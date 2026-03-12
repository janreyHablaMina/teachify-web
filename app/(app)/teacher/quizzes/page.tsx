"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    api.get("/api/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.error("Failed to fetch quizzes", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="quizzes-container">
      <header className="page-header">
        <div>
          <p className="breadcrumb">Dashboard / Quizzes</p>
          <h2>My Generated Quizzes</h2>
          <p className="subtitle">Collection of your AI-generated lesson assessments.</p>
        </div>
        <Link href="/teacher/generate" className="btn-sketch btn-primary">
          + Create New Quiz
        </Link>
      </header>

      {loading ? (
        <p>Loading your quizzes...</p>
      ) : quizzes.length === 0 ? (
        <div className="empty-state card">
          <p>You haven't generated any quizzes yet.</p>
          <Link href="/teacher/generate" className="text-secondary">
            Go to Generator to start
          </Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card card sketch-border">
              <h3>{quiz.title}</h3>
              <p className="topic">Topic: {quiz.topic}</p>
              <div className="stats">
                <span>📝 {quiz.questions_count} Questions</span>
                <span>📅 {new Date(quiz.created_at).toLocaleDateString()}</span>
              </div>
              <div className="actions">
                {/* For now just a link to view, we can expand later */}
                <span className="view-link">Saved to Database</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .quizzes-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem 0;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
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
          font-size: 1.25rem;
          color: #0f172a;
        }
        .topic {
          font-size: 0.9rem;
          color: #64748b;
        }
        .stats {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .actions {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px dashed #e2e8f0;
        }
        .view-link {
          font-size: 0.8rem;
          color: #10a37f;
          font-weight: 700;
        }
        .btn-sketch {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          border: 2px solid #0f172a;
          box-shadow: 3px 3px 0 #0f172a;
          transition: transform 0.1s;
        }
        .btn-sketch:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 #0f172a;
        }
        .btn-primary {
          background: #feef89;
          color: #0f172a;
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #64748b;
        }
      `}</style>
    </section>
  );
}
