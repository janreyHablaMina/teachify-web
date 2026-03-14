"use client";
import { useState, useEffect } from "react";
import styles from "./DateTimePicker.module.css";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function DateTimePicker({ value, onChange, onClose }: Props) {
  // Use a ref to ensure we only set the initial local time once on mount
  const [isMounted, setIsMounted] = useState(false);
  
  const today = new Date();
  const parsed = value ? new Date(value) : null;
  const isValidParsed = parsed && !isNaN(parsed.getTime());
  
  const initialDate = isValidParsed ? parsed : today;

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(isValidParsed ? parsed : today);
  
  const initialHours24 = initialDate.getHours();
  const [hour, setHour] = useState(initialHours24 % 12 || 12);
  const [minute, setMinute] = useState(initialDate.getMinutes());
  const [ampm, setAmpm] = useState<"AM" | "PM">(initialHours24 >= 12 ? "PM" : "AM");

  // Sync state if value changes externally
  useEffect(() => {
    if (value && value !== "null") {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        const h24 = d.getHours();
        setHour(h24 % 12 || 12);
        setMinute(d.getMinutes());
        setAmpm(h24 >= 12 ? "PM" : "AM");
      }
    }
  }, [value]);

  // Set initial value on mount if currently empty
  useEffect(() => {
    setIsMounted(true);
    if (!value || value === "null") {
      const now = new Date();
      const h24 = now.getHours();
      const h12 = h24 % 12 || 12;
      const m = now.getMinutes();
      const ap = h24 >= 12 ? "PM" : "AM";
      
      setHour(h12);
      setMinute(m);
      setAmpm(ap);
      emitChange(now, h12, m, ap);
    }
  }, []);

  const emitChange = (date: Date | null, h: number, m: number, ap: "AM" | "PM") => {
    if (!date) return;
    const finalHour = ap === "PM" ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
    const d = new Date(date);
    d.setHours(finalHour, m, 0, 0);
    
    // Use local time components to avoid UTC shifting
    const YYYY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const DD = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    
    onChange(`${YYYY}-${MM}-${DD}T${HH}:${mm}`);
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    setSelectedDate(newDate);
    emitChange(newDate, hour, minute, ampm);
  };

  const adjustHour = (inc: number) => {
    const next = ((hour - 1 + inc + 12) % 12) + 1;
    setHour(next);
    emitChange(selectedDate, next, minute, ampm);
  };

  const adjustMinute = (inc: number) => {
    const next = (minute + inc + 60) % 60;
    setMinute(next);
    emitChange(selectedDate, hour, next, ampm);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isSelected = (day: number) => 
    selectedDate?.getFullYear() === viewYear && 
    selectedDate?.getMonth() === viewMonth && 
    selectedDate?.getDate() === day;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.picker} onClick={(e) => e.stopPropagation()}>
        <div className={styles.calendar}>
          <div className={styles.calNav}>
            <button className={styles.navBtn} onClick={() => setViewMonth(m => m === 0 ? (setViewYear(y => y - 1), 11) : m - 1)}>‹</button>
            <span className={styles.calTitle}>{MONTHS[viewMonth]} {viewYear}</span>
            <button className={styles.navBtn} onClick={() => setViewMonth(m => m === 11 ? (setViewYear(y => y + 1), 0) : m + 1)}>›</button>
          </div>

          <div className={styles.dayHeaders}>
            {DAYS.map(d => <span key={d}>{d}</span>)}
          </div>

          <div className={styles.calGrid}>
            {blanks.map((_, i) => <span key={`b${i}`} />)}
            {days.map(day => (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`${styles.day} ${isSelected(day) ? styles.daySelected : ""} ${viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate() ? styles.dayToday : ""}`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className={styles.calFooter}>
            <button className={styles.footerBtn} onClick={() => {
              const d = new Date();
              setSelectedDate(d);
              setViewMonth(d.getMonth());
              setViewYear(d.getFullYear());
              emitChange(d, hour, minute, ampm);
            }}>Today</button>
            <button className={styles.footerBtn} onClick={() => { setSelectedDate(null); onChange(""); }}>Clear</button>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.timePicker}>
          <div className={styles.timeHeader}>
            <span className={styles.timeLabel}>Set Time</span>
            <button className={styles.closeBtn} onClick={onClose}>&times;</button>
          </div>
          
          <div className={styles.timeLayout}>
            <div className={styles.timeRow}>
              <div className={styles.timeBox}>{String(hour).padStart(2, "0")}</div>
              <div className={styles.timeActions}>
                <button className={styles.incBtn} onClick={() => adjustHour(1)}>▲</button>
                <button className={styles.incBtn} onClick={() => adjustHour(-1)}>▼</button>
              </div>
              <span className={styles.sep}>:</span>
              <div className={styles.timeBox}>{String(minute).padStart(2, "0")}</div>
              <div className={styles.timeActions}>
                <button className={styles.incBtn} onClick={() => adjustMinute(1)}>▲</button>
                <button className={styles.incBtn} onClick={() => adjustMinute(-1)}>▼</button>
              </div>
            </div>

            <button 
              className={`${styles.ampmToggle} ${ampm === 'PM' ? styles.ampmActive : ''}`}
              onClick={() => { const next = ampm === 'AM' ? 'PM' : 'AM'; setAmpm(next); emitChange(selectedDate, hour, minute, next); }}
            >
              {ampm}
            </button>
          </div>

          {selectedDate && (
            <div className={styles.selectedBadge}>
              {selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} @ {hour}:{String(minute).padStart(2, "0")} {ampm}
            </div>
          )}

          <button className={styles.doneBtn} onClick={onClose}>Set Expiration</button>
        </div>
      </div>
    </div>
  );
}
