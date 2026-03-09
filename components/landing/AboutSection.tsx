import Link from "next/link";

export default function AboutSection() {
  return (
    <section id="about" className="about-sketch">
      <div className="sketch-canvas">
        <div className="about-sketch-head">
          <span className="sketch-badge hl-purple">ABOUT TEACHIFY AI</span>
          <h2 className="about-sketch-title">
            Built to give teachers back
            <br />
            <span className="hl-yellow-text">time, energy, and focus.</span>
          </h2>
          <p className="about-sketch-sub">
            Teachify helps educators generate lessons, quizzes, and classroom-ready resources in minutes so they can
            spend less time on admin and more time on impact.
          </p>
        </div>

        <div className="about-sketch-board">
          <div className="about-story-card">
            <span className="about-mini-tag">OUR MISSION</span>
            <p>
              Turn every teacher into a high-impact creator with AI tools that are practical, fast, and built for real
              classrooms.
            </p>
            <Link href="/register" className="sketch-btn-primary hl-yellow">
              Start Teaching Smarter
            </Link>
          </div>

          <div className="about-stats-card">
            <div className="about-stat-item">
              <strong>12K+</strong>
              <span>Teachers Supported</span>
            </div>
            <div className="about-stat-item">
              <strong>500K+</strong>
              <span>Quizzes Generated</span>
            </div>
            <div className="about-stat-item">
              <strong>20h</strong>
              <span>Avg Weekly Time Saved</span>
            </div>
          </div>
        </div>

        <div className="about-sketch-values">
          <div className="about-value-card hl-teal">
            <h3>Practical by Design</h3>
            <p>Built around what teachers actually do: plan, assign, grade, and improve.</p>
          </div>
          <div className="about-value-card hl-pink">
            <h3>Classroom-First UX</h3>
            <p>Simple workflows that reduce friction and keep focus on student outcomes.</p>
          </div>
          <div className="about-value-card hl-yellow">
            <h3>Always Improving</h3>
            <p>Shipped fast with educator feedback so the platform evolves with real needs.</p>
          </div>
        </div>

        <div className="about-sketch-tags">
          <div className="about-tag">
            <span className="dot" />
            AI Lesson Generator
          </div>
          <div className="about-tag">
            <span className="dot" />
            Document to Quiz
          </div>
          <div className="about-tag">
            <span className="dot" />
            Auto-Grading
          </div>
          <div className="about-tag">
            <span className="dot" />
            Analytics Dashboard
          </div>
        </div>
      </div>
    </section>
  );
}
