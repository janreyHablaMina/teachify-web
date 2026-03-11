"use client";

import styles from "./quizzes.module.css";

const quizzes = [
  { title: "Introduction to Photosynthesis", subject: "Science", questions: 20, submissions: 28, status: "Live" },
  { title: "World War II - Overview", subject: "History", questions: 15, submissions: 30, status: "Live" },
  { title: "Basic Geometry Principles", subject: "Mathematics", questions: 25, submissions: 12, status: "Draft" },
  { title: "English Literature - Macbeth", subject: "English", questions: 30, submissions: 0, status: "Scheduled" },
] as const;

export default function TeacherQuizzesPage() {
  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Dashboard / Quizzes</p>
          <h2>My Learning Content</h2>
        </div>
        <button className={styles.btnPrimary}>Create New Quiz</button>
      </header>

      <section className={styles.panel}>
        <div className={styles.tableHeader}>
          <div>Quiz Title</div>
          <div>Subject</div>
          <div>Questions</div>
          <div>Submissions</div>
          <div>Action</div>
        </div>

        <div className={styles.quizList}>
          {quizzes.map((quiz) => (
            <article
              key={quiz.title}
              className={styles.quizSlice}
              style={{ "--accent-color": quiz.status === "Live" ? "var(--hl-teal)" : quiz.status === "Draft" ? "var(--hl-yellow)" : "var(--hl-pink)" } as any}
            >
              <div className={styles.quizTitle}>{quiz.title}</div>
              <div className={styles.quizInfo}>{quiz.subject}</div>
              <div className={styles.quizInfo}>{quiz.questions} Items</div>
              <div>
                <span className={`${styles.statusTag} ${quiz.status === "Live" ? styles.statusLive : ""}`}>
                  {quiz.status}
                </span>
              </div>
              <button className={styles.btnAction}>Configure</button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
