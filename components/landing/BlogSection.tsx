import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Modern Classrooms",
    excerpt: "Discover how Teachify is changing the way teachers approach lesson planning and grading.",
    date: "March 15, 2026",
    image: "/blog-ai-assistant.png",
    category: "AI & Innovation",
    href: "/blog/ai-modern-classrooms",
  },
  {
    id: 2,
    title: "Empowering Students with Digital Literacy",
    excerpt: "Practical ways to integrate classroom tech that actually improves collaboration and confidence.",
    date: "March 12, 2026",
    image: "/blog-students-tech.png",
    category: "Education Policy",
    href: "/blog/digital-literacy",
  },
  {
    id: 3,
    title: "A Data-Driven Approach to Student Performance",
    excerpt: "Use quiz analytics to spot weak topics early and adapt instruction before students fall behind.",
    date: "March 10, 2026",
    image: "/blog-analytics-hologram.png",
    category: "Analytics",
    href: "/blog/data-driven-performance",
  },
];

export default function BlogSection() {
  const [feature, leftCard, rightCard] = blogPosts;

  return (
    <section id="blog" className="lp-blog-zine">
      <div className="sketch-canvas">
        <div className="blog-zine-head">
          <span className="sketch-badge hl-teal">FROM THE STAFF ROOM</span>
          <h2 className="blog-zine-title">
            Fresh ideas for modern <span className="hl-pink-text">teaching teams.</span>
          </h2>
        </div>

        <div className="blog-zine-layout">
          <article className="blog-feature-card">
            <div className="blog-feature-media">
              <Image src={feature.image} alt={feature.title} fill style={{ objectFit: "cover" }} />
              <span className="blog-chip">{feature.category}</span>
            </div>
            <div className="blog-feature-content">
              <span className="blog-feature-date">{feature.date}</span>
              <h3>{feature.title}</h3>
              <p>{feature.excerpt}</p>
              <Link href={feature.href} className="blog-zine-link">
                Read the full story <span>→</span>
              </Link>
            </div>
          </article>

          <div className="blog-side-stack">
            <article className="blog-side-card card-left">
              <div className="blog-side-media">
                <Image src={leftCard.image} alt={leftCard.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="blog-side-body">
                <div className="blog-side-meta">
                  <span>{leftCard.category}</span>
                  <span>{leftCard.date}</span>
                </div>
                <h4>{leftCard.title}</h4>
                <p>{leftCard.excerpt}</p>
                <Link href={leftCard.href} className="blog-zine-link small">
                  Read article <span>→</span>
                </Link>
              </div>
            </article>

            <article className="blog-side-card card-right">
              <div className="blog-side-media">
                <Image src={rightCard.image} alt={rightCard.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="blog-side-body">
                <div className="blog-side-meta">
                  <span>{rightCard.category}</span>
                  <span>{rightCard.date}</span>
                </div>
                <h4>{rightCard.title}</h4>
                <p>{rightCard.excerpt}</p>
                <Link href={rightCard.href} className="blog-zine-link small">
                  Read article <span>→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
