export type WeatherCondition = "rain" | "storm" | "hot" | "cold";

export interface WeatherSnapshot {
  condition: WeatherCondition | null;
  tempC: number;
}

const HANOI_LAT = 21.0285;
const HANOI_LON = 105.8542;

// Mã thời tiết WMO (chuẩn Open-Meteo dùng) ứng với mưa / mưa rào và giông.
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]);
const STORM_CODES = new Set([95, 96, 99]);

function classify(code: number, tempC: number): WeatherCondition | null {
  if (STORM_CODES.has(code)) return "storm";
  if (RAIN_CODES.has(code)) return "rain";
  if (tempC >= 34) return "hot";
  if (tempC <= 18) return "cold";
  return null;
}

/**
 * Thời tiết hiện tại ở Hà Nội qua Open-Meteo — miễn phí, không cần API key.
 * Lỗi/timeout bất kỳ đều trả null, không được chặn luồng lời chúc chính.
 */
export async function fetchHanoiWeather(
  timeoutMs = 4000,
): Promise<WeatherSnapshot | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${HANOI_LAT}&longitude=${HANOI_LON}&current=temperature_2m,weather_code`,
      { signal: controller.signal },
    );
    if (!res.ok) return null;

    const data: unknown = await res.json();
    const current =
      typeof data === "object" && data !== null
        ? (data as { current?: unknown }).current
        : undefined;
    if (typeof current !== "object" || current === null) return null;

    const c = current as Record<string, unknown>;
    const tempC =
      typeof c.temperature_2m === "number" ? c.temperature_2m : null;
    const code = typeof c.weather_code === "number" ? c.weather_code : null;
    if (tempC === null || code === null) return null;

    return { condition: classify(code, tempC), tempC };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
