"use client";

import Image from "next/image";
import { Gochi_Hand } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

type Countdown = {
  hours: number;
  mins: number;
  secs: number;
};

const gochi = Gochi_Hand({ subsets: ["latin"], weight: "400" });

export function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<Countdown>({ hours: 24, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const units = [
    { key: "hours", value: String(timeLeft.hours).padStart(2, "0"), label: "Hours", short: "H", tone: "bg-yellow-200 rotate-[-2deg]" },
    { key: "mins", value: String(timeLeft.mins).padStart(2, "0"), label: "Minutes", short: "M", tone: "bg-teal-200 rotate-[1deg]" },
    { key: "secs", value: String(timeLeft.secs).padStart(2, "0"), label: "Seconds", short: "S", tone: "bg-rose-200 rotate-[-1deg]" },
  ];

  return (
    <div className="sticky top-0 z-50">
      <div className="border-b-2 border-slate-900 bg-[#fda4af]">
        <div className="px-4 sm:px-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="flex min-h-14 items-center justify-between gap-2 py-1 sm:gap-3">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <span className="inline-flex rotate-[-1deg] items-center gap-1 bg-slate-900 px-2 py-1 text-[10px] font-black text-white sm:px-2.5 sm:py-1.5 sm:text-[11px]">
                  <span aria-hidden="true">{"\uD83D\uDD25"}</span>
                  <span>SEASON SALE</span>
                </span>
                <p className="hidden truncate text-[15px] font-bold text-slate-900 sm:block">
                  Grab 50% OFF Teachify Pro - Limited Teachers only!
                </p>
              </div>

              <div
                className={`${gochi.className} relative flex shrink-0 scale-[0.92] items-center gap-1.5 rounded-[16px] border-[1.6px] border-slate-900 bg-[repeating-linear-gradient(-11deg,rgba(255,255,255,0.92)_0_8px,rgba(255,255,255,0.7)_8px_16px)] px-1.5 py-1 shadow-[3px_3px_0_rgba(15,23,42,0.22)] before:absolute before:-left-1 before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:border before:border-slate-900 before:bg-[#fda4af] after:absolute after:-right-1 after:top-1/2 after:h-2 after:w-2 after:-translate-y-1/2 after:rounded-full after:border after:border-slate-900 after:bg-[#fda4af] sm:scale-100 sm:gap-2 sm:rounded-[18px] sm:border-[1.8px] sm:px-2 sm:py-1 sm:shadow-[4px_4px_0_rgba(15,23,42,0.22)] sm:before:-left-1.5 sm:before:h-2.5 sm:before:w-2.5 sm:after:-right-1.5 sm:after:h-2.5 sm:after:w-2.5`}
                role="timer"
                aria-live="polite"
                aria-label={`Sale ends in ${String(timeLeft.hours).padStart(2, "0")} hours ${String(timeLeft.mins).padStart(2, "0")} minutes ${String(timeLeft.secs).padStart(2, "0")} seconds`}
              >
                <span className="hidden whitespace-nowrap text-[11px] font-black uppercase tracking-[0.1em] text-slate-700 sm:inline">Ends In</span>
                {units.map((unit, i) => (
                  <div key={unit.key} className="flex items-center gap-0.5">
                    <div className={`relative min-w-[46px] rounded-lg border-[1.5px] border-slate-900 px-1 py-0.5 text-center shadow-[2px_2px_0_rgba(15,23,42,0.3)] sm:min-w-[62px] sm:rounded-xl sm:border-[1.7px] sm:px-1.5 sm:py-1 sm:shadow-[2px_2px_0_rgba(15,23,42,0.35)] ${unit.tone}`}>
                      <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 px-1 py-0 text-[7px] font-black text-white sm:-right-1.5 sm:-top-1.5 sm:text-[9px]">{unit.short}</span>
                      <div className="text-[14px] leading-none font-black sm:text-[17px]">{unit.value}</div>
                      <div className="text-[6px] font-black uppercase tracking-[0.11em] text-slate-700 sm:text-[8px]">{unit.label}</div>
                    </div>
                    {i < units.length - 1 ? <span className="px-0.5 text-[12px] font-black text-slate-500 sm:text-[14px]">:</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-8">
        <div className="relative mx-auto w-full max-w-[1280px]">
          <div className="rounded-full border-2 border-slate-900 bg-white px-3 py-3 shadow-[8px_8px_0_#fef08a] sm:px-4">
            <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[auto_1fr_auto]">
              <Link href="/" className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full border border-slate-900 bg-white shadow-[2px_2px_0_#99f6e4]">
                  <Image src="/teachify-logo.png" alt="Teachify logo" width={28} height={28} />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Teachify<span className="text-rose-300">AI</span></span>
              </Link>

              <button
                type="button"
                className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-teal-200 md:hidden"
                onClick={() => setMenuOpen((p) => !p)}
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
              >
                <span className="sr-only">Menu</span>
                <div className="space-y-1">
                  <span className="block h-0.5 w-5 bg-slate-900" />
                  <span className="block h-0.5 w-5 bg-slate-900" />
                  <span className="block h-0.5 w-5 bg-slate-900" />
                </div>
              </button>

              <nav className="hidden items-center justify-center gap-6 md:flex lg:gap-8">
                <Link href="#features" className="text-sm font-bold text-slate-900">Features</Link>
                <Link href="#blog" className="text-sm font-bold text-slate-900">Blog</Link>
                <Link href="#pricing" className="text-sm font-bold text-rose-400 underline decoration-wavy">Sale!</Link>
              </nav>

              <div className="hidden items-center gap-3 md:flex lg:gap-4">
                <Link href="/login" className="hidden text-sm font-bold text-slate-900 lg:inline-flex">Login</Link>
                <div className="relative">
                  <Link href="/register" className="rounded-full border-2 border-slate-900 bg-yellow-200 px-4 py-2 text-sm font-black text-slate-900 shadow-[4px_4px_0_#0f172a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 lg:px-5">Get Pro</Link>
                  <svg
                    className="pointer-events-none absolute -left-8 -top-3 hidden lg:block"
                    width="30"
                    height="16"
                    viewBox="0 0 40 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M5 10 Q20 0 35 10 M35 10 L30 5 M35 10 L30 15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {menuOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 w-full rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[6px_6px_0_#ddd6fe] md:hidden">
              <div className="flex flex-col gap-3">
                <Link href="#features" className="text-sm font-bold text-slate-900">Features</Link>
                <Link href="#blog" className="text-sm font-bold text-slate-900">Blog</Link>
                <Link href="#pricing" className="text-sm font-bold text-rose-400">Sale!</Link>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link href="/login" className="text-sm font-bold text-slate-900">Login</Link>
                <Link href="/register" className="rounded-full border-2 border-slate-900 bg-yellow-200 px-4 py-2 text-sm font-black text-slate-900">Get Pro</Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

