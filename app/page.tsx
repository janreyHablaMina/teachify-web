"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "./landing.css";

// ── Count-up hook ──
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

export default function Home() {
  // Slide state
  const [slide, setSlide] = useState(0);
  const slides = [
    { img: "/hero-teacher-1.png", label: "AI Lesson Plans", sub: "Generated in 30 seconds" },
    { img: "/hero-teacher-2.png", label: "Smart Grading", sub: "Save 20 hours per week" },
  ];
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Sales Countdown Hook
  const [timeLeft, setTimeLeft] = useState({ hours: 24, mins: 0, secs: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stats counter
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
  const c1 = useCountUp(12000, 1800, statsVisible);
  const c2 = useCountUp(500000, 2000, statsVisible);
  const c3 = useCountUp(20, 1500, statsVisible);
  const c4 = useCountUp(98, 1600, statsVisible);

  // Blog data
  const blogPosts = [
    { id: 1, title: "The Future of AI in Modern Classrooms", excerpt: "Discover how Teachify is changing the way teachers approach lesson planning and grading.", date: "March 15, 2026", image: "/blog-ai-assistant.png", category: "AI & Innovation" },
    { id: 2, title: "Empowering Students with Digital Literacy", excerpt: "Learn how to integrate tech in a way that truly benefits student learning and collaboration.", date: "March 12, 2026", image: "/blog-students-tech.png", category: "Education Policy" },
    { id: 3, title: "A Data-Driven Approach to Student Performance", excerpt: "Using analytics to understand where each student needs more support in real-time.", date: "March 10, 2026", image: "/blog-analytics-hologram.png", category: "Analytics" },
  ];

  return (
    <main className="lp-root">
      <div className="sketch-fixed-top">
        {/* ── SALES BANNER ── */}
        <div className="sketch-sale-wrap">
          <div className="sketch-canvas">
            <div className="lp-sale-banner-sketch">
              <div className="sale-content-wrap">
                <span className="sale-badge">SEASON SALE</span>
                <span className="sale-msg">Grab 50% OFF Teachify Pro — <strong>Limited Teachers only!</strong></span>
              </div>
              <div className="sale-countdown-sketch">
                <div className="c-box-sketch">{String(timeLeft.hours).padStart(2, '0')}<span>h</span></div>
                <div className="c-box-sketch">{String(timeLeft.mins).padStart(2, '0')}<span>m</span></div>
                <div className="c-box-sketch">{String(timeLeft.secs).padStart(2, '0')}<span>s</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── HEADER ── */}
        <div className="lp-header-pill-wrap">
          <div className="sketch-canvas">
            <header className="lp-header-pill sketch-header-style">
              <Link href="/" className="lp-logo-pill">
                <div className="lp-logo-icon-sketch">
                  <svg width="40" height="40" viewBox="0 0 200 200" fill="none">
                    <defs>
                      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38b2ac" />
                        <stop offset="100%" stopColor="#2d3748" />
                      </linearGradient>
                    </defs>
                    <path d="M70 140 Q70 160 100 160 Q130 160 130 140" stroke="url(#logoGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <line x1="80" y1="170" x2="120" y2="170" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" />
                    <line x1="85" y1="182" x2="115" y2="182" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" />
                    <path d="M60 90 C60 50 140 50 140 90 C140 120 120 130 115 145 L85 145 C80 130 60 120 60 90Z" stroke="url(#logoGrad)" strokeWidth="8" fill="none" strokeLinejoin="round" />
                    <path d="M40 85 L100 65 L160 85 L100 105 Z" fill="url(#logoGrad)" />
                    <path d="M100 105 L100 115 C100 125 100 125 100 115" stroke="url(#logoGrad)" strokeWidth="4" />
                    <path d="M160 85 L160 110" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="160" cy="115" r="4" fill="url(#logoGrad)" />
                    <path d="M100 115 L100 135 M90 125 L110 125" stroke="url(#logoGrad)" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="logo-text">Teachify<span className="sketch-pink">AI</span></span>
              </Link>

              <nav className="lp-nav-sketch">
                <Link href="#features" className="sketch-link">Features</Link>
                <Link href="#blog" className="sketch-link">Blog</Link>
                <Link href="/pricing" className="sketch-link sale-hl">Sale!</Link>
              </nav>

              <div className="lp-auth-sketch">
                <Link href="/login" className="login-sketch">Login</Link>
                <div className="sketch-cta-wrap">
                  <Link href="/register" className="sketch-cta-head hl-yellow">Get Pro</Link>
                  <svg className="cta-sketch-arrow" width="40" height="20" viewBox="0 0 40 20">
                    <path d="M5,10 Q20,0 35,10 M35,10 L30,5 M35,10 L30,15" stroke="var(--ink-primary)" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
            </header>
          </div>
        </div>
      </div>

      {/* ── COLORFUL SKETCH HERO SECTION ── */}
      <section className="lp-hero-sketch">
        {/* Background Layers */}
        <div className="sketch-doodles-bg">
          <svg className="doodle d-star" viewBox="0 0 24 24" fill="none" stroke="#FDA4AF" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          <svg className="doodle d-arrow" viewBox="0 0 24 24" fill="none" stroke="#99F6E4" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          <svg className="doodle d-circle" viewBox="0 0 24 24" fill="none" stroke="#FEF08A" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
          <svg className="doodle d-pencil" viewBox="0 0 64 64" fill="none">
            <rect x="9" y="32" width="35" height="10" rx="3" fill="#FCD34D" stroke="#0F172A" strokeWidth="2" transform="rotate(-25 9 32)" />
            <rect x="38" y="28" width="8" height="10" fill="#F9A8D4" stroke="#0F172A" strokeWidth="2" transform="rotate(-25 38 28)" />
            <path d="M45 25 L56 23 L51 33 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
            <circle cx="52" cy="28" r="1.8" fill="#0F172A" />
          </svg>
          <svg className="doodle d-book" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="14" width="22" height="36" rx="4" fill="#A7F3D0" stroke="#0F172A" strokeWidth="2.2" />
            <rect x="30" y="14" width="26" height="36" rx="4" fill="#BFDBFE" stroke="#0F172A" strokeWidth="2.2" />
            <path d="M30 14V50" stroke="#0F172A" strokeWidth="2.2" />
            <path d="M16 24H24M36 24H48" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg className="doodle d-ruler" viewBox="0 0 72 32" fill="none">
            <rect x="2" y="6" width="68" height="20" rx="5" fill="#FECACA" stroke="#0F172A" strokeWidth="2" />
            <path d="M10 11V22M18 11V18M26 11V22M34 11V18M42 11V22M50 11V18M58 11V22" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg className="doodle d-spark" viewBox="0 0 32 32" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round">
            <path d="M16 4V11M16 21V28M4 16H11M21 16H28M8 8L12 12M20 20L24 24M24 8L20 12M12 20L8 24" />
          </svg>
        </div>

        <div className="lp-hero-v3-container">
          <div className="lp-hero-v3-left">
            <div className="sketch-badge hl-teal">
              🔥 50% OFF FLASH SALE ENDING SOON
            </div>

            <h1 className="lp-hero-v3-title">
              Teach Less Admin. <br />
              <div className="highlighter-sweep hl-pink">
                <span className="sketch-accent-text">Inspire</span>
              </div>
              &nbsp;More.
              <svg className="sketch-underline" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M5,15 Q50,5 100,15 T195,15" stroke="#4F46E5" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </h1>

            <p className="lp-hero-v3-desc">
              Stop fighting with paperwork. Use <span className="hl-yellow-text">AI that actually understands</span> education.
              Built by teachers, for the future of learning.
            </p>

            <div className="lp-hero-v3-actions">
              <Link href="/register" className="sketch-btn-primary hl-teal">
                Claim My Discount
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
              </Link>
              <button className="sketch-btn-secondary">
                See it in action
                <div className="scribble-circle-teal" />
              </button>
            </div>
          </div>

          <div className="lp-hero-v3-right">
            <div className="sketch-polaroid-stack">
              <div className="polaroid-sketch p-1">
                <div className="p-img-wrap">
                  <Image src="/hero-sketch-1.png" alt="Teacher" fill style={{ objectFit: 'cover' }} />
                </div>
                <span className="p-label">Designing Quiz...</span>
              </div>
              <div className="polaroid-sketch p-2">
                <div className="p-img-wrap">
                  <Image src="/hero-sketch-2.png" alt="Teacher" fill style={{ objectFit: 'cover' }} />
                </div>
                <span className="p-label">AI Grading Sheet</span>
              </div>
              <div className="tape-doodle" />
            </div>
          </div>
        </div>
      </section>

      {/* ── COLORFUL SKETCH FEATURES SECTION ── */}
      <section id="features" className="lp-features-sketch">
        <div className="sketch-canvas">
          <div className="features-intro">
            <span className="sketch-badge hl-purple">WHAT YOU CAN DO</span>
            <h2 className="sketch-section-title">
              Tools that actually <br />
              <div className="highlighter-sweep hl-teal">
                <span className="sketch-accent-text">Save Time.</span>
              </div>
            </h2>
            <p className="sketch-section-desc">
              We didn't just build another AI. We built a digital co-pilot for your classroom.
              Move from admin to inspiration in seconds.
            </p>
          </div>

          <div className="sketch-features-grid">
            {/* Feature 1 */}
            <div className="sketch-feature-card f-1">
              <div className="s-card-img">
                <Image src="/category-classroom.png" alt="Quiz Creator" fill style={{ objectFit: 'cover' }} />
                <div className="s-card-tag hl-pink">NEW VERSION</div>
              </div>
              <div className="s-card-content">
                <h3>Quiz Architect</h3>
                <p>Drop a PDF or YouTube link and get a fully formatted, multi-level quiz in under 30 seconds.</p>
                <Link href="/teacher/generate" className="s-card-link">Try Architect <span className="arrow">→</span></Link>
              </div>
              <div className="s-card-scribble hl-yellow" />
            </div>

            {/* Feature 2 */}
            <div className="sketch-feature-card f-2">
              <div className="s-card-img">
                <Image src="/category-student.png" alt="Lesson Plan" fill style={{ objectFit: 'cover' }} />
                <div className="s-card-tag hl-teal">AI POWERED</div>
              </div>
              <div className="s-card-content">
                <h3>Lesson Navigator</h3>
                <p>Stop staring at blank pages. Get creative lesson structures tailored to your specific curriculum.</p>
                <Link href="/teacher/classes" className="s-card-link">View Projects <span className="arrow">→</span></Link>
              </div>
              <div className="s-card-scribble hl-pink" />
            </div>

            {/* Feature 3 */}
            <div className="sketch-feature-card f-3">
              <div className="s-card-img">
                <Image src="/blog-analytics-hologram.png" alt="Analytics" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="s-card-content">
                <h3>Instant Insights</h3>
                <p>See exactly where your students are struggling with auto-generated analytics from every assignment.</p>
                <Link href="/teacher/quizzes" className="s-card-link">See Data <span className="arrow">→</span></Link>
              </div>
              <div className="s-card-scribble hl-yellow" />
            </div>
          </div>

          {/* Decorative Doodle Annotation */}
          <div className="sketch-annotation-wrap">
            <svg className="sketch-annotation-arrow" width="80" height="40" viewBox="0 0 100 50">
              <path d="M10,10 Q50,60 90,10 M90,10 L80,15 M90,10 L85,0" stroke="var(--ink-teal)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>


      {/* ── SKETCH TESTIMONIALS ── */}
      <section className="lp-testimonials-sketch">
        <div className="sketch-canvas">
          <div className="testi-intro">
            <h3 className="sketch-section-title">What the <span className="sketch-accent-text">Staff Room</span> is saying...</h3>
          </div>

          <div className="sketch-testi-grid">
            <div className="sketch-testi-bubble b-1">
              <p className="testi-quote">"I finished my entire week's lesson planning in 10 minutes. Honestly, it feels like cheating, but my students love the quizzes!"</p>
              <div className="testi-author">— Sarah J., 10th Grade History</div>
            </div>
            <div className="sketch-testi-bubble b-2 hl-teal">
              <p className="testi-quote">"The grading scanner is a lifesaver. No more Sunday nights at the dining table with a red pen."</p>
              <div className="testi-author">— Marcus T., Math Lead</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKETCH FOOTER ── */}
      <footer className="lp-footer-sketch">
        <div className="sketch-canvas">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo-text">Teachify<span className="sketch-pink">AI</span></div>
              <p>Reimagining education through <br />creative AI automation.</p>
            </div>
            <div className="footer-links-grid">
              <div className="footer-col">
                <h4>Product</h4>
                <Link href="#features">Features</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href="/blog">Blog</Link>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="sketch-credit">Made with ✏️ and ❤️ by Teachers for Teachers.</p>
            <div className="footer-socials">
              <span className="social-scribble">Follow us for updates</span>
            </div>
          </div>
        </div>
      </footer>
    </main >
  );
}
