"use client";

import { useTeacherNotifications } from "@/components/teacher/notifications/notifications-context";
import { formatNotificationTime } from "@/components/teacher/notifications/notification-meta";
import { Activity, Zap, CheckCircle2, Clock } from "lucide-react";

type RecentActivityFeedProps = {
  remaining: number;
  used: number;
  limit: number;
};

export function RecentActivityFeed({ remaining, used, limit }: RecentActivityFeedProps) {
  const { recentNotifications, isLoading } = useTeacherNotifications();
  const displayNotifications = recentNotifications.slice(0, 3);

  return (
    <section className="flex h-full flex-col gap-4 rounded-[24px] border-[1.5px] border-indigo-900 bg-indigo-50/40 p-6 shadow-[2px_2px_0_#1e1b4b]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" />
          <h3 className="text-[18px] font-black uppercase tracking-tight text-slate-800">Recent Activity</h3>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Usage Summary Activity Item */}
        <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-indigo-100 bg-indigo-50/30 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
            <Zap className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="m-0 text-[13px] font-black text-slate-900">Usage Update</p>
            <p className="m-0 text-[11px] font-bold text-slate-600">
              You used {used} generation{used !== 1 ? "s" : ""}. {remaining} remaining this month.
            </p>
          </div>
        </div>

        {/* Real Notifications Activity */}
        {isLoading ? (
          <div className="py-4 text-center text-[12px] font-bold text-slate-400">Syncing activity...</div>
        ) : displayNotifications.length > 0 ? (
          <div className="flex flex-col gap-3">
            {displayNotifications.map((notification) => (
              <div key={notification.id} className="group relative flex items-start gap-3 px-1 transition hover:translate-x-1">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <div className="flex flex-col">
                  <p className="m-0 text-[13px] font-bold text-slate-800 group-hover:text-slate-900">{notification.message}</p>
                  <p className="m-0 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <Clock className="mr-1 inline-block h-2.5 w-2.5" />
                    {formatNotificationTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2 rounded-full bg-slate-50 p-3">
              <CheckCircle2 className="h-6 w-6 text-slate-300" />
            </div>
            <p className="m-0 text-[12px] font-bold text-slate-500">All caught up! Start a new quiz to see activity here.</p>
          </div>
        )}
      </div>

      <button className="mt-auto w-full rounded-xl border-2 border-slate-900 bg-[#fef08a] py-2 text-[11px] font-black uppercase tracking-wider text-slate-900 shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-[#fde047]">
        View Usage History
      </button>
    </section>
  );
}
