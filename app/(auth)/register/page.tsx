"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerWithApi, setShadowCookies } from "@/lib/auth";
import "./backdrop.css";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullname = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(formData.get("confirmPassword") ?? "");

    try {
      await registerWithApi({
        fullname,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role: "teacher",
      });
      setStatus({ type: "success", message: "Account created successfully. Redirecting to your dashboard..." });
      setShadowCookies("teacher");
      setTimeout(() => {
        router.push("/teacher");
      }, 900);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="register-page-root">
      <section className="register-card">
        <div className="register-card-visual">
          <div className="rg-blob rg-blob-1" />
          <div className="rg-blob rg-blob-2" />
          <div className="rg-blob rg-blob-3" />

          <div className="rg-float-tags">
            <span className="rg-float-tag tag-1">Classroom Ready</span>
            <span className="rg-float-tag tag-2">AI Quiz Builder</span>
            <span className="rg-float-tag tag-3">Fast Setup</span>
          </div>

          <div className="rg-visual-copy">
            <span className="rg-visual-kicker">Educator onboarding</span>
            <h2>Set up your teaching workspace in minutes.</h2>
            <p>Create your account once and start building lessons, quizzes, and assignments with AI support.</p>
          </div>

          <div className="rg-stats-row">
            <div className="rg-stat">
              <span className="rg-stat-val">12K+</span>
              <span className="rg-stat-label">Teachers</span>
            </div>
            <div className="rg-stat-sep" />
            <div className="rg-stat">
              <span className="rg-stat-val">508K+</span>
              <span className="rg-stat-label">Quizzes</span>
            </div>
            <div className="rg-stat-sep" />
            <div className="rg-stat">
              <span className="rg-stat-val">860+</span>
              <span className="rg-stat-label">Schools</span>
            </div>
          </div>
        </div>

        <div className="register-card-form">
          <div className="rg-form-header">
            <div className="rg-logo">
              <div className="rg-logo-icon">T</div>
              <span>Teachify AI</span>
            </div>
            <p className="rg-pill">Create Account</p>
            <h1>Teacher Signup</h1>
            <p className="rg-subtitle">Start your account and access your educator dashboard.</p>
          </div>

          <form onSubmit={handleRegister} className="rg-form-body">
            <div className="rg-input-group rg-full">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" placeholder="Alex Johnson" required disabled={isLoading} />
            </div>

            <div className="rg-input-group rg-full">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                placeholder="teacher@school.edu"
                type="email"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="rg-input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                placeholder="Enter password"
                type="password"
                minLength={8}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="rg-input-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                minLength={8}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="rg-primary-btn rg-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </button>
            {status ? (
              <p className={`rg-alert rg-full ${status.type === "success" ? "rg-alert-success" : "rg-alert-error"}`}>
                {status.message}
              </p>
            ) : null}

            <label className="rg-consent rg-full" htmlFor="agreeTerms">
              <input id="agreeTerms" name="agreeTerms" type="checkbox" required disabled={isLoading} />
              <span>
                I agree to the <Link href="/terms">Terms</Link> &amp; <Link href="/privacy">Privacy Policy</Link>.
              </span>
            </label>

            <p className="rg-disclaimer rg-full">Please review our terms before creating your account.</p>
          </form>

          <p className="rg-footer-text">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
