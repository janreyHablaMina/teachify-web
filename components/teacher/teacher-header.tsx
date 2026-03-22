"use client";

interface TeacherHeaderProps {
  planLabel: string;
  planTier: string;
  priceLabel: string;
}

export function TeacherHeader({ planLabel, planTier, priceLabel }: TeacherHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col">
        <p className="text-[12px] font-black uppercase tracking-[0.09em] text-slate-500 mb-1">Dashboard / Overview</p>
        <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-slate-900">{planLabel} Dashboard</h2>
        <p className="mt-2 text-[15px] font-bold text-slate-500">
          <span className="uppercase text-slate-900">{planTier}</span> - {priceLabel}: access your current plan features and usage in one place.
        </p>
      </div>
    </header>
  );
}
