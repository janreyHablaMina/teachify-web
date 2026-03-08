import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <section className="surface-strong w-full max-w-xl rounded-3xl p-6 md:p-8">
        <p className="pill">Create Account</p>
        <h1 className="display mt-3 text-4xl leading-[0.95]">Teacher Signup</h1>
        <p className="muted mt-2 text-sm">UI scaffold only. Backend wiring comes next.</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border-2 border-[var(--line)] bg-white px-3 py-2 text-sm outline-none md:col-span-2" placeholder="Full name" />
          <input className="rounded-xl border-2 border-[var(--line)] bg-white px-3 py-2 text-sm outline-none md:col-span-2" placeholder="Email" type="email" />
          <input className="rounded-xl border-2 border-[var(--line)] bg-white px-3 py-2 text-sm outline-none" placeholder="Password" type="password" />
          <input className="rounded-xl border-2 border-[var(--line)] bg-white px-3 py-2 text-sm outline-none" placeholder="Confirm password" type="password" />
          <button type="button" className="retro-btn md:col-span-2 rounded-xl px-4 py-2 text-sm">Create account</button>
        </form>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Already have an account? <Link href="/login" className="font-bold hover:underline">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
