import styles from "../section.module.css";

const plans = [
  { name: "Free", users: 120, percent: 67 },
  { name: "Basic", users: 35, percent: 20 },
  { name: "Pro", users: 20, percent: 10 },
  { name: "School", users: 4, percent: 3 },
];

export default function AdminRevenuePage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Revenue dashboard</p>
          <h3>Business performance</h3>
          <p>Track recurring revenue, growth, subscriptions, and plan-level conversion.</p>
        </div>
      </header>

      <div className={styles.grid4}>
        <article className={styles.card}><p>Monthly revenue</p><strong>$1,240</strong></article>
        <article className={styles.card}><p>Annual revenue run-rate</p><strong>$14,880</strong></article>
        <article className={styles.card}><p>New subscriptions</p><strong>11</strong></article>
        <article className={styles.card}><p>Cancelled subscriptions</p><strong>4</strong></article>
      </div>

      <div className={styles.grid2}>
        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Plan distribution</h4>
            <span>Current users</span>
          </div>
          <ul className={styles.list}>
            {plans.map((plan) => (
              <li key={plan.name}>
                <div>
                  <strong>{plan.name} ({plan.users})</strong>
                  <div className={styles.track}>
                    <div className={styles.fill} style={{ width: `${plan.percent}%` }} />
                  </div>
                </div>
                <span>{plan.percent}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Growth snapshot</h4>
            <span>Last 30 days</span>
          </div>
          <ul className={styles.list}>
            <li><span>Revenue growth</span><strong>+12.4%</strong></li>
            <li><span>User growth</span><strong>+8.2%</strong></li>
            <li><span>Upgrade rate</span><strong>18.2%</strong></li>
            <li><span>Net retention</span><strong>96.4%</strong></li>
          </ul>
        </article>
      </div>
    </section>
  );
}
