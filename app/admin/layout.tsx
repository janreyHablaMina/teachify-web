"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { navItems } from "@/components/admin/data";
import { NavItem } from "@/components/ui/nav/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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
