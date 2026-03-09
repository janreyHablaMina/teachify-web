"use client";

import { useEffect, useState } from "react";

type Countdown = {
  hours: number;
  mins: number;
  secs: number;
};

export default function SaleCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<Countdown>({ hours: 24, mins: 0, secs: 0 });

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
          <div className="sale-countdown-sketch">
            <div className="c-box-sketch">
              {String(timeLeft.hours).padStart(2, "0")}
              <span>h</span>
            </div>
            <div className="c-box-sketch">
              {String(timeLeft.mins).padStart(2, "0")}
              <span>m</span>
            </div>
            <div className="c-box-sketch">
              {String(timeLeft.secs).padStart(2, "0")}
              <span>s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
