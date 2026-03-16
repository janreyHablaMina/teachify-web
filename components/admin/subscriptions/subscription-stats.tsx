"use client";

import { Section } from "./types";

interface SubscriptionStatsProps {
  currentSection: Section;
  counts: Record<Section, number>;
  onSectionChange: (section: Section) => void;
}

const sections: Section[] = [
  "Free users",
  "Basic users",
  "Pro users",
  "School plans",
  "Expired subscriptions",
];

const accentColors = [
  "before:bg-[#99f6e4]",
  "before:bg-[#fef08a]",
  "before:bg-[#fda4af]",
  "before:bg-[#e9d5ff]",
  "before:bg-red-400",
];

const hoverColors = [
  "hover:border-[#99f6e4]",
  "hover:border-[#fef08a]",
  "hover:border-[#fda4af]",
  "hover:border-[#e9d5ff]",
  "hover:border-red-400",
];

const activeColors = [
  "border-[#99f6e4] bg-[#f8fafc]",
  "border-[#fef08a] bg-[#f8fafc]",
  "border-[#fda4af] bg-[#f8fafc]",
  "border-[#e9d5ff] bg-[#f8fafc]",
  "border-red-400 bg-[#f8fafc]",
];

export function SubscriptionStats({
  currentSection,
  counts,
  onSectionChange,
}: SubscriptionStatsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {sections.map((label, i) => {
        const isActive = currentSection === label;
        return (
          <button
            key={label}
            type="button"
            className={`relative flex flex-col gap-1 overflow-hidden rounded-[20px] border border-slate-900/10 bg-white p-6 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${accentColors[i]} ${hoverColors[i]} ${isActive ? activeColors[i] : ""} hover:-translate-y-0.5 hover:shadow-lg`}
            onClick={() => onSectionChange(label)}
          >
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">{label}</span>
            <strong className="text-[28px] font-black tracking-tight text-[#0f172a]">{counts[label]}</strong>
          </button>
        );
      })}
    </section>
  );
}
