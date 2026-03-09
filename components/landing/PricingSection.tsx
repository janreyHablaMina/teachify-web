import Link from "next/link";

export default function PricingSection() {
  return (
    <section id="pricing" className="lp-pricing-lab">
      <div className="sketch-canvas">
        <div className="pricing-lab-head">
          <span className="sketch-badge hl-yellow">SUBSCRIPTION MODEL</span>
          <h2 className="pricing-lab-title">
            Build your classroom stack, <br />
            <span className="hl-pink-text">not just a payment plan.</span>
          </h2>
        </div>

        <div className="pricing-lab-board">
          <article className="pricing-note note-quiz">
            <span className="note-tag">STARTER</span>
            <h3>Quiz Generator</h3>
            <div className="note-price">
              <strong>$5</strong>
              <span>/mo</span>
            </div>
            <ul className="note-list">
              <li>AI quiz generation</li>
              <li>Document upload</li>
              <li>Export support</li>
            </ul>
            <Link href="/register" className="note-btn note-btn-outline">
              Start Quiz Plan
            </Link>
          </article>

          <article className="pricing-note note-classroom">
            <div className="note-popular">MOST POPULAR</div>
            <span className="note-tag">PRO</span>
            <h3>Classroom</h3>
            <div className="note-price">
              <strong>$12</strong>
              <span>/mo</span>
            </div>
            <ul className="note-list">
              <li>Lesson + quiz generation</li>
              <li>Classroom tools and assignments</li>
              <li>Analytics dashboard</li>
            </ul>
            <Link href="/register" className="note-btn note-btn-solid">
              Get Classroom Plan
            </Link>
          </article>

          <article className="pricing-note note-school">
            <span className="note-tag">SCALE</span>
            <h3>School (Future)</h3>
            <div className="note-price">
              <strong>$49</strong>
              <span>/mo</span>
            </div>
            <ul className="note-list">
              <li>Multi-teacher support</li>
              <li>Advanced analytics</li>
              <li>Institution management</li>
            </ul>
            <Link href="/contact" className="note-btn note-btn-outline">
              Join Waitlist
            </Link>
          </article>
        </div>

        <div className="pricing-lab-strip">
          <div className="strip-title">Included Across All Plans</div>
          <div className="strip-items">
            <span>Teacher-first UX</span>
            <span>Fast generation workflow</span>
            <span>Secure account access</span>
            <span>Continuous improvements</span>
          </div>
        </div>

        <div className="pricing-lab-hint">
          <span>Tip:</span> Start with Quiz Generator, then upgrade to Classroom once you begin assigning work at scale.
        </div>
      </div>
    </section>
  );
}
