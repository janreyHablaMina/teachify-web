"use client";

interface TeacherClassesHeaderProps {
  onCreateClick: () => void;
}

export function TeacherClassesHeader({ onCreateClick }: TeacherClassesHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-[linear-gradient(120deg,#ffffff_0%,#ecfeff_40%,#fef3c7_100%)] p-5">
      <div>
        <p className="text-[12px] font-black uppercase tracking-[0.09em] text-slate-500 mb-1">Dashboard / Classes</p>
        <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">My Classrooms</h2>
        <p className="mt-2 text-[15px] font-bold text-slate-600">Manage your classes, track student counts, and open each room quickly.</p>
      </div>
      <button 
        onClick={onCreateClick}
        className="rounded-xl border-2 border-slate-900 bg-[#fef08a] px-8 py-4 text-[14px] font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0_#f97316] transition hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-[4px_4px_0_#f97316] active:translate-y-0"
      >
        Create New Class
      </button>
    </header>
  );
}
