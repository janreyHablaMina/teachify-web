export type NavIconType =
  | "overview"
  | "users"
  | "schools"
  | "subscriptions"
  | "quizzes"
  | "ai"
  | "revenue"
  | "system"
  | "settings"
  | "generate"
  | "classes"
  | "lessons"
  | "notifications";

export type NavItem = {
  group: string;
  label: string;
  icon: NavIconType;
  href: string;
  active?: boolean;
};
