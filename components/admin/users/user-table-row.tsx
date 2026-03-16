"use client";

import { UserRow, UserPlan } from "./types";
import { UserActionMenu } from "./user-action-menu";

interface UserTableRowProps {
  user: UserRow;
  index: number;
  isEditing: boolean;
  isMenuOpen: boolean;
  editDraft: { name: string; email: string };
  onEditToggle: () => void;
  onMenuToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  setEditDraft: (draft: { name: string; email: string }) => void;
}

const avatars = ["bg-[#99f6e4]", "bg-[#fef08a]", "bg-[#fda4af]", "bg-[#e9d5ff]"];
const planColors: Record<UserPlan, string> = { Free: "#94a3b8", Basic: "#99f6e4", Pro: "#fda4af", School: "#e9d5ff" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function UserTableRow({
  user,
  index,
  isEditing,
  isMenuOpen,
  editDraft,
  onEditToggle,
  onMenuToggle,
  onSave,
  onCancel,
  onDelete,
  setEditDraft,
}: UserTableRowProps) {
  return (
    <div className="group relative grid grid-cols-[2fr_2fr_1.2fr_1.2fr_1fr_1.2fr_1.2fr] items-center px-6 py-5 bg-white border border-slate-900/5 rounded-2xl transition-all hover:scale-[1.005] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#99f6e4] hover:z-10">
      {/* Name */}
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-900/10 text-[14px] font-black ${avatars[index % 4]}`}>
          {user.name.charAt(0)}
        </div>
        {isEditing ? (
          <input
            className="w-full rounded-md border border-slate-200 bg-slate-50 p-1 text-sm font-bold text-[#0f172a] outline-none focus:bg-white"
            value={editDraft.name}
            onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-[15px] font-extrabold text-[#0f172a]">{user.name}</span>
        )}
      </div>

      {/* Email */}
      <div className="text-[13px] font-semibold text-slate-500 truncate pr-4">
        {isEditing ? (
          <input
            className="w-full rounded-md border border-slate-200 bg-slate-50 p-1 text-sm font-bold text-[#0f172a] outline-none focus:bg-white"
            value={editDraft.email}
            onChange={(event) => setEditDraft({ ...editDraft, email: event.target.value })}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          user.email
        )}
      </div>

      {/* Plan */}
      <div>
        <div
          className="w-fit border-[1.5px] border-[#0f172a] bg-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight"
          style={{ boxShadow: `2px 2px 0 ${planColors[user.plan]}` }}
        >
          {user.plan}
        </div>
      </div>

      {/* Usage */}
      <div className="flex flex-col gap-1.5 pr-4">
        <span className="text-[13px] font-bold text-[#0f172a]">{user.quizzesGenerated}</span>
        <div className="h-1 w-full max-w-[60px] overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-[#99f6e4]"
            style={{ width: `${Math.min((user.quizzesGenerated / 200) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] border-2 border-white shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        <span className="text-[12px] font-extrabold text-[#0f172a]">{user.status}</span>
      </div>

      {/* Joined Date */}
      <div className="text-[12px] font-bold text-slate-500">{formatDate(user.joinedDate)}</div>

      {/* Actions */}
      <div className="relative flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md bg-[#0f172a] px-3 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <UserActionMenu
            user={user}
            isOpen={isMenuOpen}
            onToggle={onMenuToggle}
            onEdit={onEditToggle}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
