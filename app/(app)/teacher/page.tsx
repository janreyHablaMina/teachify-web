"use client";

import styles from "./teacher.module.css";

const metrics = [
  { label: "Quizzes Created", value: "42", delta: "+5 this week" },
  { label: "Active Classes", value: "5", delta: "On track" },
  { label: "Assigned This Week", value: "9", delta: "+2 vs last week" },
  { label: "Avg Score", value: "81%", delta: "+3% improvement" },
] as const;

const activities = [
  "Class 5A submitted Quiz: Photosynthesis",
  "2 Essay responses need manual review",
  "New draft: Mathematics - Geometry saved",
  "Reminder notification sent to Class 6B",
] as const;

export default function TeacherDashboardPage() {
  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Dashboard / Overview</p>
          <h2>Classroom Analysis</h2>
        </div>
      </header>

      <section className={styles.metricGrid}>
        {metrics.map((item) => (
          <article key={item.label} className={styles.metricCard}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.delta}</span>
          </article>
        ))}
      </section>

      <section className={styles.layoutGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Live Activity Feed</h4>
            <span>Recent Events</span>
          </div>
          <div className={styles.feedList}>
            {activities.map((activity, idx) => (
              <div key={idx} className={styles.feedSlice}>
                <div className={styles.feedIcon} />
                <span className={styles.feedText}>{activity}</span>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <h4>Platform Usage</h4>
            <span>Performance Metrics</span>
          </div>
          <div className={styles.perfGrid}>
            <div className={styles.perfCard}>
              <p>Engagement</p>
              <strong>87%</strong>
            </div>
            <div className={styles.perfCard}>
              <p>On-time</p>
              <strong>91%</strong>
            </div>
            <div className={styles.perfCard}>
              <p>Reviews</p>
              <strong>3</strong>
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}
