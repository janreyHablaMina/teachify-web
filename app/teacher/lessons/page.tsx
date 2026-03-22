"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { TeacherHeader } from "@/components/teacher/teacher-header";
import { Modal } from "@/components/ui/modal";
import { apiGetSummaries, apiMe } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { parseTeacherProfile } from "@/lib/auth/profile";
import { normalizePlanTier, PLAN_CATALOG } from "@/components/teacher/dashboard/plan";
import { FileText, Download, Calendar, Search, BookOpen, Trash2, ArrowRight } from "lucide-react";
import { downloadSummaryPdf } from "@/lib/pdf/download-summary-pdf";
import { useToast } from "@/components/ui/toast/toast-provider";

type Summary = {
  id: number;
  topic: string;
  content: string;
  created_at: string;
};

export default function TeacherLessonsPage() {
  const { showToast } = useToast();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [planMeta, setPlanMeta] = useState(PLAN_CATALOG.trial);
  const [planTierLabel, setPlanTierLabel] = useState("FREE");

  useEffect(() => {
    async function loadData() {
      try {
        const token = getStoredToken();
        if (!token) return;

        // Load Plan
        const { data: profileData } = await apiMe(token);
        const profile = parseTeacherProfile(profileData);
        const tier = normalizePlanTier(profile.planTier);
        setPlanMeta(PLAN_CATALOG[tier]);
        setPlanTierLabel(tier === "trial" ? "FREE" : tier.toUpperCase());

        // Load Summaries
        const { response, data } = await apiGetSummaries(token);
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

  const handleView = (summary: Summary) => {
    setSelectedSummary(summary);
    setIsModalOpen(true);
  };

  const handleDownload = (summary: Summary) => {
    downloadSummaryPdf(summary.content);
    showToast("Downloading PDF...", "success");
  };

  return (
    <section className="w-full pb-10">
      <TeacherHeader
        planLabel={planMeta.label}
        planTier={planTierLabel}
        priceLabel={planMeta.priceLabel}
      />

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-black text-[#0f172a]">My AI Lessons</h2>
            <p className="text-[15px] font-bold text-slate-500">Review and manage your generated AI summaries.</p>
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
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-[14px] font-bold text-slate-500">Loading your lessons...</p>
          </div>
        ) : filteredSummaries.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredSummaries.map((summary) => (
              <article
                key={summary.id}
                className="group relative flex flex-col rounded-[22px] border-2 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[7px_7px_0_#4f46e5]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-indigo-50 text-indigo-500 shadow-[2px_2px_0_#0f172a]">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(summary)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white transition hover:bg-slate-50"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white transition hover:bg-rose-50 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h4 className="line-clamp-2 min-h-[3rem] text-[18px] font-black leading-tight text-[#0f172a]">
                  {summary.topic}
                </h4>

                <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-slate-500">
                  <Calendar size={14} />
                  {new Date(summary.created_at).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleView(summary)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-[#edf2ff] py-3 text-[13px] font-black uppercase tracking-wide text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Review Lesson
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
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
          <div className="flex gap-3">
            <button
               onClick={() => selectedSummary && handleDownload(selectedSummary)}
               className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#edf2ff] px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-indigo-700 transition hover:bg-indigo-100"
            >
              <Download size={18} />
              Export as PDF
            </button>
          </div>
        }
      >
        <div className="leading-normal text-slate-700 font-medium [&>h1]:mb-0 [&>h2]:mb-0 [&>h3]:mb-0 [&>h1+p]:mt-[-20px] [&>h2+p]:mt-[-20px] [&>h3+p]:mt-[-20px]">
          <ReactMarkdown
             components={{
               h1: ({node, ...props}: any) => <h1 className="text-[20px] font-black text-slate-900 mt-4 mb-[-20px] underline decoration-[#fef08a] decoration-4 underline-offset-4" {...props}/>,
               h2: ({node, ...props}: any) => <h2 className="text-[18px] font-black text-slate-900 mt-4 mb-[-20px]" {...props}/>,
               h3: ({node, ...props}: any) => <h3 className="text-[16px] font-black text-slate-900 mt-4 mb-[-20px]" {...props}/>,
               strong: ({node, ...props}: any) => <strong className="font-black text-slate-900" {...props}/>,
               ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-3" {...props}/>,
               p: ({node, children, ...props}: any) => {
                 if (!children || (Array.isArray(children) && children.length === 0)) return null;
                 return <p className="mb-3 mt-0" {...props}>{children}</p>;
               },
             }}
          >
            {selectedSummary?.content?.replace(/\n{3,}/g, '\n\n').replace(/\n\n(?=#)/g, '\n').replace(/^(#+.*)\n\n/gm, '$1\n') ?? ""}
          </ReactMarkdown>
        </div>
      </Modal>
    </section>
  );
}
