import Image from "next/image";
import Link from "next/link";
import { Gochi_Hand } from "next/font/google";
import { MarketingAboutSection } from "./marketing-about-section";
import { MarketingBlogSection } from "./marketing-blog-section";
import { MarketingFeaturesSection } from "./marketing-features-section";
import { MarketingFooter } from "./marketing-footer";
import { MarketingHeader } from "./marketing-header";
import { MarketingImpact } from "./marketing-impact";
import { MarketingPricingSection } from "./marketing-pricing-section";
import { MarketingTestimonialsSection } from "./marketing-testimonials-section";

const gochi = Gochi_Hand({ subsets: ["latin"], weight: "400" });

export function MarketingPage() {
  const year = new Date().getFullYear();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-900">
      <div className="relative z-10">
        <div className="relative bg-slate-100">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(153,246,228,0.32)_0%,rgba(153,246,228,0.14)_22%,rgba(153,246,228,0)_46%)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <svg
              className="absolute left-[10%] top-[28%] hidden h-11 w-11 text-rose-300 sm:block"
              style={{ animation: "floatY 6.2s ease-in-out infinite" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l2.9 5.9 6.6 1-4.8 4.7 1.2 6.7L12 17.3 6.1 20.3l1.2-6.7L2.5 8.9l6.6-1L12 2z" />
            </svg>

            <svg
              className="absolute left-[6%] top-[43%] hidden h-10 w-10 text-sky-400 sm:block"
              style={{ animation: "floatSpin 7.4s ease-in-out infinite" }}
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M16 4V11M16 21V28M4 16H11M21 16H28M8 8L12 12M20 20L24 24M24 8L20 12M12 20L8 24" />
            </svg>

            <div
              className="absolute bottom-[14%] left-[6%] hidden items-center gap-4 text-teal-300 sm:flex"
              style={{ animation: "floatYSlow 8s ease-in-out infinite" }}
            >
              <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
              <svg className="h-12 w-12 text-slate-500" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="8" width="13" height="22" rx="2.5" fill="#A7F3D0" />
                <rect x="18" y="6" width="15" height="24" rx="2.5" fill="#BFDBFE" />
              </svg>
            </div>

            <svg
              className="absolute right-[8%] top-[30%] hidden h-14 w-14 text-slate-500 sm:block"
              style={{ animation: "floatSpin 6.8s ease-in-out infinite" }}
              viewBox="0 0 64 64"
              fill="none"
            >
              <rect x="9" y="32" width="35" height="10" rx="3" fill="#FCD34D" stroke="currentColor" strokeWidth="2" transform="rotate(-25 9 32)" />
              <rect x="38" y="28" width="8" height="10" fill="#F9A8D4" stroke="currentColor" strokeWidth="2" transform="rotate(-25 38 28)" />
              <path d="M45 25 L56 23 L51 33 Z" fill="#FDE68A" stroke="currentColor" strokeWidth="2" />
              <circle cx="52" cy="28" r="1.8" fill="currentColor" />
            </svg>

            <svg
              className="absolute right-[11%] top-[54%] hidden h-8 w-8 text-yellow-300 sm:block"
              style={{ animation: "floatY 5.8s ease-in-out infinite" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>

            <svg
              className="absolute bottom-[31%] right-[13%] hidden h-14 w-28 text-rose-200 sm:block"
              style={{ animation: "floatYSlow 7.6s ease-in-out infinite" }}
              viewBox="0 0 72 32"
              fill="none"
            >
              <rect x="2" y="6" width="68" height="20" rx="5" fill="currentColor" stroke="#0F172A" strokeWidth="2" />
              <path d="M10 11V22M18 11V18M26 11V22M34 11V18M42 11V22M50 11V18M58 11V22" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="relative">
            <MarketingHeader />
          </div>

          <section className="relative flex min-h-[calc(100svh-164px)] items-center border-b-2 border-slate-900 bg-transparent px-4 py-10 sm:px-8 lg:py-16">
            <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-0 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
              <div className="max-w-[640px]">
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-bold shadow-[4px_4px_0_#fda4af] sm:px-4 sm:py-2 sm:text-sm">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 bg-teal-100 text-[11px] leading-none">
                    &#10022;
                  </span>
                  <span>50% OFF FLASH SALE ENDING SOON</span>
                </span>

                <h1 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
                  Teach Less Admin.
                  <br />
                  <span className={`${gochi.className} relative inline-block px-2.5 py-0.5 leading-none text-[#fda4af]`}>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-[6%] h-[74%] bg-[#fef08a]"
                    />
                    <span className="relative z-10">Inspire</span>
                  </span>{" "}
                  More.
                </h1>

                <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
                  Stop fighting paperwork. Use AI that actually understands education.
                  Built by teachers, for the future of learning.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                  <Link href="/register" className="inline-flex items-center gap-2 rounded border-2 border-slate-900 bg-yellow-200 px-6 py-3 text-sm font-black shadow-[6px_6px_0_#0f172a] transition hover:-translate-x-0.5 hover:-translate-y-0.5">
                    Claim My Discount
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <button
                    className="group relative px-2 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5"
                    style={{ animation: "ctaFloat 3.2s ease-in-out infinite" }}
                  >
                    <span>See it in action</span>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-0.5 left-0 h-3 w-full text-teal-300 transition group-hover:text-teal-400"
                      viewBox="0 0 140 24"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M4 15 C30 10, 62 17, 90 12 C108 9, 122 10, 136 13"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative mx-auto h-[320px] w-full max-w-[450px] sm:h-[380px] lg:h-[420px]">
                <div className="absolute left-2 top-2 w-[220px] rotate-[-5deg] border-2 border-slate-900 bg-white p-2.5 pb-6 shadow-[8px_8px_0_rgba(15,23,42,0.1)] sm:left-0 sm:w-[250px] sm:p-3 sm:pb-7 lg:w-[280px] lg:pb-8">
                  <div className="relative aspect-square overflow-hidden border border-slate-200">
                    <Image src="/hero-sketch-1.png" alt="Designing quiz" fill className="object-cover" />
                  </div>
                  <p className={`${gochi.className} mt-2 text-center text-lg sm:mt-3 sm:text-xl`}>Designing Quiz...</p>
                </div>
                <div className="absolute bottom-0 right-2 w-[220px] rotate-[8deg] border-2 border-slate-900 bg-white p-2.5 pb-6 shadow-[8px_8px_0_rgba(15,23,42,0.1)] sm:right-0 sm:w-[250px] sm:p-3 sm:pb-7 lg:w-[280px] lg:pb-8">
                  <div className="relative aspect-square overflow-hidden border border-slate-200">
                    <Image src="/hero-sketch-2.png" alt="AI grading" fill className="object-cover" />
                  </div>
                  <p className={`${gochi.className} mt-2 text-center text-lg sm:mt-3 sm:text-xl`}>AI Grading Sheet</p>
                </div>
                <div className="absolute left-[38%] top-0 h-8 w-24 rotate-[-2deg] bg-yellow-200/80" />
              </div>
            </div>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute bottom-6 left-1/2 hidden h-8 w-[76%] -translate-x-1/2 text-[#4f46e5] sm:block"
              viewBox="0 0 1200 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M24 44 C210 43, 390 43, 566 42 C670 42, 748 41, 804 38 C844 35, 868 30, 892 28 C920 25, 944 27, 944 31 C944 35, 920 38, 884 40 C828 43, 748 44, 640 44 C462 44, 286 44, 24 45"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
            </svg>
          </section>
        </div>

        <MarketingImpact />
        <MarketingFeaturesSection gochiClassName={gochi.className} />
        <MarketingPricingSection />
        <MarketingBlogSection />
        <MarketingAboutSection />
        <MarketingTestimonialsSection gochiClassName={gochi.className} />
        <MarketingFooter year={year} />
      </div>
    </main>
  );
}
