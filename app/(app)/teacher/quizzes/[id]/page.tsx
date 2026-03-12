"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
  created_at: string;
  questions: Question[];
};

export default function QuizDetailPage() {
  const params = useParams<{ id: string }>();
  const quizId = params?.id;

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

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
        .btn-ghost {
          background: #fff;
          color: #0f172a;
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
