import { orderQuestionsByType, type PreviewQuestion } from "@/lib/quiz/question-utils";

type ParsedGeneratedQuestions = {
  title: string | null;
  questions: PreviewQuestion[];
};

type DraftQuestion = {
  type: string;
  questionLines: string[];
  choices: string[];
  answer: string;
  explanation: string;
  points: number;
};

const QUESTION_TYPE_PATTERNS: Array<{ type: string; pattern: RegExp }> = [
  { type: "multiple_choice", pattern: /^multiple\s*choice$/i },
  { type: "true_false", pattern: /^true\s*[/_-]?\s*false$/i },
  { type: "enumeration", pattern: /^enumeration$/i },
  { type: "identification", pattern: /^identification$/i },
  { type: "fill_in_the_blanks", pattern: /^fill\s*in\s*(the\s*)?blanks?$/i },
  { type: "essay", pattern: /^essay$/i },
  { type: "short_answer", pattern: /^short\s*answer$/i },
  { type: "matching", pattern: /^matching$/i },
];

function stripMarkdown(value: string): string {
  return value
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[*_`~\s]+|[*_`~\s]+$/g, "")
    .trim();
}

function inferQuestionType(value: string): string | null {
  const normalized = stripMarkdown(value).replace(/[.:]$/, "").trim();
  for (const entry of QUESTION_TYPE_PATTERNS) {
    if (entry.pattern.test(normalized)) return entry.type;
  }
  return null;
}

function isQuestionStartLine(value: string): boolean {
  return /^\s*(?:[-*]\s*)?(?:question\s*)?\d+\s*[\.\):\-]\s*/i.test(stripMarkdown(value));
}

function parseQuestionStartLabel(value: string): string {
  const normalized = stripMarkdown(value);
  return stripMarkdown(normalized.replace(/^\s*(?:[-*]\s*)?(?:question\s*)?\d+\s*[\.\):\-]\s*/i, ""));
}

function toPreviewQuestion(draft: DraftQuestion): PreviewQuestion {
  const type = draft.type || "multiple_choice";
  const question = draft.questionLines.join(" ").replace(/\s+/g, " ").trim();
  const answer = stripMarkdown(draft.answer || "Not provided");
  const explanation = stripMarkdown(draft.explanation);
  const normalizedChoices = draft.choices.map((choice) => stripMarkdown(choice)).filter(Boolean);

  return {
    type,
    question: question || "Question text not available.",
    choices: normalizedChoices.length > 0 ? normalizedChoices : undefined,
    answer,
    explanation: explanation || undefined,
    points: Math.max(1, Number(draft.points) || 1),
  };
}

function parseQuestionBlock(lines: string[]): PreviewQuestion | null {
  if (lines.length === 0) return null;
  const draft: DraftQuestion = {
    type: "multiple_choice",
    questionLines: [],
    choices: [],
    answer: "",
    explanation: "",
    points: 1,
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const pointsMatch = line.match(/^points?\s*:\s*(\d+)/i);
    if (pointsMatch) {
      draft.points = Number.parseInt(pointsMatch[1], 10);
      continue;
    }

    const answerMatch = line.match(/^answer\s*:\s*(.+)$/i);
    if (answerMatch) {
      draft.answer = answerMatch[1].trim();
      continue;
    }

    const explanationMatch = line.match(/^explanation\s*:\s*(.+)$/i);
    if (explanationMatch) {
      draft.explanation = explanationMatch[1].trim();
      continue;
    }

    const inferredType = inferQuestionType(line);
    if (inferredType && draft.questionLines.length === 0 && draft.choices.length === 0) {
      draft.type = inferredType;
      continue;
    }

    const choiceMatch = line.match(/^(?:[-*]\s*)?(?:[A-Za-z]|\d+)[\)\.\-:]\s+(.+)$/);
    if (choiceMatch) {
      draft.choices.push(choiceMatch[1].trim());
      continue;
    }

    draft.questionLines.push(stripMarkdown(line));
  }

  if (draft.questionLines.length === 0 && draft.choices.length === 0 && !draft.answer) {
    return null;
  }

  return toPreviewQuestion(draft);
}

export function parseGeneratedQuestions(content: string): ParsedGeneratedQuestions {
  const lines = content.split(/\r?\n/);
  const prefaceLines: string[] = [];
  const blockLines: string[] = [];
  const parsedQuestions: PreviewQuestion[] = [];
  let reachedQuestions = false;

  const flushBlock = () => {
    if (blockLines.length === 0) return;
    const parsed = parseQuestionBlock(blockLines);
    if (parsed) parsedQuestions.push(parsed);
    blockLines.length = 0;
  };

  for (const line of lines) {
    if (isQuestionStartLine(line)) {
      reachedQuestions = true;
      flushBlock();
      const startLabel = parseQuestionStartLabel(line);
      if (startLabel) blockLines.push(startLabel);
      continue;
    }

    if (!reachedQuestions && inferQuestionType(line)) {
      reachedQuestions = true;
      flushBlock();
      blockLines.push(stripMarkdown(line));
      continue;
    }

    if (!reachedQuestions) {
      if (line.trim()) prefaceLines.push(stripMarkdown(line));
      continue;
    }

    blockLines.push(line);
  }

  flushBlock();

  if (parsedQuestions.length === 0) {
    const answerSplitBlocks = content
      .split(/\r?\n(?=\s*(?:[-*]\s*)?answer\s*:)/i)
      .map((block) => block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
      .filter((block) => block.length > 0);
    for (const block of answerSplitBlocks) {
      const parsed = parseQuestionBlock(block);
      if (parsed) parsedQuestions.push(parsed);
    }
  }

  const titleCandidateRaw = prefaceLines.find((line) => line.length > 0) ?? null;
  const titleCandidate = titleCandidateRaw && !isQuestionStartLine(titleCandidateRaw) ? titleCandidateRaw : null;
  return {
    title: titleCandidate,
    questions: orderQuestionsByType(parsedQuestions),
  };
}
