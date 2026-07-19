export interface EasterEgg {
  greeting: string;
  encouragement: string;
}

/**
 * Bất ngờ nhỏ — thay cho lời chúc thường (tỉ lệ thấp, xem lib/EASTER_EGG_CHANCE
 * ở page.tsx). Không đi theo khuôn ngày tháng/buổi như lời chúc thường, cố
 * tình phá nhịp để tạo cảm giác bất ngờ. Cùng quy ước token {em}/{anh}, câu
 * viết thường ở đầu (được viết hoa lại khi hiển thị).
 */
export const EASTER_EGGS: EasterEgg[] = [
  {
    greeting:
      "khoan đã, quên nói với {em} một chuyện: {anh} yêu {em} nhiều lắm, nhiều đến mức đôi khi tự hỏi sao ngày nào cũng có thể yêu thêm được nữa.",
    encouragement:
      "Chỉ là muốn {em} biết vậy thôi, không có lý do gì đặc biệt cả.",
  },
  {
    greeting:
      "hôm nay {anh} không định chúc gì đặc biệt đâu, chỉ muốn nói là được yêu {em} là điều may mắn nhất {anh} từng có.",
    encouragement: "Cảm ơn {em} vì đã chọn ở lại bên {anh}.",
  },
  {
    greeting:
      "này, {em} có biết là mỗi lần nghĩ tới {em}, {anh} lại tự nhiên mỉm cười một mình không? Người ta nói thế là dấu hiệu yêu nặng rồi đó.",
    encouragement: "{anh} yêu {em}, đơn giản vậy thôi.",
  },
  {
    greeting:
      "báo cáo khẩn: có một người đang nhớ {em} quá mức cho phép, và người đó chính là {anh}.",
    encouragement: "Xin phép được nhớ {em} thêm một chút nữa nha.",
  },
  {
    greeting:
      "nếu có ai hỏi {anh} thích gì nhất trên đời, câu trả lời chắc chắn sẽ luôn là {em}, không cần suy nghĩ.",
    encouragement: "Yêu {em}, hôm nay và cả những ngày sau nữa.",
  },
  {
    greeting:
      "tự nhiên hôm nay {anh} muốn nói với {em} rằng: gặp được {em} là điều đúng đắn nhất {anh} từng làm.",
    encouragement: "Cảm ơn {em} vì đã xuất hiện trong đời {anh}.",
  },
  {
    greeting:
      "cảnh báo: đoạn chúc hôm nay bị {anh} chiếm sóng để nói riêng một câu — {em} là lý do khiến những ngày bình thường cũng trở nên đáng nhớ.",
    encouragement: "Hết giờ phát sóng đặc biệt, {anh} yêu {em}.",
  },
  {
    greeting:
      "{em} biết không, càng ở bên {em} lâu {anh} càng thấy chắc chắn hơn về một điều: đây chính xác là người {anh} muốn đi cùng đường dài.",
    encouragement: "Chỉ vậy thôi, {anh} không giấu được nên nói ra luôn.",
  },
];
