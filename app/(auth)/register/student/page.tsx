"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { setShadowCookies } from "@/lib/auth";
import "../backdrop.css";

function StudentRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setJoinCode(code);
      checkUserAndAutoEnroll(code);
    }
  }, [searchParams]);

  async function checkUserAndAutoEnroll(code: string) {
    try {
      const user = await api.get("/api/me").then(res => res.data.user);
      if (user && user.role === 'student') {
        setStatus({ type: "success", message: "Recognized your account! Enrolling you now..." });
        try {
          await api.post("/api/classrooms/join-by-code", { join_code: code });
        } catch (enrollErr: any) {
          if (enrollErr.response?.status !== 409) throw enrollErr;
          // If 409, they are already enrolled, so we just proceed to redirect
        }
        setTimeout(() => {
          router.push("/student/classes");
        }, 1000);
      }
    } catch (err) {
      // User is likely guest, proceed with registration form
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstname: String(formData.get("firstname") ?? "").trim(),
      middlename: String(formData.get("middlename") ?? "").trim(),
      lastname: String(formData.get("lastname") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      password_confirmation: String(formData.get("confirmPassword") ?? ""),
      join_code: joinCode,
    };

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/register-student", payload);
      
      setStatus({ type: "success", message: "Successfully registered and enrolled! Redirecting..." });
      setShadowCookies("student");
      
      setTimeout(() => {
        router.push("/student");
      }, 1200);
    } catch (error: any) {
      console.error("Registration failed:", error);
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="register-page-root">
      <section className="register-card">
        <div className="register-card-visual" style={{ background: 'linear-gradient(135deg, #0bd 0%, #0088aa 100%)' }}>
          <div className="rg-blob rg-blob-1" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <div className="rg-blob rg-blob-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
          
          <div className="rg-visual-copy">
            <span className="rg-visual-kicker">Student Portal</span>
            <h2>Join your classroom and start learning.</h2>
            <p>Your teacher invited you! Create your student account to access quizzes and track your progress.</p>
          </div>

          <div className="rg-stats-row">
            <div className="rg-stat">
              <span className="rg-stat-val">Live</span>
              <span className="rg-stat-label">Classes</span>
            </div>
            <div className="rg-stat-sep" />
            <div className="rg-stat">
              <span className="rg-stat-val">Instant</span>
              <span className="rg-stat-label">Feedback</span>
            </div>
          </div>
        </div>

        <div className="register-card-form">
          <div className="rg-form-header">
            <div className="rg-logo">
              <div className="rg-logo-icon" style={{ backgroundColor: '#0bd' }}>S</div>
              <span>Teachify Student</span>
            </div>
            <h1>Student Signup</h1>
            <p className="rg-subtitle">Enter your details to join the classroom.</p>
          </div>

          <form onSubmit={handleRegister} className="rg-form-body">
            <div className="rg-input-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
               <div className="rg-input-group">
                <label htmlFor="firstname">First Name</label>
                <input id="firstname" name="firstname" placeholder="John" required disabled={isLoading} />
              </div>
              <div className="rg-input-group">
                <label htmlFor="lastname">Last Name</label>
                <input id="lastname" name="lastname" placeholder="Doe" required disabled={isLoading} />
              </div>
            </div>

            <div className="rg-input-group rg-full">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                placeholder="john@example.com"
                type="email"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="rg-input-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
              <div className="rg-input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="rg-input-group">
                <label htmlFor="confirmPassword">Confirm</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="rg-input-group rg-full">
              <label htmlFor="join_code">Classroom Join Code</label>
              <input
                id="join_code"
                name="join_code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="EX: ABC123"
                required
                disabled={isLoading}
                style={{ letterSpacing: '0.2em', fontWeight: 'bold' }}
              />
            </div>

            <button type="submit" className="rg-primary-btn rg-full" style={{ backgroundColor: '#0bd' }} disabled={isLoading}>
              {isLoading ? "Signing up..." : "Join Classroom"}
            </button>

            {status && (
              <p className={`rg-alert rg-full ${status.type === "success" ? "rg-alert-success" : "rg-alert-error"}`}>
                {status.message}
              </p>
            )}

            <p className="rg-footer-text">
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function RegisterStudentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentRegisterForm />
    </Suspense>
  );
}
