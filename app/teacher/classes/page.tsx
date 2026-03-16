"use client";

import { useState } from "react";
import { TeacherClassesHeader } from "@/components/teacher/classes/classes-header";
import { ClassCard } from "@/components/teacher/classes/class-card";
import { CreateClassModal } from "@/components/teacher/classes/create-class-modal";
import { Classroom } from "@/components/teacher/classes/types";

export default function TeacherClassesPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    { id: 1, name: "Section 10A - Physics", room: "302", schedule: "Mon, Wed, Fri", join_code: "PH-9921", students_count: 32, is_active: true },
    { id: 2, name: "Intro to Biology", room: "101", schedule: "Tue, Thu", join_code: "BI-8812", students_count: 28, is_active: true },
    { id: 3, name: "English Literature", room: "204", schedule: "Daily", join_code: "EL-7734", students_count: 35, is_active: true },
    { id: 4, name: "Advanced Math", room: "B12", schedule: "Mon, Wed", join_code: "AM-1120", students_count: 15, is_active: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateClass = (data: { name: string; room: string; schedule: string }) => {
    setIsSubmitting(true);
    // Mimic API call
    setTimeout(() => {
      const newClass: Classroom = {
        id: Date.now(),
        ...data,
        join_code: "XX-" + Math.floor(Math.random() * 9000 + 1000),
        students_count: 0,
        is_active: true,
      };
      setClassrooms([newClass, ...classrooms]);
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <TeacherClassesHeader onCreateClick={() => setIsModalOpen(true)} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classrooms.map((cls) => (
          <ClassCard key={cls.id} classroom={cls} />
        ))}
        
        {/* Empty State / Add Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#0f172a]/20 bg-slate-50/50 p-7 transition-all hover:border-[#99f6e4] hover:bg-white hover:shadow-lg"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#99f6e4] group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <p className="m-0 text-[15px] font-black text-[#0f172a]">Create New Class</p>
          <p className="mt-1 text-[13px] font-bold text-slate-400">Add another classroom</p>
        </button>
      </div>

      <CreateClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateClass}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
