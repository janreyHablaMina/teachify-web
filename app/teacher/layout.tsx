"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";
import { TeacherTopbar } from "@/components/teacher/teacher-topbar";
import { teacherNavItems } from "@/components/teacher/data";
import { NavItem } from "@/components/ui/nav/types";
import { apiMe } from "@/lib/api/client";
import { parseTeacherProfile } from "@/lib/auth/profile";
import { getRouteForRole, getStoredToken } from "@/lib/auth/session";

type TeacherProfile = {
  name: string;
  email: string;
  planLabel: string;
  planTier: string;
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [authReady, setAuthReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profile, setProfile] = useState<TeacherProfile>({
    name: "Educator",
    email: "",
    planLabel: "Free",
    planTier: "trial",
  });

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
        const parsedProfile = parseTeacherProfile(data);
        const role = parsedProfile.role;

        if (role !== "teacher") {
          router.replace(role ? getRouteForRole(role) : "/login");
          return;
        }

        if (mounted) {
          setProfile({
            name: parsedProfile.name,
            email: parsedProfile.email,
            planLabel: parsedProfile.planLabel,
            planTier: parsedProfile.planTier,
          });
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
      <div className="flex min-h-screen bg-[#f8fafc]">
        <aside className="hidden w-[250px] border-r-[3.5px] border-[#0f172a] bg-white p-4 lg:block">
          <div className="animate-pulse space-y-4">
            <div className="h-7 w-36 rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
            <div className="h-10 w-4/5 rounded bg-slate-200" />
          </div>
        </aside>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="mb-2 border-b-[3.5px] border-[#0f172a] bg-white px-4 py-4 shadow-[0_8px_0_#fef08a] sm:px-6 lg:px-10">
            <div className="animate-pulse flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-slate-200" />
                <div className="h-7 w-56 rounded bg-slate-200" />
                <div className="h-4 w-64 rounded bg-slate-200" />
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-200" />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-72 rounded bg-slate-200" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="h-28 rounded bg-slate-200" />
                <div className="h-28 rounded bg-slate-200" />
                <div className="h-28 rounded bg-slate-200" />
                <div className="h-28 rounded bg-slate-200" />
              </div>
              <div className="h-48 rounded bg-slate-200" />
            </div>
          </main>
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
      <TeacherSidebar groupedNav={groupedNav} planLabel={profile.planLabel} planTier={profile.planTier} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TeacherTopbar
          monthLabel={monthLabel}
          day={day}
          headerDate={headerDate}
          headerTime={headerTime}
          userName={profile.name}
          userEmail={profile.email}
          userPlanLabel={profile.planLabel}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
