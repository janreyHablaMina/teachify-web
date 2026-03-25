"use client";

import { Check, Copy, Download } from "lucide-react";

type DocumentModalActionsProps = {
  isCopied?: boolean;
  onCopy?: () => void;
  copyLabel?: string;
  onExportPdf?: () => void;
  exportLabel?: string;
};

export function DocumentModalActions({
  isCopied = false,
  onCopy,
  copyLabel = "Copy Content",
  onExportPdf,
  exportLabel = "Export PDF",
}: DocumentModalActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {onCopy ? (
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-slate-50"
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
          {isCopied ? "Copied!" : copyLabel}
        </button>
      ) : null}

      {onExportPdf ? (
        <button
          onClick={onExportPdf}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#fef08a] px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-slate-900 transition hover:bg-yellow-200"
        >
          <Download size={16} />
          {exportLabel}
        </button>
      ) : null}
    </div>
  );
}
