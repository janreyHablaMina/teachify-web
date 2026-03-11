"use client";

import styles from "./admin.module.css";

export default function AdminDashboardPage() {
  return (
    <div className={styles.root}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Super Admin View</p>
          <h3>Platform Snapshot</h3>
          <p>Real-time momentum across users, revenue, and educational impact.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button">Generate Report</button>
          <button type="button">System Logs</button>
        </div>
      </header>

      <div className={styles.quickGrid}>
        <div className={styles.quickCard}>
          <p>Total Schools</p>
          <strong>124</strong>
        </div>
        <div className={styles.quickCard}>
          <p>Active Students</p>
          <strong>42.8k</strong>
        </div>
        <div className={styles.quickCard}>
          <p>AI Credits Used</p>
          <strong>890k</strong>
        </div>
        <div className={styles.quickCard}>
          <p>Monthly Revenue</p>
          <strong>$48.2k</strong>
        </div>
      </div>

      <div className={styles.insightGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHead}>
            <h4>User Growth</h4>
            <small>Last 12 months</small>
          </div>
          <div className={styles.chartBars}>
            {[45, 60, 40, 80, 95, 70, 85, 90, 100, 85, 95, 110].map((val, i) => (
              <div key={i} className={styles.barWrap}>
                <div
                  className={styles.barUsers}
                  style={{ height: `${val}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.notesCard}>
          <h4>Recent Activity</h4>
          <ul>
            <li>
              <div>
                <p>New School Joined</p>
                <small>Lincoln High School</small>
              </div>
              <span>2m ago</span>
            </li>
            <li>
              <div>
                <p>Platform Update</p>
                <small>v2.4.0 deployed successfully</small>
              </div>
              <span>1h ago</span>
            </li>
            <li>
              <div>
                <p>High AI Usage</p>
                <small>Summit Academy exceeding quota</small>
              </div>
              <span>3h ago</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p>Quiz Completion Rate</p>
          <strong>92%</strong>
          <span>+2.4% from last week</span>
        </div>
        <div className={styles.statCard}>
          <p>Avg. Teacher Rating</p>
          <strong>4.9</strong>
          <span>Stable</span>
        </div>
        <div className={styles.statCard}>
          <p>System Uptime</p>
          <strong>99.99%</strong>
          <span>Operational</span>
        </div>
        <div className={styles.statCard}>
          <p>Support Tickets</p>
          <strong>14</strong>
          <span>-5 this week</span>
        </div>
      </div>
    </div>
  );
}
