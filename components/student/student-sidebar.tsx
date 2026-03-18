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

export function StudentSidebar({ groupedNav, userName }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen flex-col overflow-hidden border-r-2 border-[#0f172a] bg-white px-4 py-8 backdrop-blur lg:flex">
      {/* Visual Identity: Neobrutalist Sticker */}
      <div className="mb-10 flex items-center justify-center rounded-[2px] border-2 border-[#0f172a] bg-white p-5 shadow-[8px_8px_0_#818cf8] [transform:rotate(-1.5deg)] transition hover:[transform:rotate(0deg)_scale(1.02)] hover:shadow-[10px_10px_0_#0f172a]">
        <div className="flex items-center gap-3">
          <Image
            src="/teachify-logo.png"
            alt="Teachify logo"
            width={40}
            height={40}
            className="rounded-full border-[1.5px] border-[#0f172a] bg-white p-1 shadow-[2px_2px_0_#fda4af]"
          />
          <p className="text-2xl font-black leading-none tracking-[-0.04em]">
            Teachify<span className="text-indigo-500">STU</span>
          </p>
        </div>
      </div>

      <nav className="grid gap-7 pb-10">
        {Object.entries(groupedNav).map(([group, items]) => (
          <section key={group} className="grid gap-3">
            <p className="pl-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-65">{group}</p>
            <div className="grid gap-2">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-[12px] text-left text-[14px] font-black text-[#0f172a] transition ${
                      isActive
                        ? "border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#818cf8] [transform:rotate(-1deg)]"
                        : "border-2 border-transparent hover:border-[#0f172a] hover:bg-white hover:shadow-[4px_4px_0_#fef08a] hover:[transform:translateX(4px)_rotate(1deg)]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[#0f172a] bg-white text-[#0f172a] shadow-[2px_2px_0_#0f172a] ${
                        isActive ? "bg-indigo-400" : ""
                      }`}
                    >
                      <span className="h-[18px] w-[18px]">
                        <NavIcon icon={item.icon} />
                      </span>
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      {/* Profile Summary Slot */}
      <div className="mt-auto mb-2 rounded-2xl border-2 border-[#0f172a] bg-slate-50 p-4 shadow-[4px_4px_0_rgba(15,23,42,0.06)] [transform:rotate(1deg)]">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Enrolled Student</p>
        <p className="mt-1 text-[13px] font-black text-[#0f172a] truncate">{userName ?? "Loading..."}</p>
      </div>
    </aside>
  );
}
