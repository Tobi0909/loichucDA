"use client";

import { useEffect, useMemo } from "react";

interface Props {
  active: boolean;
  onDone?: () => void;
}

const BURST_COUNT = 3;
const PARTICLES_PER_BURST = 14;
const HUES = [330, 45, 200, 275];
const DURATION_MS = 1700;

/** Chùm pháo hoa nhỏ, thuần CSS — bùng lên rồi tự tắt, dùng cho easter egg. */
export default function Fireworks({ active, onDone }: Props) {
  const bursts = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: BURST_COUNT }, (_, bi) => ({
      id: bi,
      left: 15 + Math.random() * 70,
      top: 12 + Math.random() * 40,
      delay: bi * 0.22,
      hue: HUES[bi % HUES.length] ?? 330,
      particles: Array.from({ length: PARTICLES_PER_BURST }, (_, pi) => {
        const angle = (pi / PARTICLES_PER_BURST) * Math.PI * 2;
        const dist = 46 + Math.random() * 38;
        return {
          id: pi,
          dx: Math.round(Math.cos(angle) * dist),
          dy: Math.round(Math.sin(angle) * dist),
        };
      }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => onDone?.(), DURATION_MS);
    return () => window.clearTimeout(t);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{ left: `${b.left}%`, top: `${b.top}%` }}
        >
          {b.particles.map((p) => (
            <span
              key={p.id}
              className="absolute h-1.5 w-1.5 rounded-full animate-fireworkParticle"
              style={
                {
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  animationDelay: `${b.delay}s`,
                  backgroundColor: `hsl(${b.hue} 90% 65%)`,
                  boxShadow: `0 0 6px hsl(${b.hue} 90% 65%)`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
