import styles from "./system.module.css";

const metrics = [
  { label: "Server status", value: "Healthy", note: "99.98% uptime" },
  { label: "Queue workers", value: "12", note: "2 scaling workers idle" },
  { label: "Failed jobs", value: "34", note: "Past 24 hours" },
  { label: "API errors", value: "17", note: "4xx + 5xx this hour" },
  { label: "AI request failures", value: "12", note: "Last 30 minutes" },
] as const;

const alerts = [
  { title: "Queue backlog detected", detail: "Generation queue exceeded threshold at 34 pending jobs", tone: "warn" },
  { title: "AI API failure", detail: "Transient timeout spikes from upstream provider region", tone: "high" },
  { title: "High CPU usage", detail: "Worker cluster averaging 81% CPU for 14 minutes", tone: "warn" },
] as const;

export default function AdminSystemMonitoringPage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <p className={styles.kicker}>System monitoring</p>
        <h3>Keep the system stable</h3>
        <p>Watch infrastructure health, queue pressure, API errors, and AI reliability signals in real time.</p>
      </header>

      <section className={styles.metricGrid}>
        {metrics.map((item) => (
          <article key={item.label} className={styles.metricCard}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.note}</span>
          </article>
        ))}
      </section>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Active alerts</h4>
          <span>Realtime</span>
        </div>
        <ul className={styles.alertList}>
          {alerts.map((alert) => (
            <li key={alert.title}>
              <span className={`${styles.dot} ${alert.tone === "high" ? styles.high : styles.warn}`} />
              <div>
                <p>{alert.title}</p>
                <small>{alert.detail}</small>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
