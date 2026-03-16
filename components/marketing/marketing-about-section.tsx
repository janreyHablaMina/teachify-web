import Link from "next/link";

export function MarketingAboutSection() {
  return (
    <section id="about" className="border-b-2 border-slate-900 bg-white px-4 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mx-auto mb-12 max-w-[900px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[0_5px_0_#ddd6fe]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 bg-violet-100">
              <svg className="h-2.5 w-2.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5.5 13.8 10 18.8 10.3 14.9 13.4 16.2 18.2 12 15.4 7.8 18.2 9.1 13.4 5.2 10.3 10.2 10z" />
              </svg>
            </span>
            <span>ABOUT TEACHIFY AI</span>
          </span>
          <h2 className="mt-6 text-[34px] font-black leading-[1.06] tracking-[-0.03em] sm:text-[58px]">
            Built to give teachers back
            <br />
            <span className="text-yellow-500">time, energy, and focus.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[850px] text-base font-medium leading-[1.65] text-slate-500 sm:text-lg">
            Teachify helps educators generate lessons, quizzes, and classroom-ready resources in minutes so they can spend less time on admin and more time on impact.
          </p>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="flex flex-col gap-[18px] border-2 border-slate-900 bg-white p-7 shadow-[8px_8px_0_#0f172a]">
            <span className="w-fit rotate-[-1.5deg] border-2 border-slate-900 bg-teal-200 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em]">OUR MISSION</span>
            <p className="max-w-[95%] text-[17px] font-semibold leading-[1.7] text-slate-700">
              Turn every teacher into a high-impact creator with AI tools that are practical, fast, and built for real classrooms.
            </p>
            <Link href="/register" className="inline-flex w-fit rounded border-2 border-slate-900 bg-yellow-200 px-5 py-2 text-sm font-black transition hover:-translate-x-0.5 hover:-translate-y-0.5">
              Start Teaching Smarter
            </Link>
          </article>

          <article className="grid grid-rows-3 gap-[14px] border-2 border-slate-900 bg-[linear-gradient(180deg,#fff_0%,#f8fafc_100%)] p-7 shadow-[8px_8px_0_#0f172a]">
            {[
              ["12K+", "Teachers Supported"],
              ["500K+", "Quizzes Generated"],
              ["20h", "Avg Weekly Time Saved"],
            ].map(([value, label]) => (
              <div key={label} className="border-[1.5px] border-dashed border-slate-300 bg-white px-4 py-3.5">
                <strong className="block text-[32px] font-black leading-none">{value}</strong>
                <span className="mt-2 block text-[12px] font-extrabold uppercase tracking-[0.09em] text-slate-500">{label}</span>
              </div>
            ))}
          </article>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Practical by Design", "Built around what teachers actually do: plan, assign, grade, and improve.", "bg-teal-100"],
            ["Classroom-First UX", "Simple workflows that reduce friction and keep focus on student outcomes.", "bg-rose-100"],
            ["Always Improving", "Shipped fast with educator feedback so the platform evolves with real needs.", "bg-yellow-100"],
          ].map(([title, body, tone]) => (
            <article key={title} className={`border-2 border-slate-900 p-5 shadow-[6px_6px_0_rgba(15,23,42,0.2)] ${tone}`}>
              <h3 className="mb-2.5 text-[22px] font-black">{title}</h3>
              <p className="text-sm font-bold leading-[1.6] text-slate-700">{body}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {["AI Lesson Generator", "Document to Quiz", "Auto-Grading", "Analytics Dashboard"].map((tag) => (
            <span key={tag} className="inline-flex items-center gap-2.5 border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-extrabold">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
