import Image from "next/image";
import Link from "next/link";

export default function FeaturesSection() {
  return (
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
            We didn&apos;t just build another AI. We built a digital co-pilot for your classroom.
            Move from admin to inspiration in seconds.
          </p>
        </div>

        <div className="sketch-features-grid">
          <div className="sketch-feature-card f-1">
            <div className="s-card-img">
              <Image src="/category-classroom.png" alt="Quiz Creator" fill style={{ objectFit: "cover" }} />
              <div className="s-card-tag hl-pink">NEW VERSION</div>
            </div>
            <div className="s-card-content">
              <h3>Quiz Architect</h3>
              <p>Drop a PDF or YouTube link and get a fully formatted, multi-level quiz in under 30 seconds.</p>
              <Link href="/teacher/generate" className="s-card-link">
                Try Architect <span className="arrow">→</span>
              </Link>
            </div>
            <div className="s-card-scribble hl-yellow" />
          </div>

          <div className="sketch-feature-card f-2">
            <div className="s-card-img">
              <Image src="/category-student.png" alt="Lesson Plan" fill style={{ objectFit: "cover" }} />
              <div className="s-card-tag hl-teal">AI POWERED</div>
            </div>
            <div className="s-card-content">
              <h3>Lesson Navigator</h3>
              <p>Stop staring at blank pages. Get creative lesson structures tailored to your specific curriculum.</p>
              <Link href="/teacher/classes" className="s-card-link">
                View Projects <span className="arrow">→</span>
              </Link>
            </div>
            <div className="s-card-scribble hl-pink" />
          </div>

          <div className="sketch-feature-card f-3">
            <div className="s-card-img">
              <Image src="/blog-analytics-hologram.png" alt="Analytics" fill style={{ objectFit: "cover" }} />
            </div>
            <div className="s-card-content">
              <h3>Instant Insights</h3>
              <p>See exactly where your students are struggling with auto-generated analytics from every assignment.</p>
              <Link href="/teacher/quizzes" className="s-card-link">
                See Data <span className="arrow">→</span>
              </Link>
            </div>
            <div className="s-card-scribble hl-yellow" />
          </div>
        </div>

        <div className="sketch-annotation-wrap">
          <svg className="sketch-annotation-arrow" width="80" height="40" viewBox="0 0 100 50">
            <path d="M10,10 Q50,60 90,10 M90,10 L80,15 M90,10 L85,0" stroke="var(--ink-teal)" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
