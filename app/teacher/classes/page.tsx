"use client";

import Link from "next/link";
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

          {classrooms.length === 0 && (
            <div className="col-span-full rounded-[36px] border-2 border-[#0f172a]/10 bg-white p-4 md:p-7">
              <div className="relative overflow-hidden rounded-[28px] border-2 border-[#0f172a]/15 bg-gradient-to-br from-[#fdf4ff] via-[#eef2ff] to-[#ecfeff] p-8 md:p-12">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f0abfc]/35 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-[#a5b4fc]/30 blur-2xl" />

                <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                  <span className="inline-flex items-center rounded-full border border-fuchsia-300/70 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-fuchsia-700">
                    class workspace
                  </span>
                  <h3 className="mt-4 m-0 text-[30px] leading-[1.05] font-black tracking-[-0.03em] text-[#0f172a]">
                    Let&apos;s create your first class
                  </h3>
                  <p className="mt-3 mb-0 max-w-xl text-[15px] font-semibold leading-relaxed text-slate-600">
                    Set up a classroom, invite students with a join code, and keep your teaching organized from one place.
                  </p>

                  <div className="mt-7 grid w-full gap-3 text-left md:grid-cols-3">
                    {[
                      "Create classroom details",
                      "Share class join code",
                      "Start assigning quizzes",
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="rounded-2xl border border-fuchsia-200/70 bg-white/85 px-4 py-3"
                      >
                        <p className="m-0 text-[10px] font-black uppercase tracking-[0.12em] text-fuchsia-700/80">
                          Step {index + 1}
                        </p>
                        <p className="mt-1 mb-0 text-[14px] font-extrabold text-[#0f172a]">{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-[#0f172a] bg-fuchsia-700 px-8 py-3 text-[13px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:bg-fuchsia-800 hover:shadow-lg"
                    >
                      Create Class
                    </button>
                    <Link
                      href="/teacher/generate"
                      className="inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-[#0f172a] bg-indigo-100 px-8 py-3 text-[13px] font-black uppercase tracking-wider text-[#0f172a] no-underline shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-1 hover:bg-indigo-200 hover:shadow-[5px_5px_0_#0f172a]"
                    >
                      Generate Quiz
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
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
