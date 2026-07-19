import {
  DATE_PREFIXES,
  EVENING_SOFT_NOTES,
  EXAM_DAY_ENCOURAGEMENTS,
  EXAM_DAY_GREETINGS,
  EXAM_ENCOURAGEMENTS,
  EXAM_EVE_ENCOURAGEMENTS,
  EXAM_EVE_GREETINGS,
  GREETINGS_BY_PERIOD,
  MONDAY_NOTES,
  NIGHT_SOFT_NOTES,
  WEEKEND_NOTES,
} from "@/data/greetings";
import { Deck } from "./deck";
import { capitalize, fill, normalizeSentences } from "./text";

/** Ghép + chuẩn hoá hoa/thường cho một câu đã thay token. */
function finish(s: string): string {
  return normalizeSentences(fill(s));
}
import type { Period, VNTime } from "./time";

export interface GreetingPayload {
  greeting: string;
  encouragement: string;
}

type DeckKey =
  | "prefix"
  | "monday"
  | "weekend"
  | "eveningNote"
  | "nightNote"
  | "encouragement"
  | "examGreeting"
  | "examEncouragement"
  | "examEveGreeting"
  | "examEveEncouragement"
  | Period;

/** Bộ deck dùng chung cho cả phiên (giữ trong useRef ở component). */
export function createGreetingDecks(): Record<DeckKey, Deck<string>> {
  return {
    morning: new Deck(GREETINGS_BY_PERIOD.morning),
    afternoon: new Deck(GREETINGS_BY_PERIOD.afternoon),
    evening: new Deck(GREETINGS_BY_PERIOD.evening),
    night: new Deck(GREETINGS_BY_PERIOD.night),
    prefix: new Deck(DATE_PREFIXES),
    monday: new Deck(MONDAY_NOTES),
    weekend: new Deck(WEEKEND_NOTES),
    eveningNote: new Deck(EVENING_SOFT_NOTES),
    nightNote: new Deck(NIGHT_SOFT_NOTES),
    encouragement: new Deck(EXAM_ENCOURAGEMENTS),
    examGreeting: new Deck(EXAM_DAY_GREETINGS),
    examEncouragement: new Deck(EXAM_DAY_ENCOURAGEMENTS),
    examEveGreeting: new Deck(EXAM_EVE_GREETINGS),
    examEveEncouragement: new Deck(EXAM_EVE_ENCOURAGEMENTS),
  };
}

export type GreetingDecks = ReturnType<typeof createGreetingDecks>;

/**
 * Sinh lời chúc từ kho tĩnh. Kết quả có cùng hình dạng với output của API
 * nên người dùng không thể phân biệt được nguồn.
 */
export function buildFallbackGreeting(
  decks: GreetingDecks,
  t: VNTime,
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
  if (t.isMonday) {
    const n = decks.monday.draw();
    if (n) notes.push(n);
  } else if (t.isWeekend) {
    const n = decks.weekend.draw();
    if (n) notes.push(n);
  }

  const greeting = finish([prefix + body, ...notes].join(" "));

  const softDeck =
    t.period === "night"
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
