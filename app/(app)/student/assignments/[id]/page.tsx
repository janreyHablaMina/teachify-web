"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import styles from "../../dashboard.module.css";

type Question = {
  id: number;
  question_text: string;
  options?: string[] | null;
};

type AssignmentDetail = {
  id: number;
  deadline_at: string | null;
  quiz: {
    id: number;
    title: string;
    topic: string;
    questions: Question[];
  };
  classroom: {
    name: string;
    teacher: {
      fullname: string;
    };
  };
};

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id;

  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/api/assignments/${assignmentId}`);
      setAssignment(response.data);
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async () => {
    if (!assignment) return;
    
    // Check if all questions answered
    const unanswered = assignment.quiz.questions.some(q => !answers[q.id]);
    if (unanswered && !confirm("You haven't answered all questions. Submit anyway?")) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/api/assignments/${assignmentId}/submit`, {
        answers: answers
      });
      setResult(response.data.submission);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading quiz...</div>;
  if (!assignment) return <div className={styles.container}>Assignment not found.</div>;

  if (result) {
    return (
      <div className={styles.container}>
        <div className={styles.statCard} style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '48px' }}>🎉</span>
          <h1 className={styles.welcomeHeading}>Quiz Completed!</h1>
          <p className={styles.welcomeSub}>Great job! You've successfully submitted your answers.</p>
          
          <div style={{ margin: '32px 0' }}>
            <span className={styles.statLabel}>Your Score</span>
            <div className={styles.statValue}>{Math.round(result.score)}<span className={styles.unit}>%</span></div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/student/assignments" className={styles.joinBtn} style={{ textDecoration: 'none' }}>
              Back to Assignments
            </Link>
            <Link href="/student" className={styles.joinBtn} style={{ background: 'white', color: '#0f172a', textDecoration: 'none' }}>
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.welcomeSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p className={styles.statLabel}>{assignment.classroom.name} • {assignment.classroom.teacher.fullname}</p>
            <h1 className={styles.welcomeHeading}>{assignment.quiz.title}</h1>
            <p className={styles.welcomeSub}>{assignment.quiz.topic}</p>
          </div>
          {assignment.deadline_at && (
            <div className={styles.statCard} style={{ padding: '12px 20px', boxShadow: '4px 4px 0 #0f172a' }}>
              <span className={styles.statLabel} style={{ marginBottom: '4px' }}>Deadline</span>
              <span style={{ fontWeight: 800, fontSize: '14px' }}>{new Date(assignment.deadline_at).toLocaleString()}</span>
            </div>
          )}
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
        {assignment.quiz.questions.map((q, idx) => (
          <div key={q.id} className={styles.statCard}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ 
                background: '#0f172a', 
                color: 'white', 
                borderRadius: '8px', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 900,
                flexShrink: 0
              }}>{idx + 1}</span>
              <h3 style={{ fontSize: '18px', fontWeight: 850, lineHeight: 1.4 }}>{q.question_text}</h3>
            </div>

            {Array.isArray(q.options) && q.options.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px', paddingLeft: '44px' }}>
                {q.options.map((option, i) => {
                  const isSelected = answers[q.id] === option;
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(q.id, option)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '2px solid #0f172a',
                        background: isSelected ? '#feef89' : 'white',
                        textAlign: 'left',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.1s',
                        boxShadow: isSelected ? '2px 2px 0 #0f172a' : '0 0 0 transparent',
                        transform: isSelected ? 'translateY(1px)' : 'none'
                      }}
                    >
                      <span style={{ opacity: 0.5, marginRight: '8px' }}>{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className={styles.joinBtn} 
            onClick={handleSubmit}
            disabled={submitting}
            style={{ 
              padding: '20px 48px', 
              fontSize: '18px',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
