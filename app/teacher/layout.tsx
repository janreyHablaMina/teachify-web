"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";
import { TeacherTopbar } from "@/components/teacher/teacher-topbar";
import { teacherNavItems } from "@/components/teacher/data";
import { NavItem } from "@/components/ui/nav/types";
import { apiMe } from "@/lib/api/client";
import { getRouteForRole, getStoredToken } from "@/lib/auth/session";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [authReady, setAuthReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function verifyAuth() {
      try {
        const token = getStoredToken();
        const { response, data } = await apiMe(token ?? undefined);

        if (!response.ok) throw new Error("Unauthorized");
        const role = String(data?.user?.role ?? "");

        if (role !== "teacher") {
          router.replace(role ? getRouteForRole(role) : "/login");
          return;
        }

        if (mounted) {
          setIsAuthorized(true);
        }
      } catch {
        router.replace("/login");
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    }

    verifyAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!authReady || !isAuthorized) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fafc]">
        <div className="rounded border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black text-slate-900 shadow-[4px_4px_0_#0f172a]">
          Verifying session...
        </div>
      </div>
    );
  }

  const monthLabel = now.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = now.getDate();
  const headerDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(now);
  const headerTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  const groupedNav = teacherNavItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <TeacherSidebar groupedNav={groupedNav} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TeacherTopbar
          monthLabel={monthLabel}
          day={day}
          headerDate={headerDate}
          headerTime={headerTime}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
