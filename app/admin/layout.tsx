"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { navItems } from "@/components/admin/data";
import { NavItem } from "@/components/ui/nav/types";
import { apiMe } from "@/lib/api/client";
import { getRouteForRole, getStoredToken } from "@/lib/auth/session";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());
  const [authReady, setAuthReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function verifyAuth() {
      try {
        const token = getStoredToken();
        const { response, data } = await apiMe(token ?? undefined);

        if (!response.ok) throw new Error("Unauthorized");
        const role = String(data?.user?.role ?? "");

        if (role !== "admin") {
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

  const monthLabel = useMemo(
    () => now.toLocaleString("default", { month: "short" }).toUpperCase(),
    [now]
  );

  const headerDate = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(now),
    [now]
  );

  const headerTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }).format(now),
    [now]
  );

  const groupedNav = useMemo(
    () =>
      navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
      }, {}),
    []
  );

  if (!authReady || !isAuthorized) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fafc]">
        <div className="rounded border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black text-slate-900 shadow-[4px_4px_0_#0f172a]">
          Verifying session...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-manrope">
      <div className="grid h-screen grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
        <AdminSidebar groupedNav={groupedNav} />

        <section className="flex h-screen min-w-0 flex-col overflow-y-auto">
          <AdminTopbar
            monthLabel={monthLabel}
            day={now.getDate()}
            headerDate={headerDate}
            headerTime={headerTime}
          />
          {children}
        </section>
      </div>
    </div>
  );
}
