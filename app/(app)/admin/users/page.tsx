"use client";

import { useMemo, useState } from "react";
import styles from "./users.module.css";

type UserPlan = "Free" | "Basic" | "Pro" | "School";
type UserStatus = "Active" | "Suspended";

type UserRow = {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  quizzesGenerated: number;
  status: UserStatus;
  joinedDate: string;
};

const initialUsers: UserRow[] = [
  { id: "u1", name: "Sarah Johnson", email: "sarah.j@maplegrove.edu", plan: "School", quizzesGenerated: 128, status: "Active", joinedDate: "2025-03-02" },
  { id: "u2", name: "Marcus Lee", email: "marcus.lee@northside.edu", plan: "Pro", quizzesGenerated: 91, status: "Active", joinedDate: "2025-02-25" },
  { id: "u3", name: "Daniel Kim", email: "dkim@lakeshore.edu", plan: "Basic", quizzesGenerated: 17, status: "Active", joinedDate: "2025-02-11" },
  { id: "u4", name: "Nora Patel", email: "nora.p@hillside.edu", plan: "Free", quizzesGenerated: 9, status: "Suspended", joinedDate: "2025-01-14" },
  { id: "u5", name: "Isabelle Cruz", email: "isabelle.cruz@eastbay.edu", plan: "Pro", quizzesGenerated: 74, status: "Active", joinedDate: "2024-12-03" },
  { id: "u6", name: "Carlos Mendez", email: "carlos.m@pinehill.edu", plan: "Basic", quizzesGenerated: 32, status: "Active", joinedDate: "2024-10-19" },
  { id: "u7", name: "Elena Rossi", email: "elena.rossi@milan.edu", plan: "Pro", quizzesGenerated: 56, status: "Active", joinedDate: "2024-09-12" },
  { id: "u8", name: "Kenzo Tanaka", email: "kenzo.t@shibuya.edu", plan: "School", quizzesGenerated: 210, status: "Active", joinedDate: "2024-08-05" },
];

const plans: UserPlan[] = ["Free", "Basic", "Pro", "School"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ name: "", email: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
  }, [search, users]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  function startEdit(user: UserRow) {
    setEditingId(user.id);
    setEditDraft({ name: user.name, email: user.email });
  }

  function saveEdit(userId: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, name: editDraft.name.trim() || user.name, email: editDraft.email.trim() || user.email }
          : user,
      ),
    );
    setEditingId(null);
  }

  function toggleSuspend(userId: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" }
          : user,
      ),
    );
  }

  function deleteUser(userId: string) {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    if (editingId === userId) setEditingId(null);
  }

  return (
    <section className={styles.root}>
      <div className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / User Management</p>
          <h2>Manage Teachers</h2>
        </div>
        <div className={styles.heroActions}>
          <button type="button">Export User List</button>
          <button type="button" className={styles.btnPrimary}>Invite New Teacher</button>
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
            />
          </div>
          <p className={styles.countLabel}>{filteredUsers.length} records</p>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <div>Profile Name</div>
            <div>Email Address</div>
            <div>Access Plan</div>
            <div>Usage</div>
            <div>Status</div>
            <div>Joined</div>
            <div>Operations</div>
          </div>
          {paginatedUsers.map((user, idx) => {
            const isEditing = editingId === user.id;
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

                <div className={`${styles.statusWrap} ${user.status === "Active" ? "" : styles.statusSuspended}`}>
                  <span className={`${styles.statusIndicator} ${user.status === "Active" ? styles.statusIndicatorActive : styles.statusIndicatorSuspended}`} />
                  <span className={styles.statusText}>{user.status}</span>
                </div>

                <div className={styles.joinedDate}>{formatDate(user.joinedDate)}</div>

                <div className={styles.actions}>
                  {isEditing ? (
                    <>
                      <button type="button" className={styles.btnPrimary} onClick={() => saveEdit(user.id)}>
                        Save
                      </button>
                      <button type="button" className={styles.btnGhost} onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className={styles.btnAction} onClick={() => startEdit(user)} title="Edit User">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                  )}
                  <button type="button" className={styles.btnWarn} onClick={() => toggleSuspend(user.id)}>
                    {user.status === "Active" ? "Suspend" : "Activate"}
                  </button>
                  <button type="button" className={styles.btnDanger} onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
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
      </article>
    </section>
  );
}
