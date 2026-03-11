"use client";

import styles from "./quizzes.module.css";

const metrics = [
  { label: "Total quizzes generated", value: "248,931" },
  { label: "Quizzes generated today", value: "412" },
  { label: "Average questions per quiz", value: "12.4" },
] as const;

const subjectMix = [
  { name: "Math", percent: 40 },
  { name: "Science", percent: 30 },
  { name: "English", percent: 20 },
  { name: "Social Studies", percent: 15 },
  { name: "Others", percent: 10 },
] as const;

const dailyQuizTrend = [60, 45, 80, 55, 90, 70, 100, 85, 95, 75, 110, 105];

function heightOf(value: number, max: number) {
  return `${Math.max(12, Math.round((value / max) * 100))}%`;
}

export default function AdminQuizAnalyticsPage() {
  const max = Math.max(...dailyQuizTrend);

  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / Quiz Analytics</p>
          <h2>Understand platform usage</h2>
        </div>
      </header>

      <section className={styles.metricGrid}>
        {metrics.map((item) => (
          <article key={item.label} className={styles.metricCard}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Most popular subjects</h4>
            <span>Distribution by use</span>
          </div>
          <ul className={styles.subjectList}>
            {subjectMix.map((subject) => (
              <li key={subject.name} className={styles.subjectRow}>
                <div className={styles.rowTop}>
                  <strong>{subject.name}</strong>
                  <span>{subject.percent}%</span>
                </div>
                <div className={styles.track}>
                  <div className={styles.fill} style={{ width: `${subject.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Quiz generation trend</h4>
            <span>Last 12 cycles</span>
          </div>
          <div className={styles.chart}>
            {dailyQuizTrend.map((value, index) => (
              <div key={`q-${index}`} className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{ height: heightOf(value, max) }}
                  title={`${Math.round((value / max) * 100)}% volume`}
                />
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
