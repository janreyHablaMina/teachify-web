"use client";

import { useState } from "react";
import { X, Link as LinkIcon } from "lucide-react";
import { apiUpdateInviteExpiration, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";
import { InviteLinkCard } from "./invite-modal/link-card";
import { ExpiryPicker } from "./invite-modal/expiry-picker";
import type { ExpiryMode } from "./invite-modal/types";

interface InviteStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  joinCode: string;
  classId: number | string;
}

export function InviteStudentsModal({ isOpen, onClose, joinCode, classId }: InviteStudentsModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiryMode, setExpiryMode] = useState<ExpiryMode>("30m");

  // Expiration State
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}/student/register?code=${encodeURIComponent(joinCode)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Link copied!", "success");
  };

  const handleSave = async (modeOverride?: ExpiryMode): Promise<boolean> => {
    const mode = modeOverride ?? expiryMode;
    setIsSubmitting(true);
    try {
      const token = getStoredToken();
      let isoDate: string | null = null;

      if (mode === "none") {
        isoDate = null;
      } else if (mode === "15m") {
        isoDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      } else if (mode === "30m") {
        isoDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      } else if (mode === "1h") {
        isoDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      } else if (selectedDay !== null) {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDay);
        let h = parseInt(hour, 10);
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        date.setHours(h, parseInt(minute, 10));
        
        // Frontend check for "after now"
        if (date <= new Date()) {
          showToast("Expiration must be in the future.", "error");
          return false;
        }

        isoDate = date.toISOString();
      } else {
        showToast("Please choose a custom date.", "error");
        return false;
      }

      const { response, data } = await apiUpdateInviteExpiration(token ?? undefined, classId, isoDate);
      if (response.ok) {
        return true;
      } else {
        const message = getApiErrorMessage(response, data, "Failed to save settings.");
        showToast(message, "error");
        return false;
      }
    } catch {
      showToast("An unexpected error occurred.", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-[32px] border-2 border-[#0f172a] bg-white shadow-[16px_16px_0_#0f172a] animate-in zoom-in duration-300">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b-2 border-slate-100 bg-slate-50/50 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f172a] text-white shadow-[3px_3px_0_#99f6e4]">
              <LinkIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[20px] font-black text-[#0f172a] leading-none">Invitation Dashboard</h3>
              <p className="mt-1.5 text-[13px] font-bold text-slate-400">Class Join Code: <span className="text-[#0f172a]">{joinCode}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="p-8">
          <InviteLinkCard 
            inviteUrl={inviteUrl} 
            copied={copied} 
            onCopy={handleCopy} 
          />

          <ExpiryPicker
            expiryMode={expiryMode}
            setExpiryMode={setExpiryMode}
            viewDate={viewDate}
            setViewDate={setViewDate}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            hour={hour}
            setHour={setHour}
            minute={minute}
            setMinute={setMinute}
            ampm={ampm}
            setAmpm={setAmpm}
            onAutoSave={handleSave}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
