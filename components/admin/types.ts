export type NavIconType =
  | "overview"
  | "users"
  | "schools"
  | "subscriptions"
  | "quizzes"
  | "ai"
  | "revenue"
  | "system"
  | "settings";

export type NavItem = {
  group: string;
  label: string;
  icon: NavIconType;
  href: string;
  active?: boolean;
};

export type StatCard = {
  title: string;
  value: string;
  note: string;
  accent: string;
};

export type RealtimeEvent = {
  type: "Success" | "Warning" | "Info";
  msg: string;
  time: string;
  style: string;
};
