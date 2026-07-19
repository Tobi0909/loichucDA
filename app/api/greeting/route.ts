import { NextResponse } from "next/server";
import { HER_NAME, XUNG_HO_ANH, XUNG_HO_EM } from "@/lib/config";
import { isMood, type Mood } from "@/lib/mood";
import { getVNTime, type Period } from "@/lib/time";
import { fetchHanoiWeather, type WeatherSnapshot } from "@/lib/weather";

const MOOD_VI: Record<Mood, string> = {
  happy: "vui",
  tired: "mệt mỏi",
  stressed: "áp lực",
  sad: "buồn",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const TIMEOUT_MS = 9_000;

const PERIOD_VI: Record<Period, string> = {
  morning: "buổi sáng",
  afternoon: "buổi chiều",
  evening: "buổi tối",
  night: "buổi đêm",
};

interface GreetingPayload {
  greeting: string;
  encouragement: string;
}

function buildSystemPrompt(): string {
  return [
    `Bạn là người viết lời chúc thay cho ${XUNG_HO_ANH} (bạn trai) gửi tới ${HER_NAME} (bạn gái).`,
    `Cách xưng hô BẮT BUỘC: gọi cô ấy là "${XUNG_HO_EM}", tự xưng là "${XUNG_HO_ANH}". Tuyệt đối không dùng cách xưng hô khác (không "bạn", không "cậu", không "mình").`,
    "",
    "Bối cảnh: cô ấy đang ôn thi viên chức nên rất bận và dễ căng thẳng (examMode = true).",
    "",
    "YÊU CẦU NỘI DUNG:",
    `- greeting: lời chúc chính, 1-3 câu, BẮT BUỘC mở đầu bằng ngày tháng được cung cấp (ví dụ: "Hôm nay 22/7 rồi, chúc ${XUNG_HO_EM}...").`,
    "- Thứ Hai: lồng ý \"tuần mới\", cần thêm chút động lực. Thứ Sáu: lồng ý \"bung xoả\", háo hức vì cuối tuần đã tới. Thứ Bảy: lồng ý nghỉ ngơi, thong thả. Chủ nhật: lồng ý \"chữa lành\", chuẩn bị tinh thần nhẹ nhàng cho tuần mới (không hối thúc).",
    "- Buổi sáng: tươi tắn, tiếp năng lượng. Buổi chiều: dịu, nhắc nghỉ tay, uống nước.",
    "- Buổi tối (18:00–21:29): ấm áp, thư giãn sau một ngày dài (ăn tối, nghỉ ngơi, làm điều mình thích). TUYỆT ĐỐI KHÔNG nhắc tới việc học/ôn thi/bài vở, và CHƯA phải lúc chúc ngủ — đây là lúc thư giãn trước khi đi ngủ, không phải lời chúc ngủ ngon.",
    "- Buổi đêm (21:30 trở đi): nhẹ nhàng, tập trung chúc ngủ ngon, giục đi ngủ sớm. TUYỆT ĐỐI KHÔNG nhắc tới việc học/ôn thi/bài vở.",
    `- Nếu la_dem_truoc_ngay_thi = true (hôm nay là ngày TRƯỚC ngày thi): đây là lời dặn dò cho đêm trước. Nhấn mạnh: mai ${XUNG_HO_EM} thi rồi, tối nay ngủ sớm, ĐỪNG thức khuya ôn nữa, ${XUNG_HO_EM} đã chuẩn bị đủ, chúc mai thi thật tốt và bình tĩnh. Bỏ qua quy tắc buổi trong ngày, ưu tiên nội dung này.`,
    `- Nếu la_ngay_thi = true (đúng hôm thi): chúc ${XUNG_HO_EM} bình tĩnh, tin vào bản thân, làm bài chắc tay.`,
    `- encouragement: MỘT câu ngắn (tối đa 20 từ) làm dòng phụ. Buổi sáng/chiều thì động viên chuyện ôn thi (nhắc nghỉ ngơi, tin vào nỗ lực, thi cử chỉ là một chặng, dù kết quả thế nào vẫn thương...). Buổi tối và buổi đêm thì chỉ là một câu dỗ dành nhẹ nhàng, KHÔNG nhắc việc học.`,
    `- Trường thoi_tiet cho biết thời tiết thực tế ở Hà Nội lúc này (rain/storm/hot/cold/khong_ro). Nếu là rain/storm/hot/cold, có thể lồng NHẸ một ý ngắn về thời tiết đó vào greeting (ví dụ trời mưa thì nhắc mang áo mưa hoặc ở nhà cho ấm, trời nóng thì nhắc uống nước) — không bắt buộc phải nhắc dài dòng. Nếu là khong_ro thì bỏ qua, TUYỆT ĐỐI không tự bịa thời tiết.`,
    `- Trường tam_trang cho biết ${XUNG_HO_EM} vừa TỰ CHỌN tâm trạng hiện tại (vui/mệt mỏi/áp lực/buồn/khong_ro). Nếu KHÁC khong_ro: đây là ưu tiên SỐ MỘT, greeting PHẢI phản hồi thẳng vào đúng tâm trạng đó trước (an ủi nếu mệt/áp lực/buồn, vui cùng nếu vui — nếu buồn thì KHÔNG hỏi lý do, chỉ cần {em} biết ${XUNG_HO_ANH} ở đây), có thể kết hợp nhẹ với buổi trong ngày nếu hợp, nhưng được phép bỏ qua các quy tắc buổi/thứ ở trên nếu chúng không hợp với tâm trạng. encouragement cũng phải bám theo đúng tâm trạng này (không phải quy tắc mặc định theo buổi).`,
    "",
    "GIỌNG VĂN: ấm áp, tự nhiên, ngọt ngào vừa phải, KHÔNG sến súa, KHÔNG sáo rỗng, KHÔNG dùng emoji. Mỗi lần phải là một cách diễn đạt khác nhau.",
    "",
    'ĐỊNH DẠNG ĐẦU RA: CHỈ trả về đúng một object JSON hợp lệ dạng {"greeting": "...", "encouragement": "..."}. Không markdown, không code fence, không giải thích, không thêm bất kỳ ký tự nào ngoài JSON.',
  ].join("\n");
}

/** Tách JSON ra khỏi text kể cả khi model lỡ bọc code fence hoặc thêm chữ. */
function safeParse(raw: string): GreetingPayload | null {
  let text = raw.trim();

  // Bỏ code fence ```json ... ```
  const fence = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fence?.[1]) text = fence[1].trim();

  // Nếu vẫn còn chữ thừa, lấy đoạn từ { đầu tiên tới } cuối cùng
  if (!text.startsWith("{")) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    text = text.slice(start, end + 1);
  }

  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) return null;
    const obj = parsed as Record<string, unknown>;
    const greeting = typeof obj.greeting === "string" ? obj.greeting.trim() : "";
    const encouragement =
      typeof obj.encouragement === "string" ? obj.encouragement.trim() : "";
    if (greeting.length < 5) return null;
    return { greeting, encouragement };
  } catch {
    return null;
  }
}

/**
 * Mọi thất bại đều trả 200 + ok:false để client im lặng dùng kho tĩnh.
 * Thời tiết vẫn được gửi kèm (nếu lấy được) để kho tĩnh cũng dùng được.
 */
function fallbackResponse(weather: WeatherSnapshot | null): NextResponse {
  return NextResponse.json({ ok: false, weather }, { status: 200 });
}

export async function POST(req: Request): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  let mood: Mood | null = null;
  try {
    const body: unknown = await req.json();
    if (typeof body === "object" && body !== null) {
      const m = (body as { mood?: unknown }).mood;
      if (isMood(m)) mood = m;
    }
  } catch {
    // Không có body hoặc body không hợp lệ — coi như không chọn tâm trạng.
  }

  // Thời tiết không phụ thuộc Anthropic key nên luôn lấy, kể cả khi sẽ fallback.
  const weather = await fetchHanoiWeather();

  if (!apiKey) return fallbackResponse(weather);

  const t = getVNTime();

  const userContent = JSON.stringify(
    {
      buoi: PERIOD_VI[t.period],
      gio: `${t.hour}:${String(t.minute).padStart(2, "0")}`,
      thu: t.weekdayLabel,
      ngay_thang: t.shortDate,
      la_thu_hai: t.isMonday,
      la_thu_sau: t.isFriday,
      la_thu_bay: t.isSaturday,
      la_chu_nhat: t.isSunday,
      examMode: true,
      la_dem_truoc_ngay_thi: t.isExamEve,
      la_ngay_thi: t.isExamDay,
      con_bao_nhieu_ngay_toi_ngay_thi: t.daysToExam >= 0 ? t.daysToExam : null,
      thoi_tiet: weather?.condition ?? "khong_ro",
      nhiet_do_c: weather?.tempC ?? null,
      tam_trang: mood ? MOOD_VI[mood] : "khong_ro",
    },
    null,
    2,
  );

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        temperature: 1,
        system: buildSystemPrompt(),
        messages: [
          {
            role: "user",
            content: `Thông tin hôm nay:\n${userContent}\n\nHãy viết lời chúc. Chỉ trả JSON.`,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) return fallbackResponse(weather);

    const data: unknown = await res.json();
    const blocks =
      typeof data === "object" && data !== null
        ? (data as { content?: unknown }).content
        : undefined;
    if (!Array.isArray(blocks)) return fallbackResponse(weather);

    const raw = blocks
      .map((b) =>
        typeof b === "object" &&
        b !== null &&
        (b as { type?: unknown }).type === "text"
          ? String((b as { text?: unknown }).text ?? "")
          : "",
      )
      .join("");

    const parsed = safeParse(raw);
    if (!parsed) return fallbackResponse(weather);

    return NextResponse.json(
      {
        ok: true,
        greeting: parsed.greeting,
        encouragement: parsed.encouragement,
        weather,
      },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  } catch {
    // Timeout, lỗi mạng, hết quota... — im lặng, client tự dùng kho tĩnh.
    return fallbackResponse(weather);
  } finally {
    clearTimeout(timer);
  }
}
