import styles from "./settings.module.css";

const toggles = [
  { label: "Allow self-service teacher signups", hint: "Enable public teacher registration flow", enabled: true },
  { label: "Require email verification", hint: "Block login before verification is complete", enabled: true },
  { label: "Enable maintenance banner", hint: "Show scheduled maintenance alert in app", enabled: false },
  { label: "Auto-suspend failed billing after 7 days", hint: "Apply temporary account lock after grace period", enabled: true },
];

const apiKeys = [
  { name: "OpenAI Production", key: "sk-live-...x91f", lastRotated: "Mar 01, 2026" },
  { name: "Stripe Billing", key: "rk_live_...k2a", lastRotated: "Feb 15, 2026" },
  { name: "Internal Queue", key: "qk_prod_...77z", lastRotated: "Jan 28, 2026" },
];

export default function Page() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Platform settings</p>
          <h3>System configuration and controls</h3>
          <p>Manage defaults, security behavior, notifications, and operational preferences.</p>
        </div>
        <button type="button" className={styles.saveBtn}>Save changes</button>
      </header>

      <div className={styles.grid}>
        <article className={styles.panel}>
          <h4>General policies</h4>
          <ul className={styles.toggleList}>
            {toggles.map((toggle) => (
              <li key={toggle.label}>
                <div>
                  <p>{toggle.label}</p>
                  <small>{toggle.hint}</small>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked={toggle.enabled} />
                  <span />
                </label>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.panel}>
          <h4>Security quick actions</h4>
          <div className={styles.actions}>
            <button type="button">Force logout all sessions</button>
            <button type="button">Rotate API keys</button>
            <button type="button">Reset admin MFA</button>
            <button type="button">Generate audit export</button>
          </div>
        </article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>API credentials</h4>
          <button type="button" className={styles.smallBtn}>Create key</button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Key</th>
                <th>Last rotated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((entry) => (
                <tr key={entry.name}>
                  <td>{entry.name}</td>
                  <td>{entry.key}</td>
                  <td>{entry.lastRotated}</td>
                  <td><button type="button" className={styles.linkBtn}>Rotate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
