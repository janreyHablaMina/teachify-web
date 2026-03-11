"use client";

import { useMemo, useState } from "react";
import styles from "./subscriptions.module.css";

type Plan = "Free" | "Basic" | "Pro" | "School";
type SubStatus = "Active" | "Expired";
type BillingCycle = "Monthly" | "Yearly";
type Section = "Free users" | "Basic users" | "Pro users" | "School plans" | "Expired subscriptions";

type SubscriptionRow = {
  id: string;
  account: string;
  email: string;
  plan: Plan;
  status: SubStatus;
  billing: BillingCycle;
  amount: number;
  renewalDate: string;
  refunded: boolean;
};

const sectionLabels: Section[] = [
  "Free users",
  "Basic users",
  "Pro users",
  "School plans",
  "Expired subscriptions",
];

const initialSubscriptions: SubscriptionRow[] = [
  { id: "sub-1", account: "Sarah Johnson", email: "sarah.j@maplegrove.edu", plan: "Free", status: "Active", billing: "Monthly", amount: 0, renewalDate: "2026-04-01", refunded: false },
  { id: "sub-2", account: "Marcus Lee", email: "marcus.lee@northside.edu", plan: "Basic", status: "Active", billing: "Monthly", amount: 7, renewalDate: "2026-04-05", refunded: false },
  { id: "sub-3", account: "Northside Academy", email: "finance@northside.edu", plan: "Pro", status: "Active", billing: "Monthly", amount: 14, renewalDate: "2026-04-08", refunded: false },
  { id: "sub-4", account: "Maple Grove High", email: "billing@maplegrove.edu", plan: "School", status: "Active", billing: "Yearly", amount: 590, renewalDate: "2027-01-10", refunded: false },
  { id: "sub-5", account: "Hillside School", email: "admin@hillside.edu", plan: "Pro", status: "Expired", billing: "Monthly", amount: 14, renewalDate: "2026-02-17", refunded: false },
  { id: "sub-6", account: "Lakeshore Prep", email: "finance@lakeshore.edu", plan: "Basic", status: "Expired", billing: "Monthly", amount: 7, renewalDate: "2026-02-19", refunded: true },
];

function toSection(item: SubscriptionRow): Section {
  if (item.status === "Expired") return "Expired subscriptions";
  if (item.plan === "Free") return "Free users";
  if (item.plan === "Basic") return "Basic users";
  if (item.plan === "Pro") return "Pro users";
  return "School plans";
}

function fmtDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function fmtMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function plusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function SubscriptionManagementPage() {
  const [rows, setRows] = useState<SubscriptionRow[]>(initialSubscriptions);
  const [section, setSection] = useState<Section>("Free users");

  const counts = useMemo(() => {
    return sectionLabels.reduce<Record<Section, number>>((acc, label) => {
      acc[label] = rows.filter((item) => toSection(item) === label).length;
      return acc;
    }, {
      "Free users": 0,
      "Basic users": 0,
      "Pro users": 0,
      "School plans": 0,
      "Expired subscriptions": 0,
    });
  }, [rows]);

  const filteredRows = useMemo(
    () => rows.filter((item) => toSection(item) === section),
    [rows, section],
  );

  function patchRow(id: string, update: (current: SubscriptionRow) => SubscriptionRow) {
    setRows((prev) => prev.map((item) => (item.id === id ? update(item) : item)));
  }

  function upgradePlan(id: string) {
    patchRow(id, (item) => {
      const nextPlan: Plan =
        item.plan === "Free" ? "Basic" :
        item.plan === "Basic" ? "Pro" :
        item.plan === "Pro" ? "School" : "School";
      const nextAmount = nextPlan === "Free" ? 0 : nextPlan === "Basic" ? 7 : nextPlan === "Pro" ? 14 : 590;
      return { ...item, plan: nextPlan, amount: nextAmount, status: "Active", renewalDate: plusDays(30) };
    });
  }

  function cancelPlan(id: string) {
    patchRow(id, (item) => ({ ...item, status: "Expired" }));
    setSection("Expired subscriptions");
  }

  function extendSubscription(id: string) {
    patchRow(id, (item) => ({ ...item, status: "Active", renewalDate: plusDays(item.billing === "Yearly" ? 365 : 30) }));
  }

  function refund(id: string) {
    patchRow(id, (item) => ({ ...item, refunded: true, status: "Expired" }));
    setSection("Expired subscriptions");
  }

  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Subscription management</p>
        <h3>Monitor billing and plans</h3>
        <p>Track plan distribution and perform subscription actions from one control panel.</p>
      </header>

      <section className={styles.sectionGrid}>
        {sectionLabels.map((label) => (
          <button
            key={label}
            type="button"
            className={`${styles.sectionCard} ${section === label ? styles.sectionActive : ""}`}
            onClick={() => setSection(label)}
          >
            <span>{label}</span>
            <strong>{counts[label]}</strong>
          </button>
        ))}
      </section>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>{section}</h4>
          <span>{filteredRows.length} records</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Account</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Billing</th>
                <th>Amount</th>
                <th>Renewal Date</th>
                <th>Refunded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td className={styles.cellPrimary}>{row.account}</td>
                  <td>{row.email}</td>
                  <td>{row.plan}</td>
                  <td>
                    <span className={`${styles.status} ${row.status === "Active" ? styles.s_active : styles.s_expired}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.billing}</td>
                  <td>{fmtMoney(row.amount)}</td>
                  <td>{fmtDate(row.renewalDate)}</td>
                  <td>{row.refunded ? "Yes" : "No"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button type="button" className={styles.btnPrimary} onClick={() => upgradePlan(row.id)} disabled={row.plan === "School"}>
                        Upgrade plan
                      </button>
                      <button type="button" className={styles.btnWarn} onClick={() => cancelPlan(row.id)}>
                        Cancel plan
                      </button>
                      <button type="button" className={styles.btnGhost} onClick={() => extendSubscription(row.id)}>
                        Extend subscription
                      </button>
                      <button type="button" className={styles.btnDanger} onClick={() => refund(row.id)}>
                        Refund
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
