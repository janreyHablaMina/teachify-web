"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

type Quiz = {
  id: number;
  title: string;
  topic: string;
  questions_count?: number;
  created_at: string;
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteQuiz, setPendingDeleteQuiz] = useState<Quiz | null>(null);

  const sortedQuizzes = useMemo(
    () => [...quizzes].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [quizzes]
  );

  async function loadQuizzes() {
    setLoading(true);
    try {
      const res = await api.get("/api/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
      setStatusMessage("Failed to load quizzes.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (!statusMessage) return;

    const timer = window.setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  function requestDeleteQuiz(quizId: number) {
    const target = quizzes.find((q) => q.id === quizId) ?? null;
    setPendingDeleteQuiz(target);
  }

  async function handleDeleteQuiz(quizId: number) {
    setDeletingId(quizId);
    setStatusMessage("");
    setStatusType("");

    try {
      await api.delete(`/api/quizzes/${quizId}`);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      setPendingDeleteQuiz(null);
      setStatusMessage("Quiz deleted successfully.");
      setStatusType("success");
    } catch (err) {
      console.error("Failed to delete quiz", err);
      setStatusMessage("Failed to delete quiz.");
      setStatusType("error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="quizzes-container">
      <header className="page-header">
        <div>
          <p className="breadcrumb">Dashboard / Quizzes</p>
          <h2>My Generated Quizzes</h2>
          <p className="subtitle">Saved quizzes are available anytime.</p>
        </div>
        <div className="header-actions">
          <button className="btn-sketch btn-ghost" type="button" onClick={loadQuizzes}>
            Refresh
          </button>
          <Link href="/teacher/generate" className="btn-sketch btn-primary">
            + Create New Quiz
          </Link>
        </div>
      </header>

      {statusMessage ? (
        <p className={`status status-animated ${statusType === "success" ? "status-success" : "status-error"}`}>{statusMessage}</p>
      ) : null}

      {loading ? (
        <p>Loading your quizzes...</p>
      ) : sortedQuizzes.length === 0 ? (
        <div className="empty-state card sketch-border">
          <div className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M9 7h7M9 11h7M9 15h4" />
            </svg>
          </div>
          <h3>No quizzes yet</h3>
          <p>Create your first quiz from a lesson PDF and it will appear here.</p>
          <Link href="/teacher/generate" className="btn-sketch btn-primary">
            Generate My First Quiz
          </Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {sortedQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card card sketch-border">
              <Link href={`/teacher/quizzes/${quiz.id}`} className="card-link">
                <div className="card-head">
                  <h3>{quiz.title}</h3>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={(event) => {
                      event.preventDefault();
                      requestDeleteQuiz(quiz.id);
                    }}
                    disabled={deletingId === quiz.id}
                    aria-label="Delete quiz"
                    title="Delete quiz"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
                <p className="topic">Topic: {quiz.topic}</p>
                <div className="stats">
                  <span className="stat-chip">{quiz.questions_count ?? 0} Questions</span>
                  <span className="stat-side">
                    <span className="stat-date">{new Date(quiz.created_at).toLocaleDateString()}</span>
                    <span className="view-link">View details</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {pendingDeleteQuiz ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="delete-quiz-title">
          <div className="confirmModal">
            <p className="confirmTag">Confirm action</p>
            <h3 id="delete-quiz-title" className="confirmTitle">Delete this quiz?</h3>
            <p className="confirmText">
              <strong>{pendingDeleteQuiz.title}</strong> will be permanently removed.
            </p>
            <div className="confirmActions">
              <button
                type="button"
                className="confirmCancelBtn"
                onClick={() => setPendingDeleteQuiz(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirmSignoutBtn"
                onClick={() => handleDeleteQuiz(pendingDeleteQuiz.id)}
                disabled={deletingId !== null}
              >
                {deletingId === pendingDeleteQuiz.id ? "Deleting..." : "Delete quiz"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .quizzes-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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
          gap: 0.75rem;
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
        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.1rem;
        }
        .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .sketch-border {
          border: 2px solid #0f172a;
          box-shadow: 3px 3px 0 #0f172a;
        }
        .quiz-card h3 {
          margin: 0;
          font-size: 1.08rem;
          color: #0f172a;
          line-height: 1.3;
          padding-right: 0.5rem;
        }
        .quiz-card {
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .quiz-card:hover {
          transform: translateY(-2px);
          box-shadow: 5px 5px 0 #0f172a;
        }
        .card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .delete-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #fecaca;
          background: #fff;
          color: #dc2626;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.12s ease, border-color 0.12s ease;
          flex-shrink: 0;
        }
        .delete-btn svg {
          width: 14px;
          height: 14px;
        }
        .delete-btn:hover {
          background: #fef2f2;
          border-color: #f87171;
        }
        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.55rem;
        }
        .topic {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.2rem;
        }
        .stat-chip {
          font-size: 0.76rem;
          font-weight: 700;
          color: #0f172a;
          background: #f1f5f9;
          border: 1px solid #dbe2ea;
          border-radius: 8px;
          padding: 0.2rem 0.5rem;
        }
        .stat-date {
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
        }
        .stat-side {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.1rem;
        }
        .view-link {
          margin: 0;
          font-size: 0.76rem;
          font-weight: 700;
          color: #0369a1;
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
        .btn-ghost {
          background: #fff;
          color: #0f172a;
        }
        .empty-state {
          text-align: center;
          padding: 2.25rem 1.25rem;
          color: #64748b;
          align-items: center;
          gap: 0.75rem;
          max-width: 560px;
          margin: 0 auto;
          box-shadow: 6px 6px 0 #0f172a;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }
        .empty-icon {
          width: 56px;
          height: 56px;
          border: 2px solid #0f172a;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #feef89;
          color: #0f172a;
        }
        .empty-icon svg {
          width: 28px;
          height: 28px;
        }
        .empty-state h3 {
          margin: 0.2rem 0 0;
          color: #0f172a;
          font-size: 1.3rem;
          line-height: 1.2;
        }
        .empty-state p {
          margin: 0;
          font-size: 0.95rem;
          max-width: 420px;
          color: #475569;
        }
        .status {
          margin: 0 0 0.35rem;
          font-weight: 600;
          border: 2px solid #0f172a;
          box-shadow: 4px 4px 0 #0f172a;
          padding: 0.55rem 0.75rem;
          width: fit-content;
          border-radius: 10px;
          font-size: 0.86rem;
        }
        .status-success {
          background: #dcfce7;
          color: #166534;
        }
        .status-error {
          background: #fee2e2;
          color: #991b1b;
        }
        .status-animated {
          animation: statusFadeOut 0.45s ease 2.6s forwards;
        }
        @keyframes statusFadeOut {
          to {
            opacity: 0;
            transform: translateY(-2px);
          }
        }
        .modalBackdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          display: grid;
          place-items: center;
          z-index: 1200;
          padding: 16px;
        }
        .confirmModal {
          width: min(440px, 100%);
          border: 2px solid #0f172a;
          background: #fff;
          box-shadow: 10px 10px 0 #0f172a;
          padding: 20px;
          transform: rotate(-0.4deg);
        }
        .confirmTag {
          margin: 0 0 8px;
          width: fit-content;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1.5px solid #0f172a;
          background: #feef89;
          padding: 3px 9px;
        }
        .confirmTitle {
          margin: 0;
          font-size: 28px;
          line-height: 1;
          letter-spacing: -0.03em;
          color: #0f172a;
        }
        .confirmText {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }
        .confirmActions {
          margin-top: 18px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .confirmCancelBtn,
        .confirmSignoutBtn {
          border: 2px solid #0f172a;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .confirmCancelBtn {
          background: #ffffff;
          color: #0f172a;
        }
        .confirmSignoutBtn {
          background: #fecaca;
          color: #7f1d1d;
          box-shadow: 4px 4px 0 #7f1d1d;
        }
        .confirmCancelBtn:hover,
        .confirmSignoutBtn:hover {
          transform: translate(-1px, -1px);
        }
        .confirmCancelBtn:disabled,
        .confirmSignoutBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </section>
  );
}
