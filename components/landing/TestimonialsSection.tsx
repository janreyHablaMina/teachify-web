const testimonials = [
  {
    quote:
      "I finished my entire week's lesson planning in 10 minutes. It feels unfair in the best way.",
    author: "Sarah J., 10th Grade History",
    toneClass: "hl-yellow",
  },
  {
    quote: "The grading scanner gave me my Sunday evenings back. That alone made Teachify worth it.",
    author: "Marcus T., Math Lead",
    toneClass: "hl-teal",
  },
  {
    quote:
      "My quizzes are clearer, faster to build, and students are actually asking for another round.",
    author: "Ariana P., Science Department",
    toneClass: "hl-pink",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="lp-testimonials-sketch">
      <div className="sketch-canvas">
        <div className="testi-intro">
          <span className="sketch-badge hl-purple">TEACHER STORIES</span>
          <h2 className="sketch-section-title">
            What the <span className="sketch-accent-text">staff room</span> is saying.
          </h2>
        </div>

        <div className="sketch-testi-grid">
          {testimonials.map((item) => (
            <article className={`sticky-note ${item.toneClass}`} key={item.author}>
              <span className="tape-doodle mini" aria-hidden="true" />
              <p>{item.quote}</p>
              <div className="s-author">- {item.author}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
