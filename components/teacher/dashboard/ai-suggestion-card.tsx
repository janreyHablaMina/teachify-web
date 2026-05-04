import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AiSuggestionCard() {
  return (
    <section className="relative h-full overflow-hidden rounded-[24px] border-[1.5px] border-slate-900 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 shadow-[2px_2px_0_#0f172a]">
      {/* Decorative blurry circles */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      
      <div className="relative flex h-full flex-col justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <p className="m-0 text-[12px] font-black uppercase tracking-[0.15em] text-white/90">AI Suggestion</p>
        </div>

        <div>
          <h3 className="m-0 pr-4 text-[22px] font-black leading-tight text-white">
            Generate a quiz from a topic you recently taught.
          </h3>
          <p className="mt-2 text-[13px] font-bold text-white/80">
            Our AI can transform your lesson notes into a comprehensive assessment in seconds.
          </p>
        </div>

        <Link 
          href="/teacher/generate"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white bg-white px-5 py-3 text-[14px] font-black uppercase tracking-wider text-indigo-700 shadow-[4px_4px_0_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)]"
        >
          Generate Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
