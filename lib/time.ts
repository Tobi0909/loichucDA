import { EXAM_DATE, TIME_ZONE } from "./config";

export type Period = "morning" | "afternoon" | "night";

export interface VNTime {
  /** 0-23, giờ Việt Nam */
  hour: number;
  minute: number;
  /** 1-31 */
  day: number;
  /** 1-12 */
  month: number;
  year: number;
  /** 0 = Chủ nhật ... 6 = Thứ Bảy */
  weekday: number;
  /** "2026-07-19" theo giờ VN */
  isoDate: string;
  period: Period;
  /** "thứ Ba" */
  weekdayLabel: string;
  /** "Buổi sáng" */
  periodLabel: string;
  /** "22/7" */
  shortDate: string;
  /** "Hôm nay thứ Ba, 22/7" */
  fullDateLine: string;
  isMonday: boolean;
  isWeekend: boolean;
  isExamDay: boolean;
  /** Ngày ngay trước ngày thi (daysToExam === 1) — lúc để dặn dò, chúc ngủ ngon */
  isExamEve: boolean;
  /** Số ngày còn lại tới ngày thi; âm nghĩa là đã qua */
  daysToExam: number;
}

const WEEKDAY_LABELS = [
  "Chủ nhật",
  "thứ Hai",
  "thứ Ba",
  "thứ Tư",
  "thứ Năm",
  "thứ Sáu",
  "thứ Bảy",
] as const;

const PERIOD_LABELS: Record<Period, string> = {
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  night: "Buổi tối",
};

/** Đọc các thành phần ngày giờ tại Asia/Ho_Chi_Minh, bất kể máy đang ở đâu. */
function readVNParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });

  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== "literal") parts[p.type] = p.value;
  }

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    // Intl trả "24" cho nửa đêm ở một số runtime -> chuẩn hoá về 0
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: weekdayMap[parts.weekday ?? "Sun"] ?? 0,
  };
}

export function periodFromHour(hour: number): Period {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Số ngày nguyên giữa hai ngày lịch (dạng YYYY-MM-DD), không lệ thuộc timezone. */
function daysBetweenIso(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.NaN;
  return Math.round((b - a) / 86_400_000);
}

export function getVNTime(now: Date = new Date()): VNTime {
  const p = readVNParts(now);
  const period = periodFromHour(p.hour);
  const isoDate = `${p.year}-${pad(p.month)}-${pad(p.day)}`;
  const weekdayLabel = WEEKDAY_LABELS[p.weekday] ?? "hôm nay";
  const shortDate = `${p.day}/${p.month}`;
  const daysToExam = daysBetweenIso(isoDate, EXAM_DATE);

  return {
    hour: p.hour,
    minute: p.minute,
    day: p.day,
    month: p.month,
    year: p.year,
    weekday: p.weekday,
    isoDate,
    period,
    weekdayLabel,
    periodLabel: PERIOD_LABELS[period],
    shortDate,
    fullDateLine: `Hôm nay ${weekdayLabel}, ${shortDate}`,
    isMonday: p.weekday === 1,
    isWeekend: p.weekday === 0 || p.weekday === 6,
    isExamDay: isoDate === EXAM_DATE,
    isExamEve: daysToExam === 1,
    daysToExam: Number.isNaN(daysToExam) ? -1 : daysToExam,
  };
}
