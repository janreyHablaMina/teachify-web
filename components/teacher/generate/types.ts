export type GeneratePayload = {
  title: string;
  file: File;
  types: string[];
  difficulty: "easy" | "medium" | "hard";
  enumerationCount?: number;
};

export type GeneratedQuestion = {
  type: string;
  question: string;
  choices?: string[];
  answer: string;
  explanation?: string;
};

export type GeneratedQuiz = {
  title: string;
  difficulty: string;
  questions: GeneratedQuestion[];
};
