import { NavItem } from "../ui/nav/types";

export const teacherNavItems: NavItem[] = [
  { group: "Main", label: "Overview", icon: "overview", href: "/teacher" },
  { group: "Teaching", label: "Generate Quiz", icon: "generate", href: "/teacher/generate" },
  { group: "Teaching", label: "My Lessons", icon: "lessons", href: "/teacher/lessons" },
  { group: "Teaching", label: "My Quizzes", icon: "quizzes", href: "/teacher/quizzes" },
  { group: "Classroom", label: "Classes", icon: "classes", href: "/teacher/classes" },
  { group: "Settings", label: "Profile", icon: "users", href: "/teacher/profile" },
];
