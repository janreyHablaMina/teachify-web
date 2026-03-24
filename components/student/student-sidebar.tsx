"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "../ui/nav/nav-icon";
import { NavItem } from "../ui/nav/types";

interface StudentSidebarProps {
  groupedNav: Record<string, NavItem[]>;
  userName?: string;
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ""))
    .join(" ")
    .trim();
}

function getCompactDisplayName(name?: string): string {
  const raw = (name ?? "").trim();
  if (!raw) return "ENROLLED";

  const firstToken = raw.split(/\s+/)[0] ?? "";
  if (firstToken.includes("@")) {
    const local = firstToken.split("@")[0] ?? "";
    const cleaned = local.replace(/[._-]+/g, " ").trim();
    return cleaned ? toTitleCase(cleaned) : "ENROLLED";
  }

  return toTitleCase(firstToken);
}

export function StudentSidebar({ groupedNav, userName }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen flex-col overflow-hidden border-r-2 border-[#0f172a] bg-white/80 px-4 py-6 backdrop-blur lg:flex">
      <div className="mb-8 flex items-center justify-center rounded-[2px] border-2 border-[#0f172a] bg-white p-5 shadow-[8px_8px_0_#c7d2fe] [transform:rotate(-1deg)] transition hover:[transform:rotate(0deg)_scale(1.02)] hover:shadow-[10px_10px_0_#0f172a]">
        <div className="flex items-center gap-3">
          <Image
            src="/teachify-logo.png"
            alt="Teachify logo"
            width={44}
            height={44}
            className="rounded-full border-[1.5px] border-[#0f172a] bg-white p-1 shadow-[2px_2px_0_#99f6e4]"
          />
          <p className="text-2xl font-black leading-none tracking-[-0.04em]">
            Teachify<span className="text-[#a78bfa]">AI</span>
          </p>
        </div>
      </div>

      <nav className="grid gap-6 pb-10">
        {Object.entries(groupedNav).map(([group, items]) => (
          <section key={group} className="grid gap-2">
            <p className="pl-1 text-[11px] font-normal uppercase tracking-[0.15em] text-slate-600">{group}</p>
            <div className="grid gap-2">
              {items.map((item) => {
                const isActive = pathname === item.href;
                const themes: Record<string, { bg: string; indicator: string; hoverBg: string }> = {
                  overview: { bg: "bg-blue-500", indicator: "bg-blue-500", hoverBg: "group-hover:bg-blue-500" },
                  classes: { bg: "bg-rose-500", indicator: "bg-rose-500", hoverBg: "group-hover:bg-rose-500" },
                  quizzes: { bg: "bg-amber-500", indicator: "bg-amber-500", hoverBg: "group-hover:bg-amber-500" },
                  ai: { bg: "bg-violet-500", indicator: "bg-violet-500", hoverBg: "group-hover:bg-violet-500" },
                  settings: { bg: "bg-indigo-500", indicator: "bg-indigo-500", hoverBg: "group-hover:bg-indigo-500" },
                  system: { bg: "bg-cyan-500", indicator: "bg-cyan-500", hoverBg: "group-hover:bg-cyan-500" },
                  default: { bg: "bg-slate-900", indicator: "bg-slate-900", hoverBg: "group-hover:bg-slate-900" },
                };
                const theme = themes[item.icon] ?? themes.default;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-[10px] text-left text-[15px] font-bold text-[#0f172a] transition-all duration-200 ${
                      isActive
                        ? "border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#99f6e4] [transform:rotate(-1deg)]"
                        : "border-2 border-transparent hover:[transform:translateX(4px)_rotate(1deg)] hover:border-[#0f172a] hover:bg-white hover:shadow-[4px_4px_0_#c7d2fe]"
                    }`}
                  >
                    {isActive ? (
                      <span className={`absolute -left-2 top-2 bottom-2 w-[4px] rounded-full ${theme.indicator}`} />
                    ) : null}
                    <span
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#0f172a] transition-all duration-300 ${
                        isActive
                          ? `${theme.bg} text-white shadow-[3px_3px_0_#0f172a]`
                          : `bg-white text-[#0f172a] ${theme.hoverBg} group-hover:text-white group-hover:shadow-[3px_3px_0_#0f172a]`
                      }`}
                    >
                      <span className="h-[20px] w-[20px]">
                        <NavIcon icon={item.icon} />
                      </span>
                    </span>
                    <span className={isActive ? "font-black" : "font-semibold"}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="mt-auto mb-3 rounded-lg border-2 border-[#0f172a] bg-white p-3 shadow-[4px_4px_0_rgba(0,0,0,0.1)] [transform:rotate(1deg)]">
        <p className="text-[11px] font-normal uppercase tracking-[0.1em] text-slate-600">Student Account</p>
        <span className="mt-1 inline-flex rounded-full border-[1.5px] border-[#0f172a] bg-indigo-100 px-2.5 py-1 text-xs font-normal text-[#0f172a]">
          {getCompactDisplayName(userName)}
        </span>
      </div>
    </aside>
  );
}
