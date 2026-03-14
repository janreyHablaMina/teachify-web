"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { getUser } from "@/lib/auth";
import api from "@/lib/axios";

export default function StudentDashboard() {
  const [userName, setUserName] = useState("Student");
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    getUser().then(user => {
      if (user?.fullname && isMounted) setUserName(user.fullname.split(' ')[0]);
    });

    Promise.all([
      api.get("/api/classrooms").catch(() => ({ data: [] })),
      api.get("/api/assignments").catch(() => ({ data: [] }))
    ]).then(([classroomsRes, assignmentsRes]) => {
      if (isMounted) {
        setClassrooms(classroomsRes.data ?? []);
        setAssignments(assignmentsRes.data ?? []);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const colors = ["#fef08a", "#dbeafe", "#dcfce7", "#ffedd5", "#fce7f3", "#e0e7ff"];

  return (
    <div className={styles.container}>
      <header className={styles.welcomeSection}>
        <h1 className={styles.welcomeHeading}>Hello, {userName}! 👋</h1>
        <p className={styles.welcomeSub}>Ready to master your classes today? You have {assignments.length} tasks due soon.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Classes</span>
          <div className={styles.statValue}>{loading ? "..." : classrooms.length}</div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Completed Quizzes</span>
          <div className={styles.statValue}>0</div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Overall Progress</span>
          <div className={styles.statValue}>0<span className={styles.unit}>%</span></div>
        </div>
      </div>

      <div className={styles.dashGrid}>
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Classes</h2>
            <Link href="/student/classes" className={styles.viewAll}>View All Classes →</Link>
          </div>
          <div className={styles.classGrid}>
            {loading ? (
              <p>Loading classes...</p>
            ) : classrooms.length === 0 ? (
              <p>You haven't joined any classes yet.</p>
            ) : (
              classrooms.slice(0, 3).map((cls, index) => (
                <Link href={`/student/classes/${cls.id}`} key={cls.id} className={styles.classCard}>
                  <div className={styles.cardHeader} style={{ backgroundColor: colors[index % colors.length] }}>
                    <h3 className={styles.classTitle}>{cls.name}</h3>
                    <span className={styles.teacherName}>{cls.teacher?.fullname || "Instructor"}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressLabel}>
                        <span>Completion</span>
                        <span>0%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `0%` }}></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <aside>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming</h2>
            <Link href="/student/assignments" className={styles.viewAll}>All Tasks →</Link>
          </div>
          <div className={styles.assignmentsList}>
            {loading ? (
              <p>Loading tasks...</p>
            ) : assignments.length === 0 ? (
              <p>No upcoming tasks. You're all caught up!</p>
            ) : (
              assignments.slice(0, 5).map(task => {
                const isUrgent = task.deadline_at && new Date(task.deadline_at).getTime() - Date.now() < 86400000 * 2;
                return (
                  <div key={task.id} className={styles.assignmentItem}>
                    <div className={styles.assignIcon}>📖</div>
                    <div className={styles.assignContent}>
                      <h3 className={styles.assignTitle}>{task.quiz?.title || "Quiz"}</h3>
                      <div className={`${styles.assignMeta} ${isUrgent ? styles.urgent : ''}`}>
                        {task.classroom?.name || "Class"} • Due {task.deadline_at ? new Date(task.deadline_at).toLocaleDateString() : "Anytime"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
