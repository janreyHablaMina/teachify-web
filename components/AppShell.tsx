"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getUser, logoutFromApi, signOut, type UserRole } from "@/lib/auth";
import { normalizePlanTier } from "@/lib/plans";
import styles from "./app-shell.module.css";

type AppShellProps = {
  role: UserRole;
  children: React.ReactNode;
};

type ShellUser = {
  fullname?: string;
  email?: string;
  role?: string;
  plan?: string;
  plan_tier?: string;
};

type NavItem = {
  group: string;
  label: string;
  href: string;
  icon: "overview" | "users" | "schools" | "subscriptions" | "quizzes" | "analytics" | "ai" | "revenue" | "support" | "system" | "settings" | "generate" | "list" | "classes" | "Doc" | "Magic" | "Book";
};

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { group: "Overview", label: "Overview", href: "/admin", icon: "overview" },
    { group: "Management", label: "User Management", href: "/admin/users", icon: "users" },
    { group: "Management", label: "School Management", href: "/admin/schools", icon: "schools" },
    { group: "Management", label: "Subscription Management", href: "/admin/subscriptions", icon: "subscriptions" },
    { group: "Analytics", label: "Quiz Analytics", href: "/admin/quizzes", icon: "quizzes" },
    { group: "Analytics", label: "AI Usage Monitoring", href: "/admin/ai-usage", icon: "ai" },
    { group: "Analytics", label: "Revenue Dashboard", href: "/admin/revenue", icon: "revenue" },
    { group: "System", label: "System Monitoring", href: "/admin/system", icon: "system" },
    { group: "System", label: "Settings", href: "/admin/settings", icon: "settings" },
  ],
  teacher: [
    { group: "Main", label: "Overview", href: "/teacher", icon: "overview" },
    { group: "Teaching", label: "Generate Quiz", href: "/teacher/generate", icon: "Magic" },
    { group: "Teaching", label: "My Quizzes", href: "/teacher/quizzes", icon: "Book" },
    { group: "Classroom", label: "Classes", href: "/teacher/classes", icon: "classes" },
  ],
  student: [
    { group: "Main", label: "Overview", href: "/student", icon: "overview" },
    { group: "Learning", label: "My Classes", href: "/student/classes", icon: "classes" },
    { group: "Learning", label: "Assignments", href: "/student/assignments", icon: "Book" },
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
    case "ai":
      return <svg {...common}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></svg>;
    case "revenue":
      return <svg {...common}><path d="M3 17 9 11l4 4 8-8" /><path d="M14 7h7v7" /></svg>;
    case "system":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "settings":
      return <svg {...common}><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "generate":
      return <svg {...common}><path d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2" /></svg>;
    case "list":
      return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>;
    case "classes":
      return <svg {...common}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8M12 18v2" /></svg>;
    case "Doc":
      return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
    case "Magic":
      return <svg {...common}><path d="m11.5 15-2 5M15 11.5l5-2M15 15l5 5M8.5 8.5 3 3M12 2l-2 3M2 12l3-2" /></svg>;
    case "Book":
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="3" /></svg>;
  }
}

const profileByRole: Record<UserRole, { name: string; email: string; title: string }> = {
  admin: {
    name: "Amelia Cruz",
    email: "amelia.cruz@teachify.com",
    title: "System Administrator",
  },
  teacher: {
    name: "Teacher Account",
    email: "teacher@teachify.com",
    title: "Classroom Owner",
  },
  student: {
    name: "Student Account",
    email: "student@teachify.com",
    title: "Learner",
  },
};

export default function AppShell({ role, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [teacherPlan, setTeacherPlan] = useState<"trial" | "basic" | "pro" | "school">("trial");
  const [sidebarNotice, setSidebarNotice] = useState("");
  const [profile, setProfile] = useState(profileByRole[role]);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const nav = navByRole[role];
  const activeItem = [...nav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const groupedNav = nav.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setProfile(profileByRole[role]);

    getUser()
      .then((user: ShellUser | null) => {
        if (!isMounted || !user) return;

        setProfile({
          name: user.fullname || profileByRole[role].name,
          email: user.email || profileByRole[role].email,
          title:
            user.role === "admin"
              ? "System Administrator"
              : user.role === "teacher"
                ? "Classroom Owner"
                : "User Account",
        });

        if (role === "teacher") {
          setTeacherPlan(normalizePlanTier(user.plan_tier ?? user.plan));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [role]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!sidebarNotice) return;
    const timer = window.setTimeout(() => setSidebarNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [sidebarNotice]);

  const headerDate = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(now),
    [now]
  );

  const headerTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }).format(now),
    [now]
  );

  async function handleConfirmSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    await logoutFromApi();
    signOut();
    setLogoutConfirmOpen(false);
    router.push("/login");
  }


  return (
    <div className={styles.shellRoot}>
      <div className={styles.shellGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.brandBlock}>
            <div className={styles.stickyLogo}>
              <img src="/teachify-logo.png" alt="Logo" />
              <div className={styles.logoLabel}>Teachify<span className={styles.sketchPink}>AI</span></div>
            </div>
          </div>

          <nav className={styles.navList}>
            {Object.entries(groupedNav).map(([group, items]) => (
              <section key={group} className={styles.navGroup}>
                <p className={styles.groupTitle}>{group}</p>
                <div className={styles.groupItems}>
                  {items.map((item) => {
                    const active = activeItem?.href === item.href;
                    const classesLocked =
                      role === "teacher" &&
                      item.href === "/teacher/classes" &&
                      teacherPlan !== "pro" &&
                      teacherPlan !== "school";

                    if (classesLocked) {
                      return (
                        <button
                          key={item.href}
                          type="button"
                          className={`${styles.navItem} ${styles.navItemLocked}`}
                          onClick={() => setSidebarNotice("Upgrade to Pro to create classrooms")}
                        >
                          <span className={styles.navIcon} aria-hidden="true">
                            <NavIcon icon={item.icon} />
                          </span>
                          <span className={styles.navLabel}>{"\uD83D\uDD12"} {item.label}</span>
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                      >
                        <span className={styles.navIcon} aria-hidden="true">
                          <NavIcon icon={item.icon} />
                        </span>
                        <span className={styles.navLabel}>{item.label} {item.href === "/teacher/classes" && (teacherPlan === "pro" || teacherPlan === "school") && <span className={styles.navBadgePro}>PRO</span>}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
          {sidebarNotice ? <p className={styles.sidebarNotice}>{sidebarNotice}</p> : null}

          <div className={styles.sidebarFooter}>
            <p>System status</p>
            <span>All services healthy</span>
          </div>
        </aside>

        <section className={styles.mainColumn}>
          <header className={styles.topbar}>
            <div className={styles.topbarMain}>
              <div className={styles.topbarLeadWrap}>
                <div className={styles.topbarDivider} aria-hidden="true" />
                <div className={styles.topbarGreet}>
                  <p>{role === "admin" ? "Platform Administrator" : "Educator Account"}
                    {role === "teacher" && (teacherPlan === "pro" || teacherPlan === "school") && (
                      <span className={styles.topbarBadgePro}>PRO</span>
                    )}
</p>
                  <h3>{profile.name.toUpperCase()}</h3>
                  <small className={styles.topbarSubtitle}>
                    {role === "admin"
                      ? "Overseeing growth, schools, and metrics."
                      : "Managing students, classes, and quizzes."}
                  </small>
                </div>
              </div>

              <div className={styles.topbarControls}>
                <div className={styles.timeCluster}>
                  <div className={styles.dateCard}>
                    <span className={styles.dateMonth}>
                      {now.toLocaleString("default", { month: "short" }).toUpperCase()}
                    </span>
                    <span className={styles.dateDay}>{now.getDate()}</span>
                  </div>
                  <div className={styles.timeTape}>
                    <div className={styles.timeTapeHeader}>
                      <span className={styles.timeDot} />
                      LIVE CLOCK {headerDate}
                    </div>
                    <strong className={styles.timeValue}>{headerTime}</strong>
                  </div>
                </div>

                <div className={styles.profileMenu} ref={profileMenuRef}>
                  <button
                    type="button"
                    className={styles.profileTrigger}
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    <span className={styles.avatar}>{profile.name.charAt(0)}</span>
                  </button>

                  {profileOpen && (
                    <div className={styles.profileDropdown} role="menu">
                      <div className={styles.dropdownHead}>
                        <p className={styles.dropdownName}>{profile.name}</p>
                        <p className={styles.dropdownEmail}>{profile.email}</p>
                        <p className={styles.dropdownRole}>{profile.title}</p>
                      </div>
                      <button type="button" className={styles.dropdownItemBtn}>Manage account</button>
                      <button type="button" className={styles.dropdownItemBtn}>Workspace settings</button>
                      <button
                        type="button"
                        className={styles.dropdownSignoutBtn}
                        onClick={() => {
                          setProfileOpen(false);
                          setLogoutConfirmOpen(true);
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className={styles.contentSurface}>{children}</main>
        </section>
      </div>

      {logoutConfirmOpen && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
          <div className={styles.confirmModal}>
            <p className={styles.confirmTag}>Confirm action</p>
            <h3 id="logout-confirm-title" className={styles.confirmTitle}>Sign out now?</h3>
            <p className={styles.confirmText}>You will need to log in again to access your dashboard.</p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmCancelBtn}
                onClick={() => setLogoutConfirmOpen(false)}
                disabled={isSigningOut}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmSignoutBtn}
                onClick={handleConfirmSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? "Signing out..." : "Yes, sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
