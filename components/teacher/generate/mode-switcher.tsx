"use client";

interface ModeSwitcherProps {
  mode: "chat" | "file";
  setMode: (mode: "chat" | "file") => void;
}

export function ModeSwitcher({ mode, setMode }: ModeSwitcherProps) {
  return (
    <div className="mb-8 flex gap-3">
      <button
        onClick={() => setMode("chat")}
        className={`flex-1 rounded-[10px] border-2 border-slate-900 py-3 text-[13px] font-black uppercase tracking-[0.06em] transition-all ${
          mode === "chat"
            ? "bg-[#fef08a] text-slate-900 shadow-[4px_4px_0_#0f172a]"
            : "bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        Chat AI Summary
      </button>
      <button
        onClick={() => setMode("file")}
        className={`flex-1 rounded-[10px] border-2 border-slate-900 py-3 text-[13px] font-black uppercase tracking-[0.06em] transition-all ${
          mode === "file"
            ? "bg-[#fef08a] text-slate-900 shadow-[4px_4px_0_#0f172a]"
            : "bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        Upload & Generate
      </button>
    </div>
  );
}
