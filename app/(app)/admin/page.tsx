"use client";

import styles from "./admin.module.css";

export default function AdminDashboardPage() {
  return (
    <div className={styles.root}>
      <div className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / Dashboard</p>
          <h2>Platform Pulse</h2>
        </div>
        <div className={styles.heroActions}>
          <button type="button">Download Analytics</button>
          <button type="button">System Settings</button>
        </div>
      </div>

      <section className={styles.dashboardGrid}>
        {/* Row 1: Key Performance Metrics */}
        <div className={styles.statsRow}>
          <div className={styles.statCardPrimary}>
            <div className={styles.statLabel}>Active Schools</div>
            <div className={styles.statValue}>124</div>
            <div className={styles.statTrend}>+12 this month</div>
          </div>
          <div className={styles.statCardPrimary}>
            <div className={styles.statLabel}>Daily Learners</div>
            <div className={styles.statValue}>42.8k</div>
            <div className={styles.statTrend}>+3.2% vs yesterday</div>
          </div>
          <div className={styles.statCardPrimary}>
            <div className={styles.statLabel}>Monthly Revenue</div>
            <div className={styles.statValue}>$48.2k</div>
            <div className={styles.statTrend}>115% of goal</div>
          </div>
          <div className={styles.statCardPrimary}>
            <div className={styles.statLabel}>AI Generations</div>
            <div className={styles.statValue}>890k</div>
            <div className={styles.statTrend}>System optimal</div>
          </div>
        </div>

        {/* Row 2: Deep Insights & Activity */}
        <div className={styles.mainInsightsRow}>
          <div className={styles.growthPanel}>
            <div className={styles.panelHeader}>
              <div>
                <h4>Growth Velocity</h4>
                <p>New registrations & teacher onboarding</p>
              </div>
              <select className={styles.panelSelect}>
                <option>Last 30 Days</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className={styles.growthChart}>
              {[60, 45, 80, 55, 90, 70, 100, 85, 95, 75, 110, 105].map((h, i) => (
                <div key={i} className={styles.chartBar} style={{ height: `${h}%` }}>
                  <div className={styles.barTooltip}>Day {i + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.activityPanel}>
            <div className={styles.panelHeader}>
              <h4>Realtime Events</h4>
            </div>
            <div className={styles.activityList}>
              {[
                { type: "Success", msg: "v2.5 deployment complete", time: "2m ago" },
                { type: "Warning", msg: "API usage spike detected", time: "15m ago" },
                { type: "Info", msg: "New school 'Westwood High' onboarded", time: "1h ago" },
                { type: "Info", msg: "Weekly backup successful", time: "4h ago" },
              ].map((item, i) => (
                <div key={i} className={styles.activityItem}>
                  <span className={styles[`type${item.type}`]}>{item.type}</span>
                  <div className={styles.activityBody}>
                    <p>{item.msg}</p>
                    <small>{item.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Operational Health & Secondary Stats */}
        <div className={styles.operationalRow}>
          <div className={styles.healthCard}>
            <h4>System Health</h4>
            <div className={styles.healthStats}>
              <div className={styles.healthItem}>
                <span>Uptime</span>
                <strong>99.99%</strong>
              </div>
              <div className={styles.healthItem}>
                <span>API Latency</span>
                <strong>42ms</strong>
              </div>
              <div className={styles.healthItem}>
                <span>Open Tickets</span>
                <strong>14</strong>
              </div>
            </div>
          </div>

          <div className={styles.schoolsCard}>
            <h4>Top Performing Schools</h4>
            <div className={styles.schoolList}>
              {[
                { name: "Summit Ridge Academy", score: 98 },
                { name: "Lincoln Technical", score: 95 },
                { name: "Global Innovators High", score: 93 },
              ].map((school, i) => (
                <div key={i} className={styles.schoolItem}>
                  <span>{school.name}</span>
                  <strong>{school.score}% <small>engagement</small></strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
