import styles from "./users.module.css";

type UserRow = {
  name: string;
  email: string;
  plan: "Free" | "Basic" | "Pro" | "School";
  status: "Active" | "Pending" | "Suspended";
  quizzes: number;
  joined: string;
};

const users: UserRow[] = [
  { name: "Sarah Johnson", email: "sarah.j@maplegrove.edu", plan: "School", status: "Active", quizzes: 128, joined: "Mar 02" },
  { name: "Marcus Lee", email: "marcus.lee@northside.edu", plan: "Pro", status: "Active", quizzes: 91, joined: "Feb 25" },
  { name: "Amelia Cruz", email: "amelia.cruz@teachify.com", plan: "Pro", status: "Active", quizzes: 66, joined: "Feb 11" },
  { name: "Daniel Kim", email: "dkim@lakeshore.edu", plan: "Basic", status: "Pending", quizzes: 17, joined: "Today" },
  { name: "Nora Patel", email: "nora.p@hillside.edu", plan: "Free", status: "Suspended", quizzes: 9, joined: "Jan 14" },
];

const pendingInvites = [
  { school: "Brighton Public School", count: 4 },
  { school: "Evergreen International", count: 2 },
  { school: "Starlight Academy", count: 3 },
];

export default function Page() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>User management</p>
          <h3>Manage teachers and admins</h3>
          <p>Review account status, role access, and pending onboarding requests.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btn}>Export CSV</button>
          <button type="button" className={styles.btnPrimary}>Invite user</button>
        </div>
      </header>

      <div className={styles.statsRow}>
        <article className={styles.statCard}>
          <p>Total users</p>
          <strong>1,284</strong>
        </article>
        <article className={styles.statCard}>
          <p>Teachers</p>
          <strong>1,102</strong>
        </article>
        <article className={styles.statCard}>
          <p>School admins</p>
          <strong>161</strong>
        </article>
        <article className={styles.statCard}>
          <p>System admins</p>
          <strong>21</strong>
        </article>
      </div>

      <div className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.toolbar}>
            <input placeholder="Search by name or email" className={styles.search} />
            <div className={styles.filters}>
              <button type="button">All plans</button>
              <button type="button">Active</button>
              <button type="button">Pending</button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Quizzes Generated</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.avatar}>{user.name.charAt(0)}</span>
                        <div>
                          <p>{user.name}</p>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{user.plan}</td>
                    <td><span className={`${styles.status} ${styles[`s_${user.status.toLowerCase()}`]}`}>{user.status}</span></td>
                    <td>{user.quizzes}</td>
                    <td>{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className={styles.sideStack}>
          <article className={styles.panel}>
            <h4>Pending invitations</h4>
            <ul className={styles.list}>
              {pendingInvites.map((invite) => (
                <li key={invite.school}>
                  <span>{invite.school}</span>
                  <strong>{invite.count}</strong>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.panel}>
            <h4>Quick actions</h4>
            <ul className={styles.actions}>
              <li>Edit user details</li>
              <li>Suspend account</li>
              <li>Delete account</li>
              <li>Reset password</li>
              <li>Change plan</li>
            </ul>
          </article>
        </aside>
      </div>
    </section>
  );
}
