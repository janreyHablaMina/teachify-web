"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "./classroom-detail.module.css";
import DateTimePicker from "./DateTimePicker";

type Student = {
  id: number;
  fullname: string;
  email: string;
};

type Assignment = {
  id: number;
  deadline: string;
  quiz: {
    id: number;
    title: string;
  };
};

type Classroom = {
  id: number;
  name: string;
  room: string;
  schedule: string;
  join_code: string;
  is_active: boolean;
  students: Student[];
  assignments: Assignment[];
};

export default function ClassroomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"students" | "assignments" | "analytics">("students");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiration, setExpiration] = useState("null");

  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register/student`
    : '';

  useEffect(() => {
    fetchClassroom();
  }, [id]);

  async function fetchClassroom() {
    try {
      const response = await api.get(`/api/classrooms/${id}`);
      setClassroom(response.data);
      if (response.data.invite_expires_at) {
        // Convert to local datetime-local format (YYYY-MM-DDTHH:mm)
        const date = new Date(response.data.invite_expires_at);
        const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setExpiration(localISO);
      } else {
        setExpiration("null");
      }
    } catch (error) {
      console.error("Failed to fetch classroom:", error);
    } finally {
      setLoading(false);
    }
  }

  const [expirationType, setExpirationType] = useState<"none" | "preset" | "custom">("none");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleSetExpiration = async (value: string, type: "none" | "preset" | "custom" = "custom") => {
    setExpirationType(type);
    let expiresAt: string | null = null;

    if (type === "preset") {
      setActivePreset(value);
      const date = new Date();
      if (value === "1h") date.setHours(date.getHours() + 1);
      else if (value === "6h") date.setHours(date.getHours() + 6);
      else if (value === "24h") date.setHours(date.getHours() + 24);
      else if (value === "7d") date.setDate(date.getDate() + 7);
      expiresAt = date.toISOString();
      setExpiration(expiresAt.slice(0, 16));
    } else if (type === "custom") {
      setActivePreset(null);
      setExpiration(value);
      expiresAt = value ? new Date(value).toISOString() : null;
    } else {
      setActivePreset(null);
      setExpiration("null");
      expiresAt = null;
    }

    try {
      await api.patch(`/api/classrooms/${id}/invite-expiration`, { expires_at: expiresAt });
      // Local state is enough for immediate feedback, fetch for sync if needed
    } catch (err) {
      console.error("Failed to set expiration:", err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className={styles.loading}>Loading classroom details...</div>;
  if (!classroom) return <div className={styles.error}>Classroom not found.</div>;

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <p className={styles.breadcrumb}>
            <Link href="/teacher/classes">Classes</Link> / {classroom.name}
          </p>
          <h2>{classroom.name}</h2>
          <div className={styles.headerMeta}>
            <span className={styles.badge}>Join Code: <strong>{classroom.join_code}</strong></span>
            {classroom.room && <span className={styles.metaText}>Room {classroom.room}</span>}
            {classroom.schedule && <span className={styles.metaText}>{classroom.schedule}</span>}
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary} onClick={() => setShowInviteModal(true)}>Invite Students</button>
          <button className={styles.btnSecondary}>Assign Quiz</button>
          <button className={styles.btnPrimary}>Class Settings</button>
        </div>
      </header>

      {showInviteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Invite Students</h3>
              <button className={styles.btnClose} onClick={() => setShowInviteModal(false)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <p>Share this registration link with your students. They will need the <strong>Join Code</strong> to enroll.</p>

              <div className={styles.expirationGroup}>
                <label className={styles.groupLabel}>Invite Expiration</label>
                <div className={styles.presetTiles}>
                  <button 
                    className={`${styles.tile} ${expirationType === 'none' ? styles.tileActive : ''}`}
                    onClick={() => handleSetExpiration("", "none")}
                  >
                    <span className={styles.tileIcon}>&infin;</span>
                    <span className={styles.tileText}>Never</span>
                  </button>
                  <button 
                    className={`${styles.tile} ${activePreset === '1h' ? styles.tileActive : ''}`}
                    onClick={() => handleSetExpiration("1h", "preset")}
                  >
                    <span className={styles.tileIcon}>1h</span>
                    <span className={styles.tileText}>1 Hour</span>
                  </button>
                  <button 
                    className={`${styles.tile} ${activePreset === '24h' ? styles.tileActive : ''}`}
                    onClick={() => handleSetExpiration("24h", "preset")}
                  >
                    <span className={styles.tileIcon}>1d</span>
                    <span className={styles.tileText}>1 Day</span>
                  </button>
                  <button 
                    className={`${styles.tile} ${activePreset === '7d' ? styles.tileActive : ''}`}
                    onClick={() => handleSetExpiration("7d", "preset")}
                  >
                    <span className={styles.tileIcon}>1w</span>
                    <span className={styles.tileText}>1 Week</span>
                  </button>
                  <button 
                    className={`${styles.tile} ${expirationType === 'custom' ? styles.tileActive : ''}`}
                    onClick={() => setExpirationType("custom")}
                  >
                    <span className={styles.tileIcon}>📅</span>
                    <span className={styles.tileText}>Custom</span>
                  </button>
                </div>

                {expirationType === "custom" && (
                  <DateTimePicker 
                    value={expiration !== "null" ? expiration : ""} 
                    onChange={(val: string) => handleSetExpiration(val, "custom")}
                    onClose={() => setExpirationType("preset")} // Or keep custom but close modal logic
                  />
                )}
                
                <p className={styles.expirationHint}>
                  {expirationType === 'none' 
                    ? "Link will remain active indefinitely." 
                    : `Expires on: ${expiration !== 'null' ? new Date(expiration).toLocaleString() : 'Not set'}`}
                </p>
              </div>

              <div className={styles.inviteLinkGroup}>
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className={styles.inviteInput}
                />
                <button
                  className={styles.btnCopy}
                  onClick={copyToClipboard}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <div className={styles.joinCodeNotice}>
                <span>Join Code:</span>
                <strong>{classroom.join_code}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'students' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students ({classroom.students.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'assignments' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments ({classroom.assignments.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'analytics' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>

        <section className={styles.tabPanel}>
          {activeTab === 'students' && (
            <div className={styles.list}>
              {classroom.students.length === 0 ? (
                <div className={styles.empty}>No students enrolled yet.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Performance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classroom.students.map(student => (
                      <tr key={student.id}>
                        <td><strong>{student.fullname}</strong></td>
                        <td>{student.email}</td>
                        <td><span className={styles.performanceGood}>85%</span></td>
                        <td><button className={styles.btnText}>View Profile</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className={styles.list}>
              {classroom.assignments.length === 0 ? (
                <div className={styles.empty}>No assignments created yet.</div>
              ) : (
                <div className={styles.assignmentGrid}>
                  {classroom.assignments.map(assignment => (
                    <article key={assignment.id} className={styles.itemCard}>
                      <h4>{assignment.quiz.title}</h4>
                      <p>Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p>
                      <div className={styles.itemFooter}>
                        <span>12/32 Submitted</span>
                        <button className={styles.btnSmall}>View Results</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className={styles.placeholderAnalytics}>
              <h3>Class Analytics</h3>
              <p>Detailed performance metrics and anti-cheat reports will appear here as students complete assignments.</p>
              <div className={styles.chartPlaceholder}></div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
