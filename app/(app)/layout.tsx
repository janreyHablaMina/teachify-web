import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import type { UserRole } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const role = cookieStore.get("teachify_role")?.value;

  if (role !== "admin" && role !== "teacher" && role !== "student") {
    redirect("/login");
  }

  return <AppShell role={role as UserRole}>{children}</AppShell>;
}
