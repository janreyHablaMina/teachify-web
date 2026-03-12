"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { getUser } from "@/lib/auth";
import { normalizePlanTier, PLAN_CATALOG, type PlanTier } from "@/lib/plans";
import styles from "./generate.module.css";

type Mode = "chat" | "file";
type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "essay" | "enumeration";

type TeacherPlanUser = {
  plan?: string;
  plan_tier?: string;
  max_questions_per_quiz?: number;
};

const questionTypeLabel: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  true_false: "True / False",
  short_answer: "Short Answer",
  essay: "Essay",
  enumeration: "Enumeration",
};

const advancedTypes: QuestionType[] = ["true_false", "short_answer", "essay", "enumeration"];

function exportTextToPdf(title: string, content: string) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; line-height: 1.6; color: #0f172a; }
          h1 { margin: 0 0 12px; }
          pre { white-space: pre-wrap; font-family: inherit; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export default function TeacherGeneratePage() {
  const [mode, setMode] = useState<Mode>("chat");
  const [planTier, setPlanTier] = useState<PlanTier>("trial");

  const [summaryPrompt, setSummaryPrompt] = useState("Generate me a summary of Jose Rizal life.");
  const [summaryResult, setSummaryResult] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(["multiple_choice"]);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    getUser()
      .then((user: TeacherPlanUser | null) => {
        if (!isMounted || !user) return;
        const tier = normalizePlanTier(user.plan_tier ?? user.plan);
        setPlanTier(tier);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const planMeta = PLAN_CATALOG[planTier];
  const maxQuestionLimit = useMemo(() => {
    if (planTier === "trial") return 10;
    return 50;
  }, [planTier]);

  const isTrial = planTier === "trial";

  function handleFilePick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  function toggleType(type: QuestionType) {
    if (isTrial && type !== "multiple_choice") return;

    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        const next = prev.filter((x) => x !== type);
        return next.length > 0 ? next : ["multiple_choice"];
      }

      return [...prev, type];
    });
  }

  async function handleGenerateSummary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    setSummaryLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const output = `Summary Request: ${summaryPrompt}\n\nJose Rizal was a Filipino nationalist, doctor, writer, and reformist. He used his novels and essays to expose social injustice under colonial rule. His works, especially Noli Me Tangere and El Filibusterismo, inspired national consciousness and reform movements. Rizal promoted peaceful reform through education and civic engagement. He was executed on December 30, 1896, and became one of the central heroes of the Philippines independence narrative.`;

    setSummaryResult(output);
    setSummaryLoading(false);
    setStatusMessage("Summary generated. You can export it as PDF.");
  }

  async function handleGenerateQuestions(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    if (!selectedFile) {
      setStatusMessage("Please upload a lesson file first.");
      return;
    }

    const safeCount = Math.max(1, Math.min(questionCount, maxQuestionLimit));
    if (safeCount !== questionCount) {
      setQuestionCount(safeCount);
    }

    setGenerationLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const fileTopic = selectedFile.name.replace(/\.[^/.]+$/, "");
    const primaryType = selectedTypes[0] ?? "multiple_choice";

    const questions = Array.from({ length: Math.min(safeCount, 8) }, (_, i) => {
      const idx = i + 1;
      return `${idx}. (${questionTypeLabel[primaryType]}) Based on \"${fileTopic}\", write question ${idx}.`;
    });

    setGeneratedQuestions(questions);
    setGenerationLoading(false);
    setStatusMessage(`Generated ${safeCount} questions request (${selectedTypes.map((t) => questionTypeLabel[t]).join(", ")}).`);
  }

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>Dashboard / Generator</p>
          <h2>AI Generator Workspace</h2>
          <p className={styles.subtitle}>
            {planMeta.label} ({planMeta.priceLabel}) - Max {maxQuestionLimit} questions per quiz in this plan.
          </p>
        </div>
      </header>

      <section className={styles.planNotice}>
        <p>
          Plan: <strong>{planTier.toUpperCase()}</strong> | Quiz limit: <strong>{planMeta.quizLimitLabel}</strong>
        </p>
        <p>
          {isTrial
            ? "Trial plan supports up to 10 questions and multiple choice only."
            : "You can generate up to 50 questions and mix advanced question types."}
        </p>
      </section>

      <section className={styles.modeTabs}>
        <button
          type="button"
          className={`${styles.modeTab} ${mode === "chat" ? styles.modeTabActive : ""}`}
          onClick={() => setMode("chat")}
        >
          Chat AI Summary
        </button>
        <button
          type="button"
          className={`${styles.modeTab} ${mode === "file" ? styles.modeTabActive : ""}`}
          onClick={() => setMode("file")}
        >
          Upload File to Generate Questions
        </button>
      </section>

      {mode === "chat" ? (
        <article className={styles.panel}>
          <h3>Ask AI for Summary</h3>
          <form className={styles.form} onSubmit={handleGenerateSummary}>
            <label htmlFor="summaryPrompt">Prompt</label>
            <textarea
              id="summaryPrompt"
              value={summaryPrompt}
              onChange={(e) => setSummaryPrompt(e.target.value)}
              placeholder="Generate me a summary of Jose Rizal life"
              required
            />
            <button type="submit" className={styles.primaryBtn} disabled={summaryLoading}>
              {summaryLoading ? "Generating..." : "Generate Summary"}
            </button>
          </form>

          {summaryResult ? (
            <div className={styles.resultCard}>
              <h4>Generated Summary</h4>
              <p>{summaryResult}</p>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => exportTextToPdf("AI Summary", summaryResult)}
              >
                Export as PDF
              </button>
            </div>
          ) : null}
        </article>
      ) : (
        <article className={styles.panel}>
          <h3>Generate Questions from File</h3>
          <form className={styles.form} onSubmit={handleGenerateQuestions}>
            <label htmlFor="lessonFile">Upload lesson file (PDF, DOCX, PPTX)</label>
            <input id="lessonFile" type="file" accept=".pdf,.docx,.pptx" onChange={handleFilePick} />
            {selectedFile ? <p className={styles.fileName}>Selected: {selectedFile.name}</p> : null}

            <label htmlFor="questionCount">How many questions? (up to {maxQuestionLimit})</label>
            <input
              id="questionCount"
              type="number"
              min={1}
              max={maxQuestionLimit}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value) || 1)}
            />
            <p className={styles.helperText}>Your plan allows up to {maxQuestionLimit} questions per quiz.</p>

            <div className={styles.typeGrid}>
              {(Object.keys(questionTypeLabel) as QuestionType[]).map((type) => {
                const locked = isTrial && advancedTypes.includes(type);
                const checked = selectedTypes.includes(type);

                return (
                  <label key={type} className={`${styles.typeItem} ${locked ? styles.typeLocked : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleType(type)}
                      disabled={locked}
                    />
                    <span className={styles.typeLabel}>
                      {questionTypeLabel[type]}
                      {locked ? <em className={styles.lockBadge}>🔒 Pro+</em> : null}
                    </span>
                  </label>
                );
              })}
            </div>

            <button type="submit" className={styles.primaryBtn} disabled={generationLoading}>
              {generationLoading ? "Generating..." : "Generate Q & A"}
            </button>
          </form>

          {generatedQuestions.length > 0 ? (
            <div className={styles.resultCard}>
              <h4>Generated Q & A Preview</h4>
              <ul>
                {generatedQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      )}

      {statusMessage ? <p className={styles.status}>{statusMessage}</p> : null}
    </section>
  );
}
