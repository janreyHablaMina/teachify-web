import {
  apiGenerateQuizFromFile,
  apiGenerateSummary,
  getApiErrorMessage,
  type QuestionGenerationOptions,
} from "@/lib/api/client";
import type { GeneratePayload, GeneratedQuiz } from "@/components/teacher/generate/types";

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

  const quiz = data.quiz as GeneratedQuiz | undefined;
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new Error("No quiz questions were generated. Please try again.");
  }

  return quiz;
}
