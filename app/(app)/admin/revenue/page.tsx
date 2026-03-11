"use client";

import styles from "./revenue.module.css";

const metrics = [
  { label: "Monthly revenue", value: "$43,280" },
  { label: "Annual revenue", value: "$519,360" },
  { label: "New subscriptions", value: "124" },
  { label: "Cancelled subs", value: "19" },
] as const;

const revenueGrowth = [26, 29, 31, 33, 36, 39, 41, 44, 48, 50, 53, 57];
const planDistribution = [
  { plan: "Basic users", users: 35, percent: 57 },
  { plan: "Pro users", users: 20, percent: 33 },
  { plan: "School plans", users: 6, percent: 10 },
] as const;

function h(value: number, max: number) {
  return `${Math.max(12, Math.round((value / max) * 100))}%`;
}

export default function AdminRevenueDashboardPage() {
  const revenueMax = Math.max(...revenueGrowth);

  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / Financials</p>
          <h2>Business Growth</h2>
        </div>
      </header>

      <section className={styles.metricGrid}>
        {metrics.map((item) => (
          <article key={item.label} className={styles.metricCard}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Revenue Growth</h4>
            <span>Last 12 months</span>
          </div>
          <div className={styles.chart}>
            {revenueGrowth.map((value, idx) => (
              <div key={`r-${idx}`} className={styles.barWrap} title={`$${value}k volume`}>
                <div className={styles.barRevenue} style={{ height: h(value, revenueMax) }} />
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Plan Mix Distribution</h4>
            <span>Segment breakdown</span>
          </div>
          <ul className={styles.list}>
            {planDistribution.map((item) => (
              <li key={item.plan}>
                <div className={styles.rowTop}>
                  <strong>{item.plan}: {item.users} users</strong>
                  <span>{item.percent}%</span>
                </div>
                <div className={styles.track}>
                  <div className={styles.fillPlan} style={{ width: `${item.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  );
}
