import { NextResponse } from "next/server";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type QuestionDifficulty = "easy" | "medium" | "hard";
type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "enumeration"
  | "matching"
  | "identification"
  | "fill_in_the_blanks"
  | "short_answer"
  | "essay";

type QuestionOptions = {
  itemCount: number;
  difficulty: QuestionDifficulty;
  questionTypes: QuestionType[];
};

const DEFAULT_QUESTION_OPTIONS: QuestionOptions = {
  itemCount: 8,
  difficulty: "medium",
  questionTypes: ["multiple_choice"],
};

const ALLOWED_QUESTION_TYPES: QuestionType[] = [
  "multiple_choice",
  "true_false",
  "enumeration",
  "matching",
  "identification",
  "fill_in_the_blanks",
  "short_answer",
  "essay",
];

function toQuestionLabel(type: QuestionType): string {
  return type.replace(/_/g, " ");
}

function normalizeQuestionOptions(value: unknown): QuestionOptions {
  if (!value || typeof value !== "object") return DEFAULT_QUESTION_OPTIONS;
  const payload = value as {
    itemCount?: unknown;
    difficulty?: unknown;
    questionTypes?: unknown;
  };

  const numericCount =
    typeof payload.itemCount === "number"
      ? payload.itemCount
      : typeof payload.itemCount === "string"
        ? Number(payload.itemCount)
        : NaN;

  const itemCount = Number.isFinite(numericCount)
    ? Math.max(1, Math.min(50, Math.trunc(numericCount)))
    : DEFAULT_QUESTION_OPTIONS.itemCount;

  const difficulty =
    payload.difficulty === "easy" || payload.difficulty === "hard" || payload.difficulty === "medium"
      ? payload.difficulty
      : DEFAULT_QUESTION_OPTIONS.difficulty;

  const requestedTypes = Array.isArray(payload.questionTypes)
    ? payload.questionTypes.filter((item): item is QuestionType =>
        typeof item === "string" && ALLOWED_QUESTION_TYPES.includes(item as QuestionType)
      )
    : [];

  const questionTypes = requestedTypes.length > 0 ? requestedTypes : DEFAULT_QUESTION_OPTIONS.questionTypes;

  return { itemCount, difficulty, questionTypes };
}

function extractOutputText(payload: GeminiResponse): string {
  const parts: string[] = [];
  for (const item of payload.candidates ?? []) {
    for (const part of item.content?.parts ?? []) {
      if (typeof part.text === "string" && part.text.trim()) {
        parts.push(part.text.trim());
      }
    }
  }

  return parts.join("\n\n").trim();
}

export async function POST(request: Request) {
  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  const baseUrl = (process.env.AI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  const model = process.env.AI_MODEL ?? "gemini-2.5-flash";
  const apiKey = process.env.AI_API_KEY;

  if (provider !== "gemini") {
    return NextResponse.json(
      { message: `Unsupported AI provider: ${provider}.` },
      { status: 500 }
    );
  }
  if (!apiKey) return NextResponse.json({ message: "AI_API_KEY is not configured." }, { status: 500 });

  let prompt = "";
  let task: "summary" | "questions" = "summary";
  let questionOptions: QuestionOptions = DEFAULT_QUESTION_OPTIONS;
  try {
    const body = (await request.json()) as { prompt?: unknown; task?: unknown; questionOptions?: unknown };
    prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (body.task === "questions") task = "questions";
    questionOptions = normalizeQuestionOptions(body.questionOptions);
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ message: "Prompt is required." }, { status: 400 });
  }

  const instruction =
    task === "questions"
      ? [
          "You are a helpful teaching assistant.",
          "Create classroom-ready questions based only on the provided text.",
          `Return exactly ${questionOptions.itemCount} questions.`,
          `Difficulty level: ${questionOptions.difficulty}.`,
          `Allowed question types: ${questionOptions.questionTypes.map(toQuestionLabel).join(", ")}.`,
          "For multiple_choice questions, include choices A-D and one correct answer.",
          "For true_false questions, use only True or False choices.",
          "At the end, add a concise answer key.",
          "Use clear markdown headings and number each question.",
          "",
          `Source text:\n${prompt}`,
        ].join("\n")
      : [
          "You are a helpful teaching assistant.",
          "Write a clear, classroom-ready summary with short sections and simple language.",
          "Use concise markdown-like headings when useful.",
          "",
          `Teacher request: ${prompt}`,
        ].join("\n");

  try {
    const geminiResponse = await fetch(
      `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: instruction,
              },
            ],
          },
        ],
      }),
    }
    );

    const data = (await geminiResponse.json().catch(() => ({}))) as GeminiResponse;

    if (!geminiResponse.ok) {
      const message = data?.error?.message ?? "Failed to generate summary.";
      return NextResponse.json({ message }, { status: geminiResponse.status });
    }

    const summary = extractOutputText(data);
    if (!summary) {
      return NextResponse.json(
        { message: "No summary was generated. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach AI service. Please try again." },
      { status: 502 }
    );
  }
}
