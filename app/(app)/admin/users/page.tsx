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

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
  }, [search, users]);

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

  function resetPassword(userId: string) {
    const user = users.find((entry) => entry.id === userId);
    if (!user) return;
    window.alert(`Password reset link sent to ${user.email}`);
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className={styles.search}
              aria-label="Search users"
            />
          </div>
          <p className={styles.countLabel}>{filteredUsers.length} active records</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Profile Name</th>
                <th>Email Address</th>
                <th>Access Plan</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isEditing = editingId === user.id;
                return (
                  <tr key={user.id}>
                    <td>
                      {isEditing ? (
                        <input
                          className={styles.editInput}
                          value={editDraft.name}
                          onChange={(event) => setEditDraft((prev) => ({ ...prev, name: event.target.value }))}
                          aria-label={`Edit name for ${user.name}`}
                        />
                      ) : (
                        <div className={styles.cellPrimary}>{user.name}</div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          className={styles.editInput}
                          value={editDraft.email}
                          onChange={(event) => setEditDraft((prev) => ({ ...prev, email: event.target.value }))}
                          aria-label={`Edit email for ${user.name}`}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      <select
                        className={styles.planSelect}
                        value={user.plan}
                        onChange={(event) =>
                          setUsers((prev) =>
                            prev.map((entry) =>
                              entry.id === user.id ? { ...entry, plan: event.target.value as UserPlan } : entry,
                            ),
                          )
                        }
                        aria-label={`Change plan for ${user.name}`}
                      >
                        {plans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <strong>{user.quizzesGenerated}</strong> <small>quizzes</small>
                    </td>
                    <td>
                      <span className={`${styles.status} ${user.status === "Active" ? styles.s_active : styles.s_suspended}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{formatDate(user.joinedDate)}</td>
                    <td>
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
