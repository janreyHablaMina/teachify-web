"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "error"; message: string } | null>(null);
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://teachify-api-production.up.railway.app").replace(/\/$/, "");

  useEffect(() => {
    let mounted = true;

    async function checkExistingSession() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("teachify_token") : null;
        const response = await fetch(`${apiBaseUrl}/api/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) return;
        const data = await response.json().catch(() => ({}));
        const role = String(data?.user?.role ?? "");
        if (!mounted) return;
        if (role === "admin") router.replace("/admin");
        else if (role === "teacher") router.replace("/teacher");
        else if (role === "student") router.replace("/");
      } catch {
        // stay on login page
      }
    }

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [apiBaseUrl, router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const requestId = response.headers.get("x-railway-request-id");
        const validationMessages = data?.errors
          ? Object.values(data.errors).flat().join(" ")
          : null;
        const baseMessage = validationMessages || data?.message || "Login failed. Please try again.";
        throw new Error(requestId ? `${baseMessage} (req: ${requestId})` : baseMessage);
      }

      if (data?.token && typeof window !== "undefined") {
        localStorage.setItem("teachify_token", String(data.token));
      }

      const role = String(data?.user?.role ?? "teacher");
      const nextRoute = role === "admin" ? "/admin" : role === "student" ? "/" : "/teacher";
      router.push(nextRoute);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_8%_16%,rgba(153,246,228,0.38),transparent_34%),radial-gradient(circle_at_92%_8%,rgba(253,164,175,0.28),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-3 py-7 sm:px-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <section className="relative z-10 grid min-h-[650px] w-full max-w-[1100px] overflow-hidden border-2 border-slate-900 bg-white shadow-[12px_12px_0_rgba(15,23,42,0.2)] lg:grid-cols-2">
        <div className="pointer-events-none absolute -top-3 left-[52px] h-6 w-[90px] rotate-[-7deg] border border-slate-900/35 bg-yellow-200/65" />
        <div className="pointer-events-none absolute -top-3 right-[74px] h-6 w-[90px] rotate-[6deg] border border-slate-900/35 bg-teal-200/65" />

        <section className="relative border-b-2 border-dashed border-slate-900/30 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[position:0_54px] bg-[size:100%_34px] bg-repeat-y px-5 py-6 sm:px-8 sm:py-8 lg:border-b-0 lg:border-r-2 lg:px-10 lg:py-9">
          <div className="pointer-events-none absolute bottom-0 left-3 top-0 w-[2px] bg-rose-500/30 sm:left-6" />

          <div className="ml-2 sm:ml-6">
            <div className="mb-[22px]">
              <div className="mb-[14px] inline-flex items-center gap-[10px]">
                <div className="grid h-[38px] w-[38px] place-items-center border-2 border-slate-900 bg-slate-900 shadow-[3px_3px_0_#fef08a]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
                  </svg>
                </div>
                <span className="text-[18px] font-black tracking-[-0.03em] text-slate-900">Teachify <strong>AI</strong></span>
              </div>

              <h1 className="m-0 text-[34px] font-black leading-none tracking-[-0.04em] text-slate-900 sm:text-[42px]">Welcome Back</h1>
              <p className="mt-2 text-[14px] font-bold text-slate-600">Login to your Teachify account</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-900">Email Address</label>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-[13px] grid place-items-center text-slate-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9 7 9-7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="22 9 12 2 2 9" /></svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full border-[1.8px] border-slate-400 bg-white px-10 py-[13px] text-[14px] font-bold text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-slate-900 focus:shadow-[3px_3px_0_rgba(15,23,42,0.12)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-900">Password</label>
                  <Link href="/forgot-password" tabIndex={-1} className="text-[12px] font-extrabold text-teal-700 no-underline hover:border-b-2 hover:border-pink-300">Forgot Password?</Link>
                </div>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute left-[13px] grid place-items-center text-slate-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading}
                    placeholder="********"
                    autoComplete="current-password"
                    className="w-full border-[1.8px] border-slate-400 bg-white px-10 py-[13px] text-[14px] font-bold text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-slate-900 focus:shadow-[3px_3px_0_rgba(15,23,42,0.12)]"
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="mt-2 inline-flex w-full items-center justify-center gap-2 border-2 border-slate-900 bg-[#fef08a] px-3 py-[14px] text-[14px] font-black uppercase tracking-[0.04em] text-slate-900 shadow-[5px_5px_0_#0f172a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#0f172a] disabled:cursor-not-allowed disabled:opacity-65">
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/25 border-t-slate-900" /> Verifying...
                  </>
                ) : (
                  <>
                    Login to Portal <span className="transition group-hover:translate-x-1">-&gt;</span>
                  </>
                )}
              </button>

              {status ? (
                <p className="border-2 border-red-900 bg-rose-200 px-3 py-2.5 text-[12px] font-extrabold leading-[1.45] text-red-900 shadow-[4px_4px_0_rgba(15,23,42,0.14)]">
                  {status.message}
                </p>
              ) : null}

              <div className="mt-4 flex items-center justify-center gap-[14px] border-t border-dashed border-slate-400 pt-[14px]">
                <p className="m-0 text-[13px] font-bold text-slate-600">
                  New here? <Link href="/register" className="font-black text-slate-900 underline decoration-teal-200 decoration-2">Create account</Link>
                </p>
                <div className="h-[14px] w-px bg-slate-300" />
                <button type="button" className="grid h-9 w-9 place-items-center border-[1.6px] border-slate-400 bg-white text-slate-700 transition hover:border-slate-900 hover:shadow-[2px_2px_0_rgba(15,23,42,0.18)]" title="Sign in with Google">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="relative hidden flex-col justify-between gap-4 overflow-hidden bg-[radial-gradient(circle_at_85%_14%,rgba(253,164,175,0.34),transparent_36%),radial-gradient(circle_at_12%_90%,rgba(221,214,254,0.33),transparent_38%),linear-gradient(170deg,#ecfeff_0%,#ccfbf1_48%,#dbeafe_100%)] p-7 lg:flex">
          <div className="pointer-events-none absolute inset-[14px] border-[1.4px] border-dashed border-slate-900/35" />
          <div className="pointer-events-none absolute -right-10 -top-[60px] h-[180px] w-[180px] rounded-full bg-white/40" />
          <div className="pointer-events-none absolute -left-[30px] bottom-[90px] h-[120px] w-[120px] rounded-full bg-white/35" />
          <div className="pointer-events-none absolute bottom-[210px] right-5 h-[84px] w-[84px] rounded-full bg-white/30" />

          <div className="pointer-events-none absolute inset-0 z-[4]">
            <span className="absolute left-[30px] top-12 rotate-[-5deg] border-[1.4px] border-slate-900 bg-white px-[10px] py-[5px] text-[11px] font-black text-slate-900 shadow-[3px_3px_0_rgba(15,23,42,0.15)]">
              <span className="absolute -top-[9px] left-1/2 h-3 w-8 -translate-x-1/2 rotate-[4deg] border border-slate-900/35 bg-yellow-200/80" />
              <span className="inline-flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v5M12 17v5M4.93 4.93l3.54 3.54M15.54 15.54l3.53 3.53M2 12h5M17 12h5M4.93 19.07l3.54-3.54M15.54 8.46l3.53-3.53" /></svg>
                AI Lessons
              </span>
            </span>
            <span className="absolute right-8 top-[42px] rotate-[5deg] border-[1.4px] border-slate-900 bg-white px-[10px] py-[5px] text-[11px] font-black text-slate-900 shadow-[3px_3px_0_rgba(15,23,42,0.15)]">
              <span className="absolute -top-[9px] left-1/2 h-3 w-8 -translate-x-1/2 rotate-[-5deg] border border-slate-900/35 bg-teal-200/80" />
              <span className="inline-flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></svg>
                Auto Grading
              </span>
            </span>
            <span className="absolute bottom-[210px] right-5 rotate-[-3deg] border-[1.4px] border-slate-900 bg-white px-[10px] py-[5px] text-[11px] font-black text-slate-900 shadow-[3px_3px_0_rgba(15,23,42,0.15)]">
              <span className="absolute -top-[9px] left-1/2 h-3 w-8 -translate-x-1/2 rotate-[2deg] border border-slate-900/35 bg-pink-200/80" />
              <span className="inline-flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                Smart Quizzes
              </span>
            </span>
          </div>

          <div className="relative z-[3] flex min-h-[320px] items-center justify-center pt-4">
            <Image src="/Teacher-login.png" alt="AI Teacher" width={480} height={480} className="h-auto max-h-[350px] w-auto object-contain drop-shadow-[0_16px_30px_rgba(15,23,42,0.16)]" priority />
          </div>

          <article className="relative z-[5] border-2 border-slate-900 bg-white/90 p-[14px] shadow-[6px_6px_0_rgba(15,23,42,0.16)]">
            <span className="absolute -top-[10px] left-8 h-3.5 w-12 rotate-[-6deg] border border-slate-900/35 bg-yellow-200/75" />
            <span className="absolute -top-[8px] right-8 h-3 w-9 rotate-[8deg] border border-slate-900/35 bg-teal-200/75" />
            <div className="mb-2 inline-flex items-center gap-[6px] border-[1.5px] border-slate-900 bg-slate-900 px-2 py-[3px] pl-[6px] text-[11px] font-extrabold text-white">
              <div className="grid h-[18px] w-[18px] place-items-center border border-white/40">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 3L2 12h3v8h14v-8h3L12 3z" /></svg>
              </div>
              <span>Teachify AI</span>
            </div>
            <p className="mb-[6px] text-[13px] font-bold leading-[1.45] text-slate-900">&ldquo;Saves me <strong className="font-black text-teal-700">10+ hours</strong> every week on lesson planning.&rdquo;</p>
            <p className="m-0 text-[11px] font-bold text-slate-600">- Sarah J., Senior High Teacher</p>

            <div className="mt-[10px] flex items-center gap-[10px] border-t border-dashed border-slate-400 pt-[10px]">
              <div className="flex flex-col gap-[2px]"><span className="text-[16px] font-black leading-none text-slate-900">10K+</span><span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Teachers</span></div>
              <div className="h-[26px] w-px bg-slate-300" />
              <div className="flex flex-col gap-[2px]"><span className="text-[16px] font-black leading-none text-slate-900">4.9</span><span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Rating</span></div>
              <div className="h-[26px] w-px bg-slate-300" />
              <div className="flex flex-col gap-[2px]"><span className="text-[16px] font-black leading-none text-slate-900">1M+</span><span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Quizzes</span></div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
