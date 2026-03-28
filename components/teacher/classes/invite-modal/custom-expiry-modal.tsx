"use client";

import { Calendar as CalendarIcon, Clock, X } from "lucide-react";

interface CustomExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customStep: 1 | 2;
  setCustomStep: (step: 1 | 2) => void;
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
  onApply: () => Promise<void>;
  isSubmitting: boolean;
}

function getTimeValue24(hour: string, minute: string, ampm: string): string {
  const parsedHour = parseInt(hour, 10);
  const parsedMinute = parseInt(minute, 10);
  if (Number.isNaN(parsedHour) || Number.isNaN(parsedMinute)) {
    return "12:00";
  }

  let hour24 = parsedHour % 12;
  if (ampm === "PM") {
    hour24 += 12;
  }

  return `${String(hour24).padStart(2, "0")}:${String(parsedMinute).padStart(2, "0")}`;
}

export function CustomExpiryModal({
  isOpen,
  onClose,
  customStep,
  setCustomStep,
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
  onApply,
  isSubmitting,
}: CustomExpiryModalProps) {
  if (!isOpen) return null;

  const handleTimeChange = (value: string) => {
    const [hh, mm] = value.split(":");
    const hour24 = parseInt(hh, 10);
    const minuteParsed = parseInt(mm, 10);
    if (Number.isNaN(hour24) || Number.isNaN(minuteParsed)) {
      return;
    }

    const nextAmpm = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

    setHour(String(hour12).padStart(2, "0"));
    setMinute(String(minuteParsed).padStart(2, "0"));
    setAmpm(nextAmpm);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[560px] rounded-[24px] border-2 border-[#0f172a] bg-white p-5 shadow-[10px_10px_0_#0f172a]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Set Custom Expiration</h4>
            <p className="mt-1 text-[12px] font-semibold text-slate-500">
              Step {customStep} of 2: {customStep === 1 ? "Choose date" : "Choose time"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {customStep === 1 ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#0f172a]" />
                <span className="text-[12px] font-black uppercase tracking-widest text-[#0f172a]">Custom Date</span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 font-bold text-[#0f172a] transition-all hover:bg-slate-50"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 font-bold text-[#0f172a] transition-all hover:bg-slate-50"
                >
                  &rarr;
                </button>
              </div>
            </div>

            <div className="mb-2 text-[14px] font-black text-[#0f172a]">
              {viewDate.toLocaleString("default", { month: "long" })} {viewDate.getFullYear()}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={`${d}-${i}`} className="py-1.5 text-[10px] font-black uppercase text-slate-300">
                  {d}
                </div>
              ))}
              {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                const isToday = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth();
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square w-full rounded-lg text-[12px] font-black transition-all ${
                      isSelected
                        ? "bg-[#0f172a] text-white shadow-lg"
                        : isToday
                          ? "bg-teal-50 text-teal-600"
                          : "text-[#0f172a] hover:bg-slate-50"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[320px]">
            <div className="mb-2 text-[13px] font-bold text-slate-500">Date selected</div>
            <div className="mb-5 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-black text-[#0f172a]">
              {selectedDay === null
                ? "No date selected"
                : `${viewDate.toLocaleString("default", { month: "long" })} ${selectedDay}, ${viewDate.getFullYear()}`}
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#0f172a]" />
              <span className="text-[12px] font-black uppercase tracking-widest text-[#0f172a]">Choose Time</span>
            </div>

            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">Time</label>
            <input
              type="time"
              step={900}
              value={getTimeValue24(hour, minute, ampm)}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-[18px] font-black text-[#0f172a] outline-none transition-all focus:border-[#0f172a]"
            />
            <p className="mt-2 text-[12px] font-semibold text-slate-500">Selected: {hour}:{minute} {ampm}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-slate-200 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-500 hover:bg-slate-50"
          >
            Close
          </button>
          {customStep === 1 ? (
            <button
              type="button"
              onClick={() => setCustomStep(2)}
              disabled={selectedDay === null}
              className="rounded-xl border-2 border-[#0f172a] bg-[#99f6e4] px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-[#0f172a] disabled:opacity-50"
            >
              Next: Time
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCustomStep(1)}
                className="rounded-xl border-2 border-slate-200 px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-slate-500 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  void onApply();
                }}
                disabled={selectedDay === null}
                className="rounded-xl border-2 border-[#0f172a] bg-[#99f6e4] px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-[#0f172a] disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Apply"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
