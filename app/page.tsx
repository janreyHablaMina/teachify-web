"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./landing.css";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="lp-root">
      {/* ── IMMERSIVE BACKGROUND ── */}
      <div className="lp-mesh-bg" />
      <div className="lp-grain-overlay" />

      {/* ── SALES BANNER ── */}
      <div className="lp-sale-banner">
        <span className="lp-sale-tag">Limited Offer</span>
        <span>Empower your classroom with <strong>50% OFF</strong> Annual Professional Plan!</span>
        <div className="lp-countdown">
          Ends in:{" "}
          <span className="lp-timer-unit">{String(timeLeft.h).padStart(2, '0')}h</span>
          <span className="lp-timer-unit">{String(timeLeft.m).padStart(2, '0')}m</span>
          <span className="lp-timer-unit">{String(timeLeft.s).padStart(2, '0')}s</span>
        </div>
      </div>

      {/* ── HEADER ── */}
      <div className="lp-header-wrap">
        <header className="lp-header">
          <Link href="/" className="lp-logo">
            <div style={{ background: '#166534', minWidth: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
              </svg>
            </div>
            <span>Teachify<span className="logo-accent">AI</span></span>
          </Link>

          <nav className="lp-nav">
            <Link href="#features" className="lp-nav-link">Features</Link>
            <Link href="#pricing" className="lp-nav-link">Pricing</Link>
            <Link href="#about" className="lp-nav-link">Resources</Link>
          </nav>

          <div className="lp-auth-group">
            <Link href="/login" className="lp-btn-login">Login</Link>
            <Link href="/register" className="lp-btn-signup">Claim Your Free Account</Link>
          </div>
        </header>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-badge">
            ⭐ New Feature: Automated Grading
          </div>
          <h1 className="lp-hero-title">
            The Future of <span>Education</span> is Intelligent
          </h1>
          <p className="lp-hero-desc">
            Teachify AI is the all-in-one classroom assistant that automates the repetitive,
            so you can focus on the inspired. Designed by world-class educators.
          </p>
          <div className="lp-hero-actions">
            <Link href="/register" className="lp-hero-btn">
              Create Your Free Account — Takes 30 Seconds
            </Link>
          </div>
        </div>

        <div className="lp-hero-visual">
          <div style={{ position: 'relative' }}>
            <Image
              src="/futuristic_ai_teaching_landscape_1773021318200.png"
              width={800}
              height={800}
              alt="AI Teacher"
              className="lp-main-illustration"
            />
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section id="features" className="lp-features">
        <div className="lp-section-header">
          <h2>Experience Seamless <span>Teaching</span></h2>
          <p>A toolkit built specifically for the demands of the modern school.</p>
        </div>

        <div className="lp-bento-grid">
          <div className="lp-bento-card col-2 row-2" style={{ background: '#f0fdf4' }}>
            <div className="lp-bento-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            </div>
            <h3>AI Curriculum Planner</h3>
            <p>Generate entire semesters of high-quality lesson plans, syllabi, and learning paths with a single prompt. Optimized for state standards.</p>
          </div>

          <div className="lp-bento-card col-2" style={{ background: '#ecfdf5' }}>
            <div className="lp-bento-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" /></svg>
            </div>
            <h3>Automated Grading Ops</h3>
            <p>Upload handwritten or typed work and receive objective, standards-aligned feedback and scores instantly.</p>
          </div>

          <div className="lp-bento-card" style={{ background: '#fef3c7' }}>
            <h3>Smart Quiz Creator</h3>
            <p>Generate interactive quizzes from any material instantly.</p>
          </div>

          <div className="lp-bento-card" style={{ background: '#ffffff' }}>
            <h3>Insights Hub</h3>
            <p>Track student progress with real-time AI analytics.</p>
          </div>
        </div>
      </section>

      {/* ── CTA IMMERSIVE SECTION ── */}
      <section className="lp-cta-immersive">
        <div className="lp-cta-glass">
          <h2>Ready to transform your classroom?</h2>
          <p>Join the waitlist of 14,000+ educators leading the AI revolution.</p>
          <Link href="/register" className="lp-btn-signup" style={{ background: 'white', color: '#166534', padding: '20px 48px', fontSize: '18px', display: 'inline-block', textDecoration: 'none' }}>
            Start Teaching Smarter Today
          </Link>

          {/* Stats row inside Glass CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '60px', opacity: '0.8' }}>
            <div><strong style={{ fontSize: '24px', display: 'block' }}>1.2M+</strong> Quizzes</div>
            <div><strong style={{ fontSize: '24px', display: 'block' }}>14K+</strong> Teachers</div>
            <div><strong style={{ fontSize: '24px', display: 'block' }}>98%</strong> Time Saved</div>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer style={{ textAlign: 'center', padding: '60px 0', opacity: '0.5', fontSize: '14px' }}>
        © 2026 Teachify AI. All Rights Reserved. Education for the Future.
      </footer>
    </main>
  );
}
