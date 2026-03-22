export type GeneratePayload = {
  title: string;
  file: File;
  types: { id: string; count: number }[];
  difficulty: "easy" | "medium" | "hard";
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
