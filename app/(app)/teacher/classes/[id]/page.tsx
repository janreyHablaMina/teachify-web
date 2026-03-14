"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "./classroom-detail.module.css";
import DateTimePicker from "./DateTimePicker";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

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
  const router = useRouter();
  const { showToast } = useToast();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"students" | "assignments" | "analytics">("students");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", room: "", schedule: "", is_active: true });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiration, setExpiration] = useState("null");

  const inviteLink = typeof window !== 'undefined' && classroom
    ? `${window.location.origin}/register/student?code=${classroom.join_code}`
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

  const openSettings = () => {
    if (classroom) {
      setEditForm({ 
        name: classroom.name, 
        room: classroom.room || "", 
        schedule: classroom.schedule || "",
        is_active: classroom.is_active
      });
      setShowSettingsModal(true);
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.put(`/api/classrooms/${id}`, editForm);
      setClassroom(prev => prev ? { ...prev, ...response.data.classroom } : null);
      setShowSettingsModal(false);
      showToast("Classroom updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update classroom:", error);
      showToast("Failed to update classroom. Please try again.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClass = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/classrooms/${id}`);
      router.push("/teacher/classes");
    } catch (error) {
      console.error("Failed to delete classroom:", error);
      showToast("Failed to delete classroom. Please try again.", "error");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

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
          <button className={styles.btnPrimary} onClick={openSettings}>Class Settings</button>
        </div>
      </header>

      {showSettingsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Class Settings</h3>
              <button type="button" className={styles.btnClose} onClick={() => setShowSettingsModal(false)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <form onSubmit={handleUpdateClass} className={styles.form}>
                <div className={styles.field}>
                  <label>Class Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>Room (Optional)</label>
                  <input
                    type="text"
                    value={editForm.room}
                    onChange={(e) => setEditForm(prev => ({ ...prev, room: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>Schedule (Optional)</label>
                  <input
                    type="text"
                    value={editForm.schedule}
                    onChange={(e) => setEditForm(prev => ({ ...prev, schedule: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>Class Status</label>
                  <select
                    value={editForm.is_active ? "active" : "inactive"}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.value === "active" }))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnDanger} onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete Class"}
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={() => setShowSettingsModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.confirmModal}>
            <p className={styles.confirmTag}>Critical Action</p>
            <h3 className={styles.confirmTitle}>Delete Classroom?</h3>
            <p className={styles.confirmText}>Once deleted, all assignments, grades, and student progress in this classroom will be permanently lost.</p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmCancelBtn}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmSignoutBtn}
                onClick={handleDeleteClass}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, delete class"}
              </button>
            </div>
          </div>
        </div>
      )}

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
