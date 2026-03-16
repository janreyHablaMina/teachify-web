"use client";

interface UserHeaderProps {
  onReset: () => void;
}

export function UserHeader({ onReset }: UserHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="m-0 text-[13px] font-normal uppercase tracking-[0.1em] text-slate-500">Admin / User Management</p>
        <h2 className="mt-1 text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">Manage Teachers</h2>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#0f172a] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-colors"
        >
          Reset Mock Data
        </button>
      </div>
    </div>
  );
}
