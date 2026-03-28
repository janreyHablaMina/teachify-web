"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { CustomExpiryModal } from "./custom-expiry-modal";
import type { AutoSaveExpiry, ExpiryMode } from "./types";

interface ExpiryPickerProps {
  expiryMode: ExpiryMode;
  setExpiryMode: (mode: ExpiryMode) => void;
  viewDate: Date;
  setViewDate: (date: Date) => void;
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
  hour: string;
  setHour: (hour: string) => void;
  minute: string;
  setMinute: (minute: string) => void;
  ampm: string;
  setAmpm: (ampm: string) => void;
  onAutoSave: AutoSaveExpiry;
  isSubmitting: boolean;
}

const EXPIRY_OPTIONS: Array<{ key: ExpiryMode; label: string }> = [
  { key: "none", label: "No expiration" },
  { key: "15m", label: "15 min" },
  { key: "30m", label: "30 min" },
  { key: "1h", label: "1 hour" },
  { key: "custom", label: "Custom date" },
];

export function ExpiryPicker({
  expiryMode,
  setExpiryMode,
  viewDate,
  setViewDate,
  selectedDay,
  setSelectedDay,
  hour,
  setHour,
  minute,
  setMinute,
  ampm,
  setAmpm,
  onAutoSave,
  isSubmitting,
}: ExpiryPickerProps) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customStep, setCustomStep] = useState<1 | 2>(1);
  const showCustomDate = expiryMode === "custom";

  const selectedCustomDateLabel =
    selectedDay === null
      ? "No date selected"
      : `${viewDate.toLocaleString("default", { month: "short" })} ${selectedDay}, ${viewDate.getFullYear()} at ${hour}:${minute} ${ampm}`;

  const handleModeSelect = (mode: ExpiryMode) => {
    setExpiryMode(mode);

    if (mode === "custom") {
      setCustomStep(1);
      setIsCustomModalOpen(true);
      return;
    }

    setIsCustomModalOpen(false);
    void onAutoSave(mode);
  };

  const handleCustomApply = async () => {
    const saved = await onAutoSave("custom");
    if (saved) {
      setIsCustomModalOpen(false);
    }
  };

  return (
    <>
      <div className="mb-8 space-y-8">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#0f172a]" />
            <span className="text-[12px] font-black uppercase tracking-widest text-[#0f172a]">Link Expiration</span>
          </div>
          <p className="mb-4 text-[13px] font-semibold text-slate-500">Choose a quick expiry or set a custom date and time.</p>
          <div className="flex flex-wrap gap-3">
            {EXPIRY_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleModeSelect(option.key)}
                disabled={isSubmitting}
                className={`min-w-[120px] rounded-xl border-2 px-4 py-3 text-[12px] font-black tracking-[0.03em] transition-all ${
                  expiryMode === option.key
                    ? "border-[#0f172a] bg-[#0f172a] text-white shadow-[3px_3px_0_#99f6e4]"
                    : "border-slate-200 bg-white text-[#0f172a] hover:border-[#0f172a]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {showCustomDate && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Custom Expiration</p>
            <p className="mt-1 text-[14px] font-semibold text-[#0f172a]">{selectedCustomDateLabel}</p>
          </div>
        )}
      </div>

      <CustomExpiryModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        customStep={customStep}
        setCustomStep={setCustomStep}
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
        onApply={handleCustomApply}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
