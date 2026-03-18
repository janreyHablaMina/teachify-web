"use client";

import { Copy, Check } from "lucide-react";

interface InviteLinkCardProps {
  inviteUrl: string;
  copied: boolean;
  onCopy: () => void;
}

export function InviteLinkCard({ inviteUrl, copied, onCopy }: InviteLinkCardProps) {
  return (
    <div className="mb-10 rounded-[24px] bg-slate-50 border-2 border-[#0f172a] p-6 shadow-[inner_0_2px_4px_rgba(0,0,0,0.05)]">
      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
        Student Invite URL
      </label>
      <div className="flex items-center gap-4">
        <div className="flex-1 truncate text-[16px] font-extrabold text-[#0f172a]">
          {inviteUrl}
        </div>
        <button
          onClick={onCopy}
          className="flex h-12 items-center gap-2 rounded-xl bg-white border-2 border-[#0f172a] px-6 text-[14px] font-black uppercase text-[#0f172a] shadow-[4px_4px_0_#0f172a] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
        >
          {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
