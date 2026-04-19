import {
  apiGenerateQuizFromFile,
  apiGenerateSummary,
  getApiErrorMessage,
  type QuestionGenerationOptions,
} from "@/lib/api/client";
import type { GeneratePayload, GeneratedQuiz } from "@/components/teacher/generate/types";
import { getStoredToken } from "@/lib/auth/session";

function normalizeGeneratedQuiz(raw: unknown, fallbackDifficulty: GeneratePayload["difficulty"]): GeneratedQuiz | null {
  if (!raw || typeof raw !== "object") return null;

  const source = raw as {
    title?: unknown;
    difficulty?: unknown;
    questions?: unknown;
  };

  const title = typeof source.title === "string" && source.title.trim() ? source.title.trim() : "Generated Quiz";
  const difficulty =
    source.difficulty === "easy" || source.difficulty === "medium" || source.difficulty === "hard"
      ? source.difficulty
      : fallbackDifficulty;

  if (!Array.isArray(source.questions)) return null;

  const questions: GeneratedQuiz["questions"] = [];
  for (const question of source.questions) {
    if (!question || typeof question !== "object") continue;
    const value = question as {
      type?: unknown;
      question?: unknown;
      question_text?: unknown;
      choices?: unknown;
      options?: unknown;
      answer?: unknown;
      correct_answer?: unknown;
      explanation?: unknown;
      points?: unknown;
    };

    const text =
      typeof value.question === "string" && value.question.trim()
        ? value.question.trim()
        : typeof value.question_text === "string" && value.question_text.trim()
          ? value.question_text.trim()
          : "";
    const answer =
      typeof value.answer === "string" && value.answer.trim()
        ? value.answer.trim()
        : typeof value.correct_answer === "string" && value.correct_answer.trim()
          ? value.correct_answer.trim()
          : "";

    if (!text || !answer) continue;

    const rawChoices = Array.isArray(value.choices)
      ? value.choices
      : Array.isArray(value.options)
        ? value.options
        : [];
    const choices = rawChoices.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    const parsedPoints =
      typeof value.points === "number"
        ? value.points
        : typeof value.points === "string"
          ? Number(value.points)
          : NaN;

    questions.push({
      type: typeof value.type === "string" && value.type.trim() ? value.type.trim() : "multiple_choice",
      question: text,
      ...(choices.length > 0 ? { choices } : {}),
      answer,
      ...(typeof value.explanation === "string" && value.explanation.trim()
        ? { explanation: value.explanation.trim() }
        : {}),
      points: Number.isFinite(parsedPoints) ? Math.max(1, Math.floor(parsedPoints)) : 1,
    });
  }

  if (questions.length === 0) return null;

  return {
    title,
    difficulty,
    questions,
  };
}

export async function generateSummary(prompt: string): Promise<string> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) throw new Error("Prompt is required.");

  const { response, data } = await apiGenerateSummary({ prompt: trimmedPrompt });
  if (!response.ok) {
    throw new Error(getApiErrorMessage(response, data, "Failed to generate summary."));
  }

  const generatedSummary = typeof data.summary === "string" ? data.summary.trim() : "";
  if (!generatedSummary) {
    throw new Error("No summary was generated. Please try again.");
  }

  return generatedSummary;
}

export async function generateQuestionsFromSummary(
  summary: string,
  options?: QuestionGenerationOptions,
  signal?: AbortSignal
): Promise<string> {
  const trimmedSummary = summary.trim();
  if (!trimmedSummary) throw new Error("Summary is required.");

  const { response, data } = await apiGenerateSummary({
    prompt: trimmedSummary,
    task: "questions",
    questionOptions: options,
  }, { signal });

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response, data, "Failed to generate questions."));
  }

  const generatedQuestions = typeof data.summary === "string" ? data.summary.trim() : "";
  if (!generatedQuestions) {
    throw new Error("No questions were generated. Please try again.");
  }

  return generatedQuestions;
}

export async function generateQuizFromFile(
  payload: GeneratePayload,
  maxQuestions: number,
  signal?: AbortSignal
): Promise<GeneratedQuiz> {
  const selectedCount = payload.types.reduce((sum, typeEntry) => sum + typeEntry.count, 0);
  const clampedQuestionCount = Math.max(1, Math.min(selectedCount || 1, maxQuestions));

  const { response, data } = await apiGenerateQuizFromFile({
    token: getStoredToken() ?? undefined,
    title: payload.title,
    file: payload.file,
    types: payload.types.map((typeEntry) => typeEntry.id),
    difficulty: payload.difficulty,
    questionCount: clampedQuestionCount,
    enumerationCount: payload.enumerationCount,
    signal,
  });

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response, data, "Failed to generate quiz from file."));
  }

  const quiz = normalizeGeneratedQuiz(data.quiz, payload.difficulty);
  if (!quiz) {
    throw new Error("No quiz questions were generated. Please try again.");
  }

  return quiz;
}
