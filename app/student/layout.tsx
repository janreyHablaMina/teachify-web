"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiMe } from "@/lib/api/client";
import { getRouteForRole, getStoredToken } from "@/lib/auth/session";
import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentTopbar } from "@/components/student/student-topbar";
import { studentNavItems } from "@/components/student/data";
import { NavItem } from "@/components/ui/nav/types";
import { StudentSession } from "@/components/student/types";
import { StudentProvider } from "@/components/student/student-context";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [authReady, setAuthReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [session, setSession] = useState<StudentSession | null>(null);

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
        
        const apiData = data as any;
        const role = String(apiData?.user?.role ?? "");

        if (role !== "student") {
          router.replace(role ? getRouteForRole(role) : "/login");
          return;
        }

        if (mounted) {
          setSession(apiData.user);
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
      <div className="flex min-h-screen bg-[#f8fafc] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0f172a]/10 border-t-indigo-500" />
          <p className="text-[12px] font-black uppercase tracking-widest text-[#0f172a]/40">Authenticating...</p>
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
    second: "2-digit"
  }).format(now);

  const groupedNav = studentNavItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <StudentProvider value={{ session, isLoading: !authReady }}>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        <StudentSidebar 
          groupedNav={groupedNav} 
          userName={session?.fullname} 
        />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <StudentTopbar
            monthLabel={monthLabel}
            day={day}
            headerDate={headerDate}
            headerTime={headerTime}
            userName={session?.fullname}
            userEmail={session?.email}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-7 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </StudentProvider>
  );
}
