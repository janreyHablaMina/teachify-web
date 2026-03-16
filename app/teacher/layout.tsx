"use client";

import { useEffect, useState } from "react";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";
import { TeacherTopbar } from "@/components/teacher/teacher-topbar";
import { teacherNavItems } from "@/components/teacher/data";
import { NavItem } from "@/components/ui/nav/types";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
