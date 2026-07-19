import { XUNG_HO_ANH, XUNG_HO_EM } from "./config";

/** Thay token {em} / {anh} / {date} bằng giá trị thật. */
export function fill(
  template: string,
  extra: Record<string, string> = {},
): string {
  const map: Record<string, string> = {
    em: XUNG_HO_EM,
    anh: XUNG_HO_ANH,
    ...extra,
  };
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in map ? (map[key] as string) : whole,
  );
}

/** Viết hoa chữ cái đầu (an toàn với tiếng Việt có dấu). */
export function capitalize(s: string): string {
  if (s.length === 0) return s;
  return s.charAt(0).toLocaleUpperCase("vi-VN") + s.slice(1);
}

/**
 * Viết hoa chữ cái đầu mỗi câu (trừ câu đầu tiên — chỗ đó đã có tiền tố ngày tháng).
 * Cần thiết vì token {anh}/{em} có thể rơi đúng đầu câu sau dấu chấm.
 */
export function normalizeSentences(s: string): string {
  return s.replace(
    /([.!?…]\s+)(\p{Ll})/gu,
    (_m, sep: string, ch: string) => sep + ch.toLocaleUpperCase("vi-VN"),
  );
}
