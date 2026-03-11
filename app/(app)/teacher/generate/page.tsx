"use client";

import styles from "./generate.module.css";

export default function TeacherGeneratePage() {
  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Dashboard / Generator</p>
          <h2>Create AI Quiz</h2>
        </div>
      </header>

      <article className={styles.panel}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Quiz Subject</label>
            <input type="text" placeholder="e.g. Cellular Biology, Civil War History..." />
          </div>

          <div className={styles.field}>
            <label>Target Grade Level</label>
            <select>
              <option>Elementary (Grades 1-5)</option>
              <option>Middle School (Grades 6-8)</option>
              <option>High School (Grades 9-12)</option>
              <option>University / Higher Ed</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Number of Questions</label>
            <input type="number" defaultValue={10} min={5} max={50} />
          </div>

          <div className={styles.field}>
            <label>Additional Instructions (Optional)</label>
            <textarea placeholder="Focus on specific topics, include multiple choice only, etc." />
          </div>

          <div className={styles.hint}>
            💡 Our AI will analyze your requirements and generate a balanced quiz with correct answers and explanations.
          </div>

          <button className={styles.btnGenerate}>
            Generate Quiz Content
          </button>
        </div>
      </article>
    </section>
  );
}
