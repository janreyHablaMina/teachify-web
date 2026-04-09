"use client";

import { useState } from "react";
import type { GeneratePayload } from "./types";
import { useToast } from "@/components/ui/toast/toast-provider";
import { 
  CheckSquare, 
  CircleHelp, 
  ListOrdered, 
  AlignLeft, 
  FileText, 
  Layers, 
  Type, 
  PencilLine,
  ChevronRight,
  ShieldCheck,
  MousePointerClick,
  Lock,
  Check,
  Minus,
  Plus
} from "lucide-react";

interface FileUploadWorkspaceProps {
  onGenerate: (data: GeneratePayload) => void | Promise<void>;
  isLoading: boolean;
  planTier: string;
  generationsRemaining: number;
  onNoGenerationsLeft?: () => void;
}

const DEFAULT_COUNT = 5;

const QUESTION_TYPES = [
  { 
    id: "multiple_choice", 
    label: "Multiple Choice", 
    icon: CheckSquare, 
    desc: "Standard 4-option questions",
    locked: false 
  },
  { 
    id: "true_false", 
    label: "True / False", 
    icon: CircleHelp, 
    desc: "Binary choice assessments",
    lockedForTrial: true 
  },
  { 
    id: "enumeration", 
    label: "Enumeration", 
    icon: ListOrdered, 
    desc: "Listing items for a topic",
    lockedForTrial: true 
  },
  { 
    id: "matching", 
    label: "Matching", 
    icon: Layers, 
    desc: "Column A to Column B",
    lockedForTrial: true 
  },
  { 
    id: "identification", 
    label: "Identification", 
    icon: Type, 
    desc: "Specific term answers",
    lockedForTrial: true 
  },
  { 
    id: "fill_in_the_blanks", 
    label: "Fill in Blanks", 
    icon: PencilLine, 
    desc: "Completion type questions",
    lockedForTrial: true 
  },
  { 
    id: "short_answer", 
    label: "Short Answer", 
    icon: AlignLeft, 
    desc: "Pointed explanations",
    lockedForTrial: true 
  },
  { 
    id: "essay", 
    label: "Essay", 
    icon: FileText, 
    desc: "Comprehensive reasoning",
    lockedForTrial: true 
  },
];

export function FileUploadWorkspace({ onGenerate, isLoading, planTier, generationsRemaining, onNoGenerationsLeft }: FileUploadWorkspaceProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const { showToast } = useToast();

  const showLimitToast = () => {
    showToast(
      planTier === "trial"
        ? `You've reached the free plan limit of ${planMax} questions. Upgrade to Pro to generate up to 50 questions.`
        : `You've reached the maximum of ${planMax} questions for your plan. Remove some items to continue.`,
      "error"
    );
  };

  // Plan-based total question limit
  const planMax = (planTier === "trial" || planTier === "free") ? 10 : 50;

  // typeCounts: key = type id, value = { enabled: boolean, count: number }
  const [typeCounts, setTypeCounts] = useState<Record<string, { enabled: boolean; count: number }>>(
    () =>
      Object.fromEntries(
        QUESTION_TYPES.map((t) => [t.id, { enabled: t.id === "multiple_choice", count: Math.min(DEFAULT_COUNT, planTier === "trial" ? 10 : 50) }])
      )
  );

  const questionTypes = QUESTION_TYPES.map((t) => ({
    ...t,
    locked: "lockedForTrial" in t && t.lockedForTrial && (planTier === "trial" || planTier === "free"),
  }));

  const toggleType = (id: string) => {
    setTypeCounts((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
  };

  const adjustCount = (id: string, delta: number) => {
    const otherTotal = Object.entries(typeCounts)
      .filter(([k, v]) => k !== id && v.enabled)
      .reduce((sum, [, v]) => sum + v.count, 0);
    const maxForThis = planMax - otherTotal;

    if (delta > 0 && typeCounts[id].count >= maxForThis) {
      showLimitToast();
      return;
    }

    setTypeCounts((prev) => {
      const next = Math.max(1, Math.min(maxForThis, prev[id].count + delta));
      return { ...prev, [id]: { ...prev[id], count: next } };
    });
  };

  const setCount = (id: string, rawValue: string) => {
    const parsedValue = Number.parseInt(rawValue.trim() === "" ? "1" : rawValue, 10);
    if (Number.isNaN(parsedValue)) return null;
    let nextCountForType: number | null = null;

    setTypeCounts((prev) => {
      if (!prev[id]?.enabled) return prev;
      const otherTotal = Object.entries(prev)
        .filter(([k, v]) => k !== id && v.enabled)
        .reduce((sum, [, v]) => sum + v.count, 0);
      const maxForThis = Math.max(1, planMax - otherTotal);
      const next = Math.max(1, Math.min(maxForThis, parsedValue));
      nextCountForType = next;
      return { ...prev, [id]: { ...prev[id], count: next } };
    });

    return nextCountForType;
  };

  const selectedEntries = Object.entries(typeCounts).filter(([, v]) => v.enabled);
  const totalItems = selectedEntries.reduce((sum, [, v]) => sum + v.count, 0);
  const anySelected = selectedEntries.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (generationsRemaining <= 0) {
      onNoGenerationsLeft?.();
      return;
    }
    if (!file || !title || !anySelected) return;
    const types = selectedEntries.map(([id, v]) => ({ id, count: v.count }));
    onGenerate({ title, file, types, difficulty });
  };

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.01)]">
      <div className="bg-white border-b border-slate-100 p-8">
        <h3 className="m-0 text-[26px] font-black tracking-tight text-[#0f172a]">Quiz Generator</h3>
        <p className="mt-2 text-[15px] font-medium text-slate-500 leading-relaxed max-w-xl">
          Transform your classroom materials into professional assessments using Teachify&apos;s specialized AI models.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Config */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Summary pill at the top of the left column */}
            {anySelected ? (
              <div className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                totalItems >= planMax
                  ? "border-red-200 bg-red-50"
                  : "border-slate-200 bg-slate-50"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Questions</span>
                    {totalItems >= planMax && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-red-500">Limit reached</span>
                    )}
                  </div>
                </div>
                <span className={`text-[15px] font-black ${ totalItems >= planMax ? "text-red-500" : "text-emerald-600" }`}>
                  {totalItems}
                  <span className="text-[11px] font-bold text-slate-400"> / {planMax}</span>
                  <span className="text-[11px] font-bold text-slate-500 ml-1">. {selectedEntries.length} type{selectedEntries.length !== 1 ? "s" : ""}</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Plan Limit</span>
                <span className="text-[13px] font-black text-slate-500">{planMax} questions max</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Lesson Details</label>
              <input
                type="text"
                required
                placeholder="e.g. Life and Works of Rizal"
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-teal-500/20 transition-all focus:border-emerald-500 focus:ring-4 placeholder:text-slate-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Lesson Material (PDF)</label>
              <div className="relative group overflow-hidden flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-slate-400 hover:bg-white">
                <input
                  type="file"
                  required
                  accept=".pdf"
                  className="absolute inset-0 cursor-pointer opacity-0 z-10"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm">
                      <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                      <p className="m-0 text-[14px] font-black text-[#0f172a] truncate max-w-[200px]">{file.name}</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-1 text-[11px] font-bold text-red-500 hover:text-red-700 underline">Remove file</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400 transition-transform group-hover:scale-105">
                    <MousePointerClick size={32} strokeWidth={1.5} />
                    <div className="text-center">
                      <p className="m-0 text-[14px] font-black text-slate-500">Drop PDF lesson here</p>
                      <p className="m-0 text-[11px] font-bold text-slate-400">Max size 20MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Assess Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`rounded-xl border px-3 py-3 text-[12px] font-black uppercase tracking-[0.06em] transition-all ${
                      difficulty === level
                        ? "border-emerald-500 bg-[#ccfbf1] text-emerald-900 shadow-[4px_4px_0_#10b981] -translate-y-1"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !file || !anySelected || !title}
              className="relative group mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-emerald-300 bg-emerald-100 py-4 text-[14px] font-black uppercase tracking-[0.08em] text-emerald-900 shadow-sm transition hover:bg-emerald-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin" />
                  <span>Analyzing Lesson Context...</span>
                </div>
              ) : (
                <>
                  <span className="z-10">{generationsRemaining <= 0 ? "No Tokens Remaining" : "Generate Assessment Now"}</span>
                  <ChevronRight size={18} strokeWidth={3} className="z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </div>

          {/* Right Column: Question Types */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex justify-between items-center">
              Target Question Formats
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full lowercase tracking-normal">Select type . set item count</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-2 pt-16 custom-scrollbar">
              {questionTypes.map((type) => {
                const Icon = type.icon;
                const state = typeCounts[type.id];
                const isSelected = state.enabled && !type.locked;
                const otherTotal = Object.entries(typeCounts)
                  .filter(([key, value]) => key !== type.id && value.enabled)
                  .reduce((sum, [, value]) => sum + value.count, 0);
                const maxForThis = Math.max(1, planMax - otherTotal);

                return (
                  <div
                    key={type.id}
                    className={`group relative flex flex-col rounded-2xl border-2 transition-all overflow-visible ${
                      type.locked
                        ? "cursor-not-allowed border-slate-100 bg-slate-50/30 select-none"
                        : isSelected
                          ? "border-emerald-500 bg-emerald-50 shadow-sm"
                          : "border-slate-100 bg-white hover:border-emerald-200 hover:shadow-sm"
                    }`}
                  >
                    {/* Original Floating Tooltip - Now Colorful as per user request */}
                    {type.locked && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none z-50 animate-in fade-in zoom-in duration-200 hidden group-hover:flex items-center justify-center whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-black text-white shadow-xl after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-emerald-600 border border-emerald-500/50">
                        Upgrade to Pro to unlock format! 
                      </div>
                    )}

                    <div className={`flex items-center gap-3 p-4 transition-opacity ${type.locked ? "opacity-70" : "opacity-100"}`}>
                      <button
                        type="button"
                        disabled={type.locked}
                        onClick={() => { if (!type.locked) toggleType(type.id); }}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <div className={`shrink-0 p-2.5 rounded-xl transition-all ${
                          isSelected ? "bg-emerald-500 text-white shadow-lg" : 
                          type.id === "multiple_choice" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          type.id === "true_false" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          type.id === "enumeration" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          type.id === "matching" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                          type.id === "identification" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                          type.id === "fill_in_the_blanks" ? "bg-violet-50 text-violet-600 border border-violet-100" :
                          type.id === "short_answer" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                          "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}>
                          <Icon size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-[14px] font-black leading-tight text-slate-900">{type.label}</span>
                          <span className="block text-[10px] font-bold leading-tight mt-1 opacity-80 text-slate-500">{type.desc}</span>
                        </div>
                      </button>
                      {type.locked ? (
                        <div className="shrink-0 flex items-center justify-center p-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-500 shadow-sm">
                          <Lock size={12} strokeWidth={3} />
                        </div>
                      ) : isSelected ? (
                        <div className="shrink-0 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => adjustCount(type.id, -1)}
                            disabled={state.count <= 1}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-emerald-200 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <input
                            key={`${type.id}-${state.count}`}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={maxForThis}
                            defaultValue={state.count}
                            onBlur={(event) => {
                              const rawValue = event.target.value;
                              const normalizedCount = setCount(type.id, rawValue);
                              if (normalizedCount === null) {
                                event.currentTarget.value = String(state.count);
                                return;
                              }
                              if (Number.parseInt(rawValue || "0", 10) > maxForThis) {
                                showToast(`Maximum allowed for ${type.label} is ${maxForThis}.`, "error");
                              }
                              event.currentTarget.value = String(normalizedCount);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                (event.currentTarget as HTMLInputElement).blur();
                              }
                            }}
                            className="h-6 w-14 rounded-md border border-emerald-200 bg-white px-1 text-center text-[14px] font-black text-emerald-700 outline-none focus:border-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => adjustCount(type.id, +1)}
                            disabled={state.count >= maxForThis || totalItems >= planMax}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white border border-emerald-200 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                          <div className="ml-1 h-6 w-6 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_10px_-2px_rgba(16,185,129,0.3)] border-2 border-white">
                            <Check size={13} strokeWidth={4} />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


      </form>
    </article>
  );
}

