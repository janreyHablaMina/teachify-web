"use client";

import { createContext, useContext, ReactNode } from "react";
import { StudentSession } from "./types";

interface StudentContextType {
  session: StudentSession | null;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: StudentContextType;
}) {
  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
