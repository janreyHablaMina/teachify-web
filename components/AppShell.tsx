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
    { group: "Management", label: "Users", href: "/admin/users", icon: "users" },
    { group: "Management", label: "Schools", href: "/admin/schools", icon: "schools" },
    { group: "Management", label: "Subscriptions", href: "/admin/subscriptions", icon: "subscriptions" },
    { group: "Operations", label: "Quizzes", href: "/admin/quizzes", icon: "quizzes" },
    { group: "Operations", label: "Analytics", href: "/admin/analytics", icon: "analytics" },
    { group: "Operations", label: "AI Usage", href: "/admin/ai-usage", icon: "ai" },
    { group: "Operations", label: "Revenue", href: "/admin/revenue", icon: "revenue" },
    { group: "Operations", label: "Support", href: "/admin/support", icon: "support" },
    { group: "Operations", label: "System", href: "/admin/system", icon: "system" },
    { group: "Main", label: "Settings", href: "/admin/settings", icon: "settings" },
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
    case "users":
      return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "schools":
      return <svg {...common}><path d="m2 22 10-6 10 6V8L12 2 2 8z" /><path d="M12 22V12" /><path d="M7 10h.01M12 10h.01M17 10h.01" /></svg>;
    case "subscriptions":
      return <svg {...common}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></svg>;
    case "quizzes":
      return <svg {...common}><path d="M9 3h6l4 4v14H5V3z" /><path d="M9 3v4h4" /><path d="M9 13h6M9 17h6" /></svg>;
    case "analytics":
      return <svg {...common}><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20V8" /></svg>;
    case "ai":
      return <svg {...common}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></svg>;
    case "revenue":
      return <svg {...common}><path d="M3 17 9 11l4 4 8-8" /><path d="M14 7h7v7" /></svg>;
    case "support":
      return <svg {...common}><path d="M21 11.5a8.5 8.5 0 0 1-17 0C4 6.8 7.8 3 12.5 3S21 6.8 21 11.5z" /><path d="M8 10a2.5 2.5 0 1 1 5 0c0 1.8-2.5 2-2.5 4" /><path d="M10.5 18h.01" /></svg>;
    case "system":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "settings":
      return <svg {...common}><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "generate":
      return <svg {...common}><path d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2" /></svg>;
    case "list":
      return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>;
    case "classes":
      return <svg {...common}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" /></svg>;
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
