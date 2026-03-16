import Link from "next/link";

type MarketingFooterProps = {
  year: number;
};

export function MarketingFooter({ year }: MarketingFooterProps) {
  return (
    <footer className="border-t-2 border-slate-900 bg-[radial-gradient(circle_at_10%_5%,rgba(254,240,138,0.35),transparent_30%),radial-gradient(circle_at_92%_0%,rgba(153,246,228,0.25),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-[72px] sm:px-8 sm:py-[92px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative border-2 border-slate-900 bg-[repeating-linear-gradient(to_bottom,#f8fafc_0px,#f8fafc_35px,rgba(148,163,184,0.34)_35px,rgba(148,163,184,0.34)_36px)] px-4 pb-4 pt-5 shadow-[10px_10px_0_rgba(15,23,42,0.18)] before:absolute before:bottom-0 before:top-0 before:hidden before:w-[2px] before:bg-rose-400/45 sm:px-6 sm:pb-[18px] sm:pt-[22px] md:before:left-[54px] md:before:block">
          <div className="mb-[22px] md:ml-[74px] md:max-w-[660px]">
            <span className="mb-2 inline-block rotate-[-2deg] border-2 border-slate-900 bg-yellow-200 px-[10px] py-1 text-[10px] font-black uppercase tracking-[0.1em]">Classroom Edition</span>
            <div className="text-3xl font-black">Teachify<span className="text-rose-300">AI</span></div>
            <p className="mb-[14px] mt-[10px] text-[15px] font-bold leading-[1.6] text-slate-700">
              The all-in-one teaching copilot for planning, assessment, and classroom momentum.
            </p>
            <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center">
              <Link href="/register" className="inline-flex items-center border-2 border-slate-900 bg-slate-900 px-[14px] py-[10px] text-xs font-black uppercase tracking-[0.05em] text-white shadow-[4px_4px_0_#fda4af] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#fda4af]">
                Start free trial
              </Link>
              <Link href="/login" className="inline-flex items-center border-[1.5px] border-slate-900 bg-white px-3 py-[10px] text-xs font-extrabold text-slate-900">
                Teacher Login
              </Link>
            </div>
          </div>

          <div className="grid gap-3 md:ml-[74px] md:grid-cols-2 xl:grid-cols-3">
            <nav aria-label="Product links" className="relative border-[1.8px] border-slate-900 bg-[#fff8d8] p-3.5 before:absolute before:-top-[7px] before:left-3 before:h-[10px] before:w-9 before:rotate-[-6deg] before:border before:border-slate-900/35 before:bg-white/70 before:content-['']">
              <h4 className="mb-2.5 text-xs font-black uppercase tracking-[0.08em]">Product</h4>
              <div className="grid gap-1.5">
                <Link href="#features" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Features</Link>
                <Link href="#pricing" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Pricing</Link>
                <Link href="/blog" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Blog</Link>
              </div>
            </nav>
            <nav aria-label="Company links" className="relative border-[1.8px] border-slate-900 bg-[#ddfbf6] p-3.5 before:absolute before:-top-[7px] before:left-3 before:h-[10px] before:w-9 before:rotate-[-6deg] before:border before:border-slate-900/35 before:bg-white/70 before:content-['']">
              <h4 className="mb-2.5 text-xs font-black uppercase tracking-[0.08em]">Company</h4>
              <div className="grid gap-1.5">
                <Link href="#about" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">About Us</Link>
                <Link href="/contact" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Contact</Link>
                <Link href="/privacy" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Privacy</Link>
              </div>
            </nav>
            <nav aria-label="Resources links" className="relative border-[1.8px] border-slate-900 bg-[#efe8ff] p-3.5 before:absolute before:-top-[7px] before:left-3 before:h-[10px] before:w-9 before:rotate-[-6deg] before:border before:border-slate-900/35 before:bg-white/70 before:content-['']">
              <h4 className="mb-2.5 text-xs font-black uppercase tracking-[0.08em]">Resources</h4>
              <div className="grid gap-1.5">
                <Link href="#blog" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Teaching Blog</Link>
                <Link href="#testimonials" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Testimonials</Link>
                <Link href="/contact" className="w-fit text-[13px] font-bold text-slate-700 hover:underline hover:decoration-2 hover:decoration-teal-300">Support</Link>
              </div>
            </nav>
          </div>

          <div className="mt-[18px] grid gap-3 border-t border-dashed border-slate-400 pt-[14px] md:ml-[74px] lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <p className="text-[15px] text-slate-600">Made with care by teachers, for teachers.</p>
            <div className="inline-flex gap-3">
              <Link href="/privacy" className="text-xs font-extrabold text-slate-700 hover:underline hover:decoration-2 hover:decoration-rose-300">Privacy</Link>
              <Link href="/contact" className="text-xs font-extrabold text-slate-700 hover:underline hover:decoration-2 hover:decoration-rose-300">Contact</Link>
            </div>
            <span className="w-fit border-[1.5px] border-slate-900 bg-white px-2.5 py-[7px] text-xs font-extrabold tracking-[0.04em]">
              Teachify AI - {year}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
