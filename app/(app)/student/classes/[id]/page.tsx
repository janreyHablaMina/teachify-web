"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "../../dashboard.module.css";

type ClassroomDetail = {
  id: number;
  name: string;
  room: string;
  schedule: string;
  teacher: {
    fullname: string;
  };
  assignments: {
    id: number;
    deadline_at: string | null;
    quiz: {
      title: string;
      topic: string;
    };
  }[];
};

export default function StudentClassDetailPage() {
  const params = useParams();
  const classId = params.id;

  const [classroom, setClassroom] = useState<ClassroomDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const response = await api.get(`/api/classrooms/${classId}`);
      setClassroom(response.data);
    } catch (error) {
      console.error("Failed to fetch class details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading classroom...</div>;
  if (!classroom) return <div className={styles.container}>Classroom not found.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.welcomeSection}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
          <Link href="/student/classes" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 700, fontSize: '14px' }}>← Back to Classes</Link>
        </div>
        <h1 className={styles.welcomeHeading}>{classroom.name}</h1>
        <p className={styles.welcomeSub}>Instructor: {classroom.teacher.fullname} • {classroom.room || 'General Room'} • {classroom.schedule || 'No set schedule'}</p>
      </header>

      <div className={styles.dashGrid}>
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Assignments</h2>
          </div>
          
          <div className={styles.assignmentsList}>
            {classroom.assignments.length === 0 ? (
              <div className={styles.statCard} style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#64748b' }}>No assignments yet for this class. Enjoy your free time!</p>
              </div>
            ) : (
              classroom.assignments.map(task => {
                const isUrgent = task.deadline_at && new Date(task.deadline_at).getTime() - Date.now() < 86400000 * 2;
                return (
                  <Link href={`/student/assignments/${task.id}`} key={task.id} className={styles.assignmentItem} style={{ textDecoration: 'none' }}>
                    <div className={styles.assignIcon}>📖</div>
                    <div className={styles.assignContent}>
                      <h3 className={styles.assignTitle}>{task.quiz?.title || "Quiz"}</h3>
                      <div className={`${styles.assignMeta} ${isUrgent ? styles.urgent : ''}`}>
                         Due {task.deadline_at ? new Date(task.deadline_at).toLocaleString() : "Anytime"}
                      </div>
                    </div>
                    <span className={styles.viewAll}>Take Quiz →</span>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <aside>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Resources</h2>
          </div>
          <div className={styles.statCard}>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Class resources and shared materials from your teacher will appear here.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
