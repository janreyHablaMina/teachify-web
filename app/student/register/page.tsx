"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRegister, apiRegisterStudent, getApiErrorMessage } from "@/lib/api/client";
import { storeToken } from "@/lib/auth/session";
import { GraduationCap, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/toast/toast-provider";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const joinCode = searchParams.get("code") || "";
  const normalizedJoinCode = joinCode.trim().toUpperCase();

  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const middleName = String(formData.get("middleName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      setIsLoading(false);
      return;
    }

    const fullname = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;

    try {
      const registrationRequest = normalizedJoinCode
        ? apiRegisterStudent({
            firstname: firstName,
            middlename: middleName || undefined,
            lastname: lastName,
            email,
            password,
            password_confirmation: confirmPassword,
            join_code: normalizedJoinCode,
          })
        : apiRegister({
            fullname,
            email,
            password,
            password_confirmation: confirmPassword,
            role: "student",
          });

      const { response: regRes, data: regData } = await registrationRequest;

      if (!regRes.ok) {
        throw new Error(getApiErrorMessage(regRes, regData, "Registration failed"));
      }

      const token =
        typeof regData.token === "string"
          ? regData.token
          : typeof regData.access_token === "string"
            ? regData.access_token
            : "";

      if (token) {
        storeToken(token);
      }

      showToast(
        normalizedJoinCode
          ? "Student account created and class joined successfully!"
          : "Student account created successfully!",
        "success"
      );
      // Redirect to student dashboard
      router.replace("/student");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[540px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#0f172a] bg-indigo-300 shadow-[4px_4px_0_#0f172a]">
          <GraduationCap className="h-9 w-9 text-[#0f172a]" />
        </div>
        <h1 className="text-[40px] font-black leading-none tracking-[-0.04em] text-[#0f172a]">Student Signup</h1>
        <p className="mt-3 text-[16px] font-medium text-slate-500">
          Create your account to join <strong>{joinCode ? `Class ${joinCode}` : "your classroom"}</strong>
        </p>
      </header>

      <div className="rounded-[32px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#0f172a] md:p-10">
        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Name Row */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input name="firstName" required placeholder="John" className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 py-3 pl-11 pr-4 text-[14px] font-bold text-[#0f172a] outline-none transition-all focus:border-[#0f172a] focus:bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Middle Name</label>
            <input name="middleName" placeholder="Optional" className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 py-3 px-4 text-[14px] font-bold text-[#0f172a] outline-none transition-all focus:border-[#0f172a] focus:bg-white" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Last Name</label>
            <input name="lastName" required placeholder="Doe" className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 py-3 px-4 text-[14px] font-bold text-[#0f172a] outline-none transition-all focus:border-[#0f172a] focus:bg-white" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input name="email" type="email" required placeholder="student@school.edu" className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 py-3 pl-11 pr-4 text-[14px] font-bold text-[#0f172a] outline-none transition-all focus:border-[#0f172a] focus:bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
              <input name="password" type="password" required minLength={8} placeholder="••••••••" className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 py-3 pl-11 pr-4 text-[14px] font-bold text-[#0f172a] outline-none transition-all focus:border-[#0f172a] focus:bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Confirm</label>
            <input name="confirmPassword" type="password" required minLength={8} placeholder="••••••••" className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 py-3 px-4 text-[14px] font-bold text-[#0f172a] outline-none transition-all focus:border-[#0f172a] focus:bg-white" />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#0f172a] bg-[#0f172a] py-4 text-[15px] font-bold text-white shadow-[6px_6px_0_#818cf8] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Complete Signup"}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
          <ShieldCheck className="h-6 w-6 text-indigo-600" />
          <p className="text-[12px] font-medium text-slate-500 leading-tight">
            Registration for student accounts is secure. You will be automatically added to your teacher&apos;s classroom.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-[14px] font-bold text-slate-400">
        Already have an account? <Link href="/login" className="text-[#0f172a] underline decoration-indigo-300 decoration-2 underline-offset-4">Sign in here</Link>
      </p>
    </div>
  );
}

export default function StudentRegisterPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f8fafc] p-6 lg:bg-[radial-gradient(circle_at_20%_20%,rgba(129,140,248,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(221,214,254,0.15),transparent_40%)]">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
