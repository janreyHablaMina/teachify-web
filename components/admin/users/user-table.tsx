"use client";

import { useMemo, useState } from "react";
import { UserRow } from "./types";
import { UserTableRow } from "./user-table-row";

interface UserTableProps {
  users: UserRow[];
  search: string;
  onSearchChange: (value: string) => void;
  onSaveEdit: (userId: number, draft: { name: string; email: string }) => void;
  onDelete: (userId: number) => void;
}

export function UserTable({
  users,
  search,
  onSearchChange,
  onSaveEdit,
  onDelete,
}: UserTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({ name: "", email: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const itemsPerPage = 5;

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
  }, [search, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleStartEdit = (user: UserRow) => {
    setEditingId(user.id);
    setEditDraft({ name: user.name, email: user.email });
    setOpenMenuId(null);
  };

  const handleSave = (userId: number) => {
    onSaveEdit(userId, editDraft);
    setEditingId(null);
  };

  return (
    <article className="relative flex flex-col gap-5 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.04)] before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:bg-[#99f6e4]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-5 border-bottom border-slate-100 pb-3">
        <div className="w-full max-w-[400px]">
          <input
            value={search}
            onChange={(event) => {
              onSearchChange(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#0f172a] outline-none focus:border-[#99f6e4] focus:bg-white transition-all"
            aria-label="Search users"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <p className="m-0 text-sm font-bold text-slate-500">{filteredUsers.length} records</p>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-3" onClick={() => setOpenMenuId(null)}>
        {/* Header */}
        <div className="grid grid-cols-[2fr_2fr_1.2fr_1.2fr_1fr_1.2fr_1.2fr] items-center px-6 py-3 bg-[#0f172a] rounded-xl text-white text-[10px] font-black uppercase tracking-[0.1em]">
          <div>Profile Name</div>
          <div>Email Address</div>
          <div>Access Plan</div>
          <div>Usage</div>
          <div>Status</div>
          <div>Joined</div>
          <div className="text-right">Operations</div>
        </div>

        {/* Rows */}
        {paginatedUsers.map((user, idx) => (
          <UserTableRow
            key={user.id}
            user={user}
            index={idx}
            isEditing={editingId === user.id}
            isMenuOpen={openMenuId === user.id}
            editDraft={editDraft}
            onEditToggle={() => handleStartEdit(user)}
            onMenuToggle={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
            onSave={() => handleSave(user.id)}
            onCancel={() => setEditingId(null)}
            onDelete={() => onDelete(user.id)}
            setEditDraft={setEditDraft}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-2 rounded-xl border-1.5 border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-[#0f172a] transition-all hover:bg-teal-50 hover:border-[#99f6e4] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200"
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
          className="flex items-center gap-2 rounded-xl border-1.5 border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-[#0f172a] transition-all hover:bg-teal-50 hover:border-[#99f6e4] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200"
        >
          Next &rarr;
        </button>
      </div>
    </article>
  );
}
