"use client";

import { EXAM_LABEL, XUNG_HO_EM } from "@/lib/config";
import type { VNTime } from "@/lib/time";

interface Props {
  time: VNTime;
  night: boolean;
}

/** Đếm ngược tới ngày thi. Qua ngày thi thì tự ẩn. */
export default function ExamCountdown({ time, night }: Props) {
  if (time.daysToExam < 0) return null;

  const isToday = time.daysToExam === 0;

  return (
    <div
      className={[
        "glass mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-center shadow-sm",
        night
          ? "border-white/15 bg-white/10 text-night"
          : "border-white/70 bg-white/50 text-day",
      ].join(" ")}
    >
      {isToday ? (
        <p className="text-sm font-medium sm:text-base">
          🎯 Hôm nay là ngày thi rồi — bình tĩnh nhé {XUNG_HO_EM}!
        </p>
      ) : (
        <p className="text-sm sm:text-base">
          <span className="opacity-80">Còn</span>{" "}
          <span className="text-xl font-bold tabular-nums sm:text-2xl">
            {time.daysToExam}
          </span>{" "}
          <span className="opacity-80">ngày nữa tới {EXAM_LABEL}</span>
          <span className="mt-0.5 block text-xs opacity-70 sm:text-sm">
            Cố lên {XUNG_HO_EM}! ✨
          </span>
        </p>
      )}
    </div>
  );
}
