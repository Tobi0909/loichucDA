import { NextResponse } from "next/server";
import { HER_NAME, XUNG_HO_ANH, XUNG_HO_EM } from "@/lib/config";
import { getVNTime, type Period } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const TIMEOUT_MS = 9_000;

const PERIOD_VI: Record<Period, string> = {
  morning: "buổi sáng",
  afternoon: "buổi chiều",
  night: "buổi tối",
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
    "- Nếu là thứ Hai: lồng ý \"tuần mới\". Nếu là thứ Bảy hoặc Chủ nhật: lồng ý \"cuối tuần\".",
    "- Buổi sáng: tươi tắn, tiếp năng lượng. Buổi chiều: dịu, nhắc nghỉ tay, uống nước.",
    "- Buổi tối: nhẹ nhàng, chúc ngủ ngon. TUYỆT ĐỐI KHÔNG nhắc tới việc học/ôn thi/bài vở vào buổi tối — để cô ấy nghỉ.",
    `- encouragement: MỘT câu ngắn (tối đa 20 từ) làm dòng phụ. Buổi sáng/chiều thì động viên chuyện ôn thi (nhắc nghỉ ngơi, tin vào nỗ lực, thi cử chỉ là một chặng, dù kết quả thế nào vẫn thương...). Buổi tối thì chỉ là một câu dỗ dành nhẹ nhàng, KHÔNG nhắc việc học.`,
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

/** Mọi thất bại đều trả 200 + ok:false để client im lặng dùng kho tĩnh. */
function fallbackResponse(): NextResponse {
  return NextResponse.json({ ok: false }, { status: 200 });
}

export async function POST(): Promise<NextResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackResponse();

  const t = getVNTime();

  const userContent = JSON.stringify(
    {
      buoi: PERIOD_VI[t.period],
      gio: `${t.hour}:${String(t.minute).padStart(2, "0")}`,
      thu: t.weekdayLabel,
      ngay_thang: t.shortDate,
      la_thu_hai: t.isMonday,
      la_cuoi_tuan: t.isWeekend,
      examMode: true,
      la_ngay_thi: t.isExamDay,
      con_bao_nhieu_ngay_toi_ngay_thi: t.daysToExam >= 0 ? t.daysToExam : null,
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

    if (!res.ok) return fallbackResponse();

    const data: unknown = await res.json();
    const blocks =
      typeof data === "object" && data !== null
        ? (data as { content?: unknown }).content
        : undefined;
    if (!Array.isArray(blocks)) return fallbackResponse();

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
    if (!parsed) return fallbackResponse();

    return NextResponse.json(
      {
        ok: true,
        greeting: parsed.greeting,
        encouragement: parsed.encouragement,
      },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  } catch {
    // Timeout, lỗi mạng, hết quota... — im lặng, client tự dùng kho tĩnh.
    return fallbackResponse();
  } finally {
    clearTimeout(timer);
  }
}
