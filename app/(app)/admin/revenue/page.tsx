import styles from "./revenue.module.css";

const metrics = [
  { label: "Monthly revenue", value: "$43,280" },
  { label: "Annual revenue", value: "$519,360" },
  { label: "New subscriptions", value: "124" },
  { label: "Cancelled subscriptions", value: "19" },
] as const;

const revenueGrowth = [26, 29, 31, 33, 36, 39, 41, 44, 48, 50, 53, 57];
const mrrTrend = [31, 32, 34, 35, 36, 37, 39, 40, 42, 43, 44, 46];
const planDistribution = [
  { plan: "Basic", users: 35, percent: 57 },
  { plan: "Pro", users: 20, percent: 33 },
  { plan: "School", users: 6, percent: 10 },
] as const;

function h(value: number, max: number) {
  return `${Math.max(12, Math.round((value / max) * 100))}%`;
}

export default function AdminRevenueDashboardPage() {
  const revenueMax = Math.max(...revenueGrowth);
  const mrrMax = Math.max(...mrrTrend);

  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Revenue dashboard</p>
        <h3>Track business growth</h3>
        <p>Monitor SaaS performance across revenue, MRR, subscriptions, and plan mix.</p>
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
            <h4>Revenue growth</h4>
            <span>Last 12 months</span>
          </div>
          <div className={styles.chart}>
            {revenueGrowth.map((value, idx) => (
              <div key={`r-${idx}`} className={styles.barWrap}>
                <div className={styles.barRevenue} style={{ height: h(value, revenueMax) }} />
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Plan distribution</h4>
            <span>Basic / Pro / School</span>
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

        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>MRR trend</h4>
            <span>Monthly recurring revenue</span>
          </div>
          <div className={styles.chart}>
            {mrrTrend.map((value, idx) => (
              <div key={`m-${idx}`} className={styles.barWrap}>
                <div className={styles.barMrr} style={{ height: h(value, mrrMax) }} />
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
