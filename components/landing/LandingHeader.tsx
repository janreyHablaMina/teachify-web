import Link from "next/link";

export default function LandingHeader() {
  return (
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
            <span className="logo-text">
              Teachify<span className="sketch-pink">AI</span>
            </span>
          </Link>

          <nav className="lp-nav-sketch">
            <Link href="#features" className="sketch-link">
              Features
            </Link>
            <Link href="#blog" className="sketch-link">
              Blog
            </Link>
            <Link href="/pricing" className="sketch-link sale-hl">
              Sale!
            </Link>
          </nav>

          <div className="lp-auth-sketch">
            <Link href="/login" className="login-sketch">
              Login
            </Link>
            <div className="sketch-cta-wrap">
              <Link href="/register" className="sketch-cta-head hl-yellow">
                Get Pro
              </Link>
              <svg className="cta-sketch-arrow" width="40" height="20" viewBox="0 0 40 20">
                <path d="M5,10 Q20,0 35,10 M35,10 L30,5 M35,10 L30,15" stroke="var(--ink-primary)" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
