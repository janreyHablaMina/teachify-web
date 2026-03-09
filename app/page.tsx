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
      <div className="lp-bg-extras">
        <div className="lp-bokeh bokeh-1" />
        <div className="lp-bokeh bokeh-2" />
        <div className="lp-pattern-overlay" />
      </div>
      <div className="lp-grain-overlay" />

      {/* ── COLORFUL FLOATING BG ICONS ── */}
      <div className="lp-bg-icons">
        {/* Pencil - Yellow */}
        <div className="lp-bg-icon bi-pencil-1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
        </div>
        {/* Book - Mint */}
        <div className="lp-bg-icon bi-book-1">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
        </div>
        {/* Ruler - Pink */}
        <div className="lp-bg-icon bi-ruler-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17l-5 5L2 7 7 2l15 15z" /><path d="M5 9l2 2" /><path d="M9 13l2 2" /><path d="M13 17l2 2" /></svg>
        </div>
        {/* Grad Cap - Indigo */}
        <div className="lp-bg-icon bi-cap-1">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
        </div>
        {/* Pencil 2 - Orange */}
        <div className="lp-bg-icon bi-pencil-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
        </div>
        {/* Calculator - Cyan */}
        <div className="lp-bg-icon bi-calc-1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="12" y2="18" /></svg>
        </div>
        {/* Clipboard - Rose */}
        <div className="lp-bg-icon bi-clip-1">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="15" y2="16" /></svg>
        </div>
        {/* Book 2 - Lime */}
        <div className="lp-bg-icon bi-book-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
        </div>
      </div>

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
          <div className="lp-app-panel">
            {/* Panel Header */}
            <div className="lp-panel-header">
              <div className="lp-panel-dots">
                <span /><span /><span />
              </div>
              <span className="lp-panel-title">Teachify AI · Classroom Dashboard</span>
              <span className="lp-panel-live">● Live</span>
            </div>

            {/* Panel Body */}
            <div className="lp-panel-body">

              {/* Row 1: Grading */}
              <div className="lp-panel-row">
                <div className="lp-panel-icon-wrap" style={{ background: '#f0fdf4' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" /></svg>
                </div>
                <div className="lp-panel-row-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="lp-panel-row-label">AI Grading</span>
                    <span className="lp-panel-tag" style={{ background: '#dcfce7', color: '#166534' }}>Analyzing</span>
                  </div>
                  <div className="lp-panel-row-text">Class_B_History.docx · 28 submissions</div>
                  <div className="lp-panel-row-bar"><div className="lp-panel-row-bar-fill" /></div>
                </div>
              </div>

              <div className="lp-panel-divider" />

              {/* Row 2: Smart Quiz */}
              <div className="lp-panel-row">
                <div className="lp-panel-icon-wrap" style={{ background: '#fef3c7' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                </div>
                <div className="lp-panel-row-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="lp-panel-row-label">Quiz Generated</span>
                    <span className="lp-panel-tag" style={{ background: '#fef3c7', color: '#b45309' }}>Ready</span>
                  </div>
                  <div className="lp-quiz-options">
                    <div className="lp-quiz-option" style={{ background: '#f8fafc', color: '#334155' }}><div className="opt-bullet" />Nucleus</div>
                    <div className="lp-quiz-option correct"><div className="opt-bullet" />Mitochondria</div>
                  </div>
                </div>
              </div>

              <div className="lp-panel-divider" />

              {/* Row 3: Stats */}
              <div className="lp-panel-stats">
                <div className="lp-panel-stat">
                  <span className="val">12K+</span>
                  <span className="lbl">Teachers</span>
                </div>
                <div className="lp-panel-stat">
                  <span className="val">98%</span>
                  <span className="lbl">Accuracy</span>
                </div>
                <div className="lp-panel-stat">
                  <span className="val">20h</span>
                  <span className="lbl">Saved/wk</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
