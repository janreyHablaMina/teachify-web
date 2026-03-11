import styles from "./admin.module.css";

const todayBrief = [
  { label: "Quizzes generated today", value: "412" },
  { label: "New teacher signups", value: "14" },
  { label: "Open support tickets", value: "18" },
  { label: "Failed AI requests", value: "12" },
];

const growthMetrics = [
  { label: "Total users", value: "120", trend: "+8 this week" },
  { label: "Total teachers", value: "95", trend: "+6 this week" },
  { label: "Total schools", value: "6", trend: "1 pending review" },
  { label: "Total students", value: "1,200", trend: "+74 this month" },
  { label: "Active subscriptions", value: "59", trend: "4 expired" },
  { label: "Monthly revenue", value: "$1,240", trend: "+12.4% MoM" },
];

const planMix = [
  { name: "Free", value: 120, width: 67 },
  { name: "Basic", value: 35, width: 20 },
  { name: "Pro", value: 20, width: 10 },
  { name: "School", value: 4, width: 3 },
];

const aiBudget = [
  { label: "Total tokens this month", value: "25,000,000" },
  { label: "Estimated AI cost", value: "$18" },
  { label: "Cost per active user", value: "$0.31" },
  { label: "Highest cost segment", value: "School plan" },
];

const subjectMix = [
  { subject: "Math", percent: 40 },
  { subject: "Science", percent: 30 },
  { subject: "English", percent: 20 },
  { subject: "Others", percent: 10 },
];

const riskList = [
  { title: "AI API retries rising", detail: "Failure rate increased in last 30 minutes", tone: "high" },
  { title: "Queue backlog", detail: "34 quiz jobs waiting for processing", tone: "medium" },
  { title: "Moderation queue", detail: "7 flagged quizzes need manual review", tone: "medium" },
  { title: "Support SLA delay", detail: "2 unresolved tickets over target time", tone: "low" },
] as const;

const supportLog = [
  { id: "#2194", user: "Lakeshore Prep", issue: "Upgrade to School plan", status: "Open" },
  { id: "#2191", user: "Nora Patel", issue: "Password reset request", status: "Resolved" },
  { id: "#2188", user: "Maple Grove High", issue: "Student join code error", status: "In progress" },
  { id: "#2182", user: "Carlos M.", issue: "Flagged quiz clarification", status: "Open" },
];

export default function AdminDashboardPage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Admin Overview</p>
          <h3>Daily command report</h3>
          <p>Clear snapshot of growth, usage, cost, and operational risks.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btnGhost}>Export daily report</button>
          <button type="button" className={styles.btnPrimary}>Review critical alerts</button>
        </div>
      </header>

      <section className={styles.briefRow}>
        {todayBrief.map((item) => (
          <article key={item.label} className={styles.briefCard}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHead}>
          <h4>Growth Snapshot</h4>
          <span>Users and subscriptions</span>
        </div>

        <div className={styles.growthLayout}>
          <div className={styles.metricGrid}>
            {growthMetrics.map((item) => (
              <article key={item.label} className={styles.metricCard}>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
                <small>{item.trend}</small>
              </article>
            ))}
          </div>

          <aside className={styles.sidePanel}>
            <h5>Plan mix</h5>
            <ul className={styles.barList}>
              {planMix.map((item) => (
                <li key={item.name}>
                  <div className={styles.barHead}>
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className={styles.track}>
                    <div className={styles.fillMint} style={{ width: `${item.width}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHead}>
          <h4>Cost Control</h4>
          <span>AI usage and budget health</span>
        </div>

        <div className={styles.costLayout}>
          <article className={styles.costPanel}>
            <ul className={styles.costList}>
              {aiBudget.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>
            <div className={styles.budgetMeter}>
              <p>Monthly AI budget usage</p>
              <div className={styles.track}>
                <div className={styles.fillBlue} style={{ width: "61%" }} />
              </div>
              <small>61% used</small>
            </div>
          </article>

          <article className={styles.subjectPanel}>
            <h5>Most used subjects</h5>
            <ul className={styles.barList}>
              {subjectMix.map((item) => (
                <li key={item.subject}>
                  <div className={styles.barHead}>
                    <span>{item.subject}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className={styles.track}>
                    <div className={styles.fillBlue} style={{ width: `${item.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHead}>
          <h4>Risk and Support</h4>
          <span>Operational watchlist</span>
        </div>

        <div className={styles.bottomLayout}>
          <article className={styles.riskPanel}>
            <ul className={styles.riskList}>
              {riskList.map((item) => (
                <li key={item.title}>
                  <span className={`${styles.dot} ${styles[`t_${item.tone}`]}`} />
                  <div>
                    <p>{item.title}</p>
                    <small>{item.detail}</small>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.logPanel}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>User</th>
                    <th>Issue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supportLog.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.user}</td>
                      <td>{row.issue}</td>
                      <td><span className={styles.pill}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
