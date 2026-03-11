import styles from "../section.module.css";

const tickets = [
  { id: "#2194", user: "Daniel Kim", issue: "Need plan upgrade", priority: "High", status: "Open" },
  { id: "#2191", user: "Maple Grove High", issue: "Student join code issue", priority: "Medium", status: "In progress" },
  { id: "#2188", user: "Nora Patel", issue: "Password reset", priority: "Low", status: "Open" },
];

export default function AdminSupportPage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Support tools</p>
          <h3>Help desk and user activity</h3>
          <p>Review tickets, inspect activity, and access impersonation tools for faster debugging.</p>
        </div>
      </header>

      <div className={styles.grid3}>
        <article className={styles.card}><p>Open tickets</p><strong>18</strong></article>
        <article className={styles.card}><p>Avg first response</p><strong>12m</strong></article>
        <article className={styles.card}><p>User impersonations</p><strong>6</strong><small>Today</small></article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Support queue</h4>
          <span>Latest activity</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>User</th>
                <th>Issue</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Tools</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.user}</td>
                  <td>{item.issue}</td>
                  <td>{item.priority}</td>
                  <td><span className={styles.pill}>{item.status}</span></td>
                  <td>View activity | Impersonate user</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
