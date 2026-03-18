"use client";

import { Calendar as CalendarIcon, Clock, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface ExpiryPickerProps {
  viewDate: Date;
  setViewDate: (date: Date) => void;
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
  hour: string;
  setHour: (h: string) => void;
  minute: string;
  setMinute: (m: string) => void;
  ampm: string;
  setAmpm: (a: string) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function ExpiryPicker({
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
  onSave,
  isSubmitting,
}: ExpiryPickerProps) {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10">
      {/* Column 1: Calendar */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[#0f172a]" />
            <span className="text-[12px] font-black uppercase tracking-widest text-[#0f172a]">Set Expiry Date</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-[#0f172a] font-bold"
            >
              &larr;
            </button>
            <button
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-[#0f172a] font-bold"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="mb-3 text-[14px] font-black text-[#0f172a]">
          {viewDate.toLocaleString("default", { month: "long" })} {viewDate.getFullYear()}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={`${d}-${i}`} className="text-[10px] font-black uppercase text-slate-300 py-1.5">
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
                onClick={() => setSelectedDay(day)}
                className={`aspect-square w-full rounded-xl text-[12px] font-black transition-all ${
                  isSelected
                    ? "bg-[#0f172a] text-white shadow-lg"
                    : isToday
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-slate-50 text-[#0f172a]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Column 2: Time Picker */}
      <div className="flex flex-col border-l-2 border-dashed border-slate-100 pl-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-[#0f172a]" />
            <span className="text-[12px] font-black uppercase tracking-widest text-[#0f172a]">Rotation Time</span>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-slate-100 bg-white py-3 pl-4 pr-10 text-[16px] font-black text-[#0f172a] outline-none hover:border-[#0f172a] transition-all"
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>

            <div className="relative group">
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-slate-100 bg-white py-3 pl-4 pr-10 text-[16px] font-black text-[#0f172a] outline-none hover:border-[#0f172a] transition-all"
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 pointer-events-none" />
            </div>

            <div className="flex h-[52px] rounded-xl border-2 border-slate-100 bg-white p-1.5">
              {["AM", "PM"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAmpm(a)}
                  className={`flex-1 rounded-lg text-[13px] font-black transition-all ${
                    ampm === a ? "bg-[#0f172a] text-white shadow-md" : "text-slate-400 hover:text-[#0f172a]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={onSave}
            disabled={isSubmitting || selectedDay === null}
            className="w-full rounded-2xl border-2 border-[#0f172a] bg-[#99f6e4] py-4 text-[14px] font-black uppercase tracking-[0.1em] text-[#0f172a] shadow-[6px_6px_0_#0f172a] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all"
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
