"use client";

import { useMemo } from "react";

/** Sao lấp lánh cho buổi tối — thuần CSS, rất nhẹ. */
export default function StarField({ enabled }: { enabled: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        id: i,
        left: (i * 37.6) % 100,
        top: (i * 61.3) % 92,
        size: 1 + ((i * 7) % 3) * 0.7,
        delay: ((i * 13) % 30) / 10,
        duration: 2.4 + ((i * 5) % 25) / 10,
      })),
    [],
  );

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}
      <div
        className="absolute left-6 top-24 text-5xl opacity-80 sm:left-12 sm:top-28"
        style={{ filter: "drop-shadow(0 0 18px rgba(255,240,180,0.45))" }}
      >
        🌙
      </div>
    </div>
  );
}
