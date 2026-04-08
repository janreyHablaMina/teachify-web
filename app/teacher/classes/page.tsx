"use client";

import { useCallback, useEffect, useState } from "react";
import { Classroom } from "@/components/teacher/classes/types";
import { TeacherClassesHeader } from "@/components/teacher/classes/classes-header";
import { ClassCard } from "@/components/teacher/classes/class-card";
import { CreateClassModal } from "@/components/teacher/classes/create-class-modal";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { apiCreateClassroom, apiDeleteClassroom, apiGetClassrooms, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";

export default function TeacherClassesPage() {
  const { showToast } = useToast();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClassrooms = useCallback(async () => {
    try {
      const token = getStoredToken();
      const { response, data } = await apiGetClassrooms<Classroom[]>(token ?? undefined);
      if (response.ok) {
        setClassrooms(data);
      }
    } catch {
      showToast("Failed to load classrooms", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const handleCreateClass = async (data: { name: string; room: string; schedule: string }) => {
    setIsSubmitting(true);
    try {
      const token = getStoredToken();
      const { response, data: resData } = await apiCreateClassroom(token ?? undefined, data);
      
      if (response.ok) {
        showToast("Classroom created successfully", "success");
        await fetchClassrooms();
        setIsModalOpen(false);
      } else {
        const errorMsg = getApiErrorMessage(response, resData, "Failed to create classroom");
        showToast(errorMsg, "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteClass = async () => {
    if (!classroomToDelete) return;
    const token = getStoredToken();
    if (!token) {
      showToast("Session expired. Please log in again.", "error");
      return;
    }

    setIsDeleting(true);
    try {
      const { response, data } = await apiDeleteClassroom(token, classroomToDelete.id);
      if (!response.ok) {
        showToast(getApiErrorMessage(response, data, "Failed to delete classroom"), "error");
        return;
      }

      setClassrooms((prev) => prev.filter((cls) => cls.id !== classroomToDelete.id));
      setClassroomToDelete(null);
      showToast("Classroom deleted successfully", "success");
    } catch {
      showToast("Failed to delete classroom", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <TeacherClassesHeader onCreateClick={() => setIsModalOpen(true)} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-[24px] border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {classrooms.map((cls) => (
            <ClassCard
              key={cls.id}
              classroom={cls}
              onDelete={(classroom) => setClassroomToDelete(classroom)}
            />
          ))}
          
          {/* Empty State / Add Card */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-fuchsia-300 bg-[linear-gradient(145deg,#fdf4ff_0%,#eef2ff_60%,#ecfeff_100%)] p-7 transition-all hover:border-fuchsia-500 hover:bg-white hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-fuchsia-700 shadow-[4px_4px_0_#f0abfc] transition-transform group-hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <p className="m-0 text-[15px] font-black text-slate-900">Create New Class</p>
            <p className="mt-1 text-[13px] font-bold text-fuchsia-700">Add another classroom</p>
          </button>
        </div>
      )}

      <CreateClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateClass}
        isSubmitting={isSubmitting}
      />

      <ConfirmationModal
        isOpen={classroomToDelete !== null}
        onClose={() => setClassroomToDelete(null)}
        onConfirm={handleConfirmDeleteClass}
        title="Delete this classroom?"
        message={`This action cannot be undone. "${classroomToDelete?.name ?? "This classroom"}" will be permanently removed.`}
        confirmLabel="Yes, Delete Class"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
