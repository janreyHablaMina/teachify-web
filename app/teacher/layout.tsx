"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";
import { TeacherNotificationsProvider } from "@/components/teacher/notifications/notifications-context";
import { TeacherSessionProvider } from "@/components/teacher/teacher-session-context";
import { TeacherTopbar } from "@/components/teacher/teacher-topbar";
import { teacherNavItems } from "@/components/teacher/data";
import { NavItem } from "@/components/ui/nav/types";
import { ToastProvider, useToast } from "@/components/ui/toast/toast-provider";
import { apiMe } from "@/lib/api/client";
import { parseTeacherProfile, type TeacherProfile } from "@/lib/auth/profile";
import { getRouteForRole, getStoredToken } from "@/lib/auth/session";
import { getTeacherDisplayName } from "@/lib/teacher/display-name";
import { TEACHER_PROFILE_UPDATED_EVENT, type TeacherProfileUpdatedDetail } from "@/lib/teacher/profile-events";
import { resolveTeacherAvatarUrl } from "@/lib/teacher/avatar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <TeacherLayoutShell>{children}</TeacherLayoutShell>
    </ToastProvider>
  );
}

function TeacherLayoutShell({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [now, setNow] = useState(new Date());
  const [authReady, setAuthReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [session, setSession] = useState<TeacherProfile | null>(null);
  const blockedToastShownRef = useRef(false);

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
          setSession(parsedProfile);
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

  useEffect(() => {
    function handleProfileUpdated(event: Event) {
      const customEvent = event as CustomEvent<TeacherProfileUpdatedDetail>;
      const detail = customEvent.detail ?? {};

      setSession((previous) => {
        if (!previous) return previous;
        const hasFullname = Object.prototype.hasOwnProperty.call(detail, "fullname");
        const hasDisplayName = Object.prototype.hasOwnProperty.call(detail, "displayName");
        const hasEmail = Object.prototype.hasOwnProperty.call(detail, "email");
        const hasProfilePhotoPath = Object.prototype.hasOwnProperty.call(detail, "profilePhotoPath");
        const hasProfilePhotoUrl = Object.prototype.hasOwnProperty.call(detail, "profilePhotoUrl");

        return {
          ...previous,
          name: hasFullname ? (detail.fullname?.trim() ? detail.fullname.trim() : previous.name) : previous.name,
          displayName: hasDisplayName ? detail.displayName?.trim() : previous.displayName,
          email: hasEmail ? (detail.email?.trim() ? detail.email.trim() : previous.email) : previous.email,
          profilePhotoPath: hasProfilePhotoPath ? detail.profilePhotoPath?.trim() : previous.profilePhotoPath,
          profilePhotoUrl: hasProfilePhotoUrl ? detail.profilePhotoUrl?.trim() : previous.profilePhotoUrl,
        };
      });
    }

    window.addEventListener(TEACHER_PROFILE_UPDATED_EVENT, handleProfileUpdated as EventListener);
    return () => {
      window.removeEventListener(TEACHER_PROFILE_UPDATED_EVENT, handleProfileUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!authReady || !isAuthorized || !session) return;

    const isClassesRoute = pathname.startsWith("/teacher/classes");
    if (!isClassesRoute) return;

    const tier = session.planTier.toLowerCase();
    const canAccessClasses = tier === "pro" || tier === "school";
    if (!canAccessClasses) {
      if (!blockedToastShownRef.current) {
        showToast("Classes is available on Pro and School plans.", "error");
        blockedToastShownRef.current = true;
      }
      router.replace("/teacher");
      return;
    }

    blockedToastShownRef.current = false;
  }, [authReady, isAuthorized, session, pathname, router, showToast]);

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
          <header className="mb-2 border-b-[3.5px] border-[#0f172a] bg-white px-4 py-4 shadow-[0_8px_0_#fef08a] sm:px-6 lg:px-8">
            <div className="animate-pulse flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-slate-200" />
                <div className="h-7 w-56 rounded bg-slate-200" />
                <div className="h-4 w-64 rounded bg-slate-200" />
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-200" />
            </div>
          </header>
          <main className="flex-1 bg-white p-4 sm:p-6 lg:px-8 lg:py-10">
             {/* Content is handled by page-level skeletons */}
          </main>
        </div>
      </div>
    );
  }

  const isClassesRoute = pathname.startsWith("/teacher/classes");
  const tier = session?.planTier?.toLowerCase() ?? "trial";
  const canAccessClasses = tier === "pro" || tier === "school";

  if (isClassesRoute && !canAccessClasses) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fafc]">
        <div className="rounded border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black text-slate-900 shadow-[4px_4px_0_#0f172a]">
          Redirecting to dashboard...
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
    <TeacherSessionProvider value={session}>
      <TeacherNotificationsProvider>
        <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
          <TeacherSidebar
            groupedNav={groupedNav}
            planLabel={session?.planLabel ?? "Free"}
            planTier={session?.planTier ?? "trial"}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <TeacherTopbar
              monthLabel={monthLabel}
              day={day}
              headerDate={headerDate}
              headerTime={headerTime}
              userName={getTeacherDisplayName(session)}
              userEmail={session?.email ?? ""}
              userPlanLabel={session?.planLabel ?? "Free"}
              userAvatarUrl={resolveTeacherAvatarUrl(session)}
            />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-6 lg:py-10 w-full max-w-none">
              {children}
            </main>
          </div>
        </div>
      </TeacherNotificationsProvider>
    </TeacherSessionProvider>
  );
}
