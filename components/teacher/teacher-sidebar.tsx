"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "../ui/nav/nav-icon";
import { NavItem } from "../ui/nav/types";

type TeacherSidebarProps = {
  groupedNav: Record<string, NavItem[]>;
};

export function TeacherSidebar({ groupedNav }: TeacherSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen flex-col overflow-y-auto border-r-2 border-[#0f172a] bg-white/80 px-4 py-6 backdrop-blur lg:flex">
      <div className="mb-8 flex items-center justify-center rounded-[2px] border-2 border-[#0f172a] bg-white p-5 shadow-[8px_8px_0_#fef08a] [transform:rotate(-1deg)] transition hover:[transform:rotate(0deg)_scale(1.02)] hover:shadow-[10px_10px_0_#0f172a]">
        <div className="flex items-center gap-3">
          <Image
            src="/teachify-logo.png"
            alt="Teachify logo"
            width={44}
            height={44}
            className="rounded-full border-[1.5px] border-[#0f172a] bg-white p-1 shadow-[2px_2px_0_#99f6e4]"
          />
          <p className="text-2xl font-black leading-none tracking-[-0.04em]">
            Teachify<span className="text-[#fda4af]">AI</span>
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
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-left text-[15px] font-normal text-[#0f172a] transition ${
                      isActive
                        ? "border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#99f6e4] [transform:rotate(-1deg)]"
                        : "border-2 border-transparent hover:[transform:translateX(4px)_rotate(1deg)] hover:border-[#0f172a] hover:bg-white hover:shadow-[4px_4px_0_#fef08a]"
                    }`}
                  >
                    {isActive ? (
                      <span className="absolute -left-2 top-2 bottom-2 w-[3px] rounded-full bg-teal-500" />
                    ) : null}
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-[1.5px] border-[#0f172a] bg-white text-[#0f172a] shadow-[2px_2px_0_#0f172a] ${
                        isActive ? "bg-[#99f6e4]" : ""
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

      <div className="mt-auto mb-3 rounded-lg border-2 border-[#0f172a] bg-white p-3 shadow-[4px_4px_0_rgba(0,0,0,0.1)] [transform:rotate(1deg)]">
        <p className="text-[11px] font-normal uppercase tracking-[0.1em] text-slate-600">Teacher Account</p>
        <span className="mt-1 inline-flex rounded-full border-[1.5px] border-[#0f172a] bg-teal-100 px-2.5 py-1 text-xs font-normal text-[#0f172a]">
          Pro Plan Active
        </span>
      </div>
    </aside>
  );
}
