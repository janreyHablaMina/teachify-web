import Link from "next/link";

type Plan = {
  tag: string;
  title: string;
  price: string;
  priceUnit?: string;
  description: string;
  features: string[];
  limitations?: string[];
  className: string;
  cta: {
    href: string;
    label: string;
    solid?: boolean;
  };
  popular?: boolean;
};

const plans: Plan[] = [
  {
    tag: "TRIAL",
    title: "Free Plan",
    price: "Free",
    description:
      "Perfect for teachers who want to try Teachify AI and experience how AI can generate quizzes automatically.",
    features: [
      "3 AI quiz generations (total)",
      "Up to 10 questions per quiz",
      "Multiple choice questions",
      "Basic quiz export (PDF)",
      "Access to quiz generator",
    ],
    limitations: ["No classroom features", "No document upload", "Limited quiz generations"],
    className: "note-free",
    cta: { href: "/register", label: "Start Free", solid: false },
  },
  {
    tag: "QUIZ GENERATOR",
    title: "Basic Plan",
    price: "$7",
    priceUnit: "/month",
    description:
      "Ideal for teachers who only need AI-powered quiz generation without classroom management.",
    features: [
      "50 quizzes per month",
      "Up to 50 questions per quiz",
      "Multiple choice, True/False, Short answer, Essay",
      "Document -> Quiz generation (PDF, DOCX, PPTX)",
      "Quiz export (PDF, DOCX)",
      "Question difficulty control",
      "Question bank (save questions)",
    ],
    limitations: ["No classroom management", "No student assignments", "No analytics"],
    className: "note-basic",
    cta: { href: "/register", label: "Choose Basic", solid: false },
  },
  {
    tag: "CLASSROOM SYSTEM",
    title: "Pro Plan",
    price: "$14",
    priceUnit: "/month",
    description:
      "A complete AI teaching assistant for teachers who want to create quizzes, manage classrooms, and track student performance.",
    features: [
      "Everything in Basic, plus:",
      "200 quizzes per month",
      "Up to 50 questions per quiz",
      "Classroom creation and student join codes",
      "Quiz assignments, deadlines, and submissions",
      "Auto-grading for objective questions",
      "Essay grading review",
      "Student performance analytics",
      "Randomized questions and anti-cheat mode",
      "Teacher dashboard",
    ],
    className: "note-pro",
    cta: { href: "/register", label: "Get Pro", solid: true },
    popular: true,
  },
  {
    tag: "INSTITUTION",
    title: "School Plan",
    price: "$59",
    priceUnit: "/month",
    description:
      "Designed for schools and institutions that want to provide AI teaching tools to multiple teachers and classrooms.",
    features: [
      "Everything in Pro, plus:",
      "Up to 20 teachers",
      "Up to 1000 quizzes per month (shared)",
      "Up to 50 questions per quiz",
      "Unlimited classrooms",
      "School admin dashboard",
      "Shared question bank for teachers",
      "School branding (logo and name)",
      "Student management",
      "School-level analytics",
      "Priority AI processing",
    ],
    className: "note-school",
    cta: { href: "/contact", label: "Contact Sales", solid: false },
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="lp-pricing-lab">
      <div className="sketch-canvas">
        <div className="pricing-lab-head">
          <span className="sketch-badge hl-yellow">PRICING</span>
          <h2 className="pricing-lab-title">
            Choose the plan that fits your <br />
            <span className="hl-pink-text">teaching workflow.</span>
          </h2>
        </div>

        <div className="pricing-lab-board">
          {plans.map((plan) => (
            <article className={`pricing-note ${plan.className}`} key={plan.title}>
              {plan.popular ? <div className="note-popular">MOST POPULAR</div> : null}
              <span className="note-tag">{plan.tag}</span>
              <h3>{plan.title}</h3>
              <div className="note-price">
                <strong>{plan.price}</strong>
                {plan.priceUnit ? <span>{plan.priceUnit}</span> : null}
              </div>
              <p className="note-desc">{plan.description}</p>

              <div className="note-block">
                <h4>Features</h4>
                <ul className="note-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              {plan.limitations?.length ? (
                <div className="note-block note-block-limitations">
                  <h4>Limitations</h4>
                  <ul className="note-list note-list-limitations">
                    {plan.limitations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <Link href={plan.cta.href} className={`note-btn ${plan.cta.solid ? "note-btn-solid" : "note-btn-outline"}`}>
                {plan.cta.label}
              </Link>
            </article>
          ))}
        </div>

        <div className="pricing-lab-strip">
          <div className="strip-title">Included Across All Plans</div>
          <div className="strip-items">
            <span>AI-powered quiz generation</span>
            <span>Teacher-first UX</span>
            <span>Secure account access</span>
            <span>Continuous platform improvements</span>
          </div>
        </div>

        <div className="pricing-lab-hint">
          <span>Tip:</span> Start Free, move to Basic for regular quiz creation, then upgrade to Pro or School as classroom scale grows.
        </div>
      </div>
    </section>
  );
}
