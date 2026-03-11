import styles from "../section.module.css";

const schools = [
  { name: "Maple Grove High", teachers: 24, students: 420, usage: "5.4M tokens", plan: "School" },
  { name: "Northside Academy", teachers: 18, students: 310, usage: "4.1M tokens", plan: "School" },
  { name: "Lakeshore Prep", teachers: 13, students: 210, usage: "2.8M tokens", plan: "Pro" },
  { name: "Hillside School", teachers: 9, students: 160, usage: "1.9M tokens", plan: "Basic" },
];

export default function AdminSchoolsPage() {
  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>School management</p>
          <h3>Manage institutions</h3>
          <p>Track school usage, teacher distribution, and account actions for every institution plan.</p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.btn}>Export schools</button>
          <button type="button" className={styles.btnPrimary}>Add school</button>
        </div>
      </header>

      <article className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>School list</h4>
          <span>4 active organizations</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>School name</th>
                <th>Teachers</th>
                <th>Students</th>
                <th>Monthly usage</th>
                <th>Plan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.name}>
                  <td>{school.name}</td>
                  <td>{school.teachers}</td>
                  <td>{school.students}</td>
                  <td>{school.usage}</td>
                  <td>{school.plan}</td>
                  <td>Edit | Add teachers | Disable | Upgrade</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
