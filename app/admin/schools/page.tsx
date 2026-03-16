"use client";

import { useState } from "react";
import { School, SchoolPlan } from "@/components/admin/schools/types";
import { SchoolHeader } from "@/components/admin/schools/school-header";
import { SchoolTable } from "@/components/admin/schools/school-table";

const planOrder: SchoolPlan[] = ["Basic", "Pro", "School"];

const INITIAL_SCHOOLS: School[] = [
  { id: "s1", name: "Maple Grove High", students: 420, quizzesGenerated: 6320, plan: "School", status: "Active", joinedDate: "2024-10-12", teachers: [{ id: "t1", name: "Sarah Johnson", email: "sarah.j@maplegrove.edu" }, { id: "t2", name: "Ethan Brooks", email: "ethan.b@maplegrove.edu" }] },
  { id: "s2", name: "Northside Academy", students: 310, quizzesGenerated: 4890, plan: "Pro", status: "Active", joinedDate: "2024-11-05", teachers: [{ id: "t3", name: "Marcus Lee", email: "marcus.lee@northside.edu" }, { id: "t4", name: "Rhea Collins", email: "rhea.c@northside.edu" }] },
  { id: "s3", name: "Lakeshore Prep", students: 210, quizzesGenerated: 2742, plan: "Basic", status: "Active", joinedDate: "2024-11-12", teachers: [{ id: "t5", name: "Daniel Kim", email: "dkim@lakeshore.edu" }] },
  { id: "s4", name: "Summit Ridge School", students: 550, quizzesGenerated: 8120, plan: "School", status: "Active", joinedDate: "2024-09-20", teachers: [{ id: "t7", name: "Chris Evans", email: "c.evans@summit.edu" }] },
  { id: "s5", name: "Eastbay Collegiate", students: 180, quizzesGenerated: 1450, plan: "Basic", status: "Disabled", joinedDate: "2024-08-15", teachers: [] },
  { id: "s6", name: "Global Innovators Academy", students: 600, quizzesGenerated: 12400, plan: "School", status: "Active", joinedDate: "2024-07-30", teachers: [{ id: "t8", name: "Yuki Sato", email: "y.sato@global.edu" }] },
];

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);

  const handleUpgrade = (id: string) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextIdx = Math.min(planOrder.indexOf(s.plan) + 1, planOrder.length - 1);
        return { ...s, plan: planOrder[nextIdx] };
      })
    );
  };

  const handleToggleStatus = (id: string) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "Active" ? "Disabled" : "Active" } : s))
    );
  };

  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        <SchoolHeader />
        <SchoolTable
          schools={schools}
          onUpgrade={handleUpgrade}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </main>
  );
}
