export function UnlockProPanel() {
  return (
    <section className="flex flex-col gap-[14px] rounded-[18px] border border-slate-900/10 bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <h4 className="m-0 text-[20px] font-black tracking-[-0.02em] text-slate-900">Unlock Pro Features</h4>
      </div>
      <div className="grid grid-cols-1 gap-2.5 min-[1160px]:grid-cols-3">
        <div className="rounded-xl border-[1.5px] border-dashed border-slate-900/35 bg-orange-50 p-3 text-center text-[13px] font-extrabold text-amber-900">Classrooms</div>
        <div className="rounded-xl border-[1.5px] border-dashed border-slate-900/35 bg-orange-50 p-3 text-center text-[13px] font-extrabold text-amber-900">Student Analytics</div>
        <div className="rounded-xl border-[1.5px] border-dashed border-slate-900/35 bg-orange-50 p-3 text-center text-[13px] font-extrabold text-amber-900">Assignments</div>
      </div>
      <p className="m-0 text-[12px] font-bold leading-[1.5] text-slate-600">
        Pro and School unlock classroom tools, analytics, assignments, and advanced teacher workflows.
      </p>
    </section>
  );
}
