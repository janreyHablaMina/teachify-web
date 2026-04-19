"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useTeacherSession } from "@/components/teacher/teacher-session-context";
import { 
  apiGetClassrooms, 
  apiGetQuizzes, 
  apiUpdatePassword, 
  apiUpdateProfile, 
  apiUpdateAvatar,
  getApiErrorMessage 
} from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";
import { emitTeacherProfileUpdated } from "@/lib/teacher/profile-events";
import { 
  User, 
  Shield, 
  CreditCard, 
  Save, 
  Lock, 
  Loader2, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Bot,
  Bell,
  Database,
  Palette,
  CheckCircle2,
  XCircle,
  Mail,
  Zap,
  Download,
  Key
} from "lucide-react";
import { PlanBanner } from "@/components/teacher/dashboard/plan-banner";
import { PlanFeaturesPanel } from "@/components/teacher/dashboard/plan-features-panel";
import { normalizePlanTier, PLAN_CATALOG } from "@/components/teacher/dashboard/plan";
import type { TeacherPlanUser } from "@/components/teacher/dashboard/types";

type TabID = "identity" | "ai" | "subscription" | "notifications" | "security" | "data" | "ui";

const TEACHING_LEVELS = ["Elementary", "High School", "College", "Post-Graduate"];

export default function ProfilePage() {
  const session = useTeacherSession();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabID>("identity");
  
  // State for all 20+ fields
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Password State
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Stats State
  const [stats, setStats] = useState({ classrooms: 0, quizzes: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Sync state with session
  useEffect(() => {
    if (session) {
      setProfile({
        fullname: session.name ?? "",
        email: session.email ?? "",
        display_name: session.displayName ?? "",
        bio: session.bio ?? "",
        school: session.school ?? "",
        subjects: session.subjects ?? [], // Kept in state, but UI for editing is removed
        teaching_level: session.teachingLevel ?? "High School",
        ai_default_difficulty: session.aiDefaultDifficulty ?? "medium",
        ai_default_question_type: session.aiDefaultQuestionType ?? "mixed",
        ai_language: session.aiLanguage ?? "English",
        ai_tone: session.aiTone ?? "Formal",
        ai_generate_explanations: session.aiGenerateExplanations ?? true,
        ai_include_rationale: session.aiIncludeRationale ?? true,
        notify_email: session.notifyEmail ?? true,
        notify_quiz_completed: session.notifyQuizCompleted ?? true,
        notify_student_submission: session.notifyStudentSubmission ?? true,
        notify_weekly_summary: session.notifyWeeklySummary ?? true,
        ui_theme: session.uiTheme ?? "light",
        ui_accent_color: session.uiAccentColor ?? "#0f172a",
        ui_density: session.uiDensity ?? "comfortable",
        two_factor_enabled: session.twoFactorEnabled ?? false,
      });
    }
  }, [session]);

  // Fetch Stats
  useEffect(() => {
    async function fetchStats() {
      try {
        const token = getStoredToken();
        const [c, q] = await Promise.all([
          apiGetClassrooms<any[]>(token ?? undefined),
          apiGetQuizzes<any[]>(token ?? undefined)
        ]);
        setStats({ 
          classrooms: c.response.ok ? c.data.length : 0, 
          quizzes: q.response.ok ? q.data.length : 0 
        });
      } catch { /* ignore */ } finally { setIsLoadingStats(false); }
    }
    fetchStats();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: string) => {
    setProfile(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const saveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const token = getStoredToken();
      const { response, data } = await apiUpdateProfile(token ?? undefined, profile as any);
      if (response.ok) {
        emitTeacherProfileUpdated({
          fullname: typeof profile.fullname === "string" ? profile.fullname : "",
          displayName: typeof profile.display_name === "string" ? profile.display_name : "",
          email: typeof profile.email === "string" ? profile.email : "",
        });
        showToast("Control Panel preferences updated successfully.", "success");
      } else {
        showToast(getApiErrorMessage(response, data, "Failed to update profile."), "error");
      }
    } catch {
      showToast("A network error occurred.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const token = getStoredToken();
      const { response, data } = await apiUpdateAvatar(token ?? undefined, file);
      if (response.ok) {
        showToast("Avatar updated successfully.", "success");
      } else {
        showToast(getApiErrorMessage(response, data, "Failed to upload avatar."), "error");
      }
    } catch {
      showToast("Error uploading image.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        showToast("Passwords do not match.", "error"); return;
    }
    setIsUpdatingPassword(true);
    try {
        const token = getStoredToken();
        const { response, data } = await apiUpdatePassword(token ?? undefined, {
            current_password: passwords.current,
            password: passwords.new,
            password_confirmation: passwords.confirm,
        });
        if (response.ok) {
            showToast("Security credentials updated successfully.", "success");
            setPasswords({ current: "", new: "", confirm: "" });
        } else {
            showToast(getApiErrorMessage(response, data, "Update failed."), "error");
        }
    } catch { showToast("Error occurred.", "error"); } 
    finally { setIsUpdatingPassword(false); }
  };

  // Plan Calculations
  const planTier = normalizePlanTier(session?.planTier);
  const planMeta = PLAN_CATALOG[planTier];
  const limit = session?.quizGenerationLimit ?? 3;
  const used = session?.quizzesUsed ?? 0;
  const progressPercent = (used / (limit || 1)) * 100;

  const joinDate = useMemo(() => {
    if (!session?.createdAt) return "---";
    return new Date(session.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [session?.createdAt]);

  const navItem = (id: TabID, icon: any, label: string, color: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all font-black text-[13px] uppercase tracking-wider
        ${activeTab === id 
          ? `border-[#0f172a] bg-white shadow-[6px_6px_0_${color}] text-[#0f172a] -translate-y-1` 
          : "border-transparent text-slate-500 hover:bg-white hover:border-[#0f172a]/10"}
      `}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="w-full py-8 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">Verified Educator</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date: {joinDate}</span>
          </div>
          <h1 className="text-[48px] font-black leading-none tracking-[-0.05em] text-slate-900">Control Panel</h1>
          <p className="mt-4 text-[16px] font-bold text-slate-500 max-w-xl leading-relaxed">Customize your Teachify experience, fine-tune your AI assistants, and manage your teaching credentials.</p>
        </div>
        <div className="flex items-center gap-4 bg-white border-2 border-slate-900 p-4 rounded-[24px] shadow-[4px_4px_0_#99f6e4]">
           <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center font-black text-teal-700 text-xl border border-teal-200 overflow-hidden">
             {session?.profilePhotoPath ? (
               <img src={`http://localhost:8000/storage/${session.profilePhotoPath}`} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               profile.fullname?.charAt(0) || "T"
             )}
           </div>
           <div>
             <p className="m-0 text-[14px] font-black text-slate-900">{profile.display_name || profile.fullname}</p>
             <p className="m-0 text-[11px] font-bold text-slate-500">{profile.school || "Autonomous Educator"}</p>
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-72 space-y-3 sticky top-8">
           <p className="px-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Teacher Modules</p>
           {navItem("identity", <User size={18} />, "Identity Info", "#99f6e4")}
           {navItem("ai", <Bot size={18} />, "AI Preferences", "#fef08a")}
           {navItem("subscription", <Zap size={18} />, "Plan & Usage", "#c7d2fe")}
           {navItem("notifications", <Bell size={18} />, "Alert Settings", "#fed7aa")}
           {navItem("security", <Shield size={18} />, "Shield Vault", "#fda4af")}
           {navItem("data", <Database size={18} />, "Data & Export", "#e2e8f0")}
           {navItem("ui", <Palette size={18} />, "UI Visuals", "#d1d5db")}
           <div className="pt-6 px-4">
              <button 
                onClick={() => saveProfile()}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-[#0f172a] bg-[#0f172a] py-4 text-xs font-black uppercase tracking-widest text-white shadow-[6px_6px_0_#99f6e4] transition hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Deploy Changes
              </button>
           </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full space-y-8">
          {activeTab === "identity" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               {/* Identity Card */}
               <div className="rounded-[36px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#99f6e4]">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black flex items-center gap-3"><User className="text-teal-500" /> Professional Identity</h3>
                    <div className="relative group">
                       <div className="h-20 w-20 rounded-2xl bg-slate-50 border-2 border-slate-900 flex items-center justify-center font-black text-2xl text-slate-400 overflow-hidden shadow-[4px_4px_0_#0f172a]">
                          {session?.profilePhotoPath ? (
                            <img src={`http://localhost:8000/storage/${session.profilePhotoPath}`} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            profile.fullname?.charAt(0) || "T"
                          )}
                       </div>
                       <label className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-teal-400 border-2 border-slate-900 cursor-pointer shadow-[2px_2px_0_#0f172a] hover:-translate-y-0.5 transition-all">
                          <Palette size={14} className="text-slate-900" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                       </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Full Legal Name</label>
                        <input className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none" 
                          value={profile.fullname} onChange={e => handleInputChange("fullname", e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Public Display Name</label>
                        <input className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none" 
                          placeholder="e.g. Professor X" value={profile.display_name} onChange={e => handleInputChange("display_name", e.target.value)} />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Professional Bio</label>
                        <textarea className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none min-h-[120px]" 
                          placeholder="Tell your students about your experience..." value={profile.bio} onChange={e => handleInputChange("bio", e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Institution / School</label>
                        <input className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none" 
                          placeholder="Global Academy" value={profile.school} onChange={e => handleInputChange("school", e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Teaching Level</label>
                        <select className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none appearance-none"
                          value={profile.teaching_level} onChange={e => handleInputChange("teaching_level", e.target.value)}>
                          {TEACHING_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="rounded-[36px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#fef08a]">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Bot className="text-yellow-600" /> Neural Preferences</h3>
                  <p className="text-sm font-bold text-slate-500 mb-8 border-l-4 border-yellow-200 pl-4">Define how the Teachify AI behaves across all your quiz generations. These are your classroom defaults.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Default Difficulty</label>
                           <div className="grid grid-cols-3 gap-2">
                              {["easy", "medium", "hard"].map(v => (
                                <button key={v} onClick={() => handleInputChange("ai_default_difficulty", v)}
                                  className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all
                                    ${profile.ai_default_difficulty === v ? "border-slate-900 bg-yellow-100 shadow-[4px_4px_0_#0f172a]" : "border-slate-100 text-slate-400"}
                                  `}>
                                  {v}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Neural Tone</label>
                           <select className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none"
                             value={profile.ai_tone} onChange={e => handleInputChange("ai_tone", e.target.value)}>
                             <option value="Formal">Formal & Academic</option>
                             <option value="Simple">Simple & Clear</option>
                             <option value="Student-friendly">Student Friendly & Engaging</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-5 rounded-3xl border-2 border-slate-100 bg-slate-50/50">
                           <div>
                              <p className="m-0 text-sm font-black text-slate-900">Step-by-Step Explanations</p>
                              <p className="m-0 text-[11px] font-bold text-slate-500">Auto-generate rationale for answers</p>
                           </div>
                           <button onClick={() => handleToggle("ai_generate_explanations")}
                              className={`w-12 h-6 rounded-full border-2 border-slate-900 transition-colors relative
                                ${profile.ai_generate_explanations ? "bg-emerald-400" : "bg-slate-200"}
                              `}>
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white border border-slate-900 transition-all ${profile.ai_generate_explanations ? "right-1" : "left-1"}`} />
                           </button>
                        </div>

                        <div className="flex items-center justify-between p-5 rounded-3xl border-2 border-slate-100 bg-slate-50/50">
                           <div>
                              <p className="m-0 text-sm font-black text-slate-900">Include Teacher Rationale</p>
                              <p className="m-0 text-[11px] font-bold text-slate-500">Provide pedagogical context</p>
                           </div>
                           <button onClick={() => handleToggle("ai_include_rationale")}
                              className={`w-12 h-6 rounded-full border-2 border-slate-900 transition-colors relative
                                ${profile.ai_include_rationale ? "bg-emerald-400" : "bg-slate-200"}
                              `}>
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white border border-slate-900 transition-all ${profile.ai_include_rationale ? "right-1" : "left-1"}`} />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <PlanBanner planMeta={planMeta} remaining={limit - used} limit={limit} used={used} progressPercent={progressPercent} />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <PlanFeaturesPanel planMeta={planMeta} planTier={planTier} />
                  <div className="rounded-[36px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#c7d2fe]">
                     <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Zap className="text-indigo-500" /> Usage Analysis</h3>
                     <div className="space-y-6">
                        <div className="flex justify-between p-5 rounded-2xl border-2 border-slate-100 bg-slate-50">
                           <p className="m-0 text-sm font-black text-slate-500">Next Credit Reset</p>
                           <p className="m-0 text-sm font-black text-slate-900">May 1, 2026</p>
                        </div>
                        <div className="flex justify-between p-5 rounded-2xl border-2 border-slate-100 bg-slate-50">
                           <p className="m-0 text-sm font-black text-slate-500">Cloud Storage Used</p>
                           <p className="m-0 text-sm font-black text-slate-900">1.2 MB / 50 MB</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="rounded-[36px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#fed7aa]">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Bell className="text-orange-500" /> Transmission Channels</h3>
                  <div className="space-y-4">
                     {[
                       { id: "notify_email", label: "Email Notifications", desc: "Core account and security updates" },
                       { id: "notify_quiz_completed", label: "Quiz Completion Alerts", desc: "Get notified when AI finishes a generation" },
                       { id: "notify_student_submission", label: "Submission Alerts", desc: "Real-time updates when students finish assignments" },
                       { id: "notify_weekly_summary", label: "Weekly Intelligence Report", desc: "A summary of student performance and usage" }
                     ].map(n => (
                        <div key={n.id} className="flex items-center justify-between p-6 rounded-3xl border-2 border-slate-900/5 bg-slate-50/30">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500 border border-orange-100">
                                 <Mail size={18} />
                              </div>
                              <div>
                                 <p className="m-0 text-sm font-black text-slate-900">{n.label}</p>
                                 <p className="m-0 text-[11px] font-bold text-slate-500">{n.desc}</p>
                              </div>
                           </div>
                           <button onClick={() => handleToggle(n.id)}
                              className={`w-12 h-6 rounded-full border-2 border-slate-900 transition-colors relative
                                ${profile[n.id] ? "bg-orange-400" : "bg-slate-200"}
                              `}>
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white border border-slate-900 transition-all ${profile[n.id] ? "right-1" : "left-1"}`} />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === "security" && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="rounded-[36px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#fda4af]">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Lock className="text-rose-500" /> Security Shield</h3>
                   <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="grid gap-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Current Vault Key</label>
                        <input className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none" 
                          type="password" placeholder="Enter your current password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="grid gap-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">New Vault Key</label>
                           <input className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none" 
                             type="password" placeholder="Min. 8 characters" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} />
                         </div>
                         <div className="grid gap-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Confirm Key</label>
                           <input className="w-full p-4 rounded-2xl border-2 border-slate-900 font-bold bg-slate-50 focus:bg-white outline-none" 
                             type="password" placeholder="Repeat new password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                         </div>
                      </div>
                      <button type="submit" disabled={isUpdatingPassword}
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#0f172a] bg-[#0f172a] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#fda4af] transition hover:-translate-y-1 active:translate-y-0 disabled:opacity-50">
                        {isUpdatingPassword ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} />} Update Shield
                      </button>
                   </form>
                </div>
                
                <div className="rounded-[36px] border-2 border-slate-900 bg-[#fff1f2] p-8">
                   <h4 className="flex items-center gap-2 text-rose-700 font-black uppercase tracking-widest mb-4"><Zap size={18} /> Two-Factor Authentication</h4>
                   <p className="text-sm font-bold text-rose-600/70 mb-6">Add an extra layer of security to your classroom assets using TOTP authenticators.</p>
                   <button onClick={() => handleToggle("two_factor_enabled")}
                     className={`px-6 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all
                       ${profile.two_factor_enabled ? "border-slate-900 bg-rose-500 text-white shadow-[4px_4px_0_#0f172a]" : "border-rose-200 text-rose-400 bg-white"}
                     `}>
                     {profile.two_factor_enabled ? "Disable 2FA" : "Secure with 2FA"}
                   </button>
                </div>
             </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="rounded-[36px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#e2e8f0]">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Database className="text-slate-600" /> Resource Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <button className="flex items-center gap-4 p-6 rounded-[28px] border-2 border-slate-900 bg-white shadow-[4px_4px_0_#99f6e4] transition-all hover:-translate-y-1">
                        <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100"><Download size={22} /></div>
                        <div className="text-left">
                           <p className="m-0 text-sm font-black text-slate-900">Export All Quizzes</p>
                           <p className="m-0 text-[11px] font-bold text-slate-500">JSON / PDF Bundle</p>
                        </div>
                     </button>
                     <button className="flex items-center gap-4 p-6 rounded-[28px] border-2 border-slate-900 bg-white shadow-[4px_4px_0_#c7d2fe] transition-all hover:-translate-y-1">
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100"><Download size={22} /></div>
                        <div className="text-left">
                           <p className="m-0 text-sm font-black text-slate-900">Full System Backup</p>
                           <p className="m-0 text-[11px] font-bold text-slate-500">Download entire account data</p>
                        </div>
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "ui" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="rounded-[36px] border-2 border-[#0f172a] bg-white p-8 shadow-[12px_12px_0_#d1d5db]">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Palette className="text-slate-400" /> Creative Personalization</h3>
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Interface Theme</label>
                        <div className="grid grid-cols-2 gap-4">
                           {["light", "dark"].map(t => (
                              <button key={t} onClick={() => handleInputChange("ui_theme", t)}
                                className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all
                                  ${profile.ui_theme === t ? "border-slate-900 bg-slate-100 shadow-[6px_6px_0_#0f172a]" : "border-slate-100 text-slate-300"}
                                `}>
                                {t === "light" ? "Bright & Clear" : "Midnight Mode"}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Control Panel Density</label>
                        <div className="grid grid-cols-2 gap-4">
                           {["comfortable", "compact"].map(d => (
                              <button key={d} onClick={() => handleInputChange("ui_density", d)}
                                className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all
                                  ${profile.ui_density === d ? "border-slate-900 bg-slate-100 shadow-[6px_6px_0_#0f172a]" : "border-slate-100 text-slate-300"}
                                `}>
                                {d}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
