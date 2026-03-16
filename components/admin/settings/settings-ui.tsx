"use client";

import { ReactNode } from "react";

interface SettingsPanelProps {
  title: string;
  accentColor: string;
  children: ReactNode;
}

export function SettingsPanel({ title, accentColor, children }: SettingsPanelProps) {
  return (
    <article className={`relative flex flex-col gap-5 overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm transition-all duration-400 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 hover:-translate-y-1 hover:shadow-lg ${accentColor}`}>
      <h4 className="m-0 text-[20px] font-black tracking-tight text-[#0f172a]">{title}</h4>
      <div className="flex flex-col gap-5">
        {children}
      </div>
    </article>
  );
}

interface SettingsFieldProps {
  label: string;
  children: ReactNode;
}

export function SettingsField({ label, children }: SettingsFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">{label}</label>
      {children}
    </div>
  );
}
