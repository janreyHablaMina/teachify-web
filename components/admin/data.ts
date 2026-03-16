import { NavItem } from "../ui/nav/types";
import type { RealtimeEvent, StatCard } from "./types";

export const navItems: NavItem[] = [
  { group: "Overview", label: "Overview", icon: "overview", href: "/admin" },
  { group: "Management", label: "User Management", icon: "users", href: "/admin/users" },
  { group: "Management", label: "School Management", icon: "schools", href: "/admin/schools" },
  { group: "Management", label: "Subscription Management", icon: "subscriptions", href: "/admin/subscriptions" },
  { group: "Analytics", label: "Quiz Analytics", icon: "quizzes", href: "/admin/quizzes" },
  { group: "Analytics", label: "AI Usage Monitoring", icon: "ai", href: "/admin/ai-usage" },
  { group: "Analytics", label: "Revenue Dashboard", icon: "revenue", href: "/admin/revenue" },
  { group: "System", label: "System Monitoring", icon: "system", href: "/admin/system" },
  { group: "System", label: "Settings", icon: "settings", href: "/admin/settings" },
];

export const statCards: StatCard[] = [
  { title: "Active Schools", value: "124", note: "+12 this month", accent: "before:bg-[#99f6e4]" },
  { title: "Daily Learners", value: "42.8k", note: "+3.2% vs yesterday", accent: "before:bg-[#fef08a]" },
  { title: "Monthly Revenue", value: "$48.2k", note: "115% of goal", accent: "before:bg-[#fda4af]" },
  { title: "AI Generations", value: "890k", note: "System optimal", accent: "before:bg-[#e9d5ff]" },
];

export const realtimeEvents: RealtimeEvent[] = [
  { type: "Success", msg: "v2.5 deployment complete", time: "2m ago", style: "bg-emerald-100 text-emerald-800" },
  { type: "Warning", msg: "API usage spike detected", time: "15m ago", style: "bg-orange-100 text-orange-700" },
  { type: "Info", msg: "New school 'Westwood High' onboarded", time: "1h ago", style: "bg-sky-100 text-sky-800" },
  { type: "Info", msg: "Weekly backup successful", time: "4h ago", style: "bg-sky-100 text-sky-800" },
];

export const growthHeights = [60, 45, 80, 55, 90, 70, 100, 85, 95, 75, 110, 105];

export const topSchools = [
  { name: "Summit Ridge Academy", score: 98 },
  { name: "Lincoln Technical", score: 95 },
  { name: "Global Innovators High", score: 93 },
];
