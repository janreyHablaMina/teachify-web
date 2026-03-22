"use client";

interface TeacherClassesHeaderProps {
  onCreateClick: () => void;
}

export function TeacherClassesHeader({ onCreateClick }: TeacherClassesHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-[12px] font-black uppercase tracking-[0.09em] text-slate-500 mb-1">Dashboard / Classes</p>
        <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">My Classrooms</h2>
      </div>
      <button 
        onClick={onCreateClick}
        className="rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-8 py-4 text-[14px] font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
      >
        Create New Class
      </button>
    </header>
  );
}
