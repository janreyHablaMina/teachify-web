"use client";

import { useState } from "react";
import { X, Link as LinkIcon } from "lucide-react";
import { apiUpdateInviteExpiration, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";
import { InviteLinkCard } from "./invite-modal/link-card";
import { ExpiryPicker } from "./invite-modal/expiry-picker";

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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const token = getStoredToken();
      let isoDate: string | null = null;
      
      if (selectedDay !== null) {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDay);
        let h = parseInt(hour);
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        date.setHours(h, parseInt(minute));
        
        // Frontend check for "after now"
        if (date <= new Date()) {
          showToast("Expiration must be in the future.", "error");
          setIsSubmitting(false);
          return;
        }

        isoDate = date.toISOString();
      }

      const { response, data } = await apiUpdateInviteExpiration(token ?? undefined, classId, isoDate);
      if (response.ok) {
        showToast("Settings saved!", "success");
        onClose();
      } else {
        const message = getApiErrorMessage(response, data, "Failed to save settings.");
        showToast(message, "error");
      }
    } catch {
      showToast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-[640px] overflow-hidden rounded-[32px] border-2 border-[#0f172a] bg-white shadow-[16px_16px_0_#0f172a] animate-in zoom-in duration-300">
        
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
            onSave={handleSave}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
