"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, type UserRole } from "@/lib/auth";
import styles from "./app-shell.module.css";

type AppShellProps = {
  role: UserRole;
  children: React.ReactNode;
};

type NavItem = {
  group: string;
  label: string;
  href: string;
  icon: "overview" | "users" | "schools" | "subscriptions" | "quizzes" | "analytics" | "ai" | "revenue" | "support" | "system" | "settings" | "generate" | "list" | "classes";
};

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { group: "Main", label: "Overview", href: "/admin", icon: "overview" },
  ],
  teacher: [
    { group: "Main", label: "Overview", href: "/teacher", icon: "overview" },
    { group: "Teaching", label: "Generate Quiz", href: "/teacher/generate", icon: "generate" },
    { group: "Teaching", label: "My Quizzes", href: "/teacher/quizzes", icon: "list" },
    { group: "Classroom", label: "Classes", href: "/teacher/classes", icon: "classes" },
  ],
};

function NavIcon({ icon }: { icon: NavItem["icon"] }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "overview":
      return <svg {...common}><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="5" /><rect x="13" y="10" width="8" height="11" /><rect x="3" y="13" width="8" height="8" /></svg>;
    case "generate":
      return <svg {...common}><path d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2" /></svg>;
    case "list":
      return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>;
    case "classes":
      return <svg {...common}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="3" /></svg>;
  }
}

const profileByRole: Record<UserRole, { name: string; title: string; status: string }> = {
  admin: {
    name: "Amelia Cruz",
    title: "System Administrator",
    status: "Platform secure",
  },
  teacher: {
    name: "Teacher Account",
    title: "Classroom Owner",
    status: "Ready to create quizzes",
  },
};

export default function AppShell({ role, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = navByRole[role];
  const profile = profileByRole[role];
  const panelTitle = role === "admin" ? "Admin Panel" : "Teacher Panel";
  const activePage = nav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Overview";
  const roleLabel = role === "admin" ? "System Ops" : "Teaching Ops";
  const groupedNav = nav.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div className={styles.shellRoot}>
      <div className={styles.shellGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.brandBlock}>
            <span className={styles.brandMark}>T</span>
            <div>
              <p className={styles.brandPill}>Teachify {role}</p>
              <h1 className={styles.workspaceTitle}>Workspace</h1>
            </div>
          </div>

          <nav className={styles.navList}>
            {Object.entries(groupedNav).map(([group, items]) => (
              <section key={group} className={styles.navGroup}>
                <p className={styles.groupTitle}>{group}</p>
                <div className={styles.groupItems}>
                  {items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                      >
                        <span className={styles.navIcon} aria-hidden="true">
                          <NavIcon icon={item.icon} />
                        </span>
                        <span className={styles.navLabel}>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <p>System status</p>
            <span>All services healthy</span>
          </div>
        </aside>

        <section className={styles.mainColumn}>
          <header className={styles.topbar}>
            <div className={styles.topbarHeader}>
              <div>
                <p className={styles.topbarKicker}>{roleLabel}</p>
                <h2 className={styles.topbarTitle}>{panelTitle}</h2>
                <p className={styles.topbarSubtext}>
                  Section: <strong>{activePage}</strong>
                  <span>{todayLabel}</span>
                </p>
              </div>

              <div className={styles.headerActions}>
                <button type="button" className={styles.ghostBtn}>Export snapshot</button>
                <button type="button" className={styles.primaryBtn}>New announcement</button>
              </div>
            </div>

            <div className={styles.topbarRow}>
              <div className={styles.metaStrip}>
                <span className={styles.metaChip}>Live workspace</span>
                <span className={styles.metaChip}>Auto refresh: 30s</span>
                <span className={styles.metaChip}>Scope: {activePage}</span>
              </div>

              <div className={styles.topbarActions}>
                <div className={styles.profileCard}>
                  <span className={styles.avatar}>{profile.name.charAt(0)}</span>
                  <div>
                    <p className={styles.profileName}>{profile.name}</p>
                    <p className={styles.profileRole}>{profile.title}</p>
                  </div>
                  <span className={styles.profileStatus}>{profile.status}</span>
                </div>

                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={() => {
                    signOut();
                    router.push("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className={styles.contentSurface}>{children}</main>
        </section>
      </div>
    </div>
  );
}
