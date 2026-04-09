import type { GeneratedQuiz } from "@/components/teacher/generate/types";
import type { Quiz } from "@/components/teacher/quizzes/types";

export const QUIZ_STORAGE_KEY = "teachify_teacher_quizzes_v1";
const QUIZ_DETAILS_STORAGE_KEY = "teachify_teacher_quiz_details_v1";
const RECENT_GENERATED_QUIZZES_KEY = "teachify_recent_generated_quizzes_v1";
const QUIZ_STORAGE_EVENT = "teachify_teacher_quizzes_changed";

export type StoredTeacherQuizDetail = Quiz & {
  difficulty: string;
  questions: GeneratedQuiz["questions"];
};

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyQuizStoreChanged() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(QUIZ_STORAGE_EVENT));
}

function inferTopic(title: string): string {
  const parts = title
    .split(/[-:|]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[0] ?? "General";
}

export function getStoredTeacherQuizzes(): Quiz[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Quiz[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((quiz) => typeof quiz?.id === "number" && typeof quiz?.title === "string")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch {
    return [];
  }
}

export function setStoredTeacherQuizzes(quizzes: Quiz[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
  notifyQuizStoreChanged();
}

function getStoredTeacherQuizDetails(): StoredTeacherQuizDetail[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(QUIZ_DETAILS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredTeacherQuizDetail[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (quiz) =>
        typeof quiz?.id === "number" &&
        typeof quiz?.title === "string" &&
        typeof quiz?.difficulty === "string" &&
        Array.isArray(quiz?.questions)
    );
  } catch {
    return [];
  }
}

function setStoredTeacherQuizDetails(quizzes: StoredTeacherQuizDetail[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(QUIZ_DETAILS_STORAGE_KEY, JSON.stringify(quizzes));
}

export function getStoredTeacherQuizDetailById(quizId: number): StoredTeacherQuizDetail | null {
  const directMatch = getStoredTeacherQuizDetails().find((quiz) => quiz.id === quizId) ?? null;
  if (directMatch) return directMatch;

  const summary = getStoredTeacherQuizzes().find((quiz) => quiz.id === quizId);
  if (!summary) return null;

  // Fallback migration path: recover full questions from recent-generated cache when possible.
  try {
    const raw = window.localStorage.getItem(RECENT_GENERATED_QUIZZES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<{ createdAt?: string; quiz?: GeneratedQuiz }>;
    if (!Array.isArray(parsed)) return null;

    const expectedCount = summary.questions_count ?? 0;
    const summaryCreatedAt = new Date(summary.created_at).getTime();
    const candidates = parsed
      .filter(
        (entry) =>
          typeof entry?.quiz?.title === "string" &&
          Array.isArray(entry?.quiz?.questions) &&
          entry.quiz.title === summary.title &&
          (expectedCount <= 0 || entry.quiz.questions.length === expectedCount)
      )
      .sort((a, b) => {
        const aTime = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0;
        const bTime = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0;
        if (!Number.isFinite(summaryCreatedAt)) return bTime - aTime;
        return Math.abs(aTime - summaryCreatedAt) - Math.abs(bTime - summaryCreatedAt);
      });

    const match = candidates[0];
    if (!match?.quiz) return null;

    const recoveredDetail: StoredTeacherQuizDetail = {
      ...summary,
      difficulty: match.quiz.difficulty,
      questions: match.quiz.questions,
    };
    const nextDetails = [recoveredDetail, ...getStoredTeacherQuizDetails()]
      .filter((quiz, index, list) => list.findIndex((entry) => entry.id === quiz.id) === index)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setStoredTeacherQuizDetails(nextDetails);
    return recoveredDetail;
  } catch {
    return null;
  }
}

export function addGeneratedQuizToStore(generatedQuiz: GeneratedQuiz): Quiz {
  const now = new Date().toISOString();
  const generatedId = Date.now();
  const mappedQuiz: Quiz = {
    id: generatedId,
    title: generatedQuiz.title,
    topic: inferTopic(generatedQuiz.title),
    type: "file",
    questions_count: generatedQuiz.questions.length,
    created_at: now,
  };
  const mappedQuizDetail: StoredTeacherQuizDetail = {
    ...mappedQuiz,
    difficulty: generatedQuiz.difficulty,
    questions: generatedQuiz.questions,
  };

  const existing = getStoredTeacherQuizzes();
  const next = [mappedQuiz, ...existing].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  setStoredTeacherQuizzes(next);

  const existingDetails = getStoredTeacherQuizDetails();
  const nextDetails = [mappedQuizDetail, ...existingDetails]
    .filter((quiz, index, list) => list.findIndex((entry) => entry.id === quiz.id) === index)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  setStoredTeacherQuizDetails(nextDetails);

  return mappedQuiz;
}

export function deleteTeacherQuizFromStore(quizId: number): Quiz[] {
  const next = getStoredTeacherQuizzes().filter((quiz) => quiz.id !== quizId);
  setStoredTeacherQuizzes(next);
  const nextDetails = getStoredTeacherQuizDetails().filter((quiz) => quiz.id !== quizId);
  setStoredTeacherQuizDetails(nextDetails);
  return next;
}

export function updateStoredTeacherQuizQuestions(quizId: number, questions: GeneratedQuiz["questions"]) {
  const details = getStoredTeacherQuizDetails();
  const nextDetails = details.map((quiz) =>
    quiz.id === quizId
      ? {
          ...quiz,
          questions,
        }
      : quiz
  );
  setStoredTeacherQuizDetails(nextDetails);
  notifyQuizStoreChanged();
}

export function subscribeTeacherQuizzes(onStoreChange: () => void) {
  if (!isBrowser()) return () => {};

  function onStorage(event: StorageEvent) {
    if (event.key !== QUIZ_STORAGE_KEY) return;
    onStoreChange();
  }

  function onInternalChange() {
    onStoreChange();
  }

  window.addEventListener("storage", onStorage);
  window.addEventListener(QUIZ_STORAGE_EVENT, onInternalChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(QUIZ_STORAGE_EVENT, onInternalChange);
  };
}
