import styles from "./ai-usage.module.css";

const metrics = [
  { label: "Total tokens used", value: "128,400,000", note: "All-time usage" },
  { label: "Tokens used today", value: "1,240,000", note: "Last 24 hours" },
  { label: "Tokens used this month", value: "23,000,000", note: "March usage" },
  { label: "Estimated AI cost", value: "$17", note: "Projected month-end" },
] as const;

const topUsers = [
  { name: "Carlos M.", school: "Lakeshore Prep", quizzes: 162, tokens: "4,200,000", estCost: "$3.10" },
  { name: "Maple Grove High", school: "Maple Grove High", quizzes: 148, tokens: "3,600,000", estCost: "$2.66" },
  { name: "Nora Patel", school: "Hillside School", quizzes: 103, tokens: "2,700,000", estCost: "$1.99" },
  { name: "Northside Academy", school: "Northside Academy", quizzes: 87, tokens: "2,100,000", estCost: "$1.55" },
  { name: "Isabelle Cruz", school: "Eastbay Learning", quizzes: 74, tokens: "1,800,000", estCost: "$1.33" },
] as const;

export default function AdminAiUsagePage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <p className={styles.kicker}>AI usage monitoring</p>
        <h3>Monitor AI usage and cost</h3>
        <p>Keep token spend under control and quickly identify accounts with the highest generation load.</p>
      </header>

      <section className={styles.metricGrid}>
        {metrics.map((metric) => (
          <article key={metric.label} className={styles.metricCard}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.note}</span>
          </article>
        ))}
      </section>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Top users generating quizzes</h4>
          <span>Highest token consumption</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>School</th>
                <th>Quizzes Generated</th>
                <th>Tokens Used</th>
                <th>Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user) => (
                <tr key={user.name}>
                  <td className={styles.cellPrimary}>{user.name}</td>
                  <td>{user.school}</td>
                  <td>{user.quizzes}</td>
                  <td>{user.tokens}</td>
                  <td>{user.estCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
