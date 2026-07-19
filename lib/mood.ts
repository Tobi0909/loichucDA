export type Mood = "happy" | "tired" | "stressed" | "sad";

export interface MoodMeta {
  label: string;
  emoji: string;
}

export const MOOD_META: Record<Mood, MoodMeta> = {
  happy: { label: "Vui", emoji: "😊" },
  tired: { label: "Mệt", emoji: "😮‍💨" },
  stressed: { label: "Áp lực", emoji: "😣" },
  sad: { label: "Buồn", emoji: "😢" },
};

/** Thứ tự hiển thị cố định trong mood picker. */
export const MOOD_ORDER: Mood[] = ["happy", "tired", "stressed", "sad"];

export function isMood(value: unknown): value is Mood {
  return (
    value === "happy" ||
    value === "tired" ||
    value === "stressed" ||
    value === "sad"
  );
}
