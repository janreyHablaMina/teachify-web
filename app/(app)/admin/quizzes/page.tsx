import styles from "../section.module.css";

const moderationItems = [
  { id: "QZ-991", owner: "Carlos M.", subject: "Math", reason: "Reported by student", status: "Pending review" },
  { id: "QZ-976", owner: "Hillside School", subject: "Science", reason: "Flagged phrase detected", status: "Needs action" },
  { id: "QZ-961", owner: "Nora Patel", subject: "English", reason: "Duplicate abusive prompt", status: "Escalated" },
];

export default function AdminQuizzesPage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Content moderation</p>
          <h3>Quiz safety and quality</h3>
          <p>Review reported quizzes, flagged outputs, and enforce moderation actions.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btn}>Export moderation log</button>
          <button type="button" className={styles.btnPrimary}>Open safety policy</button>
        </div>
      </header>

      <div className={styles.grid3}>
        <article className={styles.card}><p>Reported quizzes</p><strong>12</strong><small>Last 24 hours</small></article>
        <article className={styles.card}><p>Flagged content</p><strong>7</strong><small>Requires review</small></article>
        <article className={styles.card}><p>Deleted quizzes</p><strong>3</strong><small>Today</small></article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Flagged quiz queue</h4>
          <span>Live queue</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Quiz ID</th>
                <th>Owner</th>
                <th>Subject</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {moderationItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.owner}</td>
                  <td>{item.subject}</td>
                  <td>{item.reason}</td>
                  <td><span className={styles.pill}>{item.status}</span></td>
                  <td>Remove quiz | Warn user | Ban user</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
