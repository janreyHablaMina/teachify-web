"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { signIn, type UserRole } from "@/lib/auth";
import "./backdrop.css";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";

    try {
      const data = await signIn({ email, password });
      const role = data.user.role as UserRole;

      if (role === "admin") {
        router.push("/admin");
        return;
      }

      if (role === "teacher") {
        router.push("/teacher");
        return;
      }

      if (role === "student") {
        router.push("/student");
        return;
      }

      throw new Error("This account role is not allowed to access the web dashboard.");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      alert(message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page-root">
      <div className="login-card">

        {/* ── LEFT: Premium Form Panel ── */}
        <div className="login-card-form">
          <div className="lc-form-header">
            <div className="lc-logo-container">
              <div className="lc-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
                </svg>
              </div>
              <span className="lc-logo-text">Teachify <strong>AI</strong></span>
            </div>
            <div className="lc-header-text">
              <h1 className="lc-main-title">Welcome Back</h1>
              <p className="lc-subtitle">Login to your Teachify account</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="lc-form-body">
            <div className="lc-input-group">
              <label htmlFor="email" className="lc-label">Email Address</label>
              <div className="lc-input-wrapper">
                <div className="lc-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9 7 9-7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="22 9 12 2 2 9" /></svg>
                </div>
                <input id="email" name="email" type="email" required disabled={isLoading} placeholder="you@example.com" autoComplete="email" />
              </div>
            </div>

            <div className="lc-input-group">
              <div className="lc-label-row">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password" tabIndex={-1} className="lc-forgot-link">Forgot Password?</Link>
              </div>
              <div className="lc-input-wrapper">
                <div className="lc-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <input id="password" name="password" type="password" required disabled={isLoading} placeholder="••••••••" autoComplete="current-password" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="lc-primary-btn">
              {isLoading ? <><span className="lc-loading-spinner" /> Verifying...</> : <>Login to Portal <span className="btn-arrow">→</span></>}
            </button>

            <div className="lc-footer-compact">
              <p className="lc-footer-text">
                New here? <Link href="/register">Create account</Link>
              </p>
              <div className="lc-compact-divider" />
              <button type="button" className="lc-google-icon-btn" title="Sign in with Google">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT: Redesigned Green Panel ── */}
        <div className="login-card-visual">
          <div className="lc-blob lc-blob-1" />
          <div className="lc-blob lc-blob-2" />
          <div className="lc-blob lc-blob-3" />

          {/* Floating Feature Tags */}
          <div className="lc-float-tags">
            <span className="lc-float-tag tag-1">🧠 AI Lessons</span>
            <span className="lc-float-tag tag-2">⚡ Auto Grading</span>
            <span className="lc-float-tag tag-3">📝 Smart Quizzes</span>
          </div>

          {/* Teacher illustration */}
          <div className="lc-illustration-wrap">
            <Image
              src="/Teacher-login.png"
              alt="AI Teacher"
              width={480}
              height={480}
              className="lc-illustration-img"
              priority
            />
          </div>

          {/* Glass Info Card */}
          <div className="lc-glass-card">
            <div className="lc-glass-top">
              <div className="lc-brand-badge">
                <div className="lc-badge-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 3L2 12h3v8h14v-8h3L12 3z" /></svg>
                </div>
                <span>Teachify AI</span>
              </div>
              <p className="lc-glass-quote">&ldquo;Saves me <strong>10+ hours</strong> every week on lesson planning.&rdquo;</p>
              <p className="lc-glass-author">— Sarah J., Senior High Teacher</p>
            </div>
            <div className="lc-glass-bottom">
              <div className="lc-stat"><span className="lc-stat-val">10K+</span><span className="lc-stat-label">Teachers</span></div>
              <div className="lc-stat-sep" />
              <div className="lc-stat"><span className="lc-stat-val">4.9★</span><span className="lc-stat-label">Rating</span></div>
              <div className="lc-stat-sep" />
              <div className="lc-stat"><span className="lc-stat-val">1M+</span><span className="lc-stat-label">Quizzes</span></div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
