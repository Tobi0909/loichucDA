import {
  DATE_PREFIXES,
  EXAM_DAY_ENCOURAGEMENTS,
  EXAM_DAY_GREETINGS,
  EXAM_ENCOURAGEMENTS,
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
  | "nightNote"
  | "encouragement"
  | "examGreeting"
  | "examEncouragement"
  | Period;

/** Bộ deck dùng chung cho cả phiên (giữ trong useRef ở component). */
export function createGreetingDecks(): Record<DeckKey, Deck<string>> {
  return {
    morning: new Deck(GREETINGS_BY_PERIOD.morning),
    afternoon: new Deck(GREETINGS_BY_PERIOD.afternoon),
    night: new Deck(GREETINGS_BY_PERIOD.night),
    prefix: new Deck(DATE_PREFIXES),
    monday: new Deck(MONDAY_NOTES),
    weekend: new Deck(WEEKEND_NOTES),
    nightNote: new Deck(NIGHT_SOFT_NOTES),
    encouragement: new Deck(EXAM_ENCOURAGEMENTS),
    examGreeting: new Deck(EXAM_DAY_GREETINGS),
    examEncouragement: new Deck(EXAM_DAY_ENCOURAGEMENTS),
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

  const encouragement = capitalize(
    finish(
      t.period === "night"
        ? (decks.nightNote.draw() ?? "{em} nghỉ ngơi thật ngon nha.")
        : (decks.encouragement.draw() ?? "{anh} luôn tin ở {em}."),
    ),
  );

  return { greeting, encouragement };
}
