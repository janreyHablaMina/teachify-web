"use client";

import { FeatureFlags } from "./types";

interface FeatureTogglesProps {
  flags: FeatureFlags;
  onToggle: (key: keyof FeatureFlags) => void;
}

const toggleLabels: Record<keyof FeatureFlags, string> = {
  aiAssist: "AI Assistant",
  smartHints: "Smart Hints",
  maintenanceMode: "Maintenance Mode",
  publicSignup: "Public Signup",
};

export function FeatureToggles({ flags, onToggle }: FeatureTogglesProps) {
  return (
    <article className="relative flex flex-col gap-6 overflow-hidden rounded-[24px] border border-slate-900/10 bg-white p-7 shadow-sm transition-all duration-400 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-red-400 hover:-translate-y-1 hover:shadow-lg hover:border-red-400">
      <h4 className="m-0 text-[20px] font-black tracking-tight text-[#0f172a]">Feature toggles</h4>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {(Object.keys(flags) as Array<keyof FeatureFlags>).map((key) => {
          const isActive = flags[key];
          return (
            <li
              key={key}
              className="flex items-center justify-between rounded-2xl border border-slate-900/5 bg-[#f8fbff] px-5 py-4 transition-all hover:bg-white hover:border-[#99f6e4] hover:translate-x-1"
            >
              <span className="text-[14px] font-extrabold text-[#0f172a]">{toggleLabels[key]}</span>
              <button
                type="button"
                className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all shadow-sm ${
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
                onClick={() => onToggle(key)}
              >
                {isActive ? "Active" : "Disabled"}
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
