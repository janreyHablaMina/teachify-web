import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <section className="surface-strong w-full max-w-lg rounded-3xl p-6 md:p-8">
        <p className="pill">Recovery</p>
        <h1 className="display mt-3 text-4xl leading-[0.95]">Reset Password</h1>
        <p className="muted mt-2 text-sm">Enter your email and we will send a reset link.</p>

        <form className="mt-6 space-y-4">
          <input className="w-full rounded-xl border-2 border-[var(--line)] bg-white px-3 py-2 text-sm outline-none" placeholder="you@school.com" type="email" />
          <button type="button" className="retro-btn w-full rounded-xl px-4 py-2 text-sm">Send reset link</button>
        </form>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Back to <Link href="/login" className="font-bold hover:underline">Login</Link>
        </p>
      </section>
    </main>
  );
}
