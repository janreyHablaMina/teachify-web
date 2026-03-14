"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

type Question = {
  id: number;
  question_text: string;
  options?: string[] | null;
  correct_answer?: string | null;
  explanation?: string | null;
};

type QuizDetail = {
  id: number;
  title: string;
  topic: string;
  type?: string;
  created_at: string;
  questions: Question[];
};

export default function QuizDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const quizId = params?.id;

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const questionCount = useMemo(() => quiz?.questions?.length ?? 0, [quiz]);

  useEffect(() => {
    if (!quizId) return;

    let mounted = true;
    setLoading(true);

    api
      .get(`/api/quizzes/${quizId}`)
      .then((res) => {
        if (!mounted) return;
        setQuiz(res.data);
      })
      .catch((err) => {
        console.error("Failed to load quiz details", err);
        if (!mounted) return;
        setStatusMessage("Failed to load quiz details.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [quizId]);

  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (showAssignModal) {
      api.get("/api/classrooms").then((res) => {
        setClassrooms(res.data ?? []);
      }).catch(err => {
        console.error("Failed to load classrooms for assignment", err);
      });
    }
  }, [showAssignModal]);

  async function handleAssign() {
    if (!quizId || !selectedClassroomId) return;
    setIsBusy(true);
    setStatusMessage("");
    try {
      await api.post(`/api/classrooms/${selectedClassroomId}/assignments`, {
        quiz_id: quizId,
        deadline_at: deadline || null,
        is_randomized: false,
        anti_cheat_mode: false
      });
      setShowAssignModal(false);
      setStatusMessage("Quiz assigned successfully!");
      setSelectedClassroomId("");
      setDeadline("");
    } catch (err: any) {
      setStatusMessage(err?.response?.data?.error || "Failed to assign quiz.");
    } finally {
      setIsBusy(false);
    }
  }

  async function exportQuizPdf(includeAnswers: boolean) {
    if (!quizId) return;

    try {
      const response = await api.get(`/api/quizzes/${quizId}/export-pdf`, {
        params: { include_answers: includeAnswers ? 1 : 0 },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", includeAnswers ? `quiz-${quizId}-with-answers.pdf` : `quiz-${quizId}-questions-only.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export quiz pdf", err);
      setStatusMessage("Failed to export quiz PDF.");
    }
  }

  async function duplicateQuiz() {
    if (!quizId) return;
    setIsBusy(true);
    setStatusMessage("");
    try {
      const response = await api.post(`/api/quizzes/${quizId}/duplicate`);
      const newQuizId = response.data?.quiz?.id;
      if (newQuizId) {
        router.push(`/teacher/quizzes/${newQuizId}`);
        return;
      }
      setStatusMessage("Quiz duplicated successfully.");
    } catch (err: any) {
      setStatusMessage(err?.response?.data?.error || "Failed to duplicate quiz.");
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteQuiz() {
    if (!quizId) return;
    const confirmed = window.confirm("Delete this quiz? This action cannot be undone.");
    if (!confirmed) return;
    setIsBusy(true);
    setStatusMessage("");
    try {
      await api.delete(`/api/quizzes/${quizId}`);
      router.push("/teacher/quizzes");
    } catch (err: any) {
      setStatusMessage(err?.response?.data?.error || "Failed to delete quiz.");
      setIsBusy(false);
    }
  }

  return (
    <section className="quizzes-container">
      <header className="page-header">
        <div>
          <p className="breadcrumb">Dashboard / Quizzes / Details</p>
          <h2>{quiz?.title ?? "Quiz Details"}</h2>
          <p className="subtitle">{quiz?.topic ?? "Loading..."}</p>
        </div>
        <div className="header-actions">
          <Link href="/teacher/quizzes" className="btn-sketch btn-ghost">
            Back
          </Link>
          <button className="btn-sketch btn-ghost" type="button" onClick={() => setShowAnswers((v) => !v)}>
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </button>
          <button className="btn-sketch btn-ghost" type="button" onClick={duplicateQuiz} disabled={isBusy}>
            Duplicate
          </button>
          <button className="btn-sketch btn-danger" type="button" onClick={deleteQuiz} disabled={isBusy}>
            Delete
          </button>
          <button className="btn-sketch btn-success" type="button" onClick={() => setShowAssignModal(true)} disabled={isBusy}>
            Assign
          </button>
          <button className="btn-sketch btn-primary" type="button" onClick={() => exportQuizPdf(false)}>
            Export Questions PDF
          </button>
          <button className="btn-sketch btn-primary" type="button" onClick={() => exportQuizPdf(true)}>
            Export With Answers PDF
          </button>
        </div>
      </header>

      {statusMessage ? <p className="status">{statusMessage}</p> : null}

      {loading ? (
        <p>Loading quiz details...</p>
      ) : !quiz ? (
        <p>Quiz not found.</p>
      ) : (
        <>
          <div className="card sketch-border">
            <p>
              <strong>Questions:</strong> {questionCount}
            </p>
            <p>
              <strong>Created:</strong> {new Date(quiz.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Source:</strong> {quiz.type === "file" ? "PDF upload" : "Manual"}
            </p>
          </div>

          <div className="question-list">
            {quiz.questions.map((q, idx) => (
              <div key={q.id} className="card sketch-border">
                <p className="question-title">
                  <strong>Q{idx + 1}:</strong> {q.question_text}
                </p>

                {Array.isArray(q.options) && q.options.length > 0 ? (
                  <ul className="option-list">
                    {q.options.map((opt, i) => (
                      <li key={i} className={showAnswers && q.correct_answer === opt ? "correct" : ""}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {showAnswers && q.correct_answer ? (
                  <p className="answer-text">
                    <strong>Answer:</strong> {q.correct_answer}
                  </p>
                ) : null}

                {showAnswers && q.explanation ? (
                  <p className="explanation">
                    <em>{q.explanation}</em>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content sketch-border">
            <h3>Assign Quiz</h3>
            <p className="modal-desc">Select a classroom to assign this quiz to.</p>
            <div className="form-group">
              <label>Select Classroom</label>
              <select value={selectedClassroomId} onChange={e => setSelectedClassroomId(e.target.value)} className="sketch-input">
                <option value="">-- Choose a Class --</option>
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Deadline (Optional)</label>
              <input type="datetime-local" className="sketch-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>

            <div className="modal-actions">
              <button className="btn-sketch btn-ghost" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="btn-sketch btn-primary" onClick={handleAssign} disabled={isBusy || !selectedClassroomId}>
                Confirm Assign
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .quizzes-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1rem 0;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .header-actions {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .breadcrumb {
          margin: 0;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .subtitle {
          margin: 0.5rem 0 0;
          color: #475569;
        }
        .card {
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .sketch-border {
          border: 2px solid #0f172a;
          box-shadow: 4px 4px 0 #0f172a;
        }
        .question-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .question-title {
          margin: 0;
          color: #0f172a;
        }
        .option-list {
          margin: 0;
          padding-left: 1rem;
          color: #334155;
        }
        .option-list li {
          margin-top: 0.25rem;
        }
        .option-list li.correct {
          color: #166534;
          font-weight: 700;
        }
        .answer-text {
          margin: 0.35rem 0 0;
          color: #166534;
          font-weight: 700;
        }
        .explanation {
          margin: 0.25rem 0 0;
          color: #475569;
        }
        .btn-sketch {
          padding: 0.65rem 1rem;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          border: 2px solid #0f172a;
          box-shadow: 3px 3px 0 #0f172a;
          transition: transform 0.1s;
          cursor: pointer;
        }
        .btn-sketch:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 #0f172a;
        }
        .btn-primary {
          background: #feef89;
          color: #0f172a;
        }
        .btn-success {
          background: #dcfce7;
          color: #166534;
          border-color: #166534;
          box-shadow: 3px 3px 0 #166534;
        }
        .btn-success:active {
          box-shadow: 1px 1px 0 #166534;
        }
        .btn-ghost {
          background: #fff;
          color: #0f172a;
        }
        .btn-danger {
          background: #fecaca;
          color: #7f1d1d;
          border-color: #7f1d1d;
          box-shadow: 3px 3px 0 #7f1d1d;
        }
        .btn-sketch:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .status {
          color: #b91c1c;
          margin: 0;
          font-weight: 600;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          backdrop-filter: blur(2px);
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .modal-content h3 {
          margin: 0;
          font-size: 1.4rem;
          color: #0f172a;
        }
        .modal-desc {
          margin: 0;
          color: #475569;
          font-size: 0.95rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 700;
          color: #334155;
          font-size: 0.9rem;
        }
        .sketch-input {
          padding: 0.75rem;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .sketch-input:focus {
          outline: none;
          border-color: #0f172a;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </section>
  );
}
