"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getInitialTeacherNotifications, type TeacherNotification } from "./mock-data";

type TeacherNotificationsContextValue = {
  notifications: TeacherNotification[];
  unreadCount: number;
  recentNotifications: TeacherNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
};

const TeacherNotificationsContext = createContext<TeacherNotificationsContextValue | null>(null);

type TeacherNotificationsProviderProps = {
  children: ReactNode;
};

export function TeacherNotificationsProvider({ children }: TeacherNotificationsProviderProps) {
  const [notifications, setNotifications] = useState<TeacherNotification[]>(() => getInitialTeacherNotifications());

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  const recentNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);

  const value = useMemo<TeacherNotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      recentNotifications,
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
    [notifications, recentNotifications, unreadCount],
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

