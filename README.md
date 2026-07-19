# 💌 Lời chúc mỗi ngày cho Diệu Anh

Một web nhỏ: mở lên là tự biết đang là buổi sáng / chiều / tối / đêm (giờ Việt Nam) và hiện một lời chúc phù hợp kèm ngày tháng, thêm một dòng động viên ôn thi, đồng hồ đếm ngược tới ngày thi, hiệu ứng trái tim rơi và nút bật nhạc.

Lời chúc được sinh bằng Anthropic API (`claude-haiku-4-5`). **Nếu API lỗi, hết quota, hoặc chưa cấu hình key thì web tự dùng kho lời chúc tĩnh** — người dùng không bao giờ thấy lỗi và không phân biệt được nguồn.

---

## 1. Chạy ở máy (local)

Cần Node.js 18.18+ (khuyến nghị 20+).

```bash
npm install
cp .env.example .env.local     # Windows PowerShell: copy .env.example .env.local
# mở .env.local và dán ANTHROPIC_API_KEY vào
npm run dev
```

Mở http://localhost:3000

> Không có `.env.local` vẫn chạy được bình thường — web sẽ dùng kho lời chúc tĩnh.

Lệnh khác:

```bash
npm run build      # build production (phải pass)
npm run start      # chạy bản đã build
npm run typecheck  # kiểm tra TypeScript
```

### Xem trước từng buổi

Thêm query param để xem giao diện các buổi mà không cần đợi tới giờ:

- `/?buoi=sang`
- `/?buoi=chieu`
- `/?buoi=toi`
- `/?buoi=dem`

---

## 2. Deploy lên Vercel

```bash
npm i -g vercel
vercel login
vercel deploy          # bản preview
vercel deploy --prod   # bản chính thức
```

Không cần chỉnh cấu hình gì thêm — Vercel tự nhận Next.js, và `/api/greeting` tự thành serverless function.

Hoặc: push code lên GitHub → vào https://vercel.com/new → Import repo → Deploy.

---

## 3. Set `ANTHROPIC_API_KEY` trên Vercel

**Cách 1 — qua web (dễ nhất):**

1. Vào project trên Vercel → tab **Settings** → **Environment Variables**
2. Thêm:
   - Key: `ANTHROPIC_API_KEY`
   - Value: key lấy ở https://console.anthropic.com/settings/keys
   - Environments: tick cả **Production**, **Preview**, **Development**
3. Nhấn **Save**, rồi vào tab **Deployments** → **Redeploy** (biến môi trường chỉ áp dụng cho deploy mới).

**Cách 2 — qua CLI:**

```bash
vercel env add ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY preview
vercel --prod
```

> Key chỉ nằm ở phía server (API route), không bao giờ lộ ra trình duyệt.
> Nếu key sai / hết hạn / hết quota, web vẫn chạy êm bằng kho lời chúc tĩnh.

---

## 4. Tuỳ chỉnh

Tất cả nằm trong **[`lib/config.ts`](lib/config.ts)** — sửa 1 file là xong:

| Muốn đổi | Sửa hằng số |
| --- | --- |
| Tên người nhận | `HER_NAME` |
| Cách xưng hô | `XUNG_HO_EM` / `XUNG_HO_ANH` |
| Ngày thi (đếm ngược) | `EXAM_DATE` — định dạng `YYYY-MM-DD`, giờ VN |
| Tên kỳ thi | `EXAM_LABEL` |
| Chữ ký cuối trang | `SIGNATURE` |
| Timezone | `TIME_ZONE` |

Đếm ngược **tự ẩn** khi đã qua `EXAM_DATE`. Đúng ngày thi sẽ hiện lời chúc riêng.

### Thêm / sửa lời chúc

Mở **[`data/greetings.ts`](data/greetings.ts)**:

- `MORNING_GREETINGS`, `AFTERNOON_GREETINGS`, `EVENING_GREETINGS`, `NIGHT_GREETINGS` — mỗi buổi một kho câu riêng
- `EXAM_ENCOURAGEMENTS` — câu động viên ôn thi (dòng phụ buổi sáng/chiều)
- `EVENING_SOFT_NOTES` — dòng phụ buổi tối (thư giãn, cố ý không nhắc chuyện học)
- `NIGHT_SOFT_NOTES` — dòng phụ buổi đêm (dỗ dành đi ngủ, cố ý không nhắc chuyện học)
- `EXAM_DAY_GREETINGS` / `EXAM_DAY_ENCOURAGEMENTS` — riêng cho ngày thi
- `DATE_PREFIXES`, `MONDAY_NOTES`, `WEEKEND_NOTES` — phần mở đầu có ngày và ý "tuần mới" / "cuối tuần"

Quy ước: câu viết **thường ở đầu**, vì sẽ được ghép sau tiền tố ngày tháng.
Dùng token `{em}` và `{anh}` thay cho cách xưng hô (tự thay theo `lib/config.ts`).

### Nhạc nền 🎵

Tự thêm file nhạc vào:

```
public/music.mp3
```

Nhạc **chỉ phát khi bấm nút 🎵** (trình duyệt chặn autoplay). Chưa có file thì nút vẫn hiện, bấm không phát gì và không báo lỗi.

> Chỉ dùng nhạc bạn có quyền sử dụng (royalty-free / không bản quyền).

---

## 5. Cấu trúc file

```
.
├── app/
│   ├── api/greeting/route.ts   # Serverless function gọi Anthropic API, fail-open
│   ├── globals.css             # Tailwind + gradient theo buổi
│   ├── layout.tsx              # Font Be Vietnam Pro, metadata
│   └── page.tsx                # Trang chính (client component)
├── components/
│   ├── ExamCountdown.tsx       # Đếm ngược ngày thi, tự ẩn khi đã qua
│   ├── FallingHearts.tsx       # Trái tim + cánh hoa rơi (canvas 2D)
│   ├── MusicToggle.tsx         # Nút bật/tắt nhạc
│   └── StarField.tsx           # Sao lấp lánh + mặt trăng (buổi tối)
├── data/
│   └── greetings.ts            # Kho lời chúc tĩnh (fallback)
├── lib/
│   ├── config.ts               # ⚙️ Tên, xưng hô, ngày thi, chữ ký
│   ├── deck.ts                 # Shuffle kiểu "rút bài", chống lặp
│   ├── fallback.ts             # Ghép lời chúc từ kho tĩnh
│   ├── text.ts                 # Thay token {em}/{anh}/{date}
│   └── time.ts                 # Giờ Asia/Ho_Chi_Minh, phân buổi, thứ/ngày
├── public/
│   └── README.txt              # Nhắc đặt music.mp3 ở đây
├── .env.example
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json               # strict + noUncheckedIndexedAccess
```

---

## 6. Ghi chú kỹ thuật

- **Timezone cố định** `Asia/Ho_Chi_Minh` qua `Intl.DateTimeFormat`, không phụ thuộc máy người dùng.
- **Phân buổi:** 05:00–11:59 sáng · 12:00–17:59 chiều · 18:00–21:29 tối · 21:30–04:59 đêm. Giao diện tối (nền đêm, sao lấp lánh, chữ sáng màu) áp dụng chung cho cả buổi tối lẫn buổi đêm.
- **Không dùng `localStorage`/`sessionStorage`.** Trạng thái chống lặp nằm trong `useRef` (mất khi reload — đúng như yêu cầu).
- **Chống lặp:** kiểu rút bài — xáo bộ, rút hết mới xáo lại, và lá đầu bộ mới không trùng lá vừa rút.
- **Fail-open:** API route luôn trả HTTP 200; lỗi thì trả `{ ok: false }` và client lặng lẽ dùng kho tĩnh. Timeout gọi API 9 giây.
- **Hiệu năng mobile:** canvas giới hạn 14–38 hạt, DPR tối đa 2, dừng `requestAnimationFrame` khi tab ẩn, tôn trọng `prefers-reduced-motion`.
