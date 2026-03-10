import Link from "next/link";
import "./backdrop.css";

export default function RegisterPage() {
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

          <form className="rg-form-body">
            <div className="rg-input-group rg-full">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" placeholder="Alex Johnson" />
            </div>

            <div className="rg-input-group rg-full">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" placeholder="teacher@school.edu" type="email" />
            </div>

            <div className="rg-input-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" placeholder="Enter password" type="password" />
            </div>

            <div className="rg-input-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" placeholder="Confirm password" type="password" />
            </div>

            <button type="button" className="rg-primary-btn rg-full">
              Create account
            </button>

            <p className="rg-disclaimer rg-full">By continuing, you agree to Teachify terms and privacy policy.</p>
          </form>

          <p className="rg-footer-text">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
