import { NextResponse } from "next/server";

type GeneratedQuestion = {
  type: string;
  question: string;
  choices?: string[];
  answer: string;
  explanation?: string;
};

type GeneratedQuiz = {
  title: string;
  difficulty: string;
  questions: GeneratedQuestion[];
};

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

function extractText(payload: GeminiResponse): string {
  const out: string[] = [];
  for (const candidate of payload.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (typeof part.text === "string" && part.text.trim()) {
        out.push(part.text.trim());
      }
    }
  }
  return out.join("\n").trim();
}

function parseQuizOutput(raw: string): GeneratedQuiz | null {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedQuiz>;
    const title = typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : "Generated Quiz";
    const difficulty =
      typeof parsed.difficulty === "string" && parsed.difficulty.trim() ? parsed.difficulty.trim() : "medium";
    const questions = Array.isArray(parsed.questions)
      ? (parsed.questions
          .map((q) => {
            const qq = q as Partial<GeneratedQuestion>;
            if (typeof qq.question !== "string" || !qq.question.trim()) return null;
            if (typeof qq.answer !== "string" || !qq.answer.trim()) return null;
            const type = typeof qq.type === "string" && qq.type.trim() ? qq.type.trim() : "multiple_choice";
            const choices = Array.isArray(qq.choices)
              ? qq.choices.filter((c): c is string => typeof c === "string" && Boolean(c.trim()))
              : undefined;
            return {
              type,
              question: qq.question.trim(),
              answer: qq.answer.trim(),
              choices,
              explanation: typeof qq.explanation === "string" ? qq.explanation.trim() : undefined,
            };
          })
          .filter(Boolean) as GeneratedQuestion[])
      : [];

    if (questions.length === 0) return null;
    return { title, difficulty, questions };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  const baseUrl = (process.env.AI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  const model = process.env.AI_MODEL ?? "gemini-2.5-flash";
  const apiKey = process.env.AI_API_KEY;

  if (provider !== "gemini") {
    return NextResponse.json({ message: `Unsupported AI provider: ${provider}.` }, { status: 500 });
  }
  if (!apiKey) {
    return NextResponse.json({ message: "AI_API_KEY is not configured." }, { status: 500 });
  }

  let title = "Generated Quiz";
  let difficulty = "medium";
  let types: string[] = ["multiple_choice"];
  let questionCount = 10;
  let enumerationCount = 5;
  let file: File | null = null;

  try {
    const formData = await request.formData();
    title = String(formData.get("title") ?? "Generated Quiz").trim() || "Generated Quiz";
    difficulty = String(formData.get("difficulty") ?? "medium").trim().toLowerCase();
    const rawTypes = String(formData.get("types") ?? "multiple_choice");
    types = rawTypes.split(",").map((t) => t.trim()).filter(Boolean);
    const rawCount = Number(formData.get("questionCount") ?? 10);
    questionCount = Number.isFinite(rawCount) ? Math.max(1, Math.min(50, Math.floor(rawCount))) : 10;
    enumerationCount = Number(formData.get("enumerationCount") ?? 5);

    const maybeFile = formData.get("file");
    if (!(maybeFile instanceof File)) {
      return NextResponse.json({ message: "File is required." }, { status: 400 });
    }
    file = maybeFile;
  } catch {
    return NextResponse.json({ message: "Invalid upload payload." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ message: "File size exceeds 10MB limit." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    
    let enumerationInstruction = "";
    if (types.includes("enumeration")) {
      const eCount = Number.isFinite(enumerationCount) ? Math.max(2, Math.min(20, enumerationCount)) : 5;
      enumerationInstruction = `For enumeration questions, the answer must contain exactly ${eCount} distinct items from the text. Return these items as a comma-separated list in the "answer" field.`;
    }

    const prompt = [
      "You are an expert teacher assistant.",
      `Generate exactly ${questionCount} questions from the uploaded lesson document.`,
      `Quiz title: ${title}`,
      `Difficulty level: ${difficulty}`,
      `Allowed question types: ${types.join(", ")}`,
      "Return strictly valid JSON using this shape:",
      '{"title":"string","difficulty":"easy|medium|hard","questions":[{"type":"multiple_choice|true_false|short_answer|essay|enumeration|matching|identification|fill_in_the_blanks","question":"string","choices":["A","B","C","D"],"answer":"string","explanation":"string"}]}',
      "For true_false use choices [\"True\",\"False\"].",
      "For short_answer, essay, identification, fill_in_the_blanks or enumeration, omit choices.",
      "For identification, provide a short 1-3 word answer.",
      "For fill_in_the_blanks, provide the full sentence with the blank replaced by '_______' in the question field.",
      "For matching, the question should be the stimulus and the answer should be the correct matching response.",
      enumerationInstruction,
      "Ensure all questions are based on the uploaded document only.",
    ].filter(Boolean).join("\n");

    const geminiResponse = await fetch(
      `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: file.type || "application/pdf",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = (await geminiResponse.json().catch(() => ({}))) as GeminiResponse;
    if (!geminiResponse.ok) {
      const message = data?.error?.message ?? "Failed to generate quiz questions.";
      return NextResponse.json({ message }, { status: geminiResponse.status });
    }

    const text = extractText(data);
    const quiz = parseQuizOutput(text);
    if (!quiz) {
      return NextResponse.json({ message: "Generated output was invalid. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ quiz });
  } catch {
    return NextResponse.json({ message: "Unable to generate quiz from file right now." }, { status: 502 });
  }
}
