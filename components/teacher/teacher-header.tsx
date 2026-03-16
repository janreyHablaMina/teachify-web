"use client";

interface TeacherHeaderProps {
  planLabel: string;
  planTier: string;
  priceLabel: string;
}

export function TeacherHeader({ planLabel, planTier, priceLabel }: TeacherHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-[13px] font-bold uppercase tracking-[0.1em] text-slate-500">Dashboard / Overview</p>
        <h2 className="text-[32px] font-black leading-none tracking-[-0.03em] text-[#0f172a]">{planLabel} Dashboard</h2>
        <p className="mt-2 text-[15px] font-bold text-slate-500">
          <span className="uppercase text-[#0f172a]">{planTier}</span> - {priceLabel}: access your current plan features and usage in one place.
        </p>
      </div>
    </header>
  );
}
