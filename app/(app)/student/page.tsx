"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { getUser } from "@/lib/auth";

export default function StudentDashboard() {
  const [userName, setUserName] = useState("Student");
  
  useEffect(() => {
    getUser().then(user => {
      if (user?.fullname) setUserName(user.fullname.split(' ')[0]);
    });
  }, []);

  const enrolledClasses = [
    { id: 1, title: "English Literature", teacher: "Prof. Sarah Miller", progress: 65, color: "#fef08a" },
    { id: 2, title: "Modern History", teacher: "Dr. James Wilson", progress: 40, color: "#dbeafe" },
    { id: 3, title: "Advanced Mathematics", teacher: "Mrs. Elena Petrova", progress: 85, color: "#dcfce7" },
  ];

  const upcomingAssignments = [
    { id: 1, title: "Shakespeare Essay", subject: "English", dueDate: "Today", urgent: true },
    { id: 2, title: "Calculus Quiz", subject: "Mathematics", dueDate: "Tomorrow", urgent: false },
    { id: 3, title: "War & Peace Summary", subject: "History", dueDate: "Mar 18", urgent: false },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.welcomeSection}>
        <h1 className={styles.welcomeHeading}>Hello, {userName}! 👋</h1>
        <p className={styles.welcomeSub}>Ready to master your classes today? You have 3 tasks due soon.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Classes</span>
          <div className={styles.statValue}>8</div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Completed Quizzes</span>
          <div className={styles.statValue}>24</div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Overall Progress</span>
          <div className={styles.statValue}>72<span className={styles.unit}>%</span></div>
        </div>
      </div>

      <div className={styles.dashGrid}>
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Classes</h2>
            <Link href="/student/classes" className={styles.viewAll}>View All Classes →</Link>
          </div>
          <div className={styles.classGrid}>
            {enrolledClasses.map(cls => (
              <Link href={`/student/classes/${cls.id}`} key={cls.id} className={styles.classCard}>
                <div className={styles.cardHeader} style={{ backgroundColor: cls.color }}>
                  <h3 className={styles.classTitle}>{cls.title}</h3>
                  <span className={styles.teacherName}>{cls.teacher}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                      <span>Completion</span>
                      <span>{cls.progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${cls.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming</h2>
            <Link href="/student/assignments" className={styles.viewAll}>All Tasks →</Link>
          </div>
          <div className={styles.assignmentsList}>
            {upcomingAssignments.map(task => (
              <div key={task.id} className={styles.assignmentItem}>
                <div className={styles.assignIcon}>📖</div>
                <div className={styles.assignContent}>
                  <h3 className={styles.assignTitle}>{task.title}</h3>
                  <div className={`${styles.assignMeta} ${task.urgent ? styles.urgent : ''}`}>
                    {task.subject} • Due {task.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
