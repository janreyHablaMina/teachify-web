"use client";

import { useState } from "react";
import type { GeneratePayload } from "./types";

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

  const questionTypes = [
    { id: "multiple_choice", label: "Multiple Choice", locked: false },
    { id: "true_false", label: "True / False", locked: planTier === "trial" },
    { id: "short_answer", label: "Short Answer", locked: planTier === "trial" },
    { id: "essay", label: "Essay", locked: planTier === "trial" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    onGenerate({ title, file, types: selectedTypes, difficulty });
  };

  return (
    <article className="rounded-[18px] border border-slate-900/10 bg-white p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="mb-6">
        <h3 className="m-0 text-[24px] font-black tracking-tight text-[#0f172a]">Generate Questions from Files</h3>
        <p className="mt-1 text-[14px] font-bold text-slate-500">Upload a PDF or document and Teachify AI will handle the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Quiz Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Midterm Physics Review"
            className="rounded-xl border-2 border-slate-900 bg-slate-50 px-5 py-4 text-[15px] font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Upload Document (PDF)</label>
          <div className="relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-900/25 bg-slate-50/60 p-6 transition-all hover:border-slate-900 hover:bg-white">
            <input
              type="file"
              required
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-emerald-700">OK</span>
                <p className="m-0 text-[14px] font-black text-[#0f172a]">{file.name}</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[11px] font-bold text-red-500 hover:underline">Remove file</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p className="m-0 text-[14px] font-black text-slate-400">Click or drag to upload lesson PDF</p>
                <p className="m-0 text-[11px] font-bold text-slate-400">PDF max 20 pages (5MB)</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Difficulty Level</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-xl border-2 px-4 py-3 text-[13px] font-black uppercase tracking-[0.06em] transition-all ${
                  difficulty === level
                    ? "border-slate-900 bg-[#fef08a] text-slate-900 shadow-[3px_3px_0_#0f172a]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Question Types</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questionTypes.map((type) => (
              <label
                key={type.id}
                className={`relative flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  type.locked
                    ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50"
                    : selectedTypes.includes(type.id)
                      ? "border-slate-900 bg-emerald-50"
                      : "border-slate-100 bg-white hover:border-slate-900"
                }`}
              >
                <input
                  type="checkbox"
                  disabled={type.locked}
                  className="h-5 w-5 rounded border-2 border-slate-900 text-slate-900 focus:ring-0"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => {
                    if (type.locked) return;
                    setSelectedTypes((prev) =>
                      prev.includes(type.id)
                        ? prev.filter((t) => t !== type.id)
                        : [...prev, type.id]
                    );
                  }}
                />
                <span className="text-[14px] font-black text-slate-900">
                  {type.label}
                  {type.locked && <span className="ml-2 inline-block rounded-[4px] bg-[#fef08a] px-1.5 py-0.5 text-[8px]">PRO</span>}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !file || selectedTypes.length === 0}
          className="mt-2 flex items-center justify-center rounded-[10px] border-2 border-slate-900 bg-[#99f6e4] py-4 text-[14px] font-black uppercase tracking-[0.06em] text-slate-900 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1 hover:bg-[#5eead4] disabled:transform-none disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? "Analyzing Lesson Content..." : "Generate Quiz Questions"}
        </button>
      </form>
    </article>
  );
}
