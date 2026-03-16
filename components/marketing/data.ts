import type { BlogPost, Feature, Plan, Testimonial } from "./types";

export const features: Feature[] = [
  {
    title: "Quiz Architect",
    description: "Drop a PDF or YouTube link and get a fully formatted multi-level quiz in under 30 seconds.",
    href: "/teacher/generate",
    tag: "NEW VERSION",
    tagTone: "pink",
    image: "/category-classroom.png",
  },
  {
    title: "Lesson Navigator",
    description: "Stop staring at blank pages. Get creative lesson structures tailored to your specific curriculum.",
    href: "/teacher/classes",
    tag: "AI POWERED",
    tagTone: "teal",
    image: "/category-student.png",
  },
  {
    title: "Instant Insights",
    description: "See where students are struggling with auto-generated analytics from every assignment.",
    href: "/teacher/quizzes",
    image: "/blog-analytics-hologram.png",
  },
];

export const plans: Plan[] = [
  {
    tag: "TRIAL",
    title: "Free Plan",
    price: "Free",
    description: "Great for teachers who want to try Teachify AI and experience automatic quiz generation.",
    features: [
      "3 AI quiz generations total",
      "Up to 10 questions per quiz",
      "Multiple choice questions",
      "Basic PDF export",
    ],
    limitations: ["No classroom features", "No document upload"],
    tone: "yellow",
    ctaHref: "/register",
    ctaLabel: "Start Free",
  },
  {
    tag: "QUIZ GENERATOR",
    title: "Basic Plan",
    price: "$7",
    unit: "/month",
    description: "Ideal for teachers who need AI quiz generation without classroom management.",
    features: [
      "50 quizzes per month",
      "Up to 50 questions per quiz",
      "Document to quiz generation",
      "Question bank",
    ],
    limitations: ["No classroom management", "No analytics"],
    tone: "teal",
    ctaHref: "/register",
    ctaLabel: "Choose Basic",
  },
  {
    tag: "CLASSROOM SYSTEM",
    title: "Pro Plan",
    price: "$14",
    unit: "/month",
    description: "Complete AI assistant for teachers who manage quizzes, classrooms, and performance.",
    features: [
      "Everything in Basic",
      "200 quizzes per month",
      "Classroom creation + join codes",
      "Assignments and grading",
      "Student performance analytics",
    ],
    tone: "pink",
    popular: true,
    ctaHref: "/register",
    ctaLabel: "Get Pro",
    ctaSolid: true,
  },
  {
    tag: "INSTITUTION",
    title: "School Plan",
    price: "$59",
    unit: "/month",
    description: "For schools that want AI teaching tools across multiple teachers and classrooms.",
    features: [
      "Up to 20 teachers",
      "Up to 1000 quizzes per month",
      "Unlimited classrooms",
      "School admin dashboard",
      "Priority AI processing",
    ],
    tone: "purple",
    ctaHref: "/contact",
    ctaLabel: "Contact Sales",
  },
];

export const blogPosts: BlogPost[] = [
  {
    title: "The Future of AI in Modern Classrooms",
    excerpt: "Discover how Teachify is changing lesson planning and grading.",
    date: "March 15, 2026",
    image: "/blog-ai-assistant.png",
    category: "AI & Innovation",
    href: "/blog/ai-modern-classrooms",
  },
  {
    title: "Empowering Students with Digital Literacy",
    excerpt: "Practical ways to integrate classroom tech that improves confidence.",
    date: "March 12, 2026",
    image: "/blog-students-tech.png",
    category: "Education Policy",
    href: "/blog/digital-literacy",
  },
  {
    title: "A Data-Driven Approach to Student Performance",
    excerpt: "Use quiz analytics to spot weak topics early.",
    date: "March 10, 2026",
    image: "/blog-analytics-hologram.png",
    category: "Analytics",
    href: "/blog/data-driven-performance",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "I finished my entire week's lesson planning in 10 minutes.",
    author: "Sarah J., 10th Grade History",
    tone: "yellow",
  },
  {
    quote: "The grading scanner gave me my Sunday evenings back.",
    author: "Marcus T., Math Lead",
    tone: "teal",
  },
  {
    quote: "My quizzes are clearer, faster to build, and students ask for more.",
    author: "Ariana P., Science Department",
    tone: "pink",
  },
];

export const impactStats = [
  { value: 12450, label: "Teachers Using Teachify", tag: "Active Educators", suffix: "+", tone: "yellow" },
  { value: 508200, label: "Quizzes Generated", tag: "Assessment Output", suffix: "+", tone: "teal" },
  { value: 19750, label: "Hours Saved Monthly", tag: "Time Saved", suffix: "+", tone: "pink" },
  { value: 860, label: "Schools Onboarded", tag: "School Partners", suffix: "+", tone: "purple" },
];
