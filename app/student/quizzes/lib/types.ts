export type DeadlineFilter = "all" | "due_soon" | "overdue" | "no_deadline";

export type AssignmentItem = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  quiz?: { id: number; title?: string | null; topic?: string | null } | null;
  classroom?: { id: number; name?: string | null } | null;
};

export type QuizQuestion = {
  id: number;
  type: string;
  question_text: string;
  options?: string[] | null;
};

export type AssignmentDetail = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  quiz?: {
    id: number;
    title?: string | null;
    topic?: string | null;
    questions?: QuizQuestion[];
  } | null;
  classroom?: { id: number; name?: string | null } | null;
};

export type SubmissionResult = {
  score?: number;
};
