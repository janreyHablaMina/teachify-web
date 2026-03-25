"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Target } from "lucide-react";
import { apiGetClassrooms } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { EnrolledClassroom } from "@/components/student/types";

type EnrollmentStatus = "pending" | "approved" | "suspended" | "rejected";
type FilterKey = "all" | EnrollmentStatus;

function normalizeStatus(classroom: EnrolledClassroom): EnrollmentStatus {
  return (classroom.enrollment_status ?? classroom.pivot?.status ?? "approved") as EnrollmentStatus;
}

function statusBadge(status: EnrollmentStatus): { label: string; className: string } {
  if (status === "pending") {
    return { label: "Pending Approval", className: "border-amber-200 bg-amber-50 text-amber-700" };
  }
  if (status === "suspended") {
    return { label: "Suspended", className: "border-violet-200 bg-violet-50 text-violet-700" };
  }
  if (status === "rejected") {
    return { label: "Rejected", className: "border-rose-200 bg-rose-50 text-rose-700" };
  }
  return { label: "Enrolled", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
}

export default function StudentClassesPage() {
  const [classrooms, setClassrooms] = useState<EnrolledClassroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let mounted = true;

    async function loadClassrooms() {
      setIsLoading(true);
      try {
        const token = getStoredToken();
        if (!token) return;
        const { response, data } = await apiGetClassrooms<EnrolledClassroom[]>(token);
        if (!response.ok || !mounted) return;
        setClassrooms(
          data.map((classroom) => ({
            ...classroom,
            enrollment_status: normalizeStatus(classroom),
          }))
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadClassrooms();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return classrooms.filter((classroom) => {
      const status = normalizeStatus(classroom);
      const byFilter = filter === "all" || status === filter;
      const byQuery =
        !term ||
        classroom.name.toLowerCase().includes(term) ||
        (classroom.teacher?.fullname ?? "").toLowerCase().includes(term) ||
        classroom.join_code.toLowerCase().includes(term);
      return byFilter && byQuery;
    });
  }, [classrooms, filter, query]);

  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: "all", label: "All" },
    { key: "approved", label: "Enrolled" },
    { key: "pending", label: "Pending" },
    { key: "suspended", label: "Suspended" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-[#0f172a]/15 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 text-[32px] font-black leading-none tracking-[-0.02em] text-[#0f172a]">My Classes</h1>
            <p className="mt-2 text-[14px] font-semibold text-slate-500">Track your classroom enrollment and jump into each class.</p>
          </div>
          <div className="rounded-xl border border-[#0f172a]/10 bg-slate-50 px-4 py-3 text-right">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">Total Classes</p>
            <p className="text-[26px] font-black leading-none text-[#0f172a]">{classrooms.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#0f172a]/15 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search classes, teacher, or code..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[14px] font-semibold text-[#0f172a] outline-none focus:border-indigo-300 focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition ${
                  filter === item.key
                    ? "border-[#0f172a] bg-[#0f172a] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[150px] animate-pulse rounded-2xl border border-slate-100 bg-slate-50" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#0f172a]/20 bg-slate-50/60 p-10 text-center">
            <p className="text-[18px] font-black text-[#0f172a]">No classes matched your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((classroom) => {
              const status = normalizeStatus(classroom);
              const badge = statusBadge(status);
              return (
                <Link
                  key={classroom.id}
                  href={`/student/classes/${classroom.id}`}
                  className="group rounded-2xl border border-[#0f172a]/12 bg-white p-5 no-underline transition hover:border-indigo-300 hover:bg-indigo-50/20"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <p className="truncate text-[18px] font-black text-[#0f172a]">{classroom.name}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-500">
                    Teacher: <span className="text-[#0f172a]">{classroom.teacher?.fullname ?? "Educator"}</span>
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3">
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Code: {classroom.join_code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-black uppercase tracking-wider text-indigo-600">
                      Open Class <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[20px] border border-[#0f172a]/10 bg-white p-5">
        <p className="flex items-center gap-2 text-[14px] font-black text-[#0f172a]">
          <Target className="h-4 w-4 text-indigo-500" />
          Tip: Pending classes become fully available after teacher approval.
        </p>
      </section>
    </div>
  );
}

