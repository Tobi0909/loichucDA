import type { Mood } from "@/lib/mood";

/**
 * Nội dung riêng cho Mood Picker — bổ sung thêm vào lời chúc theo buổi
 * (không thay thế), khi {em} chủ động chọn tâm trạng hiện tại của mình.
 * Cùng quy ước với data/greetings.ts: câu viết thường ở đầu, dùng token
 * {em}/{anh}.
 */

/** Ghi chú chính ghép thêm vào lời chúc theo buổi khi có tâm trạng được chọn. */
export const MOOD_NOTES: Record<Mood, string[]> = {
  happy: [
    "thấy {em} đang vui thế này {anh} cũng vui lây đó, giữ tâm trạng này lâu thêm chút nữa nha {em}.",
    "{em} đang vui thì cứ tận hưởng trọn vẹn đi, không cần lý do gì to tát, vui là đủ rồi.",
    "nghe {em} vui {anh} nhẹ cả người, mong cảm giác này ở lại với {em} thật lâu.",
    "vui thì kể {anh} nghe với, {anh} muốn vui cùng {em} dù chỉ qua vài dòng chữ thôi.",
    "{em} vui là điều {anh} thích nhất trong ngày hôm nay đấy, cứ giữ nụ cười đó nha.",
    "thấy {em} đang có tâm trạng tốt, {anh} chỉ muốn nói là {anh} tự hào và thương {em} nhiều lắm.",
  ],
  tired: [
    "biết {em} đang mệt, {anh} chỉ muốn ôm {em} một cái thật chặt lúc này thôi.",
    "mệt thì nghỉ một chút đi {em}, không cần gồng thêm gì nữa cả, mọi thứ có thể đợi được.",
    "{em} mệt rồi thì cho phép mình chậm lại nha, không ai trách {em} vì dừng lại để thở đâu.",
    "nghe {em} mệt {anh} thương lắm, ước gì {anh} có thể gánh bớt cho {em} một phần.",
    "mệt là dấu hiệu {em} đã cố gắng rất nhiều rồi đó, giờ là lúc để cơ thể {em} được nghỉ ngơi thật sự.",
    "{em} không cần mạnh mẽ mọi lúc đâu, mệt thì cứ nói với {anh}, {anh} luôn ở đây nghe {em}.",
  ],
  stressed: [
    "biết {em} đang áp lực, {anh} chỉ muốn nhắc {em} rằng không có gì quan trọng hơn sức khoẻ và tinh thần của {em} cả.",
    "áp lực thì hít thở thật sâu một lúc nha {em}, mọi thứ rồi sẽ có cách giải quyết thôi.",
    "{em} không cần gánh hết một mình đâu, có {anh} ở đây, {em} cứ chia bớt áp lực cho {anh} cùng.",
    "nếu mọi thứ đang dồn lại quá nhiều, {em} cho phép mình dừng lại một chút cũng được, không sao cả.",
    "{anh} biết {em} đang cố gắng rất nhiều, chỉ cần {em} vẫn đang cố là đủ khiến {anh} tự hào rồi.",
    "áp lực rồi cũng sẽ qua thôi {em} à, {anh} tin {em} đủ mạnh mẽ để vượt qua giai đoạn này.",
  ],
  sad: [
    "biết {em} đang buồn, {anh} không hỏi lý do đâu, chỉ muốn {em} biết là {anh} ở đây, cạnh {em}.",
    "buồn thì cứ buồn một chút cũng được {em} à, không cần phải gượng vui vì bất kỳ ai cả.",
    "{em} không cần kể ngay nếu chưa muốn, {anh} chỉ mong {em} biết là lúc nào cần thì {anh} vẫn luôn sẵn sàng nghe.",
    "nghe {em} buồn {anh} cũng chùng lòng theo, ước gì {anh} có thể ở ngay cạnh để ôm {em} lúc này.",
    "buồn rồi cũng sẽ qua thôi {em}, {anh} chỉ xin {em} đừng giữ nó một mình quá lâu.",
    "{em} cứ khóc nếu muốn, không sao cả, khóc xong rồi mình lại nhẹ lòng hơn một chút.",
  ],
};

/**
 * Câu đệm ngắn hiện ra ngay sau khi {em} bấm chọn tâm trạng, trước khi lời
 * chúc thật sự xuất hiện — tạo cảm giác "đang được lắng nghe" thay vì đổi
 * text tức thì như bấm một cái tab.
 */
export const MOOD_TRANSITIONS: Record<Mood, string[]> = {
  happy: [
    "Ừm, nghe {em} đang vui vậy thì {anh} cũng phải nói cái này...",
    "Vậy để {anh} nói với {em} một điều nhé...",
    "Khoan đã, để {anh} kể {em} nghe cái này...",
  ],
  tired: [
    "Ừm... vậy để {anh} nói với {em} một điều này nhé.",
    "Khoan đã {em}, nghe {anh} nói cái này đã.",
    "Được rồi, để {anh} nói với {em} chút này nha.",
  ],
  stressed: [
    "Ừm... vậy hôm nay để {anh} nói với {em} một điều này nhé.",
    "Khoan đã {em}, để {anh} nói cái này trước đã.",
    "Được rồi, nghe {anh} nói một chút nha {em}.",
  ],
  sad: [
    "Ừm... vậy để {anh} nói với {em} một điều nhé.",
    "Khoan đã {em}, nghe {anh} nói cái này đã.",
    "Được rồi, để {anh} ở đây nói với {em} chút này.",
  ],
};

/** Dòng phụ riêng theo tâm trạng — thay cho dòng động viên/dỗ dành mặc định. */
export const MOOD_ENCOURAGEMENTS: Record<Mood, string[]> = {
  happy: [
    "Cứ vui vậy hoài nha {em}, {anh} thích nhìn thấy {em} như thế này lắm.",
    "Niềm vui của {em} cũng là niềm vui của {anh} đó.",
    "Giữ lấy cảm giác này nha {em}, đừng để gì làm nó tắt đi.",
    "{anh} ước gì lúc này được ở cạnh để cười cùng {em}.",
  ],
  tired: [
    "Nghỉ ngơi đi {em}, mọi thứ có thể đợi được.",
    "{anh} chỉ mong {em} khoẻ, không cần cố thêm gì cả.",
    "Chậm lại một chút cũng không sao đâu {em}.",
    "{em} đã cố gắng đủ nhiều rồi, giờ là lúc để nghỉ.",
  ],
  stressed: [
    "Thở sâu một cái rồi mình từ từ giải quyết nha {em}.",
    "{em} không đơn độc đâu, có {anh} ở đây.",
    "Một bước một lúc thôi {em}, không cần vội.",
    "{anh} tin {em} sẽ vượt qua được giai đoạn này.",
  ],
  sad: [
    "{anh} ở đây, {em} không cần buồn một mình đâu.",
    "Buồn thì cứ buồn, {anh} vẫn thương {em} y như vậy.",
    "Cần khóc thì cứ khóc, {anh} không đi đâu cả.",
    "Mai trời sẽ sáng hơn, {em} à, {anh} tin vậy.",
  ],
};
