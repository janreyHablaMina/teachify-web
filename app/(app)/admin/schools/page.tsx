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
};

const planOrder: SchoolPlan[] = ["Basic", "Pro", "School"];

const initialSchools: School[] = [
  {
    id: "s1",
    name: "Maple Grove High",
    students: 420,
    quizzesGenerated: 6320,
    plan: "School",
    status: "Active",
    teachers: [
      { id: "t1", name: "Sarah Johnson", email: "sarah.j@maplegrove.edu" },
      { id: "t2", name: "Ethan Brooks", email: "ethan.b@maplegrove.edu" },
    ],
  },
  {
    id: "s2",
    name: "Northside Academy",
    students: 310,
    quizzesGenerated: 4890,
    plan: "Pro",
    status: "Active",
    teachers: [
      { id: "t3", name: "Marcus Lee", email: "marcus.lee@northside.edu" },
      { id: "t4", name: "Rhea Collins", email: "rhea.c@northside.edu" },
    ],
  },
  {
    id: "s3",
    name: "Lakeshore Prep",
    students: 210,
    quizzesGenerated: 2742,
    plan: "Basic",
    status: "Active",
    teachers: [
      { id: "t5", name: "Daniel Kim", email: "dkim@lakeshore.edu" },
      { id: "t6", name: "Alyssa Ward", email: "alyssa.w@lakeshore.edu" },
    ],
  },
];

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(initialSchools[0].id);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");

  const selectedSchool = useMemo(
    () => schools.find((school) => school.id === selectedSchoolId) ?? schools[0],
    [schools, selectedSchoolId],
  );

  function updateSchool(schoolId: string, updater: (school: School) => School) {
    setSchools((prev) => prev.map((school) => (school.id === schoolId ? updater(school) : school)));
  }

  function upgradePlan(schoolId: string) {
    updateSchool(schoolId, (school) => {
      const nextIndex = Math.min(planOrder.indexOf(school.plan) + 1, planOrder.length - 1);
      return { ...school, plan: planOrder[nextIndex] };
    });
  }

  function toggleSchoolStatus(schoolId: string) {
    updateSchool(schoolId, (school) => ({
      ...school,
      status: school.status === "Active" ? "Disabled" : "Active",
    }));
  }

  function addTeacher() {
    if (!selectedSchool || !newTeacherName.trim() || !newTeacherEmail.trim()) return;

    updateSchool(selectedSchool.id, (school) => ({
      ...school,
      teachers: [
        ...school.teachers,
        {
          id: `t-${Date.now()}`,
          name: newTeacherName.trim(),
          email: newTeacherEmail.trim(),
        },
      ],
    }));

    setNewTeacherName("");
    setNewTeacherEmail("");
  }

  function removeTeacher(teacherId: string) {
    if (!selectedSchool) return;
    updateSchool(selectedSchool.id, (school) => ({
      ...school,
      teachers: school.teachers.filter((teacher) => teacher.id !== teacherId),
    }));
  }

  return (
    <section className={styles.root}>
      <header className={styles.hero}>
        <p className={styles.kicker}>School management</p>
        <h3>Manage institutional users</h3>
        <p>Track schools, manage teacher access, control plans, and disable accounts when needed.</p>
      </header>

      <article className={styles.panel}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>School Name</th>
                <th>Teachers</th>
                <th>Students</th>
                <th>Quizzes Generated</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id}>
                  <td className={styles.cellPrimary}>{school.name}</td>
                  <td>{school.teachers.length}</td>
                  <td>{school.students}</td>
                  <td>{school.quizzesGenerated.toLocaleString()}</td>
                  <td>{school.plan}</td>
                  <td>
                    <span className={`${styles.status} ${school.status === "Active" ? styles.s_active : styles.s_disabled}`}>
                      {school.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={() => setSelectedSchoolId(school.id)}
                      >
                        View teachers
                      </button>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={() => upgradePlan(school.id)}
                        disabled={school.plan === "School"}
                      >
                        Upgrade plan
                      </button>
                      <button
                        type="button"
                        className={styles.btnWarn}
                        onClick={() => toggleSchoolStatus(school.id)}
                      >
                        {school.status === "Active" ? "Disable school" : "Enable school"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {selectedSchool && (
        <article className={styles.panel}>
          <div className={styles.teacherHead}>
            <h4>{selectedSchool.name} teachers</h4>
            <span>{selectedSchool.teachers.length} teachers</span>
          </div>

          <div className={styles.addTeacherRow}>
            <input
              className={styles.input}
              value={newTeacherName}
              onChange={(event) => setNewTeacherName(event.target.value)}
              placeholder="Teacher name"
            />
            <input
              className={styles.input}
              value={newTeacherEmail}
              onChange={(event) => setNewTeacherEmail(event.target.value)}
              placeholder="Teacher email"
            />
            <button type="button" className={styles.btnPrimary} onClick={addTeacher}>
              Add teacher
            </button>
          </div>

          <ul className={styles.teacherList}>
            {selectedSchool.teachers.map((teacher) => (
              <li key={teacher.id}>
                <div>
                  <p>{teacher.name}</p>
                  <small>{teacher.email}</small>
                </div>
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => removeTeacher(teacher.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
