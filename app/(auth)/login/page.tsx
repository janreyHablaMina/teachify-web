"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, type UserRole } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const role = (formData.get("role") as UserRole) || "teacher";

    signIn(role);
    router.push(role === "admin" ? "/admin" : "/teacher");
  }

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        backgroundImage: "radial-gradient(at 0% 0%, rgba(22, 101, 52, 0.03) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(254, 243, 199, 0.05) 0px, transparent 50%)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Top Branding Section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.8)", padding: "8px 16px",
            borderRadius: "16px", border: "1px solid var(--line)",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", marginBottom: "20px"
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "var(--brand)", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
              </svg>
            </div>
            <span style={{ fontWeight: "700", color: "var(--foreground)", fontSize: "18px", letterSpacing: "-0.02em" }}>
              Teachify AI
            </span>
          </div>
          <h1 className="display" style={{ fontSize: "32px", color: "var(--foreground)", margin: "0 0 12px" }}>
            The AI partner for every teacher.
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", maxWidth: "340px", margin: "0 auto" }}>
            Elevate your classroom with AI-powered lessons, quizzes, and instant grading.
          </p>
        </div>

        {/* Login Card */}
        <section
          className="surface"
          style={{
            padding: "48px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
            border: "1px solid var(--line)",
          }}
        >
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 8px" }}>
              Sign In
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Email Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="email" style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@school.edu"
                style={{
                  width: "100%", padding: "12px 14px", fontSize: "14px",
                  border: "1px solid var(--line)", borderRadius: "10px",
                  outline: "none", background: "#fff", color: "var(--foreground)",
                  boxSizing: "border-box", transition: "all 0.15s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--brand)";
                  e.target.style.boxShadow = "0 0 0 4px var(--brand-soft)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--line)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="password" style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: "12px", color: "var(--brand)", fontWeight: "500", textDecoration: "none" }}>
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 14px", fontSize: "14px",
                  border: "1px solid var(--line)", borderRadius: "10px",
                  outline: "none", background: "#fff", color: "var(--foreground)",
                  boxSizing: "border-box", transition: "all 0.15s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--brand)";
                  e.target.style.boxShadow = "0 0 0 4px var(--brand-soft)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--line)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Role Selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="role" style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                Sign in as
              </label>
              <select
                id="role"
                name="role"
                defaultValue="teacher"
                style={{
                  width: "100%", padding: "12px 14px", fontSize: "14px",
                  border: "1px solid var(--line)", borderRadius: "10px",
                  outline: "none", background: "#fff", color: "var(--foreground)",
                  boxSizing: "border-box", cursor: "pointer",
                }}
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="primary-btn"
              style={{
                width: "100%", padding: "14px", fontSize: "15px", fontWeight: "600",
                marginTop: "8px", border: "none", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(22, 101, 52, 0.15)"
              }}
            >
              Enter Dashboard →
            </button>
          </form>

          {/* Bottom Link */}
          <div style={{ marginTop: "32px", textAlign: "center", borderTop: "1px solid var(--line)", paddingTop: "24px" }}>
            <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
              New to Teachify? <Link href="/register" style={{ color: "var(--brand)", fontWeight: "600", textDecoration: "none" }}>Create free account</Link>
            </p>
          </div>
        </section>

        {/* Footer Text */}
        <p style={{ marginTop: "24px", textAlign: "center", color: "var(--muted)", fontSize: "12px", opacity: 0.7 }}>
          By signing in, you agree to our Terms of Service.
        </p>
      </div>
    </main>
  );
}
