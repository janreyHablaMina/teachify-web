"use client";

import styles from "./system.module.css";

const metrics = [
  { label: "Server status", value: "Healthy", note: "99.98% uptime" },
  { label: "Queue workers", value: "12", note: "2 scaling workers idle" },
  { label: "Failed jobs", value: "34", note: "Past 24 hours" },
  { label: "API errors", value: "17", note: "4xx + 5xx this hour" },
  { label: "AI failures", value: "12", note: "Last 30 minutes" },
] as const;

const alerts = [
  { title: "Queue backlog detected", detail: "Generation queue exceeded threshold at 34 pending jobs", tone: "warn" },
  { title: "AI API failure", detail: "Transient timeout spikes from upstream provider region", tone: "high" },
  { title: "High CPU usage", detail: "Worker cluster averaging 81% CPU for 14 minutes", tone: "warn" },
] as const;

export default function AdminSystemMonitoringPage() {
  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / System Monitoring</p>
          <h2>Platform Health</h2>
        </div>
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
          <h4>Active Infrastructure Alerts</h4>
          <span>Realtime Pulse</span>
        </div>

        <div className={styles.alertWrap}>
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className={styles.alertSlice}
              style={{ "--severity-color": alert.tone === "high" ? "#ef4444" : "#f59e0b" } as any}
            >
              <div className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <p>{alert.title}</p>
                <small>{alert.detail}</small>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
