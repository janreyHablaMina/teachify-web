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
  { id: "sub-7", account: "Summit Ridge School", email: "ops@summit.edu", plan: "School", status: "Active", billing: "Yearly", amount: 590, renewalDate: "2026-12-12", refunded: false },
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage]);

  function patchRow(id: string, update: (current: SubscriptionRow) => SubscriptionRow) {
    setRows((prev) => prev.map((item) => (item.id === id ? update(item) : item)));
    setOpenMenuId(null);
  }

  function upgradePlan(id: string) {
    patchRow(id, (item) => {
      const plansList: Plan[] = ["Free", "Basic", "Pro", "School"];
      const currentIdx = plansList.indexOf(item.plan);
      const nextPlan = plansList[Math.min(currentIdx + 1, plansList.length - 1)];
      const nextAmount = nextPlan === "Basic" ? 7 : nextPlan === "Pro" ? 14 : nextPlan === "School" ? 590 : 0;
      return { ...item, plan: nextPlan, amount: nextAmount, status: "Active", renewalDate: plusDays(30) };
    });
  }

  function cancelPlan(id: string) {
    patchRow(id, (item) => ({ ...item, status: "Expired" }));
    setSection("Expired subscriptions");
    setCurrentPage(1);
  }

  function extendSubscription(id: string) {
    patchRow(id, (item) => ({ ...item, status: "Active", renewalDate: plusDays(item.billing === "Yearly" ? 365 : 30) }));
  }

  function refund(id: string) {
    patchRow(id, (item) => ({ ...item, refunded: true, status: "Expired" }));
    setSection("Expired subscriptions");
    setCurrentPage(1);
  }

  return (
    <section className={styles.root} onClick={() => setOpenMenuId(null)}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / Subscriptions</p>
          <h2>Manage Billings</h2>
        </div>
      </header>

      <section className={styles.sectionGrid}>
        {sectionLabels.map((label) => (
          <button
            key={label}
            type="button"
            className={`${styles.sectionCard} ${section === label ? styles.sectionActive : ""}`}
            onClick={(e) => { e.stopPropagation(); setSection(label); setCurrentPage(1); }}
          >
            <span>{label}</span>
            <strong>{counts[label]}</strong>
          </button>
        ))}
      </section>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>{section}</h4>
          <span>{filteredRows.length} total entries</span>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <div>Account</div>
            <div>Institutional Email</div>
            <div>Plan</div>
            <div>Status</div>
            <div>Cycle</div>
            <div>Amount</div>
            <div>Renewal</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          {paginatedRows.map((row, idx) => {
            const planColors = { Free: "#94a3b8", Basic: "#bae6fd", Pro: "#fda4af", School: "#e9d5ff" };
            const accents = ["#99f6e4", "#fef08a", "#fda4af", "#e9d5ff"];
            const isMenuOpen = openMenuId === row.id;

            return (
              <div
                key={row.id}
                className={styles.rowSlice}
                style={{ "--accent-color": accents[idx % 4] } as any}
              >
                <div className={styles.cellPrimary}>{row.account}</div>
                <div className={styles.emailText}>{row.email}</div>
                <div>
                  <div className={styles.planTag} style={{ "--plan-color": planColors[row.plan] } as any}>
                    {row.plan}
                  </div>
                </div>
                <div className={styles.statusWrap}>
                  <span className={`${styles.statusIndicator} ${row.status === "Active" ? styles.statusIndicatorActive : styles.statusIndicatorExpired}`} />
                  <span className={styles.statusText}>{row.status}</span>
                </div>
                <div className={styles.dateText}>{row.billing}</div>
                <div className={styles.amountText}>{row.refunded ? "(Refunded)" : fmtMoney(row.amount)}</div>
                <div className={styles.dateText}>{fmtDate(row.renewalDate)}</div>

                <div className={styles.actionMenu}>
                  <button
                    type="button"
                    className={styles.moreBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(isMenuOpen ? null : row.id);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                  </button>

                  {isMenuOpen && (
                    <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                      <button type="button" className={styles.menuItem} onClick={() => upgradePlan(row.id)} disabled={row.plan === "School"}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                        Upgrade Plan
                      </button>
                      <button type="button" className={styles.menuItem} onClick={() => extendSubscription(row.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        Extend Term
                      </button>
                      <button type="button" className={styles.menuItem} onClick={() => cancelPlan(row.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                        Cancel Plan
                      </button>
                      <button type="button" className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => refund(row.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        Process Refund
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.pagination}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={styles.pageBtn}
          >
            &larr; Prev
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.pageNum} ${currentPage === n ? styles.pageNumActive : ""}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={styles.pageBtn}
          >
            Next &rarr;
          </button>
        </div>
      </article>
    </section>
  );
}
