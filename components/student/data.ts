import { NavItem } from "../ui/nav/types";

export const studentNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/student",
    icon: "overview",
    group: "Overview",
  },
  {
    label: "My Classes",
    href: "/student/classes",
    icon: "classes",
    group: "Education",
  },
  {
    label: "My Quizzes",
    href: "/student/quizzes",
    icon: "quizzes",
    group: "Education",
  },
  {
    label: "Achievements",
    href: "/student/achievements",
    icon: "ai",
    group: "Overview",
  },
  {
    label: "Settings",
    href: "/student/settings",
    icon: "settings",
    group: "System",
  },
  {
    label: "Help Center",
    href: "/student/help",
    icon: "system",
    group: "System",
  },
];
