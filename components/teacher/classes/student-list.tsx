"use client";

import { useMemo, useState } from "react";
import { Student } from "./types";
import { User, Search, Trash2, Edit3, UserPlus } from "lucide-react";

interface StudentListProps {
  students: Student[];
  onApproveStudent?: (studentId: number) => void;
  onRejectStudent?: (studentId: number) => void;
  isUpdatingStudentId?: number | null;
}

const avatars = ["bg-[#99f6e4]", "bg-[#fef08a]", "bg-[#fda4af]", "bg-[#e9d5ff]"];

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function StudentList({ students, onApproveStudent, onRejectStudent, isUpdatingStudentId }: StudentListProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(
      (s) => s.fullname.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)
    );
  }, [search, students]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  if (students.length === 0) {
    return (
      <div className="rounded-[32px] border-2 border-dashed border-[#0f172a]/20 bg-slate-50/50 p-12 text-center text-[#0f172a]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#99f6e4]">
          <User className="h-8 w-8" />
        </div>
        <h4 className="text-[20px] font-black">No Students Enrolled</h4>
        <p className="mt-2 text-[15px] font-bold text-slate-500">Share the join code with your class to get started!</p>
      </div>
    );
  }

  return (
    <article className="relative flex flex-col gap-5 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.04)] before:absolute before:top-0 before:left-0 before:h-1.5 before:w-full before:bg-[#99f6e4]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3 w-full max-w-[450px]">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search students..."
              className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-[14px] font-semibold text-[#0f172a] outline-none transition-all focus:border-[#99f6e4] focus:bg-white"
            />
          </div>
          <button className="flex h-[42px] items-center gap-2 rounded-xl bg-[#0f172a] px-5 text-[13px] font-bold text-white transition-all hover:bg-slate-800 active:scale-95">
            <UserPlus className="h-4 w-4" />
            Add Student
          </button>
        </div>
        <p className="m-0 text-[13px] font-bold text-slate-400">{filteredStudents.length} records found</p>
      </div>

      {/* Grid Table */}
      <div className="flex flex-col gap-2.5">
        {/* Header */}
        <div className="grid grid-cols-[2fr_2fr_1.2fr_1.2fr_0.8fr_1fr] items-center px-6 py-3 bg-[#0f172a] rounded-xl text-white text-[10px] font-black uppercase tracking-[0.1em]">
          <div>Student Profile</div>
          <div>Email</div>
          <div>Joined</div>
          <div>Performance</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-2">
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student, idx) => (
              <div 
                key={student.id} 
                className="group grid grid-cols-[2fr_2fr_1.2fr_1.2fr_0.8fr_1fr] items-center rounded-xl border border-slate-900/5 bg-white px-6 py-4 transition-all hover:border-[#99f6e4] hover:bg-slate-50/50 hover:shadow-sm"
              >
                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-900/10 text-[13px] font-black ${avatars[idx % avatars.length]}`}>
                    {student.fullname.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[14px] font-extrabold text-[#0f172a] truncate">{student.fullname}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 truncate pr-4">
                  {student.email}
                </div>

                {/* Joined */}
                <div className="text-[12px] font-bold text-slate-500">
                  {formatDate(student.enrolled_at)}
                </div>

                {/* Performance */}
                <div className="flex flex-col gap-1 pr-4">
                  <div className="h-1 w-full max-w-[60px] overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className="h-full bg-[#99f6e4]" 
                      style={{ width: `${60 + (student.id * 7) % 35}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#0f172a]">{60 + (student.id * 7) % 35}%</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    student.enrollment_status === "pending"
                      ? "bg-amber-500"
                      : student.enrollment_status === "rejected"
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                  }`} />
                  <span className="text-[12px] font-bold text-[#0f172a]">
                    {student.enrollment_status === "pending"
                      ? "Pending"
                      : student.enrollment_status === "rejected"
                        ? "Rejected"
                        : "Approved"}
                  </span>
                </div>

                {/* Operations */}
                <div className="flex justify-end gap-2">
                  {student.enrollment_status === "pending" && onApproveStudent && onRejectStudent ? (
                    <>
                      <button
                        disabled={isUpdatingStudentId === student.id}
                        onClick={() => onApproveStudent(student.id)}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={isUpdatingStudentId === student.id}
                        onClick={() => onRejectStudent(student.id)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:border-[#0f172a] hover:text-[#0f172a] hover:bg-white shadow-sm">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:border-red-200 hover:text-red-500 hover:bg-red-50 shadow-sm">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center rounded-xl border-1.5 border-dashed border-slate-100">
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">No matching students</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-[#0f172a] transition-all hover:bg-teal-50 hover:border-[#99f6e4] disabled:opacity-40"
        >
          &larr; Prev
        </button>
        
        <div className="flex gap-1.5 rounded-xl bg-slate-100 p-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg text-[13px] font-extrabold transition-all ${
                currentPage === pageNum 
                  ? "bg-[#0f172a] text-white shadow-sm" 
                  : "text-slate-500 hover:bg-white hover:text-[#0f172a]"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-[#0f172a] transition-all hover:bg-teal-50 hover:border-[#99f6e4] disabled:opacity-40"
        >
          Next &rarr;
        </button>
      </div>
    </article>
  );
}
