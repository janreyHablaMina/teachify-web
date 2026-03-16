"use client";

import { useMemo, useState } from "react";
import { SubscriptionRow, Section } from "./types";
import { SubscriptionTableRow } from "./subscription-table-row";

interface SubscriptionTableProps {
  section: Section;
  rows: SubscriptionRow[];
  onUpgrade: (id: string) => void;
  onExtend: (id: string) => void;
  onCancel: (id: string) => void;
  onRefund: (id: string) => void;
}

export function SubscriptionTable({
  section,
  rows,
  onUpgrade,
  onExtend,
  onCancel,
  onRefund,
}: SubscriptionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rows.slice(start, start + itemsPerPage);
  }, [rows, currentPage]);

  return (
    <article className="relative flex flex-col gap-5 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.04)] before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:bg-[#99f6e4]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-2xl font-black tracking-tight text-[#0f172a]">{section}</h4>
        <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-black text-slate-500 border border-slate-200">
          {rows.length} total entries
        </span>
      </div>

      <div className="flex flex-col gap-3" onClick={() => setOpenMenuId(null)}>
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-3 bg-[#0f172a] rounded-xl text-white text-[10px] font-black uppercase tracking-[0.1em]">
          <div>Account</div>
          <div>Institutional Email</div>
          <div>Plan</div>
          <div>Status</div>
          <div>Cycle</div>
          <div>Amount</div>
          <div>Renewal</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        {paginatedRows.map((row, idx) => (
          <SubscriptionTableRow
            key={row.id}
            row={row}
            index={idx}
            isMenuOpen={openMenuId === row.id}
            onMenuToggle={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
            onUpgrade={() => onUpgrade(row.id)}
            onExtend={() => onExtend(row.id)}
            onCancel={() => onCancel(row.id)}
            onRefund={() => onRefund(row.id)}
          />
        ))}

        {paginatedRows.length === 0 && (
          <div className="py-10 text-center text-sm font-bold text-slate-400">No subscriptions found in this category.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-2 rounded-xl border-1.5 border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-[#0f172a] transition-all hover:bg-teal-50 hover:border-[#99f6e4] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &larr; Prev
          </button>
          <div className="flex gap-1.5 rounded-xl bg-slate-100 p-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg text-[13px] font-extrabold transition-all ${
                  currentPage === pageNum ? "bg-[#0f172a] text-white shadow-lg" : "text-slate-500 hover:bg-white hover:text-[#0f172a]"
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-2 rounded-xl border-1.5 border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-[#0f172a] transition-all hover:bg-teal-50 hover:border-[#99f6e4] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </article>
  );
}
