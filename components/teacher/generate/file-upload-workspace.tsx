"use client";

import { useState } from "react";
import type { GeneratePayload } from "./types";
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
  Check
} from "lucide-react";

interface FileUploadWorkspaceProps {
  onGenerate: (data: GeneratePayload) => void | Promise<void>;
  isLoading: boolean;
  planTier: string;
}

export function FileUploadWorkspace({ onGenerate, isLoading, planTier }: FileUploadWorkspaceProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["multiple_choice"]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [enumerationCount, setEnumerationCount] = useState(5);

  const questionTypes = [
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
      locked: planTier === "trial" 
    },
    { 
      id: "enumeration", 
      label: "Enumeration", 
      icon: ListOrdered, 
      desc: "Listing items for a topic",
      locked: planTier === "trial" 
    },
    { 
      id: "matching", 
      label: "Matching", 
      icon: Layers, 
      desc: "Column A to Column B",
      locked: planTier === "trial" 
    },
    { 
      id: "identification", 
      label: "Identification", 
      icon: Type, 
      desc: "Specific term answers",
      locked: planTier === "trial" 
    },
    { 
      id: "fill_in_the_blanks", 
      label: "Fill in Blanks", 
      icon: PencilLine, 
      desc: "Completion type questions",
      locked: planTier === "trial" 
    },
    { 
      id: "short_answer", 
      label: "Short Answer", 
      icon: AlignLeft, 
      desc: "Pointed explanations",
      locked: planTier === "trial" 
    },
    { 
      id: "essay", 
      label: "Essay", 
      icon: FileText, 
      desc: "Comprehensive reasoning",
      locked: planTier === "trial" 
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    onGenerate({ 
      title, 
      file, 
      types: selectedTypes, 
      difficulty,
      enumerationCount: selectedTypes.includes("enumeration") ? enumerationCount : undefined
    });
  };

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.01)]">
      <div className="bg-slate-50 border-b border-slate-100 p-8">
        <h3 className="m-0 text-[26px] font-black tracking-tight text-[#0f172a]">Quiz Generator</h3>
        <p className="mt-2 text-[15px] font-medium text-slate-500 leading-relaxed max-w-xl">
          Transform your classroom materials into professional assessments using Teachify's specialized AI models.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Config */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Lesson Details</label>
              <input
                type="text"
                required
                placeholder="e.g. Life and Works of Rizal"
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-[15px] font-bold outline-none ring-teal-500/20 transition-all focus:border-slate-900 focus:ring-4 placeholder:text-slate-300"
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
                        ? "border-slate-900 bg-[#fef08a] text-slate-900 shadow-[4px_4px_0_#0f172a] -translate-y-1"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Question Types */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex justify-between items-center">
              Target Question Formats
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full lowercase tracking-normal">Multiple selection enabled</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {questionTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    disabled={type.locked}
                    onClick={() => {
                      if (type.locked) return;
                      setSelectedTypes((prev) =>
                        prev.includes(type.id)
                          ? (prev.length > 1 ? prev.filter((t) => t !== type.id) : prev)
                          : [...prev, type.id]
                      );
                    }}
                    className={`relative flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-all ${
                      type.locked
                        ? "cursor-not-allowed border-slate-50 bg-slate-50/50 opacity-40 grayscale"
                        : isSelected
                          ? "border-slate-900 bg-emerald-50 ring-4 ring-emerald-500/5"
                          : "border-slate-100 bg-white hover:border-slate-400 group/card"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 group-hover/card:bg-slate-900 group-hover/card:text-white'}`}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div className="mt-2 text-wrap">
                      <span className="block text-[14px] font-black text-slate-900 leading-tight">
                        {type.label}
                      </span>
                      <span className="block text-[10px] font-bold text-slate-500 leading-tight mt-1.5 opacity-80">
                        {type.desc}
                      </span>
                    </div>
                    {type.locked && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-black text-white">
                        <Lock size={10} />
                      </div>
                    )}
                    {isSelected && !type.locked && (
                      <div className="absolute top-4 right-4 h-6 w-6 flex items-center justify-center rounded-full bg-slate-900 text-emerald-400 shadow-lg border-2 border-white scale-110">
                        <Check size={14} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {selectedTypes.includes("enumeration") && (
              <div className="mt-auto pt-4 flex flex-col gap-3 rounded-2xl border-2 border-slate-900 bg-slate-900 text-white p-5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ListOrdered size={16} className="text-[#fef08a]" />
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-300">
                      Enumeration Depth
                    </label>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[15px] font-black shadow-inner">
                    {enumerationCount} <span className="text-[10px] uppercase opacity-70">items</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#fef08a] hover:accent-white transition-all"
                  value={enumerationCount}
                  onChange={(e) => setEnumerationCount(Number(e.target.value))}
                />
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 px-1 capitalize">
                  <span>Concise (2)</span>
                  <span>Extensive (15)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !file || selectedTypes.length === 0}
          className="relative group mt-4 flex items-center justify-center gap-3 overflow-hidden rounded-[20px] border-2 border-slate-900 bg-[#99f6e4] py-5 text-[16px] font-black uppercase tracking-[0.1em] text-slate-900 shadow-[8px_8px_0_#0f172a] transition-all hover:-translate-y-1 hover:bg-[#5eead4] active:translate-y-1 active:shadow-none disabled:transform-none disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin" />
              <span>Analyzing Lesson Context...</span>
            </div>
          ) : (
            <>
              <span className="z-10">Generate Assesment Now</span>
              <ChevronRight size={22} strokeWidth={3} className="z-10 transition-transform group-hover:translate-x-2" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>
      </form>
    </article>
  );
}
