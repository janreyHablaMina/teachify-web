"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "../dashboard.module.css"; // Reusing dashboard styles for consistency

type Assignment = {
  id: number;
  deadline_at: string | null;
  quiz?: {
    id: number;
    title: string;
    topic: string;
  };
  classroom?: {
    id: number;
    name: string;
    teacher?: {
      fullname: string;
    };
  };
};

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get("/api/assignments");
      setAssignments(response.data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.welcomeSection}>
        <h1 className={styles.welcomeHeading}>My Assignments</h1>
        <p className={styles.welcomeSub}>
          {isLoading ? "Loading your tasks..." : 
           assignments.length === 0 ? "You're all caught up! No active assignments." : 
           `You have ${assignments.length} assignments to complete.`}
        </p>
      </header>

      <div className={styles.assignmentsList} style={{ maxWidth: '800px' }}>
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className={styles.assignmentItem} style={{ opacity: 0.5 }}>
              <div className={styles.assignIcon} style={{ background: '#f1f5f9' }} />
              <div className={styles.assignContent}>
                <div style={{ height: 16, width: '40%', background: '#e2e8f0', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 12, width: '25%', background: '#f1f5f9', borderRadius: 4 }} />
              </div>
            </div>
          ))
        ) : assignments.length > 0 ? (
          assignments.map(task => {
            const isUrgent = task.deadline_at && new Date(task.deadline_at).getTime() - Date.now() < 86400000 * 2;
            return (
              <Link href={`/student/assignments/${task.id}`} key={task.id} className={styles.assignmentItem} style={{ textDecoration: 'none' }}>
                <div className={styles.assignIcon}>📖</div>
                <div className={styles.assignContent}>
                  <h3 className={styles.assignTitle}>{task.quiz?.title || "Quiz"}</h3>
                  <div className={`${styles.assignMeta} ${isUrgent ? styles.urgent : ''}`}>
                    {task.classroom?.name || "Class"} • {task.classroom?.teacher?.fullname || "Instructor"} • Due {task.deadline_at ? new Date(task.deadline_at).toLocaleString() : "Anytime"}
                  </div>
                </div>
                <div className={styles.viewAll} style={{ marginLeft: 'auto' }}>
                  Open Quiz →
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🎉</span>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>No assignments found</h2>
            <p style={{ color: '#64748b' }}>Check back later or join a new class!</p>
          </div>
        )}
      </div>
    </div>
  );
}
