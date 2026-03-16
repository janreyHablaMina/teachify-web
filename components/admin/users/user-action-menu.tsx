"use client";

interface UserActionMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserActionMenu({
  isOpen,
  onToggle,
  onEdit,
  onDelete,
}: UserActionMenuProps) {
  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-[#99f6e4] hover:text-[#0f172a]"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title="More actions"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-[100] mt-2 min-w-[160px] flex flex-col gap-1 rounded-xl border border-slate-900/5 bg-white p-1.5 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-[#0f172a] transition-colors hover:bg-slate-50"
            onClick={onEdit}
          >
            <svg className="text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Details
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-bold text-red-500 transition-colors hover:bg-red-50"
            onClick={onDelete}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Remove Teacher
          </button>
        </div>
      )}
    </div>
  );
}
