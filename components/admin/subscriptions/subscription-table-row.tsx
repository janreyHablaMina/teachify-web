"use client";

import { SubscriptionRow, Plan } from "./types";
import { SubscriptionActionMenu } from "./subscription-action-menu";

interface SubscriptionTableRowProps {
  row: SubscriptionRow;
  index: number;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onUpgrade: () => void;
  onExtend: () => void;
  onCancel: () => void;
  onRefund: () => void;
}

const planColors: Record<Plan, string> = { Free: "#94a3b8", Basic: "#bae6fd", Pro: "#fda4af", School: "#e9d5ff" };
const accentColors = ["bg-[#99f6e4]", "bg-[#fef08a]", "bg-[#fda4af]", "bg-[#e9d5ff]"];

function fmtDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function fmtMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function SubscriptionTableRow({
  row,
  index,
  isMenuOpen,
  onMenuToggle,
  onUpgrade,
  onExtend,
  onCancel,
  onRefund,
}: SubscriptionTableRowProps) {
  return (
    <div className="group relative grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 bg-white border border-slate-900/5 rounded-2xl transition-all hover:scale-[1.005] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#99f6e4] hover:z-10 before:absolute before:left-0 before:top-1/4 before:bottom-1/4 before:w-1 before:rounded-r-full before:bg-transparent hover:before:bg-[#99f6e4]">
      {/* Visual Accent */}
      <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full ${accentColors[index % 4]}`} />

      {/* Account */}
      <div className="text-[15px] font-extrabold text-[#0f172a] truncate pr-4">{row.account}</div>

      {/* Email */}
      <div className="text-[13px] font-semibold text-slate-500 truncate pr-4">{row.email}</div>

      {/* Plan */}
      <div>
        <div
          className="w-fit border-[1.5px] border-[#0f172a] bg-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight"
          style={{ boxShadow: `2px 2px 0 ${planColors[row.plan]}` }}
        >
          {row.plan}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.1)] ${
          row.status === "Active" ? "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.4)]"
        }`} />
        <span className="text-[12px] font-extrabold text-[#0f172a]">{row.status}</span>
      </div>

      {/* Cycle */}
      <div className="text-[12px] font-bold text-slate-500">{row.billing}</div>

      {/* Amount */}
      <div className={`text-[14px] font-black ${row.refunded ? "text-slate-400 italic" : "text-[#0f172a]"}`}>
        {row.refunded ? "(Refunded)" : fmtMoney(row.amount)}
      </div>

      {/* Renewal */}
      <div className="text-[12px] font-bold text-slate-500">{fmtDate(row.renewalDate)}</div>

      {/* Actions */}
      <SubscriptionActionMenu
        row={row}
        isOpen={isMenuOpen}
        onToggle={onMenuToggle}
        onUpgrade={onUpgrade}
        onExtend={onExtend}
        onCancel={onCancel}
        onRefund={onRefund}
      />
    </div>
  );
}
