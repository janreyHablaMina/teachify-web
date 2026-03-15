"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { normalizePlanTier, PLAN_CATALOG, type PlanTier } from "@/lib/plans";
import styles from "./generate.module.css";

type Mode = "chat" | "file";
type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "essay" | "enumeration";

type TeacherPlanUser = {
  plan?: string;
  plan_tier?: string;
  quiz_generation_limit?: number;
  quizzes_used?: number;
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
const summaryExamples = ["Photosynthesis", "World War 2", "Algebra Equations", "Human Digestive System"];

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
  const [generationLoading, setGenerationLoading] = useState(false);

  const [summaryPrompt, setSummaryPrompt] = useState("Generate me a summary of Jose Rizal life.");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Teachify AI is reading your file...",
    "Analyzing lesson content...",
    "Identifying key concepts...",
    "Structuring question sets...",
    "Vetting accuracy with AI...",
    "Almost there, finalizing your quiz...",
    "Polishing the answers...",
    "Wrapping things up..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generationLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [generationLoading]);

  const [summaryResult, setSummaryResult] = useState<Record<string, string> | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(["multiple_choice"]);
  const [typeCounts, setTypeCounts] = useState<Record<QuestionType, number>>({
    multiple_choice: 10,
    true_false: 0,
    short_answer: 0,
    essay: 0,
    enumeration: 0,
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [lastGeneratedQuizId, setLastGeneratedQuizId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [generationLimit, setGenerationLimit] = useState<number>(3);
  const [generationsUsed, setGenerationsUsed] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUsage() {
      try {
        const [user, quizzesRes] = await Promise.all([getUser(), api.get("/api/quizzes")]);
        if (!isMounted || !user) return;
        const typedUser = user as TeacherPlanUser;
        const tier = normalizePlanTier(typedUser.plan_tier ?? typedUser.plan);
        setPlanTier(tier);
        setGenerationLimit(typedUser.quiz_generation_limit ?? 3);
        const allQuizzes = Array.isArray(quizzesRes.data) ? quizzesRes.data : [];
        const usedCount =
          tier === "basic" || tier === "pro" || tier === "school"
            ? allQuizzes.filter((q: any) => {
                const d = new Date(q.created_at);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length
            : allQuizzes.length;
        setGenerationsUsed(usedCount);
      } catch {
      }
    }

    loadUsage();

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
  const generationsRemaining = useMemo(() => Math.max(0, generationLimit - generationsUsed), [generationLimit, generationsUsed]);
  const limitReached = generationsRemaining <= 0;
  const generationProgress = useMemo(() => {
    if (generationLimit <= 0) return 0;
    return Math.min(100, Math.round((generationsUsed / generationLimit) * 100));
  }, [generationLimit, generationsUsed]);

  function handleFilePick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  function toggleType(type: QuestionType) {
    if (planTier === "trial" && type !== "multiple_choice") return;

    setSelectedTypes((prev) => {
      const isChecked = prev.includes(type);
      let next: QuestionType[];
      
      if (isChecked) {
        next = prev.filter((x) => x !== type);
        if (next.length === 0) next = ["multiple_choice"];
      } else {
        next = [...prev, type];
      }

      // Sync typeCounts
      const newCounts = { ...typeCounts };
      if (!next.includes(type)) {
        newCounts[type] = 0;
      } else if (newCounts[type] === 0) {
        newCounts[type] = 5; // Default when checked
      }
      setTypeCounts(newCounts);
      
      return next;
    });
  }

  function handleTypeCountChange(type: QuestionType, val: number) {
    const safeVal = Math.max(0, Math.min(val, maxQuestionLimit));
    setTypeCounts(prev => ({ ...prev, [type]: safeVal }));
    
    if (safeVal > 0 && !selectedTypes.includes(type)) {
      setSelectedTypes(prev => [...prev, type]);
    } else if (safeVal === 0 && selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(prev => prev.filter(t => t !== type));
      } else {
        // Don't uncheck the last one, keep at least 1
        setTypeCounts(prev => ({ ...prev, [type]: 1 }));
      }
    }
  }

  const totalCalculatedCount = useMemo(() => {
    return Object.values(typeCounts).reduce((a, b) => a + b, 0);
  }, [typeCounts]);

  const isDemoMode = useMemo(
    () =>
      generatedQuestions.some(
        (q) =>
          typeof q?.explanation === "string" &&
          q.explanation.toLowerCase().includes("fallback question because api quota is currently exceeded")
      ),
    [generatedQuestions]
  );

  async function handleGenerateSummary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    setSummaryLoading(true);

    try {
      const response = await api.post("/api/summaries/generate", { topic: summaryPrompt });
      const summaryObj = response.data.summary;
      setSummaryResult(summaryObj.content);
      // We'll store the ID temporarily so we can export it
      (window as any)._lastSummaryId = summaryObj.id;
      setStatusMessage("Summary generated with ChatGPT & Gemini comparison.");
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setStatusMessage("Failed to generate summary. Please check AI service.");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleExportPdf() {
    const id = (window as any)._lastSummaryId;
    if (!id) return;
    
    try {
      const response = await api.get(`/api/summaries/${id}/export-pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${summaryPrompt.toLowerCase().replace(/\s+/g, "-")}-summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
      setStatusMessage("Failed to export PDF.");
    }
  }

  async function handleGenerateQuestions(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    if (!selectedFile) {
      setStatusMessage("Please upload a lesson file first.");
      return;
    }

    setGenerationLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", quizTitle.trim());
      formData.append("count", totalCalculatedCount.toString());
      selectedTypes.forEach((type) => {
        formData.append("types[]", type);
        formData.append(`type_counts[${type}]`, typeCounts[type].toString());
      });

      const response = await api.post("/api/quizzes/generate-from-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setGeneratedQuestions(response.data.quiz.questions);
      setLastGeneratedQuizId(response.data.quiz.id);
      setGenerationsUsed((prev) => prev + 1);
      setShowSuccess(true);
      setStatusMessage(`Successfully generated ${response.data.quiz.questions.length} questions.`);
    } catch (error: any) {
      console.error("Failed to generate questions:", error);
      setStatusMessage(error.response?.data?.error || "Failed to generate questions. Please check the file and try again.");
    } finally {
      setGenerationLoading(false);
    }
  }

  async function handleExportQuizPdf(includeAnswers: boolean) {
    if (!lastGeneratedQuizId) return;

    try {
      const response = await api.get(`/api/quizzes/${lastGeneratedQuizId}/export-pdf`, {
        params: {
          include_answers: includeAnswers ? 1 : 0,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", includeAnswers ? "quiz-with-answers.pdf" : "quiz-questions-only.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Quiz export failed:", error);
      setStatusMessage("Failed to export quiz PDF.");
    }
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
            : `You can generate up to ${maxQuestionLimit} questions and mix advanced question types.`}
        </p>
      </section>

      <section className={styles.usageCard}>
        <div className={styles.usageHeader}>
          <p className={styles.usageTitle}>{planMeta.label} Usage</p>
          <p className={styles.usageNumbers}>
            {generationsRemaining} of {generationLimit} quiz generations remaining
          </p>
        </div>
        <div className={styles.usageTrack} role="progressbar" aria-valuemin={0} aria-valuemax={generationLimit} aria-valuenow={generationsUsed}>
          <span className={styles.usageBar} style={{ width: `${generationProgress}%` }} />
        </div>
        {limitReached ? (
          <p className={styles.limitReachedText}>
            You have reached the Free Plan limit ({generationLimit} quiz generations). Upgrade to continue using Teachify AI.
          </p>
        ) : null}
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
            {!summaryPrompt.trim() ? <p className={styles.helperText}>Examples: {summaryExamples.join(" • ")}</p> : null}
            <button type="submit" className={styles.primaryBtn} disabled={summaryLoading}>
              {summaryLoading ? "Generating..." : "Generate Summary"}
            </button>
          </form>

          {summaryResult ? (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h4>AI Comparison View</h4>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={handleExportPdf}
                >
                  Export Both as PDF
                </button>
              </div>

              <div className={styles.comparisonGrid}>
                {Object.entries(summaryResult).map(([provider, text]) => (
                  <div key={provider} className={`${styles.providerCard} ${styles[`provider${provider.charAt(0).toUpperCase() + provider.slice(1)}`]}`}>
                    <div className={styles.providerBadge}>
                      {provider === "chatgpt" ? "🤖 ChatGPT" : "✨ Gemini"}
                    </div>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      ) : (
        <article className={styles.panel}>
          <h3>Generate Questions from your files</h3>
          <form className={styles.form} onSubmit={handleGenerateQuestions}>
            <label htmlFor="quizTitle">Quiz title</label>
            <input
              id="quizTitle"
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="e.g. Midterm Review - Chapter 3"
              disabled={limitReached}
            />

            <label htmlFor="lessonFile">Upload lesson PDF</label>
            <input
              id="lessonFile"
              type="file"
              accept={["basic", "pro", "school"].includes(planTier) ? ".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation" : ".pdf,application/pdf"}
              onChange={handleFilePick}
              disabled={limitReached}
            />
            {selectedFile ? <p className={styles.fileName}>Selected: {selectedFile.name}</p> : null}
            <p className={styles.helperText}>
              Upload your lesson file and Teachify AI will generate quiz questions automatically. Supported formats: {["basic", "pro", "school"].includes(planTier) ? "PDF, DOCX, PPTX" : "PDF"} (max 5MB; PDF max 20 pages).
            </p>

            <label>Question Configuration (Total: {totalCalculatedCount})</label>
            <div className={styles.typeConfigList}>
              {(Object.keys(questionTypeLabel) as QuestionType[]).map((type) => {
                const locked = isTrial && advancedTypes.includes(type);
                const checked = selectedTypes.includes(type);
                const count = typeCounts[type];

                return (
                  <div key={type} className={`${styles.typeConfigRow} ${locked ? styles.typeRowLocked : ""}`}>
                    <label className={styles.typeCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleType(type)}
                        disabled={locked || limitReached}
                      />
                      <span className={styles.typeLabelName}>
                        {questionTypeLabel[type]}
                        {locked ? <em className={styles.lockBadge}>🔒 Basic+</em> : null}
                      </span>
                    </label>
                    
                    {checked && !locked && (
                      <div className={styles.countInputWrapper}>
                        <input
                          type="number"
                          min={1}
                          max={maxQuestionLimit}
                          value={count}
                          onChange={(e) => handleTypeCountChange(type, Number(e.target.value) || 0)}
                          className={styles.miniInput}
                          disabled={limitReached}
                        />
                        <span className={styles.unitText}>questions</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalCalculatedCount > maxQuestionLimit && (
              <p className={styles.errorText}>Total questions ({totalCalculatedCount}) exceeds your plan limit of {maxQuestionLimit}.</p>
            )}

            {limitReached ? (
              <button type="button" className={styles.upgradeBtnLarge}>
                Upgrade Plan
              </button>
            ) : (
              <button type="submit" className={styles.primaryBtn} disabled={generationLoading || totalCalculatedCount === 0 || totalCalculatedCount > maxQuestionLimit}>
                {generationLoading ? "Generating quiz with AI..." : "Generate Q & A"}
              </button>
            )}
            {generationLoading ? <p className={styles.loadingText}>Generating quiz with AI... This usually takes 3-5 seconds.</p> : null}
          </form>

          {generatedQuestions.length > 0 ? (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h4>Generated Q & A Preview</h4>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className={styles.secondaryBtn} onClick={() => handleExportQuizPdf(false)}>
                    Export Questions PDF
                  </button>
                  <button type="button" className={styles.secondaryBtn} onClick={() => handleExportQuizPdf(true)}>
                    Export With Answers PDF
                  </button>
                </div>
              </div>
              {isDemoMode ? (
                <p className={styles.status}>Demo mode: API quota unavailable. Showing fallback questions.</p>
              ) : null}
              <div className={styles.questionList}>
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className={styles.questionItem}>
                    <p className={styles.questionText}><strong>Q{idx + 1}:</strong> {q.question_text}</p>
                    {Array.isArray(q.options) && (
                      <ul className={styles.optionList}>
                        {q.options.map((opt: string, i: number) => (
                          <li key={i} className={opt === q.correct_answer ? styles.correctOption : ""}>
                            {String.fromCharCode(65 + i)}. {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                    {!q.options && <p className={styles.correctAnswer}><strong>Answer:</strong> {q.correct_answer}</p>}
                    {q.explanation && !isDemoMode && <p className={styles.explanation}><em>Note: {q.explanation}</em></p>}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      )}

      {generationLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingModal}>
            <div className={styles.loadingAnimation}>
              <div className={styles.loadingCircle} />
              <div className={styles.loadingBrain}>🧠</div>
            </div>
            <div>
              <h3 className={styles.loadingTitle}>Generating your Quiz</h3>
              <p className={styles.loadingSub}>{loadingMessages[loadingMessageIndex]}</p>
            </div>
            <div className={styles.loadingProgress}>
              <div className={styles.loadingBar} />
            </div>
            <p className={styles.helperText} style={{ textAlign: 'center' }}>
              This usually takes 30-60 seconds depending on file length.
            </p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className={styles.loadingOverlay}>
          <div className={styles.successModal}>
            <div className={styles.successBadge}>
              <div className={styles.successIcon}>✨</div>
            </div>
            <h3 className={styles.successTitle}>Quiz Generated!</h3>
            <p className={styles.successSub}>
              We've successfully generated <strong>{generatedQuestions.length} questions</strong> from your lesson. You can now review, export, or assign them to your class.
            </p>
            <button 
              type="button"
              className={styles.successBtn} 
              onClick={() => setShowSuccess(false)}
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}

      {statusMessage ? <p className={styles.status}>{statusMessage}</p> : null}
    </section>
  );
}
