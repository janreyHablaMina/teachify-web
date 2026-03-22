"use client";

export function LessonSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col rounded-[22px] border-2 border-slate-100 bg-white p-6 shadow-[5px_5px_0_#f8fafc] animate-pulse">
          <div className="mb-4 flex items-start justify-between">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border-2 border-slate-100" />
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border-2 border-slate-100" />
              <div className="h-10 w-10 rounded-xl bg-slate-50 border-2 border-slate-100" />
            </div>
          </div>
          <div className="space-y-3 mt-2">
            <div className="h-6 w-3/4 bg-slate-50 rounded-lg" />
            <div className="h-6 w-1/2 bg-slate-50 rounded-lg" />
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-50 rounded-full" />
            <div className="h-4 w-32 bg-slate-50 rounded" />
          </div>
          <div className="mt-6 h-12 w-full bg-slate-50 rounded-xl border-2 border-slate-100" />
        </div>
      ))}
    </div>
  );
}
