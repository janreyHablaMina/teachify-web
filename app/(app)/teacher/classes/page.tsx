"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "./classes.module.css";

type Classroom = {
  id: number;
  name: string;
  room: string;
  schedule: string;
  join_code: string;
  students_count: number;
  is_active: boolean;
};

export default function TeacherClassesPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", room: "", schedule: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  async function fetchClassrooms() {
    try {
      const response = await api.get("/api/classrooms");
      setClassrooms(response.data);
    } catch (error) {
      console.error("Failed to fetch classrooms:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post("/api/classrooms", newClass);
      setClassrooms((prev) => [response.data.classroom, ...prev]);
      setShowCreateModal(false);
      setNewClass({ name: "", room: "", schedule: "" });
    } catch (error) {
      console.error("Failed to create classroom:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Dashboard / Classes</p>
          <h2>My Classrooms</h2>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowCreateModal(true)}>
          Create New Class
        </button>
      </header>

      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Create New Classroom</h3>
            <form onSubmit={handleCreateClass} className={styles.form}>
              <div className={styles.field}>
                <label>Class Name</label>
                <input
                  type="text"
                  required
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="e.g. 5A - Science"
                />
              </div>
              <div className={styles.field}>
                <label>Room (Optional)</label>
                <input
                  type="text"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  placeholder="e.g. 302"
                />
              </div>
              <div className={styles.field}>
                <label>Schedule (Optional)</label>
                <input
                  type="text"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                  placeholder="e.g. Mon, Wed, Fri"
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className={styles.panel}>
        {loading ? (
          <p>Loading classrooms...</p>
        ) : classrooms.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't created any classrooms yet.</p>
          </div>
        ) : (
          <div className={styles.classGrid}>
            {classrooms.map((cls) => (
              <Link key={cls.id} href={`/teacher/classes/${cls.id}`} className={styles.classLink}>
                <article className={styles.classCard}>
                  <div className={styles.classHead}>
                    <h4>{cls.name}</h4>
                    <span className={cls.is_active ? styles.badgeActive : styles.badgeInactive}>
                      {cls.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className={styles.classMeta}>
                    <div className={styles.metaItem}>
                      <p>Join Code</p>
                      <strong className={styles.highlight}>{cls.join_code}</strong>
                    </div>
                    <div className={styles.metaItem}>
                      <p>Students</p>
                      <strong>{cls.students_count} enrolled</strong>
                    </div>
                    {cls.room && (
                      <div className={styles.metaItem}>
                        <p>Room</p>
                        <strong>Room {cls.room}</strong>
                      </div>
                    )}
                    {cls.schedule && (
                      <div className={styles.metaItem}>
                        <p>Schedule</p>
                        <strong>{cls.schedule}</strong>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
