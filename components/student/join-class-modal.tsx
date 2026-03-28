"use client";

import { useState } from "react";
import { X, Plus, Key } from "lucide-react";
import { apiJoinClassByCode, getApiErrorMessage } from "@/lib/api/client";
import { getStoredToken } from "@/lib/auth/session";
import { useToast } from "@/components/ui/toast/toast-provider";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CLASS_JOIN_CODE_LENGTH = 6;
const LINK_EXPIRY_ERROR_PATTERN = /link\s+expired|invite\s+link\s+expired/i;

function normalizeJoinCode(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

function getJoinClassErrorMessage(rawErrorMsg: string): string {
  return LINK_EXPIRY_ERROR_PATTERN.test(rawErrorMsg)
    ? "Invite links can expire, but class codes should still work. Please try again or ask your teacher to refresh invite settings."
    : rawErrorMsg;
}

export function JoinClassModal({ isOpen, onClose, onSuccess }: JoinClassModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState("");

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = normalizeJoinCode(code);

    if (!normalizedCode || normalizedCode.length !== CLASS_JOIN_CODE_LENGTH) {
      showToast(`Code must be ${CLASS_JOIN_CODE_LENGTH} characters long.`, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getStoredToken();
      const { response, data } = await apiJoinClassByCode(token ?? undefined, normalizedCode);
      
      if (response.ok) {
        const message = typeof data.message === "string" ? data.message : "Join request submitted successfully.";
        showToast(message, "success");
        onSuccess();
        onClose();
        setCode("");
      } else {
        const rawErrorMsg = getApiErrorMessage(response, data, "Failed to join classroom.");
        const errorMsg = getJoinClassErrorMessage(rawErrorMsg);
        showToast(errorMsg, "error");
      }
    } catch {
      showToast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-[480px] rounded-[32px] border-2 border-[#0f172a] bg-white p-8 shadow-[16px_16px_0_#0f172a] animate-in zoom-in duration-300">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-[2px_2px_0_#0f172a]">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-[22px] font-black tracking-tight text-[#0f172a]">Join a Class</h3>
              <p className="text-[13px] font-bold text-slate-400">Enter the code provided by your teacher.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#0f172a]">Class Join Code</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              <input
                autoFocus
                maxLength={CLASS_JOIN_CODE_LENGTH}
                value={code}
                onChange={(e) => setCode(normalizeJoinCode(e.target.value))}
                placeholder="E.g. ABC123"
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-[18px] font-black uppercase tracking-[0.2em] text-[#0f172a] outline-none transition-all focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(129,140,248,0.1)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || normalizeJoinCode(code).length !== CLASS_JOIN_CODE_LENGTH}
            className="w-full rounded-2xl border-2 border-[#0f172a] bg-indigo-500 py-4 text-[14px] font-black uppercase tracking-[0.1em] text-white shadow-[6px_6px_0_#0f172a] hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Joining..." : "Join Classroom"}
          </button>
        </form>
      </div>
    </div>
  );
}
