"use client";

import { createContext, useContext } from "react";
import type { TeacherProfile } from "@/lib/auth/profile";

const TeacherSessionContext = createContext<TeacherProfile | null>(null);

export function TeacherSessionProvider({
  value,
  children,
}: {
  value: TeacherProfile | null;
  children: React.ReactNode;
}) {
  return <TeacherSessionContext.Provider value={value}>{children}</TeacherSessionContext.Provider>;
}

export function useTeacherSession() {
  return useContext(TeacherSessionContext);
}
