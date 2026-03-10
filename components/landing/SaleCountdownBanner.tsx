"use client";

import { useEffect, useState } from "react";

type Countdown = {
  hours: number;
  mins: number;
  secs: number;
};

export default function SaleCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<Countdown>({ hours: 24, mins: 0, secs: 0 });
  const units = [
    { key: "hours", value: String(timeLeft.hours).padStart(2, "0"), label: "Hours", short: "H", className: "c-hours" },
    { key: "mins", value: String(timeLeft.mins).padStart(2, "0"), label: "Minutes", short: "M", className: "c-mins" },
    { key: "secs", value: String(timeLeft.secs).padStart(2, "0"), label: "Seconds", short: "S", className: "c-secs" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sketch-sale-wrap">
      <div className="sketch-canvas">
        <div className="lp-sale-banner-sketch">
          <div className="sale-content-wrap">
            <span className="sale-badge">SEASON SALE</span>
            <span className="sale-msg">
              Grab 50% OFF Teachify Pro - <strong>Limited Teachers only!</strong>
            </span>
          </div>
          <div
            className="sale-countdown-sketch"
            role="timer"
            aria-live="polite"
            aria-label={`Sale ends in ${String(timeLeft.hours).padStart(2, "0")} hours ${String(timeLeft.mins).padStart(2, "0")} minutes ${String(timeLeft.secs).padStart(2, "0")} seconds`}
          >
            <span className="c-kicker">Ends In</span>
            <div className="c-track">
              {units.map((unit, index) => (
                <div className="c-segment" key={unit.key}>
                  <div className={`c-box-sketch ${unit.className}`}>
                    <span className="c-sticker">{unit.short}</span>
                    <span className="c-value">{unit.value}</span>
                    <span className="c-label">{unit.label}</span>
                  </div>
                  {index < units.length - 1 ? <span className="c-dot" aria-hidden="true">•</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
