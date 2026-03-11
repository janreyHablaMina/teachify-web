import styles from "../section.module.css";

const topUsers = [
  { name: "Carlos M.", tokens: "4,200,000", quizzes: 162, plan: "Pro" },
  { name: "Maple Grove High", tokens: "3,600,000", quizzes: 148, plan: "School" },
  { name: "Nora Patel", tokens: "2,700,000", quizzes: 103, plan: "Basic" },
  { name: "Northside Academy", tokens: "2,100,000", quizzes: 87, plan: "School" },
];

export default function AdminAiUsagePage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>AI usage monitoring</p>
          <h3>Token and cost control</h3>
          <p>Monitor token consumption, estimate cost, and identify the highest-usage accounts.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btn}>Download usage CSV</button>
        </div>
      </header>

      <div className={styles.grid4}>
        <article className={styles.card}><p>Total tokens used</p><strong>25,000,000</strong></article>
        <article className={styles.card}><p>Tokens today</p><strong>1,240,000</strong></article>
        <article className={styles.card}><p>Tokens this month</p><strong>25,000,000</strong></article>
        <article className={styles.card}><p>Estimated AI cost</p><strong>$18</strong></article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Top users generating quizzes</h4>
          <span>Cost concentration</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Tokens</th>
                <th>Quizzes</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user) => (
                <tr key={user.name}>
                  <td>{user.name}</td>
                  <td>{user.tokens}</td>
                  <td>{user.quizzes}</td>
                  <td>{user.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
