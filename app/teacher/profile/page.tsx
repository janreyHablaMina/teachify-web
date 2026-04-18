"use client";

import { useEffect, useMemo, useState } from "react";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { apiUpdatePassword, apiUpdateProfile, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";
import { User, Shield, CreditCard, Save, Lock, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const session = useTeacherSession();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"general" | "security">("general");
  
  // General Info State
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (session) {
      setFullname(session.name ?? "");
      setEmail(session.email ?? "");
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const token = getStoredToken();
      const { response, data } = await apiUpdateProfile(token ?? undefined, { fullname, email });
      if (response.ok) {
        showToast("Profile updated successfully. Refreshing session...", "success");
        // We could manually update session context here if it supports it, 
        // or just let the user see the success and refresh.
      } else {
        showToast(getApiErrorMessage(response, data, "Failed to update profile."), "error");
      }
    } catch {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const token = getStoredToken();
      const { response, data } = await apiUpdatePassword(token ?? undefined, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      if (response.ok) {
        showToast("Password updated successfully.", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(getApiErrorMessage(response, data, "Failed to update password."), "error");
      }
    } catch {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <header className="mb-8">
        <p className="text-[12px] font-black uppercase tracking-[0.09em] text-slate-500 mb-1">Account Settings</p>
        <h1 className="text-[36px] font-black leading-none tracking-[-0.03em] text-slate-900">Your Profile</h1>
        <p className="mt-2 text-[15px] font-bold text-slate-500">Manage your account information and security settings.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm
              ${activeTab === "general" 
                ? "border-[#0f172a] bg-white shadow-[4px_4px_0_#99f6e4] text-[#0f172a]" 
                : "border-transparent text-slate-500 hover:bg-white hover:border-[#0f172a]/10"}
            `}
          >
            <User size={18} />
            General Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm
              ${activeTab === "security" 
                ? "border-[#0f172a] bg-white shadow-[4px_4px_0_#99f6e4] text-[#0f172a]" 
                : "border-transparent text-slate-500 hover:bg-white hover:border-[#0f172a]/10"}
            `}
          >
            <Shield size={18} />
            Security & Password
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="rounded-[32px] border-2 border-[#0f172a] bg-white p-7 shadow-[8px_8px_0_#0f172a]">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <User className="text-emerald-500" />
                  Personal Information
                </h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid gap-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Full Name</label>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 font-bold text-[#0f172a] outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 font-bold text-[#0f172a] outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#0f172a] bg-[#fef08a] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#0f172a] shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Account Details / Plan */}
              <div className="rounded-[32px] border-2 border-[#0f172a] bg-white p-7 shadow-[8px_8px_0_#fef08a]">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <CreditCard className="text-blue-500" />
                  Current Plan
                </h3>
                
                <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-[#0f172a] bg-slate-50">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-500">Subscription</p>
                    <p className="text-2xl font-black text-[#0f172a] uppercase">{session?.planTier ?? "Trial"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase text-slate-500">Quizzes Used</p>
                    <p className="text-2xl font-black text-[#0f172a]">{session?.quizzesUsed ?? 0} / {session?.quizGenerationLimit ?? 3}</p>
                  </div>
                </div>
                
                <p className="mt-4 text-sm font-bold text-slate-500 italic">
                  * Upgrade your plan to increase your generation limits and unlock classroom features.
                </p>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-[32px] border-2 border-[#0f172a] bg-white p-7 shadow-[8px_8px_0_#fda4af]">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <Lock className="text-rose-500" />
                Change Password
              </h3>
              
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="grid gap-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 font-bold text-[#0f172a] outline-none transition focus:bg-white focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 font-bold text-[#0f172a] outline-none transition focus:bg-white focus:ring-2 focus:ring-rose-500/20"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#0f172a] bg-slate-50 px-4 py-3 font-bold text-[#0f172a] outline-none transition focus:bg-white focus:ring-2 focus:ring-rose-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-6 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0_#fda4af] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#fda4af] active:translate-y-0 disabled:opacity-50"
                  >
                    {isUpdatingPassword ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
                    Update Security
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
