"use client";

import styles from "./classes.module.css";

const classes = [
  { name: "5A - Science", students: 32, schedule: "Mon, Wed, Fri", room: "302" },
  { name: "6B - Math", students: 28, schedule: "Tue, Thu", room: "105" },
  { name: "6A - Science", students: 30, schedule: "Mon, Wed", room: "302" },
  { name: "4C - English", students: 25, schedule: "Fri", room: "201" },
] as const;

export default function TeacherClassesPage() {
  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Dashboard / Classes</p>
          <h2>My Classrooms</h2>
        </div>
        <button className={styles.btnPrimary}>Create New Class</button>
      </header>

      <section className={styles.panel}>
        <div className={styles.classGrid}>
          {classes.map((cls) => (
            <article key={cls.name} className={styles.classCard}>
              <div className={styles.classHead}>
                <h4>{cls.name}</h4>
                <span>Active</span>
              </div>

              <div className={styles.classMeta}>
                <div className={styles.metaItem}>
                  <p>Students</p>
                  <strong>{cls.students} enrolled</strong>
                </div>
                <div className={styles.metaItem}>
                  <p>Room</p>
                  <strong>Room {cls.room}</strong>
                </div>
                <div className={styles.metaItem}>
                  <p>Schedule</p>
                  <strong>{cls.schedule}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
