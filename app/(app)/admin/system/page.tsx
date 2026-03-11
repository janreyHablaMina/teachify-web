import styles from "../section.module.css";

const alerts = [
  { source: "AI API", message: "Failure rate above threshold", state: "Needs review" },
  { source: "Queue", message: "Backlog reached 34 jobs", state: "Warning" },
  { source: "Worker CPU", message: "Sustained high load at 79%", state: "Warning" },
  { source: "Error log", message: "5 new critical entries", state: "Open" },
];

export default function AdminSystemPage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>System monitoring</p>
          <h3>Platform health and uptime</h3>
          <p>Track server status, queue pressure, failed AI calls, and incident alerts.</p>
        </div>
      </header>

      <div className={styles.grid4}>
        <article className={styles.card}><p>Server status</p><strong>Healthy</strong><small>99.98% uptime</small></article>
        <article className={styles.card}><p>Queue jobs</p><strong>34</strong><small>Pending tasks</small></article>
        <article className={styles.card}><p>Failed AI requests</p><strong>12</strong><small>Last 30 min</small></article>
        <article className={styles.card}><p>Error logs</p><strong>5</strong><small>Critical today</small></article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Active alerts</h4>
          <span>Realtime</span>
        </div>
        <ul className={styles.list}>
          {alerts.map((alert) => (
            <li key={alert.source}>
              <div>
                <strong>{alert.source}</strong>
                <p>{alert.message}</p>
              </div>
              <span className={styles.pill}>{alert.state}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
