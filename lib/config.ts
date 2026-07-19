/**
 * Nơi duy nhất cần sửa khi muốn đổi tên, cách xưng hô, hay ngày thi.
 */

/** Tên người nhận lời chúc */
export const HER_NAME = "Diệu Anh";

/** Cách xưng hô: người nhận là "em", người gửi là "anh" */
export const XUNG_HO_EM = "em";
export const XUNG_HO_ANH = "anh";

/** Timezone cố định — không phụ thuộc timezone trình duyệt */
export const TIME_ZONE = "Asia/Ho_Chi_Minh";

/**
 * Ngày thi viên chức, định dạng YYYY-MM-DD (giờ Việt Nam).
 * Đổi 1 dòng này là đồng hồ đếm ngược tự cập nhật.
 * Qua ngày thi thì countdown tự ẩn.
 */
export const EXAM_DATE = "2026-09-13";

/** Tên kỳ thi, hiện trong dòng đếm ngược */
export const EXAM_LABEL = "kỳ thi viên chức";

/** Chữ ký cuối trang */
export const SIGNATURE = `Từ người luôn ở phía sau ${XUNG_HO_EM} ❤️`;
