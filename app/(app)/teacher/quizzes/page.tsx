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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuizzes();
  }, []);

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

      {statusMessage ? <p className="status">{statusMessage}</p> : null}

      {loading ? (
        <p>Loading your quizzes...</p>
      ) : sortedQuizzes.length === 0 ? (
        <div className="empty-state card">
          <p>You have not generated any quizzes yet.</p>
          <Link href="/teacher/generate" className="text-secondary">
            Go to Generator to start
          </Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {sortedQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card card sketch-border">
              <Link href={`/teacher/quizzes/${quiz.id}`} className="card-link">
                <h3>{quiz.title}</h3>
                <p className="topic">Topic: {quiz.topic}</p>
                <div className="stats">
                  <span>{quiz.questions_count ?? 0} Questions</span>
                  <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

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
          gap: 1rem;
        }
        .card {
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .sketch-border {
          border: 2px solid #0f172a;
          box-shadow: 4px 4px 0 #0f172a;
        }
        .quiz-card h3 {
          margin: 0;
          font-size: 1.15rem;
          color: #0f172a;
        }
        .quiz-card {
          transition: transform 0.12s ease;
        }
        .quiz-card:hover {
          transform: translateY(-2px);
        }
        .card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .topic {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }
        .stats {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
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
          padding: 2rem;
          color: #64748b;
        }
        .status {
          color: #b91c1c;
          margin: 0;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
