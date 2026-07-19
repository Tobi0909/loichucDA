"use client";

import { useEffect, useRef } from "react";
import type { Period } from "@/lib/time";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  angle: number;
  spin: number;
  alpha: number;
  kind: 0 | 1; // 0 = trái tim, 1 = cánh hoa
  hue: number;
}

interface Props {
  enabled: boolean;
  period: Period;
}

/**
 * Trái tim + cánh hoa rơi, vẽ bằng canvas 2D.
 * Tối ưu cho mobile: giới hạn số hạt theo bề rộng, DPR tối đa 2,
 * dừng hẳn rAF khi tab ẩn hoặc khi người dùng tắt hiệu ứng.
 */
export default function FallingHearts({ enabled, period }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let lastTs = 0;

    const nightHues = [275, 300, 220];
    const dayHues = [340, 330, 285];

    const makeParticle = (seeded: boolean): Particle => {
      const hues = period === "night" ? nightHues : dayHues;
      return {
        x: Math.random() * width,
        y: seeded ? Math.random() * height : -20 - Math.random() * 60,
        size: 8 + Math.random() * 12,
        speed: 14 + Math.random() * 26,
        drift: (Math.random() - 0.5) * 26,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.2,
        alpha: 0.25 + Math.random() * 0.4,
        kind: Math.random() < 0.55 ? 0 : 1,
        hue: hues[Math.floor(Math.random() * hues.length)] ?? 330,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(38, Math.max(14, Math.round(width / 26)));
      particles = Array.from({ length: count }, () => makeParticle(true));
    };

    const drawHeart = (p: Particle) => {
      const s = p.size / 16;
      ctx.beginPath();
      ctx.moveTo(0, 4 * s);
      ctx.bezierCurveTo(-8 * s, -4 * s, -3 * s, -10 * s, 0, -5 * s);
      ctx.bezierCurveTo(3 * s, -10 * s, 8 * s, -4 * s, 0, 4 * s);
      ctx.closePath();
      ctx.fill();
    };

    const drawPetal = (p: Particle) => {
      const s = p.size / 14;
      ctx.beginPath();
      ctx.ellipse(0, 0, 6 * s, 3.2 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = (ts: number) => {
      if (!running) return;
      const dt = lastTs === 0 ? 16 : Math.min(ts - lastTs, 50);
      lastTs = ts;
      const step = dt / 1000;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i] as Particle;
        p.y += p.speed * step;
        p.x += Math.sin(p.y / 60) * p.drift * step;
        p.angle += p.spin * step;

        if (p.y - p.size > height) {
          particles[i] = makeParticle(false);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle =
          period === "night"
            ? `hsl(${p.hue} 70% 78%)`
            : `hsl(${p.hue} 80% 72%)`;
        if (p.kind === 0) drawHeart(p);
        else drawPetal(p);
        ctx.restore();
      }

      raf = window.requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        lastTs = 0;
        raf = window.requestAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = window.requestAnimationFrame(frame);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, period]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
