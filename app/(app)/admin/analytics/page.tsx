import styles from "../section.module.css";

const subjectMix = [
  { label: "Math", percent: 40 },
  { label: "Science", percent: 30 },
  { label: "English", percent: 20 },
  { label: "Others", percent: 10 },
];

export default function AdminAnalyticsPage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Quiz analytics</p>
          <h3>Learning content insights</h3>
          <p>Understand quiz output trends and subject-level usage across the platform.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btn}>Download report</button>
        </div>
      </header>

      <div className={styles.grid4}>
        <article className={styles.card}><p>Quizzes today</p><strong>412</strong></article>
        <article className={styles.card}><p>Quizzes this month</p><strong>8,540</strong></article>
        <article className={styles.card}><p>Avg quiz questions</p><strong>22</strong></article>
        <article className={styles.card}><p>Most used subject</p><strong>Math</strong></article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Subject distribution</h4>
          <span>Monthly</span>
        </div>
        <ul className={styles.list}>
          {subjectMix.map((item) => (
            <li key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <div className={styles.track}>
                  <div className={styles.fill} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
              <span>{item.percent}%</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
