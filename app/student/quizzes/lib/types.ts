export type DeadlineFilter = "all" | "due_soon" | "overdue" | "no_deadline";

export type AssignmentItem = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  has_submitted?: boolean;
  submission?: {
    id: number;
    score?: number | null;
    submitted_at?: string | null;
  } | null;
  quiz?: { id: number; title?: string | null; topic?: string | null } | null;
  classroom?: { id: number; name?: string | null } | null;
};

export type QuizQuestion = {
  id: number;
  type: string;
  question_text: string;
  options?: string[] | null;
  points?: number;
};

export type AssignmentDetail = {
  id: number;
  classroom_id: number;
  deadline_at?: string | null;
  has_submitted?: boolean;
  submission?: {
    id: number;
    score?: number | null;
    submitted_at?: string | null;
    answers?: Record<string, unknown> | null;
  } | null;
  quiz?: {
    id: number;
    title?: string | null;
    topic?: string | null;
    questions?: QuizQuestion[];
  } | null;
  classroom?: { id: number; name?: string | null } | null;
};

export type SubmissionAnswerDetail = {
  answer?: string | null;
  is_correct?: boolean;
  correct_answer?: string | null;
  points?: number;
  earned_points?: number;
  grading_note?: string | null;
};

export type SubmissionResult = {
  id?: number;
  score?: number | null;
  submitted_at?: string | null;
  answers?: Record<string, SubmissionAnswerDetail> | null;
};
