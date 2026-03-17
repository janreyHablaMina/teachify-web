"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const encodedName = `${name}=`;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(encodedName)) {
      return decodeURIComponent(part.substring(encodedName.length));
    }
  }
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://teachify-api-production.up.railway.app").replace(/\/$/, "");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match. Please try again." });
      setIsLoading(false);
      return;
    }

    try {
      await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getCookie("XSRF-TOKEN");

      const response = await fetch(`${apiBaseUrl}/api/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        body: JSON.stringify({
          fullname: fullName,
          email,
          password,
          password_confirmation: confirmPassword,
          role: "teacher",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const requestId = response.headers.get("x-railway-request-id");
        const validationMessages = data?.errors
          ? Object.values(data.errors).flat().join(" ")
          : null;
        const baseMessage = validationMessages || data?.message || "Registration failed. Please try again.";
        throw new Error(requestId ? `${baseMessage} (req: ${requestId})` : baseMessage);
      }

      await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const loginXsrfToken = getCookie("XSRF-TOKEN");

      const loginResponse = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(loginXsrfToken ? { "X-XSRF-TOKEN": loginXsrfToken } : {}),
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json().catch(() => ({}));

      if (!loginResponse.ok) {
        const loginRequestId = loginResponse.headers.get("x-railway-request-id");
        const loginBaseMessage = loginData?.message || "Account created, but automatic login failed. Please sign in manually.";
        throw new Error(loginRequestId ? `${loginBaseMessage} (req: ${loginRequestId})` : loginBaseMessage);
      }

      if (loginData?.token && typeof window !== "undefined") {
        localStorage.setItem("teachify_token", String(loginData.token));
      }

      setStatus({ type: "success", message: "Account created successfully. Redirecting to your dashboard..." });
      setTimeout(() => router.push("/teacher"), 900);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_8%_14%,rgba(153,246,228,0.34),transparent_34%),radial-gradient(circle_at_92%_8%,rgba(221,214,254,0.3),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-3 py-6 sm:px-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />

      <section className="relative z-10 grid min-h-[670px] w-full max-w-[1120px] overflow-hidden border-2 border-slate-900 bg-white shadow-[12px_12px_0_rgba(15,23,42,0.2)] lg:grid-cols-2">
        <div className="pointer-events-none absolute -top-3 left-[60px] h-6 w-[92px] rotate-[-7deg] border border-slate-900/40 bg-yellow-200/65" />
        <div className="pointer-events-none absolute -top-3 right-[76px] h-6 w-[92px] rotate-[6deg] border border-slate-900/40 bg-pink-300/60" />

        <section className="relative hidden flex-col justify-between gap-4 border-b-2 border-dashed border-slate-900/35 bg-[radial-gradient(circle_at_82%_14%,rgba(253,164,175,0.3),transparent_36%),radial-gradient(circle_at_10%_88%,rgba(221,214,254,0.34),transparent_38%),linear-gradient(170deg,#ecfeff_0%,#ccfbf1_45%,#dbeafe_100%)] p-[26px] pt-[30px] lg:flex lg:border-b-0 lg:border-r-2">
          <div className="pointer-events-none absolute inset-[14px] border-[1.4px] border-dashed border-slate-900/30" />
          <div className="pointer-events-none absolute -right-9 -top-[60px] h-[170px] w-[170px] rounded-full bg-white/40" />
          <div className="pointer-events-none absolute -left-7 bottom-[88px] h-[116px] w-[116px] rounded-full bg-white/30" />
          <div className="pointer-events-none absolute bottom-[208px] right-4 h-[84px] w-[84px] rounded-full bg-white/30" />

          <div className="pointer-events-none absolute inset-0 z-[4]">
            <span className="absolute left-8 top-[50px] rotate-[-5deg] border-[1.4px] border-slate-900 bg-white px-[10px] py-[5px] text-[11px] font-black text-slate-900 shadow-[3px_3px_0_rgba(15,23,42,0.15)]">Classroom Ready</span>
            <span className="absolute right-7 top-[42px] rotate-[4deg] border-[1.4px] border-slate-900 bg-white px-[10px] py-[5px] text-[11px] font-black text-slate-900 shadow-[3px_3px_0_rgba(15,23,42,0.15)]">AI Quiz Builder</span>
            <span className="absolute bottom-[214px] right-6 rotate-[-3deg] border-[1.4px] border-slate-900 bg-white px-[10px] py-[5px] text-[11px] font-black text-slate-900 shadow-[3px_3px_0_rgba(15,23,42,0.15)]">Fast Setup</span>
          </div>

          <article className="relative z-[3] mt-20 border-2 border-slate-900 bg-white/85 p-[18px] shadow-[5px_5px_0_rgba(15,23,42,0.14)]">
            <span className="inline-block rotate-[-2deg] border-[1.5px] border-slate-900 bg-yellow-200 px-[10px] py-1 text-[10px] font-black uppercase tracking-[0.08em]">Educator onboarding</span>
            <h2 className="my-3 text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-slate-900">Set up your teaching workspace in minutes.</h2>
            <p className="m-0 text-[14px] font-bold leading-[1.55] text-slate-700">Create your account once and start building lessons, quizzes, and assignments with AI support.</p>
          </article>

          <article className="relative z-[3] flex items-center justify-between gap-[10px] border-2 border-slate-900 bg-white p-3 shadow-[5px_5px_0_rgba(15,23,42,0.14)]">
            <div className="flex flex-col gap-[2px]"><span className="text-[16px] font-black leading-none text-slate-900">12K+</span><span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Teachers</span></div>
            <div className="h-7 w-px bg-slate-300" />
            <div className="flex flex-col gap-[2px]"><span className="text-[16px] font-black leading-none text-slate-900">508K+</span><span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Quizzes</span></div>
            <div className="h-7 w-px bg-slate-300" />
            <div className="flex flex-col gap-[2px]"><span className="text-[16px] font-black leading-none text-slate-900">860+</span><span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Schools</span></div>
          </article>
        </section>

        <section className="relative bg-[linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[position:0_54px] bg-[size:100%_34px] bg-repeat-y px-4 py-6 sm:px-8 lg:px-9 lg:py-[34px]">
          <div className="pointer-events-none absolute bottom-0 left-3 top-0 w-[2px] bg-rose-500/30 sm:left-[26px]" />

          <div className="ml-2 sm:ml-6">
            <header className="mb-5">
              <div className="mb-3 inline-flex items-center gap-[10px] text-[18px] font-black text-slate-900">
                <div className="grid h-9 w-9 place-items-center border-2 border-slate-900 bg-slate-900 text-white shadow-[3px_3px_0_#99f6e4]">T</div>
                <span>Teachify AI</span>
              </div>
              <p className="mb-[10px] inline-block rotate-[-2deg] border-[1.5px] border-slate-900 bg-purple-200 px-[10px] py-1 text-[11px] font-black uppercase tracking-[0.08em]">Create Account</p>
              <h1 className="m-0 text-[38px] font-black leading-none tracking-[-0.04em] text-slate-900 sm:text-[44px]">Teacher Signup</h1>
              <p className="mt-[9px] text-[14px] font-bold text-slate-600">Start your account and access your educator dashboard.</p>
            </header>

            <form onSubmit={handleRegister} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-[7px] sm:col-span-2">
                <label htmlFor="fullName" className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-900">Full name</label>
                <input id="fullName" name="fullName" placeholder="Alex Johnson" required disabled={isLoading} className="w-full border-[1.8px] border-slate-400 bg-white px-3 py-3 text-[14px] font-bold text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-slate-900 focus:shadow-[3px_3px_0_rgba(15,23,42,0.12)]" />
              </div>

              <div className="flex flex-col gap-[7px] sm:col-span-2">
                <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-900">Email address</label>
                <input id="email" name="email" type="email" placeholder="teacher@school.edu" required disabled={isLoading} autoComplete="email" className="w-full border-[1.8px] border-slate-400 bg-white px-3 py-3 text-[14px] font-bold text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-slate-900 focus:shadow-[3px_3px_0_rgba(15,23,42,0.12)]" />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-900">Password</label>
                <input id="password" name="password" type="password" minLength={8} placeholder="Enter password" required disabled={isLoading} autoComplete="new-password" className="w-full border-[1.8px] border-slate-400 bg-white px-3 py-3 text-[14px] font-bold text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-slate-900 focus:shadow-[3px_3px_0_rgba(15,23,42,0.12)]" />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label htmlFor="confirmPassword" className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-900">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" minLength={8} placeholder="Confirm password" required disabled={isLoading} autoComplete="new-password" className="w-full border-[1.8px] border-slate-400 bg-white px-3 py-3 text-[14px] font-bold text-slate-900 outline-none transition placeholder:font-semibold placeholder:text-slate-400 focus:border-slate-900 focus:shadow-[3px_3px_0_rgba(15,23,42,0.12)]" />
              </div>

              <button type="submit" className="mt-1 w-full border-2 border-slate-900 bg-[#fef08a] px-3 py-[14px] text-[14px] font-black uppercase tracking-[0.05em] text-slate-900 shadow-[5px_5px_0_#0f172a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#0f172a] disabled:cursor-not-allowed disabled:opacity-80 sm:col-span-2" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </button>

              {status ? (
                <p className={`border-2 px-3 py-2.5 text-[12px] font-extrabold leading-[1.45] shadow-[4px_4px_0_rgba(15,23,42,0.14)] sm:col-span-2 ${status.type === "success" ? "border-slate-900 bg-teal-100 text-slate-900" : "border-red-900 bg-rose-200 text-red-900"}`}>
                  {status.message}
                </p>
              ) : null}

              <label className="m-0 flex items-start gap-2.5 border-[1.6px] border-dashed border-slate-400 bg-white px-3 py-2.5 text-[12px] font-bold text-slate-700 sm:col-span-2" htmlFor="agreeTerms">
                <input id="agreeTerms" name="agreeTerms" type="checkbox" required disabled={isLoading} className="mt-[1px] h-4 w-4 accent-slate-900" />
                <span>
                  I agree to the <Link href="/terms" className="font-black text-slate-900 underline decoration-teal-200 decoration-2">Terms</Link> &amp; <Link href="/privacy" className="font-black text-slate-900 underline decoration-teal-200 decoration-2">Privacy Policy</Link>.
                </span>
              </label>

              <p className="m-0 text-[12px] font-bold leading-[1.4] text-slate-500 sm:col-span-2">Please review our terms before creating your account.</p>
            </form>

            <p className="mt-4 border-t border-dashed border-slate-400 pt-[14px] text-[13px] font-bold text-slate-600">
              Already have an account? <Link href="/login" className="font-black text-slate-900 underline decoration-teal-200 decoration-2">Sign in</Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
