"use client";

import styles from "./ai-usage.module.css";

const metrics = [
  { label: "Total tokens used", value: "128,400,000", note: "All-time usage" },
  { label: "Tokens used today", value: "1,240,000", note: "Last 24 hours" },
  { label: "Used this month", value: "23,000,000", note: "March usage" },
  { label: "Estimated cost", value: "$17.40", note: "Current month" },
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
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / AI Usage</p>
          <h2>Monitor Consumption</h2>
        </div>
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
          <h4>Top Generated Loads</h4>
          <span>Highest token consumption</span>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <div>Name</div>
            <div>School</div>
            <div>Quizzes</div>
            <div>Tokens</div>
            <div>Est. Cost</div>
          </div>

          {topUsers.map((user, idx) => {
            const accents = ["#99f6e4", "#fef08a", "#fda4af", "#e9d5ff", "#f87171"];
            return (
              <div
                key={user.name}
                className={styles.rowSlice}
                style={{ "--accent-color": accents[idx % accents.length] } as any}
              >
                <div className={styles.cellPrimary}>{user.name}</div>
                <div className={styles.cellSecondary}>{user.school}</div>
                <div className={styles.cellSecondary}>{user.quizzes}</div>
                <div>
                  <div className={styles.tokenCount}>{user.tokens}</div>
                </div>
                <div>
                  <div className={styles.costTag}>{user.estCost}</div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
