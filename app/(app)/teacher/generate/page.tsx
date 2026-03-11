"use client";

import { useState } from "react";
import styles from "./generate.module.css";

const templates = [
  { name: "Final Exam", desc: "Balanced comprehensive test" },
  { name: "Quick Pop Quiz", desc: "Short, targeted assessment" },
  { name: "Midterm Review", desc: "Focus on semester core" },
] as const;

const recentGenerations = [
  { name: "Photosynthesis V2", date: "2h ago", count: 20 },
  { name: "Civil War Basics", date: "Yesterday", count: 50 },
] as const;

export default function TeacherGeneratePage() {
  const [counts, setCounts] = useState({
    multipleChoice: 20,
    trueFalse: 10,
    enumeration: 10,
    identification: 10,
  });

  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0);

  const handleCountChange = (key: keyof typeof counts, value: string) => {
    const num = parseInt(value) || 0;
    setCounts((prev) => ({ ...prev, [key]: num }));
  };

  return (
    <section className={styles.root}>
      <header className={styles.missionHeader}>
        <div className={styles.missionTitle}>
          <p className={styles.missionBreadcrumb}>Dashboard / Generator</p>
          <h2>Create AI Quiz</h2>
        </div>
      </header>

      <section className={styles.layoutGrid}>
        {/* Main Configuration Panel */}
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

            <div className={styles.distributionSection}>
              <div className={styles.sectionTitle}>Question Type Distribution</div>

              <div className={styles.distributionGrid}>
                <div className={styles.distField}>
                  <label>Multiple Choice</label>
                  <input
                    type="number"
                    value={counts.multipleChoice}
                    onChange={(e) => handleCountChange("multipleChoice", e.target.value)}
                  />
                </div>
                <div className={styles.distField}>
                  <label>True or False</label>
                  <input
                    type="number"
                    value={counts.trueFalse}
                    onChange={(e) => handleCountChange("trueFalse", e.target.value)}
                  />
                </div>
                <div className={styles.distField}>
                  <label>Enumeration</label>
                  <input
                    type="number"
                    value={counts.enumeration}
                    onChange={(e) => handleCountChange("enumeration", e.target.value)}
                  />
                </div>
                <div className={styles.distField}>
                  <label>Identification</label>
                  <input
                    type="number"
                    value={counts.identification}
                    onChange={(e) => handleCountChange("identification", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.totalBanner}>
                <span>Total Questions Planned:</span>
                <strong>{totalQuestions} Items</strong>
              </div>
            </div>

            <div className={styles.field}>
              <label>Additional Instructions (Optional)</label>
              <textarea placeholder="Focus on specific topics, include explanations, etc." />
            </div>

            <button className={styles.btnGenerate}>
              Generate {totalQuestions} Questions
            </button>
          </div>
        </article>

        {/* Pro Sidebar */}
        <aside className={styles.sidebar}>
          <article className={styles.sidePanel}>
            <h4>⚡ Quick Templates</h4>
            <div className={styles.templateGrid}>
              {templates.map(t => (
                <button key={t.name} className={styles.templateCard}>
                  <strong>{t.name}</strong>
                  <span>{t.desc}</span>
                </button>
              ))}
            </div>
          </article>

          <article className={styles.sidePanel}>
            <h4>📜 Recent Drafts</h4>
            <div className={styles.historyList}>
              {recentGenerations.map(g => (
                <div key={g.name} className={styles.historyItem}>
                  <div className={styles.historyIcon}>🧠</div>
                  <div className={styles.historyInfo}>
                    <strong>{g.name}</strong>
                    <span>{g.count} questions • {g.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className={styles.hint}>
            <strong>Pro Tip:</strong>
            <p className="mt-2 text-xs leading-relaxed">Specific subjects help the AI generate more accurate and challenging assessment items.</p>
          </div>
        </aside>
      </section>
    </section>
  );
}
