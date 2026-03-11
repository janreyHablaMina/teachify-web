import styles from "./admin.module.css";

const overviewStats = [
  { label: "Total Users", value: "18,420", delta: "+4.6%" },
  { label: "Total Teachers", value: "2,148", delta: "+3.1%" },
  { label: "Total Schools", value: "326", delta: "+1.7%" },
  { label: "Total Students", value: "15,902", delta: "+5.2%" },
  { label: "Total Quizzes Generated", value: "248,931", delta: "+8.9%" },
  { label: "AI Tokens Used", value: "92.4M", delta: "+6.4%" },
  { label: "Monthly Revenue", value: "$43,280", delta: "+12.3%" },
  { label: "Active Subscriptions", value: "1,284", delta: "+2.8%" },
] as const;

const revenueGrowth = [34, 38, 42, 40, 47, 51, 58, 61, 66, 72, 78, 84];
const userGrowth = [7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 20, 22];
const quizTrend = [12, 15, 18, 20, 17, 22, 24, 26, 29, 31, 35, 38];

function barHeight(value: number, max: number) {
  return `${Math.max(12, Math.round((value / max) * 100))}%`;
}

export default function AdminDashboardPage() {
  const revMax = Math.max(...revenueGrowth);
  const usersMax = Math.max(...userGrowth);
  const quizMax = Math.max(...quizTrend);

  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Platform Control</p>
        <h3>Overview Dashboard</h3>
        <p>
          Quick platform health overview across users, learning activity, AI usage, and revenue.
        </p>
      </header>

      <section className={styles.statsGrid}>
        {overviewStats.map((item) => (
          <article key={item.label} className={styles.statCard}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.delta} this month</span>
          </article>
        ))}
      </section>

      <section className={styles.chartGrid}>
        <article className={styles.chartCard}>
          <div className={styles.chartHead}>
            <h4>Revenue growth</h4>
            <small>Last 12 months</small>
          </div>
          <div className={styles.chartBars}>
            {revenueGrowth.map((value, idx) => (
              <div key={`rev-${idx}`} className={styles.barWrap}>
                <div className={styles.barRevenue} style={{ height: barHeight(value, revMax) }} />
              </div>
            ))}
          </div>
        </article>

        <article className={styles.chartCard}>
          <div className={styles.chartHead}>
            <h4>User growth</h4>
            <small>New users per month (k)</small>
          </div>
          <div className={styles.chartBars}>
            {userGrowth.map((value, idx) => (
              <div key={`users-${idx}`} className={styles.barWrap}>
                <div className={styles.barUsers} style={{ height: barHeight(value, usersMax) }} />
              </div>
            ))}
          </div>
        </article>

        <article className={styles.chartCard}>
          <div className={styles.chartHead}>
            <h4>Quiz generation trends</h4>
            <small>Generated quizzes per month (k)</small>
          </div>
          <div className={styles.chartBars}>
            {quizTrend.map((value, idx) => (
              <div key={`quiz-${idx}`} className={styles.barWrap}>
                <div className={styles.barQuiz} style={{ height: barHeight(value, quizMax) }} />
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
