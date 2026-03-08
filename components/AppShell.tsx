"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, type UserRole } from "@/lib/auth";

type AppShellProps = {
  role: UserRole;
  children: React.ReactNode;
};

const navByRole: Record<UserRole, { label: string; href: string }[]> = {
  admin: [
    { label: "Overview", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
    { label: "Settings", href: "/admin/settings" },
  ],
  teacher: [
    { label: "Overview", href: "/teacher" },
    { label: "Generate Quiz", href: "/teacher/generate" },
    { label: "My Quizzes", href: "/teacher/quizzes" },
    { label: "Classes", href: "/teacher/classes" },
  ],
};

export default function AppShell({ role, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = navByRole[role];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[240px_1fr]">
        <aside className="surface rounded-2xl p-4 md:p-5">
          <p className="pill">Teachify {role}</p>
          <h1 className="display mt-3 text-xl font-semibold">Workspace</h1>

          <nav className="mt-5 space-y-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl border px-3 py-2 text-sm transition ${
                    active
                      ? "border-[var(--line-strong)] bg-[var(--brand-soft)] text-[#1e3a8a]"
                      : "border-[var(--line)] bg-white text-[#334155] hover:border-[var(--line-strong)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="grid gap-4">
          <header className="surface-strong rounded-2xl px-4 py-3 md:px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--muted)]">Dashboard</p>
                <h2 className="display mt-1 text-lg font-semibold capitalize">{role} panel</h2>
              </div>
              <button
                type="button"
                className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-sm font-medium text-[#334155] hover:bg-slate-50"
                onClick={() => {
                  signOut();
                  router.push("/login");
                }}
              >
                Logout
              </button>
            </div>
          </header>

          <main className="surface rounded-2xl p-4 md:p-6">{children}</main>
        </section>
      </div>
    </div>
  );
}
