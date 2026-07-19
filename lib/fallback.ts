import {
  DATE_PREFIXES,
  EVENING_SOFT_NOTES,
  EXAM_DAY_ENCOURAGEMENTS,
  EXAM_DAY_GREETINGS,
  EXAM_ENCOURAGEMENTS,
  EXAM_EVE_ENCOURAGEMENTS,
  EXAM_EVE_GREETINGS,
  FRIDAY_NOTES,
  GREETINGS_BY_PERIOD,
  MONDAY_NOTES,
  NIGHT_SOFT_NOTES,
  SATURDAY_NOTES,
  SUNDAY_NOTES,
  WEATHER_NOTES,
} from "@/data/greetings";
import { MOOD_ENCOURAGEMENTS, MOOD_NOTES } from "@/data/moods";
import { Deck } from "./deck";
import { capitalize, fill, normalizeSentences } from "./text";

/** Ghép + chuẩn hoá hoa/thường cho một câu đã thay token. */
function finish(s: string): string {
  return normalizeSentences(fill(s));
}
import type { Mood } from "./mood";
import type { Period, VNTime } from "./time";
import type { WeatherCondition } from "./weather";

export interface GreetingPayload {
  greeting: string;
  encouragement: string;
}

export interface FallbackContext {
  weather?: WeatherCondition | null;
  mood?: Mood | null;
}

type DeckKey =
  | "prefix"
  | "monday"
  | "friday"
  | "saturday"
  | "sunday"
  | "eveningNote"
  | "nightNote"
  | "encouragement"
  | "examGreeting"
  | "examEncouragement"
  | "examEveGreeting"
  | "examEveEncouragement"
  | "rainNote"
  | "stormNote"
  | "hotNote"
  | "coldNote"
  | Period;

function buildMoodDecks(bank: Record<Mood, string[]>): Record<Mood, Deck<string>> {
  return {
    happy: new Deck(bank.happy),
    tired: new Deck(bank.tired),
    stressed: new Deck(bank.stressed),
    sad: new Deck(bank.sad),
  };
}

interface GreetingDecksShape extends Record<DeckKey, Deck<string>> {
  moodNote: Record<Mood, Deck<string>>;
  moodEncouragement: Record<Mood, Deck<string>>;
}

/** Bộ deck dùng chung cho cả phiên (giữ trong useRef ở component). */
export function createGreetingDecks(): GreetingDecksShape {
  return {
    morning: new Deck(GREETINGS_BY_PERIOD.morning),
    afternoon: new Deck(GREETINGS_BY_PERIOD.afternoon),
    evening: new Deck(GREETINGS_BY_PERIOD.evening),
    night: new Deck(GREETINGS_BY_PERIOD.night),
    prefix: new Deck(DATE_PREFIXES),
    monday: new Deck(MONDAY_NOTES),
    friday: new Deck(FRIDAY_NOTES),
    saturday: new Deck(SATURDAY_NOTES),
    sunday: new Deck(SUNDAY_NOTES),
    eveningNote: new Deck(EVENING_SOFT_NOTES),
    nightNote: new Deck(NIGHT_SOFT_NOTES),
    encouragement: new Deck(EXAM_ENCOURAGEMENTS),
    examGreeting: new Deck(EXAM_DAY_GREETINGS),
    examEncouragement: new Deck(EXAM_DAY_ENCOURAGEMENTS),
    examEveGreeting: new Deck(EXAM_EVE_GREETINGS),
    examEveEncouragement: new Deck(EXAM_EVE_ENCOURAGEMENTS),
    rainNote: new Deck(WEATHER_NOTES.rain),
    stormNote: new Deck(WEATHER_NOTES.storm),
    hotNote: new Deck(WEATHER_NOTES.hot),
    coldNote: new Deck(WEATHER_NOTES.cold),
    moodNote: buildMoodDecks(MOOD_NOTES),
    moodEncouragement: buildMoodDecks(MOOD_ENCOURAGEMENTS),
  };
}

export type GreetingDecks = GreetingDecksShape;

/**
 * Sinh lời chúc từ kho tĩnh. Kết quả có cùng hình dạng với output của API
 * nên người dùng không thể phân biệt được nguồn.
 */
export function buildFallbackGreeting(
  decks: GreetingDecks,
  t: VNTime,
  ctx: FallbackContext = {},
): GreetingPayload {
  const prefix = fill(decks.prefix.draw() ?? "Hôm nay {date} rồi, ", {
    date: t.shortDate,
  });

  // Đêm trước ngày thi: dặn dò, chúc ngủ ngon (ưu tiên hơn ngày thi).
  if (t.isExamEve) {
    const body = decks.examEveGreeting.draw() ?? "mai là ngày thi của {em} rồi.";
    return {
      greeting: finish(prefix + body),
      encouragement: capitalize(
        finish(
          decks.examEveEncouragement.draw() ??
            "Tối nay {em} ngủ ngon nhé, {anh} tin {em}.",
        ),
      ),
    };
  }

  if (t.isExamDay) {
    const body = decks.examGreeting.draw() ?? "hôm nay là ngày thi của {em}.";
    return {
      greeting: finish(prefix + body),
      encouragement: capitalize(
        finish(decks.examEncouragement.draw() ?? "{anh} luôn ở phía sau {em}."),
      ),
    };
  }

  const body =
    decks[t.period].draw() ?? "chúc {em} một ngày thật nhẹ nhàng.";

  const notes: string[] = [];

  // Tâm trạng là lựa chọn chủ động của {em} — ưu tiên hơn ghi chú theo
  // thứ/thời tiết (vốn chỉ là bối cảnh xung quanh) để lời chúc không bị loãng.
  if (ctx.mood) {
    const n = decks.moodNote[ctx.mood].draw();
    if (n) notes.push(n);
  } else {
    const dayDeck = t.isMonday
      ? decks.monday
      : t.isFriday
        ? decks.friday
        : t.isSaturday
          ? decks.saturday
          : t.isSunday
            ? decks.sunday
            : null;
    if (dayDeck) {
      const n = dayDeck.draw();
      if (n) notes.push(n);
    }

    // Thời tiết thực tế (Hà Nội) — chỉ thêm khi đáng chú ý (mưa/giông/nóng/lạnh).
    const weatherDeck =
      ctx.weather === "rain"
        ? decks.rainNote
        : ctx.weather === "storm"
          ? decks.stormNote
          : ctx.weather === "hot"
            ? decks.hotNote
            : ctx.weather === "cold"
              ? decks.coldNote
              : null;
    if (weatherDeck) {
      const w = weatherDeck.draw();
      if (w) notes.push(w);
    }
  }

  const greeting = finish([prefix + body, ...notes].join(" "));

  const softDeck = ctx.mood
    ? decks.moodEncouragement[ctx.mood]
    : t.period === "night"
      ? decks.nightNote
      : t.period === "evening"
        ? decks.eveningNote
        : null;

  const encouragement = capitalize(
    finish(
      softDeck
        ? (softDeck.draw() ?? "{em} nghỉ ngơi thật ngon nha.")
        : (decks.encouragement.draw() ?? "{anh} luôn tin ở {em}."),
    ),
  );

  return { greeting, encouragement };
}
