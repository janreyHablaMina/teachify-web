export const QUESTION_TYPE_ORDER: Record<string, number> = {
  multiple_choice: 0,
  true_false: 1,
  enumeration: 2,
  matching: 3,
  identification: 4,
  fill_in_the_blanks: 5,
  short_answer: 6,
  essay: 7,
};

export type PreviewQuestion = {
  type: string;
  question: string;
  choices?: string[] | null;
  answer: string;
  explanation?: string | null;
};

export function normalizeChoiceText(choice: string): string {
  let value = choice.trim();
  const choicePrefixPattern = /^[A-Za-z]\s*[\)\.\-:]\s*/;
  while (choicePrefixPattern.test(value)) {
    value = value.replace(choicePrefixPattern, "").trim();
  }
  return value;
}

export function formatChoiceLabel(questionType: string, choice: string, index: number): string {
  const normalized = normalizeChoiceText(choice);
  if (questionType === "multiple_choice") {
    return `${String.fromCharCode(65 + index)}. ${normalized}`;
  }
  return normalized;
}

export function formatQuestionTypeLabel(type: string): string {
  return type.replace(/_/g, " ");
}

export function parseEnumerationItems(answer: string): string[] {
  return answer
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function orderQuestionsByType<T extends { type: string }>(questions: T[]): T[] {
  return questions
    .map((question, index) => ({ question, index }))
    .sort((a, b) => {
      const aOrder = QUESTION_TYPE_ORDER[a.question.type] ?? 999;
      const bOrder = QUESTION_TYPE_ORDER[b.question.type] ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.index - b.index;
    })
    .map((entry) => entry.question);
}
