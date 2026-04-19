"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { getStoredToken } from "@/lib/auth/session";
import { fetchTeacherNotifications } from "@/lib/teacher/notification-service";
import type { TeacherNotification } from "./mock-data";

type TeacherNotificationsContextValue = {
  notifications: TeacherNotification[];
  unreadCount: number;
  recentNotifications: TeacherNotification[];
  isLoading: boolean;
  lastSyncedAt: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
};

const TeacherNotificationsContext = createContext<TeacherNotificationsContextValue | null>(null);

type TeacherNotificationsProviderProps = {
  children: ReactNode;
};

export function TeacherNotificationsProvider({ children }: TeacherNotificationsProviderProps) {
  const session = useTeacherSession();
  const [notifications, setNotifications] = useState<TeacherNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  const recentNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);

  const refreshNotifications = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setNotifications([]);
      setIsLoading(false);
      setLastSyncedAt(new Date().toISOString());
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchTeacherNotifications({ token, session });
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
      setLastSyncedAt(new Date().toISOString());
    }
  }, [session]);

  useEffect(() => {
    refreshNotifications();
    // Session fields affect plan-based notifications, so we resync when they change.
  }, [refreshNotifications, session?.id, session?.planTier, session?.quizGenerationLimit, session?.quizzesUsed]);

  const value = useMemo<TeacherNotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      recentNotifications,
      isLoading,
      lastSyncedAt,
      refreshNotifications,
      markAsRead: (id: string) => {
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
        );
      },
      markAllAsRead: () => {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      },
      deleteNotification: (id: string) => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      },
    }),
    [notifications, unreadCount, recentNotifications, isLoading, lastSyncedAt, refreshNotifications],
  );

  return (
    <TeacherNotificationsContext.Provider value={value}>
      {children}
    </TeacherNotificationsContext.Provider>
  );
}

export function useTeacherNotifications() {
  const context = useContext(TeacherNotificationsContext);
  if (!context) {
    throw new Error("useTeacherNotifications must be used within TeacherNotificationsProvider");
  }
  return context;
}
