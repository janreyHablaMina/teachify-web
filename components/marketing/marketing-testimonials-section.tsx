import { testimonials } from "./data";

const testimonialTone: Record<string, string> = {
  yellow: "bg-yellow-200 rotate-[-2deg]",
  teal: "bg-teal-200 rotate-[1.5deg]",
  pink: "bg-rose-200 rotate-[-1deg]",
};

type MarketingTestimonialsSectionProps = {
  gochiClassName: string;
};

export function MarketingTestimonialsSection({ gochiClassName }: MarketingTestimonialsSectionProps) {
  return (
    <section id="testimonials" className="border-b-2 border-slate-900 bg-[#f8fafc] px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[0_5px_0_#ddd6fe]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 bg-violet-100">
              <svg className="h-2.5 w-2.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5.5 13.8 10 18.8 10.3 14.9 13.4 16.2 18.2 12 15.4 7.8 18.2 9.1 13.4 5.2 10.3 10.2 10z" />
              </svg>
            </span>
            <span>TEACHER STORIES</span>
          </span>
          <h2 className="mt-6 text-[34px] font-black leading-[1.08] tracking-[-0.03em] sm:text-[56px]">
            What the <span className={`${gochiClassName} font-normal text-rose-300`}>staff room</span> is saying.
          </h2>
        </div>

        <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.author}
              className={`relative flex min-h-[280px] flex-col justify-center border border-black/5 p-8 shadow-[10px_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:z-10 sm:aspect-square sm:p-10 ${testimonialTone[item.tone]}`}
            >
              <span aria-hidden="true" className="absolute -top-2.5 left-1/2 h-5 w-[60px] -translate-x-1/2 rotate-[2deg] border border-slate-900/25 bg-yellow-200/75" />
              <p className={`${gochiClassName} text-[22px] leading-[1.4] text-slate-900`}>{item.quote}</p>
              <p className="mt-6 text-[13px] font-extrabold uppercase tracking-[0.05em] text-slate-700/70">- {item.author}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
