"use client";

import { useMemo, useState } from "react";
import { useTeacherNotifications } from "@/components/teacher/notifications/notifications-context";
import {
  CATEGORY_LABELS,
  formatNotificationTime,
  NOTIFICATION_TYPE_LABELS,
  type NotificationEventType,
  type TeacherNotification,
} from "@/components/teacher/notifications/notification-meta";

type NotificationTab = "all" | "unread" | "system" | "classroom" | "ai_activity";

const TABS: { id: NotificationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "system", label: "System" },
  { id: "classroom", label: "Classroom" },
  { id: "ai_activity", label: "AI Activity" },
];

function statusTone(severity: TeacherNotification["severity"]): string {
  switch (severity) {
    case "success":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    case "critical":
      return "bg-rose-500";
    default:
      return "bg-sky-500";
  }
}

export default function TeacherNotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, isLoading, lastSyncedAt, refreshNotifications } =
    useTeacherNotifications();
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [typeFilter, setTypeFilter] = useState<NotificationEventType | "all">("all");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const tabCounts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((item) => !item.read).length,
      system: notifications.filter((item) => item.category === "system" || item.category === "plan").length,
      classroom: notifications.filter((item) => item.category === "classroom").length,
      ai_activity: notifications.filter((item) => item.category === "ai_activity").length,
    };
  }, [notifications]);

  const availableTabs = useMemo(() => {
    const filtered = TABS.filter((tab) => {
      if (tab.id === "all" || tab.id === "unread") return true;
      return tabCounts[tab.id] > 0;
    });
    if (filtered.some((tab) => tab.id === activeTab)) return filtered;
    const activeTabConfig = TABS.find((tab) => tab.id === activeTab);
    return activeTabConfig ? [...filtered, activeTabConfig] : filtered;
  }, [activeTab, tabCounts]);

  const typeOptions = useMemo(() => {
    const unique = Array.from(new Set(notifications.map((item) => item.eventType)));
    return unique;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const byTab = notifications.filter((item) => {
      if (activeTab === "all") return true;
      if (activeTab === "unread") return !item.read;
      if (activeTab === "system") return item.category === "system" || item.category === "plan";
      if (activeTab === "classroom") return item.category === "classroom";
      return item.category === "ai_activity";
    });

    if (typeFilter === "all") return byTab;
    return byTab.filter((item) => item.eventType === typeFilter);
  }, [notifications, activeTab, typeFilter]);

  const visibleNotifications = filteredNotifications.slice(0, page * pageSize);
  const hasMore = visibleNotifications.length < filteredNotifications.length;

  const onChangeTab = (tab: NotificationTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const onChangeType = (nextType: NotificationEventType | "all") => {
    setTypeFilter(nextType);
    setPage(1);
  };

  return (
    <section className="flex min-h-full w-full flex-col gap-6">
      <header className="rounded-[30px] border-2 border-[#0f172a] bg-white px-6 py-6 shadow-[8px_8px_0_#fef08a]">
        <h1 className="m-0 text-[34px] font-black tracking-[-0.04em] text-[#0f172a]">Notifications</h1>
        <p className="m-0 mt-2 text-sm font-bold text-slate-500">Manage your alerts and activity updates</p>
      </header>

      <section className="rounded-[30px] border-2 border-[#0f172a] bg-white p-5 shadow-[8px_8px_0_#99f6e4]">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`rounded-xl border-2 px-3 py-2 text-[12px] font-black uppercase tracking-[0.05em] transition ${
                  isActive
                    ? "border-[#0f172a] bg-[#0f172a] text-white shadow-[3px_3px_0_#fda4af]"
                    : "border-[#0f172a] bg-white text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                {tab.label} ({tabCounts[tab.id]})
              </button>
            );
          })}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Filter by type</label>
          <select
            value={typeFilter}
            onChange={(event) => onChangeType(event.target.value as NotificationEventType | "all")}
            className="rounded-lg border-2 border-[#0f172a] bg-white px-3 py-2 text-[12px] font-bold text-[#0f172a]"
          >
            <option value="all">All Types</option>
            {typeOptions.map((item) => (
              <option key={item} value={item}>
                {NOTIFICATION_TYPE_LABELS[item]}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg border-2 border-[#0f172a] bg-[#fef08a] px-3 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-[#0f172a] shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5"
          >
            Mark all as read
          </button>
          <button
            type="button"
            onClick={refreshNotifications}
            className="rounded-lg border-2 border-[#0f172a] bg-white px-3 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-[#0f172a] transition hover:bg-slate-50"
          >
            Refresh
          </button>
          {lastSyncedAt ? (
            <span className="text-[11px] font-bold text-slate-400">
              Last synced {formatNotificationTime(lastSyncedAt)}
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] font-bold text-slate-500">
            Syncing notifications from API...
          </div>
        ) : null}

        <div className="grid gap-3">
          {visibleNotifications.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border-2 p-4 transition ${item.read ? "border-slate-200 bg-slate-50" : "border-[#0f172a] bg-white shadow-[4px_4px_0_#f8fafc]"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-[220px] flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${statusTone(item.severity)}`} aria-hidden="true" />
                    <p className="m-0 text-[15px] font-black text-[#0f172a]">{item.title}</p>
                    {!item.read ? <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-[10px] font-black uppercase text-[#1e3a8a]">New</span> : null}
                  </div>
                  <p className="m-0 text-sm font-bold text-slate-600">{item.message}</p>
                  <p className="m-0 mt-2 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400">
                    {CATEGORY_LABELS[item.category]} | {NOTIFICATION_TYPE_LABELS[item.eventType]} | {formatNotificationTime(item.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!item.read ? (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="rounded-lg border-2 border-[#0f172a] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.05em] text-[#0f172a] transition hover:bg-[#dcfce7]"
                    >
                      Mark as read
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    className="rounded-lg border-2 border-[#0f172a] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.05em] text-rose-600 transition hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleNotifications.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-300 px-4 py-8 text-center text-sm font-bold text-slate-500">
            No notifications found for this filter.
          </div>
        ) : null}

        {hasMore ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-xl border-2 border-[#0f172a] bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.05em] text-[#0f172a] shadow-[3px_3px_0_#fda4af] transition hover:-translate-y-0.5"
            >
              Load more
            </button>
          </div>
        ) : null}
      </section>
    </section>
  );
}
