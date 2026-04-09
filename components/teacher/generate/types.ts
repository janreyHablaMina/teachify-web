export type GeneratePayload = {
  title: string;
  file: File;
  types: { id: string; count: number }[];
  difficulty: "easy" | "medium" | "hard";
  enumerationCount?: number;
};

export type GeneratedQuestion = {
  type: string;
  question: string;
  choices?: string[];
  answer: string;
  explanation?: string;
  points?: number;
};

export type GeneratedQuiz = {
  title: string;
  difficulty: string;
  questions: GeneratedQuestion[];
};
