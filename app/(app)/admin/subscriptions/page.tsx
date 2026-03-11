import styles from "./subscriptions.module.css";

const plans = [
  { name: "Free", users: 120, mrr: "$0", churn: "-", tone: "free" },
  { name: "Basic", users: 35, mrr: "$245", churn: "2.1%", tone: "basic" },
  { name: "Pro", users: 20, mrr: "$280", churn: "1.4%", tone: "pro" },
  { name: "School", users: 4, mrr: "$236", churn: "0.8%", tone: "school" },
  { name: "Expired", users: 7, mrr: "$0", churn: "-", tone: "free" },
];

const invoices = [
  { id: "INV-1092", account: "Maple Grove High", plan: "School", amount: "$59", status: "Paid", date: "Mar 10", action: "Extend subscription" },
  { id: "INV-1091", account: "Northside Academy", plan: "Pro", amount: "$14", status: "Paid", date: "Mar 10", action: "Upgrade user" },
  { id: "INV-1090", account: "Lakeshore Prep", plan: "Basic", amount: "$7", status: "Retry", date: "Mar 09", action: "Cancel subscription" },
  { id: "INV-1089", account: "Starlight Academy", plan: "School", amount: "$59", status: "Pending", date: "Mar 09", action: "Extend subscription" },
  { id: "INV-1088", account: "Hillside School", plan: "Pro", amount: "$14", status: "Paid", date: "Mar 08", action: "Upgrade user" },
];

export default function Page() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Subscriptions</p>
          <h3>Billing and plan performance</h3>
          <p>Track revenue mix, subscription health, and recent invoice outcomes.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btn}>Download invoices</button>
          <button type="button" className={styles.btnPrimary}>Create coupon</button>
        </div>
      </header>

      <div className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <p>Monthly recurring revenue</p>
          <strong>$1,240</strong>
        </article>
        <article className={styles.summaryCard}>
          <p>Active subscriptions</p>
          <strong>59</strong>
        </article>
        <article className={styles.summaryCard}>
          <p>Trial to paid conversion</p>
          <strong>18.2%</strong>
        </article>
      </div>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Plan breakdown</h4>
          <span>Current month</span>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan) => (
            <div key={plan.name} className={`${styles.planCard} ${styles[`tone_${plan.tone}`]}`}>
              <p className={styles.planName}>{plan.name}</p>
              <p className={styles.planUsers}>{plan.users} users</p>
              <p className={styles.planMrr}>{plan.mrr} MRR</p>
              <p className={styles.planMeta}>Churn: {plan.churn}</p>
            </div>
          ))}
        </div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Recent invoices</h4>
          <span>Latest 5</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Account</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.account}</td>
                  <td>{invoice.plan}</td>
                  <td>{invoice.amount}</td>
                  <td><span className={`${styles.status} ${styles[`s_${invoice.status.toLowerCase()}`]}`}>{invoice.status}</span></td>
                  <td>{invoice.date}</td>
                  <td>{invoice.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
