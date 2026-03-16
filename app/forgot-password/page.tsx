import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="w-full max-w-xl border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0_rgba(15,23,42,0.2)]">
        <h1 className="text-3xl font-black text-slate-900">Forgot Password</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Password reset page migration is next.
        </p>
        <Link href="/login" className="mt-6 inline-flex rounded border-2 border-slate-900 bg-yellow-200 px-4 py-2 text-sm font-black text-slate-900">
          Back to Login
        </Link>
      </section>
    </main>
  );
}
