"use client";

import { useMemo, useState } from "react";
import styles from "./schools.module.css";

type SchoolPlan = "Basic" | "Pro" | "School";
type SchoolStatus = "Active" | "Disabled";

type Teacher = {
  id: string;
  name: string;
  email: string;
};

type School = {
  id: string;
  name: string;
  students: number;
  quizzesGenerated: number;
  plan: SchoolPlan;
  status: SchoolStatus;
  teachers: Teacher[];
  joinedDate: string;
};

const planOrder: SchoolPlan[] = ["Basic", "Pro", "School"];

const initialSchools: School[] = [
  { id: "s1", name: "Maple Grove High", students: 420, quizzesGenerated: 6320, plan: "School", status: "Active", joinedDate: "2024-10-12", teachers: [{ id: "t1", name: "Sarah Johnson", email: "sarah.j@maplegrove.edu" }, { id: "t2", name: "Ethan Brooks", email: "ethan.b@maplegrove.edu" }] },
  { id: "s2", name: "Northside Academy", students: 310, quizzesGenerated: 4890, plan: "Pro", status: "Active", joinedDate: "2024-11-05", teachers: [{ id: "t3", name: "Marcus Lee", email: "marcus.lee@northside.edu" }, { id: "t4", name: "Rhea Collins", email: "rhea.c@northside.edu" }] },
  { id: "s3", name: "Lakeshore Prep", students: 210, quizzesGenerated: 2742, plan: "Basic", status: "Active", joinedDate: "2024-11-12", teachers: [{ id: "t5", name: "Daniel Kim", email: "dkim@lakeshore.edu" }] },
  { id: "s4", name: "Summit Ridge School", students: 550, quizzesGenerated: 8120, plan: "School", status: "Active", joinedDate: "2024-09-20", teachers: [{ id: "t7", name: "Chris Evans", email: "c.evans@summit.edu" }] },
  { id: "s5", name: "Eastbay Collegiate", students: 180, quizzesGenerated: 1450, plan: "Basic", status: "Disabled", joinedDate: "2024-08-15", teachers: [] },
  { id: "s6", name: "Global Innovators Academy", students: 600, quizzesGenerated: 12400, plan: "School", status: "Active", joinedDate: "2024-07-30", teachers: [{ id: "t8", name: "Yuki Sato", email: "y.sato@global.edu" }] },
];

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredSchools = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(term));
  }, [search, schools]);

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSchools.slice(start, start + itemsPerPage);
  }, [filteredSchools, currentPage]);

  function upgradePlan(id: string) {
    setSchools(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextIdx = Math.min(planOrder.indexOf(s.plan) + 1, planOrder.length - 1);
      return { ...s, plan: planOrder[nextIdx] };
    }));
    setOpenMenuId(null);
  }

  function toggleStatus(id: string) {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Disabled" : "Active" } : s));
    setOpenMenuId(null);
  }

  return (
    <section className={styles.root} onClick={() => setOpenMenuId(null)}>
      <div className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Admin / School Management</p>
          <h2>Manage Institutions</h2>
        </div>
        <div className={styles.heroActions}>
          <button type="button">Platform Status</button>
          <button type="button" className={styles.btnPrimary}>Register School</button>
        </div>
      </div>

      <article className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search schools by name..."
              className={styles.search}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <p className={styles.countLabel}>{filteredSchools.length} records</p>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <div>School Name</div>
            <div>Institutional Size</div>
            <div>Usage</div>
            <div>Plan</div>
            <div>Status</div>
            <div>Joined</div>
            <div style={{ textAlign: "right" }}>Operations</div>
          </div>

          {paginatedSchools.map((school, idx) => {
            const avatars = ["#99f6e4", "#fef08a", "#fda4af", "#e9d5ff"];
            const planColors = { Basic: "#bae6fd", Pro: "#fda4af", School: "#e9d5ff" };
            const isMenuOpen = openMenuId === school.id;

            return (
              <div key={school.id} className={styles.rowSlice} style={{ "--avatar-bg": avatars[idx % 4] } as any}>
                <div className={styles.schoolProfile}>
                  <div className={styles.schoolAvatar}>{school.name.charAt(0)}</div>
                  <div className={styles.cellPrimary}>{school.name}</div>
                </div>

                <div className={styles.statBadge}>
                  <span className={styles.statValue}>{school.students} students</span>
                  <span className={styles.statLabel}>{school.teachers.length} teachers</span>
                </div>

                <div>
                  <span className={styles.statValue}>{school.quizzesGenerated.toLocaleString()}</span> <small>quizzes</small>
                </div>

                <div>
                  <div className={styles.planTag} style={{ "--plan-color": planColors[school.plan] } as any}>
                    {school.plan}
                  </div>
                </div>

                <div className={`${styles.statusWrap} ${school.status === "Active" ? "" : styles.statusDisabled}`}>
                  <span className={`${styles.statusIndicator} ${school.status === "Active" ? styles.statusIndicatorActive : styles.statusIndicatorDisabled}`} />
                  <span className={styles.statusText}>{school.status}</span>
                </div>

                <div className={styles.joinedDate}>{school.joinedDate}</div>

                <div className={styles.actionMenu}>
                  <button
                    type="button"
                    className={styles.moreBtn}
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : school.id); }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                  </button>

                  {isMenuOpen && (
                    <div className={styles.actionDropdown} onClick={(e) => e.stopPropagation()}>
                      <button type="button" className={styles.menuItem}>Manage Teachers</button>
                      <button type="button" className={styles.menuItem} onClick={() => upgradePlan(school.id)}>Upgrade Plan</button>
                      <button type="button" className={styles.menuItem} onClick={() => toggleStatus(school.id)}>{school.status === "Active" ? "Disable" : "Enable"}</button>
                      <button type="button" className={`${styles.menuItem} ${styles.menuItemDanger}`}>Remove School</button>
                    </div>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.pageNum} ${currentPage === n ? styles.pageNumActive : ""}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
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
