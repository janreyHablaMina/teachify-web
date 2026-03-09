import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="lp-hero-sketch">
      <div className="sketch-doodles-bg">
        <svg className="doodle d-star" viewBox="0 0 24 24" fill="none" stroke="#FDA4AF" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg className="doodle d-arrow" viewBox="0 0 24 24" fill="none" stroke="#99F6E4" strokeWidth="2">
          <path d="M5 12h14m-7-7 7 7-7 7" />
        </svg>
        <svg className="doodle d-circle" viewBox="0 0 24 24" fill="none" stroke="#FEF08A" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
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
          <div className="sketch-badge hl-teal">50% OFF FLASH SALE ENDING SOON</div>

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
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
                <Image src="/hero-sketch-1.png" alt="Teacher" fill style={{ objectFit: "cover" }} />
              </div>
              <span className="p-label">Designing Quiz...</span>
            </div>
            <div className="polaroid-sketch p-2">
              <div className="p-img-wrap">
                <Image src="/hero-sketch-2.png" alt="Teacher" fill style={{ objectFit: "cover" }} />
              </div>
              <span className="p-label">AI Grading Sheet</span>
            </div>
            <div className="tape-doodle" />
          </div>
        </div>
      </div>
    </section>
  );
}
