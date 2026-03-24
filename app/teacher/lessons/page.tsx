"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import { apiDeleteSummary, apiGetSummaries, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { Search, BookOpen } from "lucide-react";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { useToast } from "@/components/ui/toast/toast-provider";
import { LessonCard, type LessonSummary } from "@/components/teacher/lessons/lesson-card";
import { LessonSkeleton } from "@/components/teacher/lessons/lesson-skeleton";
import { GeneratedDocumentViewer } from "@/components/teacher/generate/generated-document-viewer";
import { DocumentModalActions } from "@/components/teacher/shared/document-modal-actions";

export default function TeacherLessonsPage() {
  const { showToast } = useToast();
  const [summaries, setSummaries] = useState<LessonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSummary, setSelectedSummary] = useState<LessonSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState<LessonSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = getStoredToken();
        if (!token) return;

        // Load Summaries
        const { response, data } = await apiGetSummaries<LessonSummary[]>(token);
        if (response.ok) {
          setSummaries(data);
        }
      } catch (error) {
        console.error("Failed to load lessons:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredSummaries = summaries.filter((s) =>
    s.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (summary: LessonSummary) => {
    setIsCopied(false);
    setSelectedSummary(summary);
    setIsModalOpen(true);
  };

  const handleDownload = (summary: LessonSummary) => {
    downloadSummaryPdf(summary.content);
    showToast("Downloading PDF...", "success");
  };

  const handleDeleteRequest = (summary: LessonSummary) => {
    setSummaryToDelete(summary);
  };

  const handleConfirmDelete = async () => {
    if (!summaryToDelete) return;
    const token = getStoredToken();
    if (!token) {
      showToast("Session expired. Please log in again.", "error");
      return;
    }

    setIsDeleting(true);
    try {
      const { response, data } = await apiDeleteSummary(token, summaryToDelete.id);
      if (!response.ok) {
        showToast(getApiErrorMessage(response, data, "Failed to delete lesson."), "error");
        return;
      }

      setSummaries((prev) => prev.filter((item) => item.id !== summaryToDelete.id));
      if (selectedSummary?.id === summaryToDelete.id) {
        setIsModalOpen(false);
        setSelectedSummary(null);
      }
      showToast("Lesson deleted.", "success");
      setSummaryToDelete(null);
    } catch {
      showToast("Failed to delete lesson.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast("Copied to clipboard!", "success");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast("Failed to copy.", "error");
    }
  };

  return (
    <section className="w-full pb-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.09em] text-slate-500 mb-1">Dashboard / Overview</p>
            <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">My AI Lessons</h2>
            <p className="mt-2 text-[15px] font-bold text-slate-500">Review and manage your generated AI summaries.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-900 bg-white py-3 pl-12 pr-4 text-[14px] font-bold outline-none transition focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {isLoading ? (
          <LessonSkeleton />
        ) : filteredSummaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredSummaries.map((summary) => (
              <LessonCard
                key={summary.id}
                summary={summary}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDeleteRequest}
              />
            ))}

            <Link
              href="/teacher/generate"
              className="group flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#0f172a]/20 bg-slate-50/50 p-7 transition-all hover:border-indigo-300 hover:bg-white hover:shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#c7d2fe] transition-transform group-hover:scale-110">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <p className="m-0 text-[15px] font-black text-[#0f172a]">Create New Lesson</p>
              <p className="mt-1 text-[13px] font-bold text-slate-400">Generate another lesson</p>
            </Link>
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[32px] border-4 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] bg-white border-2 border-slate-900 shadow-[6px_6px_0_#cbd5e1]">
              <BookOpen size={48} className="text-slate-300" />
            </div>
            <h3 className="text-[22px] font-black text-slate-900">No AI lessons found</h3>
            <p className="mt-2 max-w-sm text-[15px] font-bold text-slate-500">
              {searchQuery
                ? `We couldn't find any lessons matching "${searchQuery}".`
                : "You haven't generated any AI lessons yet. Start by creating a summary in the generator!"}
            </p>
            {!searchQuery && (
              <a
                href="/teacher/generate"
                className="mt-8 rounded-xl border-2 border-slate-900 bg-indigo-500 px-8 py-3 text-[14px] font-black uppercase tracking-wider text-white shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1 hover:bg-indigo-600"
              >
                Create First Lesson
              </a>
            )}
          </div>
        )}
      </div>

      {/* Modal for viewing the full lesson */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSummary?.topic ?? "AI Lesson"}
        footer={
          <DocumentModalActions
            isCopied={isCopied}
            onCopy={() => handleCopyToClipboard(selectedSummary?.content ?? "")}
            onExportPdf={() => selectedSummary && handleDownload(selectedSummary)}
          />
        }
      >
        <GeneratedDocumentViewer content={selectedSummary?.content ?? ""} />
      </Modal>

      <ConfirmationModal
        isOpen={summaryToDelete !== null}
        onClose={() => setSummaryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this lesson?"
        message={`This action cannot be undone. "${summaryToDelete?.topic ?? "This lesson"}" will be permanently removed.`}
        confirmLabel="Yes, Delete Lesson"
        isLoading={isDeleting}
        variant="danger"
      />
    </section>
  );
}
