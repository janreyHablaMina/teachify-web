"use client";

import { useState, useRef, useEffect } from "react";
import { Gochi_Hand } from "next/font/google";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { ConfirmationModal } from "@/components/admin/ui/confirmation-modal";
import {
  formatNotificationTime,
  getInitialTeacherNotifications,
  type TeacherNotification,
} from "@/components/teacher/notifications/mock-data";
import { apiLogout } from "@/lib/api/client";
import { clearStoredToken, getStoredToken } from "@/lib/auth/session";

type TeacherTopbarProps = {
  monthLabel: string;
  day: number;
  headerDate: string;
  headerTime: string;
  userName?: string;
  userEmail?: string;
  userPlanLabel?: string;
};

const gochiHand = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
});

function getInitial(name?: string): string {
  if (!name) return "E";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "E";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export function TeacherTopbar({
  monthLabel,
  day,
  headerDate,
  headerTime,
  userName,
  userEmail,
  userPlanLabel,
}: TeacherTopbarProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<TeacherNotification[]>(() => getInitialTeacherNotifications());
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const displayName = userName?.trim() ? userName.trim() : "Educator";
  const displayEmail = userEmail?.trim() ? userEmail.trim() : "";
  const displayPlan = userPlanLabel?.trim() ? userPlanLabel.trim() : "Free";
  const displayInitial = getInitial(displayName);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const recentNotifications = notifications.slice(0, 6);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      const token = getStoredToken();
      await apiLogout(token ?? undefined);
    } catch {
      // We still clear local auth state and redirect, even if API logout fails.
    } finally {
      clearStoredToken();
      setIsSigningOut(false);
      setIsLogoutModalOpen(false);
      setIsProfileDropdownOpen(false);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 mb-2 border-b-[3.5px] border-[#0f172a] bg-white px-4 py-4 shadow-[0_8px_0_#fef08a] sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 lg:gap-10">
          <div className="flex items-center gap-5">
            <div className="h-12 w-[3.5px] rounded-full bg-[#0f172a] [transform:rotate(-1.5deg)]" />
            <div>
              <p className="m-0 text-[11px] font-normal uppercase tracking-[0.1em] text-slate-600">Educator Account <span className="ml-[6px] inline-block rounded-[3px] border border-[#0f172a] bg-[#fef08a] px-[6px] py-[1px] text-[8px] font-black text-[#0f172a] shadow-[1.5px_1.5px_0_#fda4af]">{displayPlan.toUpperCase()}</span></p>
              <h3 className="m-0 text-2xl font-black uppercase leading-none tracking-[-0.05em] text-[#0f172a]">{displayName}</h3>
              <small className={`${gochiHand.className} mt-2 inline-block rounded bg-[#fef08a] px-2 py-0.5 text-sm font-normal text-slate-600 [transform:rotate(1deg)]`}>
                Managing your students, classes, and quizzes.
              </small>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="min-w-[54px] overflow-hidden rounded border-2 border-[#0f172a] bg-white shadow-[4px_4px_0_#fda4af] [transform:rotate(-2deg)]">
                <span className="block border-b-2 border-[#0f172a] bg-red-500 px-1 py-0.5 text-center text-[10px] font-normal uppercase text-white">
                  {monthLabel}
                </span>
                <span className="block p-1 text-center text-[20px] font-normal leading-none text-[#0f172a]">
                  {day}
                </span>
              </div>

              <div className="relative flex flex-col rounded border-2 border-[#0f172a] bg-white px-3 py-1.5 shadow-[4px_4px_0_#99f6e4] [transform:rotate(1deg)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 left-[30%] -z-10 h-4 w-10 bg-[#fef08a] opacity-50 [transform:rotate(-4deg)]"
                />
                <div className="mb-0.5 flex items-center gap-1.5 text-[9px] font-normal tracking-[0.05em] text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full border border-[#0f172a] bg-green-500" />
                  LIVE CLOCK {headerDate}
                </div>
                <strong className="text-[18px] font-normal leading-tight tracking-[-0.02em] text-[#0f172a]">{headerTime}</strong>
              </div>
            </div>

            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen((prev) => !prev);
                  setIsProfileDropdownOpen(false);
                }}
                className="relative rounded-full border-2 border-[#0f172a] bg-white p-2 shadow-[4px_4px_0_#fef08a] transition hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5 text-[#0f172a]" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 top-full z-[1000] mt-4 w-[320px] overflow-hidden rounded-xl border-[3px] border-[#0f172a] bg-white p-2 shadow-[8px_8px_0_#0f172a] transition-all">
                  <div className="mb-2 flex items-center justify-between border-b-[2px] border-[#0f172a] px-3 pb-3 pt-3">
                    <div>
                      <p className="m-0 text-[16px] font-black text-[#0f172a]">Notifications</p>
                      <p className="m-0 text-[11px] font-bold text-slate-500">{unreadCount} unread updates</p>
                    </div>
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="inline-flex items-center gap-1 rounded-lg border-[1.5px] border-[#0f172a] bg-[#fef08a] px-2 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-[#0f172a] transition hover:-translate-y-0.5"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all
                    </button>
                  </div>

                  <div className="max-h-[320px] overflow-auto px-1 pb-1">
                    {recentNotifications.map((item) => (
                      <div
                        key={item.id}
                        className={`mb-1 rounded-lg border px-3 py-2 ${item.read ? "border-slate-200 bg-slate-50" : "border-[#0f172a] bg-white"}`}
                      >
                        <p className="m-0 text-[13px] font-black text-[#0f172a]">- {item.message}</p>
                        <p className="m-0 mt-1 text-[11px] font-bold text-slate-500">{formatNotificationTime(item.createdAt)}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationOpen(false);
                      router.push("/teacher/notifications");
                    }}
                    className="mt-2 w-full rounded-lg border-2 border-[#0f172a] bg-[#99f6e4] px-3 py-2 text-[12px] font-black text-[#0f172a] shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileDropdownOpen((prev) => !prev);
                  setIsNotificationOpen(false);
                }}
                className="rounded-full border-2 border-[#0f172a] bg-white p-1 shadow-[4px_4px_0_#fda4af] transition hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fda4af] text-base font-black text-[#0f172a]">
                  {displayInitial}
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-4 w-[260px] overflow-hidden rounded-xl border-[3px] border-[#0f172a] bg-white p-2 shadow-[8px_8px_0_#0f172a] transition-all [transform:rotate(1deg)] z-[1000]">
                  <div className="mb-2 border-b-[2px] border-[#0f172a] pb-4 pt-4 px-3">
                    <p className="m-0 text-[18px] font-[950] tracking-tight text-[#0f172a]">{displayName}</p>
                    {displayEmail ? <p className="m-0 mt-1 text-[13px] font-bold text-slate-500">{displayEmail}</p> : null}
                    <span className="mt-3 inline-block rounded-full border-[1.5px] border-[#0f172a] bg-[#fef08a] px-3 py-1 text-[11px] font-black text-[#0f172a] leading-tight">
                      Educator ({displayPlan})
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        router.push("/teacher/profile");
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[14px] font-extrabold text-[#0f172a] transition hover:bg-[#99f6e4] hover:translate-x-1"
                    >
                      My Profile
                    </button>
                    <button 
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[14px] font-extrabold text-[#0f172a] transition hover:bg-[#99f6e4] hover:translate-x-1"
                    >
                      Subscription
                    </button>
                    <button 
                      className="mt-2 border-t-[2px] border-[#0f172a] pt-3 flex w-full items-center px-3 py-2.5 text-left text-[14px] font-black text-red-500 transition hover:bg-red-50"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign out now?"
        message="You will need to log in again to access your dashboard."
        confirmLabel="Yes, sign out"
        isLoading={isSigningOut}
        variant="danger"
      />
    </>
  );
}
