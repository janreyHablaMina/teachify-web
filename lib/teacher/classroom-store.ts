import { Classroom } from "@/components/teacher/classes/types";

export const CLASSROOM_STORAGE_KEY = "teachify_teacher_classrooms_v1";
const CLASSROOM_STORAGE_EVENT = "teachify_teacher_classrooms_changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyClassroomStoreChanged() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CLASSROOM_STORAGE_EVENT));
}

export function getStoredTeacherClassrooms(): Classroom[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CLASSROOM_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Classroom[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((cls) => typeof cls?.id === "number" && typeof cls?.name === "string")
      .sort((a, b) => b.id - a.id);
  } catch {
    return [];
  }
}

export function setStoredTeacherClassrooms(classrooms: Classroom[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CLASSROOM_STORAGE_KEY, JSON.stringify(classrooms));
  notifyClassroomStoreChanged();
}

export function addClassroomToStore(data: { name: string; room: string; schedule: string }): Classroom {
  const newClass: Classroom = {
    id: Date.now(),
    name: data.name,
    room: data.room,
    schedule: data.schedule,
    join_code: "XX-" + Math.floor(Math.random() * 9000 + 1000),
    students_count: 0,
    is_active: true,
  };

  const existing = getStoredTeacherClassrooms();
  const next = [newClass, ...existing];
  setStoredTeacherClassrooms(next);
  return newClass;
}

export function deleteClassroomFromStore(id: number): Classroom[] {
  const next = getStoredTeacherClassrooms().filter((cls) => cls.id !== id);
  setStoredTeacherClassrooms(next);
  return next;
}

export function subscribeTeacherClassrooms(onStoreChange: () => void) {
  if (!isBrowser()) return () => {};

  function onStorage(event: StorageEvent) {
    if (event.key !== CLASSROOM_STORAGE_KEY) return;
    onStoreChange();
  }

  function onInternalChange() {
    onStoreChange();
  }

  window.addEventListener("storage", onStorage);
  window.addEventListener(CLASSROOM_STORAGE_EVENT, onInternalChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CLASSROOM_STORAGE_EVENT, onInternalChange);
  };
}
