"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ExamCountdown from "@/components/ExamCountdown";
import FallingHearts from "@/components/FallingHearts";
import MusicToggle from "@/components/MusicToggle";
import StarField from "@/components/StarField";
import { HER_NAME, SIGNATURE, XUNG_HO_EM } from "@/lib/config";
import {
  buildFallbackGreeting,
  createGreetingDecks,
  type GreetingDecks,
  type GreetingPayload,
} from "@/lib/fallback";
import { getVNTime, type Period, type VNTime } from "@/lib/time";

const PERIOD_HELLO: Record<Period, string> = {
  morning: "Chào buổi sáng",
  afternoon: "Chào buổi chiều",
  evening: "Chào buổi tối",
  night: "Chúc ngủ ngon",
};

const PERIOD_EMOJI: Record<Period, string> = {
  morning: "🌅",
  afternoon: "🌤️",
  evening: "🌆",
  night: "🌙",
};

/**
 * Hiện lời chúc dần từng ký tự như đang gõ tin nhắn. Tôn trọng
 * prefers-reduced-motion (hiện đủ ngay) và tự reset khi resetKey đổi
 * (mỗi lần có lời chúc mới). Bấm vào chữ để hiện đủ ngay lập tức.
 */
function useTypewriter(text: string, resetKey: number) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    skipRef.current = false;
    setDone(false);
    setDisplayed("");

    if (!text) {
      setDone(true);
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    const chars = Array.from(text);
    // Câu dài hay ngắn thì tổng thời gian gõ vẫn chỉ khoảng 1-1.6s.
    const perCharMs = Math.min(45, Math.max(12, 1400 / chars.length));

    let shown = 0;
    let raf = 0;
    let last = 0;
    let acc = 0;

    const tick = (now: number) => {
      if (skipRef.current) {
        setDisplayed(text);
        setDone(true);
        return;
      }
      if (last === 0) last = now;
      acc += now - last;
      last = now;
      while (acc >= perCharMs && shown < chars.length) {
        shown += 1;
        acc -= perCharMs;
      }
      setDisplayed(chars.slice(0, shown).join(""));
      if (shown >= chars.length) {
        setDone(true);
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [text, resetKey]);

  const skip = useCallback(() => {
    skipRef.current = true;
  }, []);

  return { displayed, done, skip };
}

export default function Page() {
  const [time, setTime] = useState<VNTime | null>(null);
  const [payload, setPayload] = useState<GreetingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [effectsOn, setEffectsOn] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  // Toàn bộ trạng thái chống lặp nằm trong bộ nhớ (không localStorage).
  const decksRef = useRef<GreetingDecks | null>(null);
  if (decksRef.current === null) decksRef.current = createGreetingDecks();

  const requestIdRef = useRef(0);

  /** Lấy lời chúc: ưu tiên API, lỗi bất kỳ thì im lặng dùng kho tĩnh. */
  const loadGreeting = useCallback(async (current: VNTime) => {
    const decks = decksRef.current;
    if (!decks) return;

    const myId = ++requestIdRef.current;
    setLoading(true);

    let next: GreetingPayload | null = null;
    try {
      const res = await fetch("/api/greeting", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const data: unknown = await res.json();
        if (
          typeof data === "object" &&
          data !== null &&
          (data as { ok?: unknown }).ok === true
        ) {
          const d = data as { greeting?: unknown; encouragement?: unknown };
          if (typeof d.greeting === "string" && d.greeting.trim().length > 4) {
            next = {
              greeting: d.greeting.trim(),
              encouragement:
                typeof d.encouragement === "string"
                  ? d.encouragement.trim()
                  : "",
            };
          }
        }
      }
    } catch {
      // nuốt lỗi — fail-open
    }

    if (!next) next = buildFallbackGreeting(decks, current);
    // Dòng phụ trống thì bù bằng kho tĩnh để bố cục luôn giống nhau.
    if (next.encouragement.length === 0) {
      next.encouragement = buildFallbackGreeting(decks, current).encouragement;
    }

    if (myId !== requestIdRef.current) return; // đã có yêu cầu mới hơn
    setPayload(next);
    setAnimKey((k) => k + 1);
    setLoading(false);
  }, []);

  /**
   * Cho phép xem trước một buổi hoặc mốc ngày thi bất kỳ bằng query param,
   * tiện để kiểm tra giao diện mà không cần đổi ngày thi thật:
   *   /?buoi=sang | /?buoi=chieu | /?buoi=toi | /?buoi=dem
   *   /?thi=truoc  (xem lời chúc đêm trước ngày thi)
   *   /?thi=hom    (xem lời chúc đúng ngày thi)
   * Không có param thì dùng giờ thật (Asia/Ho_Chi_Minh).
   */
  const readTime = useCallback((): VNTime => {
    const t = getVNTime();
    if (typeof window === "undefined") return t;
    const params = new URLSearchParams(window.location.search);

    const q = params.get("buoi");
    const override: Record<string, Period> = {
      sang: "morning",
      chieu: "afternoon",
      toi: "evening",
      dem: "night",
    };
    const p = q ? override[q] : undefined;
    let next = p ? { ...t, period: p } : t;

    const thi = params.get("thi");
    if (thi === "truoc") {
      next = { ...next, isExamEve: true, isExamDay: false, daysToExam: 1 };
    } else if (thi === "hom") {
      next = { ...next, isExamEve: false, isExamDay: true, daysToExam: 0 };
    }

    return next;
  }, []);

  // Khởi tạo sau khi mount (tránh lệch hydration vì giờ giấc)
  useEffect(() => {
    const t = readTime();
    setTime(t);
    void loadGreeting(t);
  }, [loadGreeting, readTime]);

  // Theo dõi chuyển buổi / sang ngày mới
  useEffect(() => {
    const id = window.setInterval(() => {
      setTime((prev) => {
        const t = readTime();
        if (
          prev &&
          prev.period === t.period &&
          prev.isoDate === t.isoDate &&
          prev.daysToExam === t.daysToExam
        ) {
          return prev;
        }
        return t;
      });
    }, 30_000);
    return () => window.clearInterval(id);
  }, [readTime]);

  const { displayed: typedGreeting, done: typingDone, skip: skipTyping } =
    useTypewriter(payload?.greeting ?? "", animKey);

  const period: Period = time?.period ?? "morning";
  // Trời đã tối từ buổi tối (18:00), không chỉ riêng buổi đêm — nên giao diện tối
  // (nền đêm, sao, chữ sáng màu) áp dụng cho cả hai buổi.
  const dark = period === "evening" || period === "night";
  const night = dark;

  return (
    <main
      className={`period-bg relative min-h-[100svh] w-full overflow-hidden period-${period}`}
    >
      <StarField enabled={dark && effectsOn} />
      <FallingHearts enabled={effectsOn} period={period} />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col px-5 pb-8 pt-6 sm:px-8 sm:pt-10">
        {/* Thanh điều khiển */}
        <div className="flex items-center justify-between gap-3">
          <span
            className={[
              "glass rounded-full border px-3 py-1.5 text-xs font-medium sm:text-sm",
              night
                ? "border-white/20 bg-white/10 text-night-soft"
                : "border-white/60 bg-white/50 text-day-soft",
            ].join(" ")}
          >
            {time ? time.fullDateLine : " "}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEffectsOn((v) => !v)}
              aria-pressed={effectsOn}
              aria-label={effectsOn ? "Tắt hiệu ứng" : "Bật hiệu ứng"}
              title={effectsOn ? "Tắt hiệu ứng rơi" : "Bật hiệu ứng rơi"}
              className={[
                "glass flex h-11 w-11 items-center justify-center rounded-full border text-lg shadow-sm transition active:scale-95",
                night
                  ? "border-white/20 bg-white/10 text-night hover:bg-white/20"
                  : "border-white/60 bg-white/50 text-day hover:bg-white/70",
              ].join(" ")}
            >
              {effectsOn ? "✨" : "🚫"}
            </button>
            <MusicToggle night={night} />
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <p
            className={[
              "mb-2 text-center text-sm font-medium tracking-wide sm:text-base",
              night ? "text-night-soft" : "text-day-soft",
            ].join(" ")}
          >
            {PERIOD_EMOJI[period]} {PERIOD_HELLO[period]}
          </p>

          <h1
            className={[
              "mb-6 text-center text-3xl font-bold sm:text-4xl",
              night ? "text-night" : "text-day",
            ].join(" ")}
          >
            {HER_NAME}
          </h1>

          <div
            className={[
              "glass w-full rounded-3xl border p-6 shadow-lg sm:p-8",
              night
                ? "border-white/15 bg-white/10 shadow-black/20"
                : "border-white/70 bg-white/55 shadow-pink-200/40",
            ].join(" ")}
          >
            {loading && !payload ? (
              <div className="animate-pulse space-y-3" aria-hidden="true">
                <div
                  className={`h-5 w-full rounded-full ${night ? "bg-white/20" : "bg-white/70"}`}
                />
                <div
                  className={`h-5 w-11/12 rounded-full ${night ? "bg-white/20" : "bg-white/70"}`}
                />
                <div
                  className={`h-5 w-3/5 rounded-full ${night ? "bg-white/20" : "bg-white/70"}`}
                />
              </div>
            ) : (
              <div key={animKey}>
                <p
                  onClick={typingDone ? undefined : skipTyping}
                  className={[
                    "text-lg leading-relaxed sm:text-xl sm:leading-relaxed",
                    typingDone ? "" : "cursor-pointer",
                    night ? "text-night" : "text-day",
                  ].join(" ")}
                >
                  {typedGreeting}
                  {typingDone ? null : (
                    <span
                      aria-hidden="true"
                      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current align-middle"
                    />
                  )}
                </p>

                {payload?.encouragement ? (
                  <p
                    className={[
                      "mt-4 border-t pt-4 text-sm italic leading-relaxed sm:text-base transition-opacity duration-500",
                      typingDone ? "opacity-100" : "opacity-0",
                      night
                        ? "border-white/15 text-night-soft"
                        : "border-black/5 text-day-soft",
                    ].join(" ")}
                  >
                    {payload.encouragement}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              const t = readTime();
              setTime(t);
              void loadGreeting(t);
            }}
            className={[
              "mt-6 rounded-full px-7 py-3 text-base font-semibold shadow-md transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
              night
                ? "bg-gradient-to-r from-indigo-400/90 to-fuchsia-400/90 text-white hover:from-indigo-400 hover:to-fuchsia-400"
                : "bg-gradient-to-r from-pink-400 to-fuchsia-400 text-white hover:from-pink-500 hover:to-fuchsia-500",
            ].join(" ")}
          >
            {loading ? "Đang viết..." : "Lời chúc khác 💌"}
          </button>
        </div>

        {/* Đếm ngược + chữ ký */}
        <div className="mt-auto space-y-5">
          {time ? <ExamCountdown time={time} night={night} /> : null}

          <p
            className={[
              "text-center text-xs sm:text-sm",
              night ? "text-night-soft" : "text-day-soft",
            ].join(" ")}
          >
            {SIGNATURE}
          </p>
        </div>
      </div>

      <span className="sr-only">
        Trang dành riêng cho {XUNG_HO_EM} — {HER_NAME}
      </span>
    </main>
  );
}
