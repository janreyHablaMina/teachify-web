"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import styles from "./users.module.css";

type UserPlan = "Free" | "Basic" | "Pro" | "School";

type UserRow = {
  id: number;
  name: string;
  email: string;
  plan: UserPlan;
  quizzesGenerated: number;
  status: "Active";
  joinedDate: string;
};

type ApiUser = {
  id: number;
  fullname: string;
  email: string;
  plan?: string;
  quizzes_count?: number;
  created_at: string;
};

function toPlanLabel(plan?: string): UserPlan {
  const p = (plan ?? "free").toLowerCase();
  if (p === "basic") return "Basic";
  if (p === "pro") return "Pro";
  if (p === "school") return "School";
  return "Free";
}

function mapApiUser(user: ApiUser): UserRow {
  return {
    id: user.id,
    name: user.fullname,
    email: user.email,
    plan: toPlanLabel(user.plan),
    quizzesGenerated: user.quizzes_count ?? 0,
    status: "Active",
    joinedDate: user.created_at,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({ name: "", email: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const itemsPerPage = 5;

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/users");
      setUsers((response.data as ApiUser[]).map(mapApiUser));
    } catch (error: any) {
      setStatusMessage(error?.response?.data?.error || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
  }, [search, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  function startEdit(user: UserRow) {
    setEditingId(user.id);
    setEditDraft({ name: user.name, email: user.email });
    setOpenMenuId(null);
  }

  async function saveEdit(userId: number) {
    try {
      await api.put(`/api/admin/users/${userId}`, {
        fullname: editDraft.name.trim(),
        email: editDraft.email.trim(),
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, name: editDraft.name.trim() || user.name, email: editDraft.email.trim() || user.email }
            : user,
        ),
      );
      setEditingId(null);
      setStatusMessage("User updated successfully.");
    } catch (error: any) {
      setStatusMessage(error?.response?.data?.message || "Failed to update user.");
    }
  }

  async function deleteUser(userId: number) {
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (editingId === userId) setEditingId(null);
      setOpenMenuId(null);
      setStatusMessage("User removed successfully.");
    } catch (error: any) {
      setStatusMessage(error?.response?.data?.error || "Failed to remove user.");
    }
  }

  return (
    <section className={styles.root} onClick={() => setOpenMenuId(null)}>
      <div className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / User Management</p>
          <h2>Manage Teachers</h2>
        </div>
        <div className={styles.heroActions}>
          <button type="button" onClick={loadUsers}>Refresh List</button>
        </div>
      </div>

      <article className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name or email..."
              className={styles.search}
              aria-label="Search users"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <p className={styles.countLabel}>{filteredUsers.length} records</p>
        </div>

        {statusMessage ? <p style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>{statusMessage}</p> : null}
        {loading ? (
          <p style={{ margin: 0 }}>Loading users...</p>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <div className={styles.tableHeader}>
                <div>Profile Name</div>
                <div>Email Address</div>
                <div>Access Plan</div>
                <div>Usage</div>
                <div>Status</div>
                <div>Joined</div>
                <div style={{ textAlign: "right" }}>Operations</div>
              </div>
              {paginatedUsers.map((user, idx) => {
                const isEditing = editingId === user.id;
                const isMenuOpen = openMenuId === user.id;
                const avatars = ["#99f6e4", "#fef08a", "#fda4af", "#e9d5ff"];
                const planColors = { Free: "#94a3b8", Basic: "#99f6e4", Pro: "#fda4af", School: "#e9d5ff" };

                return (
                  <div key={user.id} className={styles.rowSlice} style={{ "--avatar-bg": avatars[idx % 4] } as any}>
                    <div className={styles.userProfile}>
                      <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
                      {isEditing ? (
                        <input
                          className={styles.editInput}
                          value={editDraft.name}
                          onChange={(event) => setEditDraft((prev) => ({ ...prev, name: event.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className={styles.cellPrimary}>{user.name}</div>
                      )}
                    </div>

                    <div className={styles.emailText}>
                      {isEditing ? (
                        <input
                          className={styles.editInput}
                          value={editDraft.email}
                          onChange={(event) => setEditDraft((prev) => ({ ...prev, email: event.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        user.email
                      )}
                    </div>

                    <div>
                      <div className={styles.planTag} style={{ "--plan-color": planColors[user.plan] } as any}>
                        {user.plan}
                      </div>
                    </div>

                    <div>
                      <span className={styles.usageText}>{user.quizzesGenerated}</span>
                      <div className={styles.usageTrack}>
                        <div className={styles.usageFill} style={{ width: `${Math.min((user.quizzesGenerated / 200) * 100, 100)}%` }} />
                      </div>
                    </div>

                    <div className={styles.statusWrap}>
                      <span className={`${styles.statusIndicator} ${styles.statusIndicatorActive}`} />
                      <span className={styles.statusText}>{user.status}</span>
                    </div>

                    <div className={styles.joinedDate}>{formatDate(user.joinedDate)}</div>

                    <div className={styles.actionMenu}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button type="button" className={styles.btnPrimary} onClick={(e) => { e.stopPropagation(); saveEdit(user.id); }}>
                            Save
                          </button>
                          <button type="button" className={styles.btnGhost} onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.moreBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : user.id);
                            }}
                            title="More actions"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                          </button>

                          {isMenuOpen && (
                            <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                              <button type="button" className={styles.menuItem} onClick={() => startEdit(user)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                Edit Details
                              </button>
                              <button type="button" className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => deleteUser(user.id)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                Remove Teacher
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.pagination}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={styles.pageBtn}
              >
                &larr; Prev
              </button>
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`${styles.pageNum} ${currentPage === pageNum ? styles.pageNumActive : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={styles.pageBtn}
              >
                Next &rarr;
              </button>
            </div>
          </>
        )}
      </article>
    </section>
  );
}
