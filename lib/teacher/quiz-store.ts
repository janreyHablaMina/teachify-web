import type { GeneratedQuiz } from "@/components/teacher/generate/types";
import type { Quiz } from "@/components/teacher/quizzes/types";

export const QUIZ_STORAGE_KEY = "teachify_teacher_quizzes_v1";
const QUIZ_STORAGE_EVENT = "teachify_teacher_quizzes_changed";

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

export function addGeneratedQuizToStore(generatedQuiz: GeneratedQuiz): Quiz {
  const now = new Date().toISOString();
  const mappedQuiz: Quiz = {
    id: Date.now(),
    title: generatedQuiz.title,
    topic: inferTopic(generatedQuiz.title),
    type: "file",
    questions_count: generatedQuiz.questions.length,
    created_at: now,
  };

  const existing = getStoredTeacherQuizzes();
  const next = [mappedQuiz, ...existing].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  setStoredTeacherQuizzes(next);
  return mappedQuiz;
}

export function deleteTeacherQuizFromStore(quizId: number): Quiz[] {
  const next = getStoredTeacherQuizzes().filter((quiz) => quiz.id !== quizId);
  setStoredTeacherQuizzes(next);
  return next;
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
