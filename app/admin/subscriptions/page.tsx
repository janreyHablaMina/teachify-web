"use client";

import { useMemo, useState } from "react";
import { SubscriptionRow, Section, Plan } from "@/components/admin/subscriptions/types";
import { SubscriptionHeader } from "@/components/admin/subscriptions/subscription-header";
import { SubscriptionStats } from "@/components/admin/subscriptions/subscription-stats";
import { SubscriptionTable } from "@/components/admin/subscriptions/subscription-table";

const INITIAL_SUBSCRIPTIONS: SubscriptionRow[] = [
  { id: "sub-1", account: "Sarah Johnson", email: "sarah.j@maplegrove.edu", plan: "Free", status: "Active", billing: "Monthly", amount: 0, renewalDate: "2026-04-01", refunded: false },
  { id: "sub-2", account: "Marcus Lee", email: "marcus.lee@northside.edu", plan: "Basic", status: "Active", billing: "Monthly", amount: 7, renewalDate: "2026-04-05", refunded: false },
  { id: "sub-3", account: "Northside Academy", email: "finance@northside.edu", plan: "Pro", status: "Active", billing: "Monthly", amount: 14, renewalDate: "2026-04-08", refunded: false },
  { id: "sub-4", account: "Maple Grove High", email: "billing@maplegrove.edu", plan: "School", status: "Active", billing: "Yearly", amount: 590, renewalDate: "2027-01-10", refunded: false },
  { id: "sub-5", account: "Hillside School", email: "admin@hillside.edu", plan: "Pro", status: "Expired", billing: "Monthly", amount: 14, renewalDate: "2026-02-17", refunded: false },
  { id: "sub-6", account: "Lakeshore Prep", email: "finance@lakeshore.edu", plan: "Basic", status: "Expired", billing: "Monthly", amount: 7, renewalDate: "2026-02-19", refunded: true },
  { id: "sub-7", account: "Summit Ridge School", email: "ops@summit.edu", plan: "School", status: "Active", billing: "Yearly", amount: 590, renewalDate: "2026-12-12", refunded: false },
];

function toSection(item: SubscriptionRow): Section {
  if (item.status === "Expired") return "Expired subscriptions";
  if (item.plan === "Free") return "Free users";
  if (item.plan === "Basic") return "Basic users";
  if (item.plan === "Pro") return "Pro users";
  return "School plans";
}

function plusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function SubscriptionsPage() {
  const [rows, setRows] = useState<SubscriptionRow[]>(INITIAL_SUBSCRIPTIONS);
  const [section, setSection] = useState<Section>("Free users");

  const counts = useMemo(() => {
    const sectionLabels: Section[] = ["Free users", "Basic users", "Pro users", "School plans", "Expired subscriptions"];
    return sectionLabels.reduce<Record<Section, number>>((acc, label) => {
      acc[label] = rows.filter((item) => toSection(item) === label).length;
      return acc;
    }, {} as Record<Section, number>);
  }, [rows]);

  const filteredRows = useMemo(
    () => rows.filter((item) => toSection(item) === section),
    [rows, section]
  );

  const handleUpgrade = (id: string) => {
    setRows((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const plansList: Plan[] = ["Free", "Basic", "Pro", "School"];
        const currentIdx = plansList.indexOf(item.plan);
        const nextPlan = plansList[Math.min(currentIdx + 1, plansList.length - 1)];
        const nextAmount = nextPlan === "Basic" ? 7 : nextPlan === "Pro" ? 14 : nextPlan === "School" ? 590 : 0;
        return { ...item, plan: nextPlan, amount: nextAmount, status: "Active", renewalDate: plusDays(30) };
      })
    );
  };

  const handleExtend = (id: string) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Active", renewalDate: plusDays(item.billing === "Yearly" ? 365 : 30) } : item
      )
    );
  };

  const handleCancel = (id: string) => {
    setRows((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Expired" } : item)));
  };

  const handleRefund = (id: string) => {
    setRows((prev) => prev.map((item) => (item.id === id ? { ...item, refunded: true, status: "Expired" } : item)));
  };

  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        <SubscriptionHeader />
        <SubscriptionStats
          currentSection={section}
          counts={counts}
          onSectionChange={setSection}
        />
        <SubscriptionTable
          section={section}
          rows={filteredRows}
          onUpgrade={handleUpgrade}
          onExtend={handleExtend}
          onCancel={handleCancel}
          onRefund={handleRefund}
        />
      </div>
    </main>
  );
}
