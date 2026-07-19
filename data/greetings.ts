import type { Period } from "@/lib/time";

/**
 * Kho lời chúc tĩnh (fallback khi API lỗi / hết quota / chưa cấu hình key).
 *
 * Quy ước: mỗi câu là phần THÂN của lời chúc, viết thường ở đầu, vì khi hiển thị
 * sẽ được ghép sau một tiền tố có ngày tháng, ví dụ:
 *   "Hôm nay 22/7 rồi, " + "chúc {em} một buổi sáng thật nhẹ nhàng."
 *
 * Token {em} / {anh} sẽ được thay bằng cách xưng hô cấu hình trong lib/config.ts.
 */

/** Các cách mở đầu có ngày tháng, xoay vòng cho đỡ nhàm. */
export const DATE_PREFIXES: string[] = [
  "Hôm nay {date} rồi, ",
  "{date} rồi đó, ",
  "Mới đó mà đã {date}, ",
  "Ngày {date} ghé qua, ",
  "Lịch báo {date} rồi nha, ",
  "Hôm nay là {date}, ",
];

/** Ý thêm theo thứ trong tuần (nối vào cuối lời chúc). */
export const MONDAY_NOTES: string[] = [
  "Tuần mới rồi, mình bắt đầu lại thật nhẹ nhàng nhé, không cần gồng để bắt kịp guồng ngay từ sáng thứ Hai đâu.",
  "Đầu tuần mà, {em} cứ đi chậm một chút cũng không sao, quan trọng là mình còn đủ sức cho cả tuần dài phía trước.",
  "Chúc {em} một tuần mới suôn sẻ và nhiều năng lượng, mong những gì dở dang tuần trước sẽ được thu xếp gọn gàng trong tuần này.",
  "Tuần mới, chỉ cần {em} khoẻ là mọi thứ ổn hết, những deadline hay bài vở rồi cũng sẽ có cách giải quyết.",
  "Mở đầu tuần mới bằng một hơi thở thật sâu nha {em}, để cả tuần phía trước bớt đi phần nào nặng nề.",
  "Thứ Hai lúc nào cũng hơi ngại, nhưng {anh} tin {em} sẽ vào guồng nhanh thôi, cứ để mọi thứ trôi theo nhịp của riêng {em}.",
];

/** Thứ Sáu — bung xõa, háo hức vì cuối tuần đã kề bên. */
export const FRIDAY_NOTES: string[] = [
  "Thứ Sáu rồi, {em} coi như đã băng qua được cả một tuần dài, tối nay cho phép mình xả hơi một chút cũng được.",
  "Cuối tuần chỉ còn cách {em} một đêm nay thôi, {anh} chúc {em} thứ Sáu này nhẹ tênh, làm gì cũng thấy hào hứng hơn ngày thường.",
  "{anh} chúc {em} thứ Sáu vui vẻ, có thể tự thưởng cho mình một điều gì đó nho nhỏ, vì cả tuần {em} đã cố gắng nhiều rồi.",
  "Thứ Sáu là để thở phào, {em} cứ để đầu óc nhẹ nhõm dần, hai ngày phía trước sẽ là của riêng {em}.",
  "Chúc {em} một thứ Sáu tràn năng lượng, cuối tuần đang vẫy gọi ngay phía trước rồi đó.",
  "{anh} chúc {em} thứ Sáu này thật sảng khoái, tuần mới còn xa, còn hôm nay thì cứ tận hưởng đã.",
];

/** Thứ Bảy — ngày đầu cuối tuần, để nghỉ ngơi và làm điều mình thích. */
export const SATURDAY_NOTES: string[] = [
  "Cuối tuần rồi, {em} cho phép mình nghỉ một chút nhé, sách vở để đó cũng không chạy đi đâu mất đâu.",
  "Cuối tuần mà, ngủ thêm mười lăm phút cũng chẳng ai trách đâu, cơ thể {em} xứng đáng được bù đắp sau một tuần dài.",
  "Chúc {em} một ngày thứ Bảy thật dễ chịu, làm điều gì đó chỉ vì {em} thích chứ không phải vì phải hoàn thành.",
  "Cuối tuần là để {em} thở, không phải để {em} chạy, nên hôm nay cứ ưu tiên bản thân trước đã nhé.",
  "Thứ Bảy rồi, nhớ dành cho bản thân một khoảng trống nha {em}, không lịch trình, không deadline, chỉ có {em} thôi.",
  "Hai ngày cuối tuần ngắn ngủi, {anh} chỉ mong {em} dùng nó để nạp lại năng lượng chứ không phải để lo lắng thêm.",
];

/** Chủ nhật — ngày chữa lành, chuẩn bị tinh thần nhẹ nhàng cho tuần mới. */
export const SUNDAY_NOTES: string[] = [
  "Chủ nhật rồi, {em} cho phép mình chậm lại thật sự một ngày, không cần nghĩ tới thứ Hai vội đâu.",
  "Chúc {em} một ngày Chủ nhật chữa lành, làm gì đó khiến lòng nhẹ đi, để đầu tuần tới {em} có thêm sức mà đi tiếp.",
  "{anh} chúc {em} Chủ nhật này được nghỉ ngơi trọn vẹn, không deadline nào đáng để {em} đánh đổi ngày cuối tuần cuối cùng.",
  "Chủ nhật là ngày của riêng {em}, không phải chuẩn bị hay lo lắng gì cho tuần sau cả, cứ để ngày mai lo chuyện của ngày mai.",
  "Chúc {em} một Chủ nhật bình yên, {em} không cần làm gì to tát, chỉ cần thấy dễ chịu là đủ rồi.",
  "{anh} chúc {em} Chủ nhật này chậm rãi và ấm áp, để khi thứ Hai tới {em} đã sẵn sàng chứ không phải gồng mình.",
];

/** Ghi chú thời tiết thực tế (Hà Nội) — chỉ dùng khi thời tiết đáng chú ý. */
export const RAIN_NOTES: string[] = [
  "Ngoài trời đang mưa đấy, {em} nhớ mang áo mưa hoặc ở trong nhà cho ấm nhé.",
  "Trời mưa rồi, đường trơn, {em} đi lại cẩn thận hơn một chút nha.",
  "Nghe nói ngoài kia đang mưa, {em} nhớ mang theo ô nếu phải ra ngoài nhé.",
  "Trời mưa thế này chỉ muốn cuộn tròn trong chăn thôi, {em} nhớ giữ ấm nha.",
  "Mưa rồi đó, {anh} chỉ mong {em} đi lại an toàn, đừng để ướt mà cảm lạnh.",
];

export const STORM_NOTES: string[] = [
  "Ngoài trời đang có giông đấy, {em} hạn chế ra đường lúc này nha, ở trong nhà cho an toàn.",
  "Trời đang giông bão, {em} nhớ đóng cửa sổ và ở yên trong nhà nhé, {anh} không yên tâm nếu {em} ra ngoài lúc này.",
  "Ngoài kia sấm chớp dữ lắm, {em} cứ ở trong nhà, đợi tạnh hẳn rồi hẵng đi đâu.",
];

export const HOT_WEATHER_NOTES: string[] = [
  "Trời đang nóng lắm đấy, {em} nhớ uống đủ nước và tránh nắng gắt giữa trưa nha.",
  "Nắng nóng thế này {em} nhớ mang theo nước và đừng quên kem chống nắng nhé.",
  "Trời nóng, {em} chọn chỗ mát mà ngồi, đừng để say nắng giữa chừng.",
];

export const COLD_WEATHER_NOTES: string[] = [
  "Trời đang se lạnh đấy, {em} nhớ mặc thêm áo ấm trước khi ra ngoài nha.",
  "Lạnh rồi đó, {em} đừng quên khoác thêm một lớp áo, giữ ấm cổ và tay chân nhé.",
  "Trời trở lạnh, {anh} chỉ mong {em} đủ ấm, đừng vì vội mà quên khoác áo.",
];

export const WEATHER_NOTES: Record<"rain" | "storm" | "hot" | "cold", string[]> = {
  rain: RAIN_NOTES,
  storm: STORM_NOTES,
  hot: HOT_WEATHER_NOTES,
  cold: COLD_WEATHER_NOTES,
};

export const MORNING_GREETINGS: string[] = [
  "chúc {em} một buổi sáng thật nhẹ nhàng, đủ nắng để {em} có thêm chút động lực nhưng không đến mức khiến {em} phải vội vàng. Mong hôm nay đối xử dịu dàng với {em}, như cách {em} vẫn dịu dàng với mọi người xung quanh.",
  "chúc {em} buổi sáng thật bình yên. Uống một ly nước ấm trước khi bắt đầu ngày mới nha, để cơ thể {em} tỉnh táo mà không bị vội vã dồn ép.",
  "{anh} chúc {em} buổi sáng vui vẻ. Hôm nay {em} chỉ cần làm tốt phần của mình là đủ rồi, phần còn lại cứ để mọi thứ tự sắp xếp theo nhịp của nó.",
  "chúc {em} một ngày mới nhiều năng lượng. Nhớ ăn sáng tử tế nhé, bụng no thì đầu óc mới đủ tỉnh táo để lo những việc quan trọng hơn.",
  "buổi sáng của {em} có nắng không? Dù có hay không thì {anh} vẫn chúc {em} một ngày thật ổn, mong những gì {em} lo lắng tối qua sẽ nhẹ bớt khi trời sáng.",
  "chúc {em} sáng nay tỉnh táo và nhẹ đầu, mọi việc rồi sẽ vào guồng thôi. Không cần phải hoàn hảo ngay từ đầu ngày đâu {em}.",
  "chúc {em} một buổi sáng không vội. Đi chậm mà chắc vẫn hơn, và {anh} tin những bước chậm rãi của {em} rồi sẽ đưa {em} đi rất xa.",
  "sáng rồi, {anh} chúc {em} mở mắt ra là thấy lòng nhẹ tênh, như thể đêm qua mọi muộn phiền đã được gác lại hết ở phía sau.",
  "chúc {em} buổi sáng tốt lành. Hôm nay {em} cứ làm những gì trong khả năng, phần còn lại để sau, không ai bắt {em} phải xong hết trong một ngày cả.",
  "chúc {em} một sáng thật trong trẻo, đầu óc tỉnh táo và tim thì nhẹ, đủ để {em} bắt đầu một ngày mà không phải mang theo gánh nặng từ hôm qua.",
  "{anh} chúc {em} sáng nay nhiều động lực, mà nếu chưa có thì cũng không sao đâu, động lực có thể đến muộn một chút, quan trọng là {em} vẫn đang cố gắng.",
  "chúc {em} một buổi sáng ấm áp như ly cà phê {em} thích, đủ để {em} thấy được chăm sóc trước khi bước vào một ngày bận rộn.",
  "sáng nay {em} nhớ vươn vai một cái thật lâu rồi hãy bắt đầu nhé, để cơ thể tỉnh hẳn trước khi đầu óc phải nghĩ đến việc gì đó.",
  "chúc {em} ngày mới suôn sẻ, gặp toàn chuyện dễ chịu. Mong hôm nay không có gì bất ngờ làm {em} phải xoay xở quá nhiều.",
  "chúc {em} một sáng bình yên, không deadline nào làm {em} cau mày. Nếu có thì cứ giải quyết từng chút một, {em} luôn xử lý được mà.",
  "{anh} chúc {em} buổi sáng thật vui. Hôm nay nhớ cười một cái cho {anh} nhé, dù chỉ là một nụ cười nhỏ lúc soi gương trước khi ra khỏi nhà.",
  "chúc {em} sáng nay đầu óc thông suốt, việc gì cũng vào một cách nhẹ nhàng, không phải cố nhớ hay cố hiểu gì trong áp lực cả.",
  "chúc {em} một buổi sáng đủ nắng và đủ bình tĩnh, để {em} nhìn ngày hôm nay như một trang mới chứ không phải một danh sách việc phải làm.",
  "sáng rồi đó, chúc {em} một ngày mà mọi thứ đều nhích lên một chút, dù chỉ là những bước tiến nhỏ cũng đáng để tự hào.",
  "chúc {em} buổi sáng an lành. {em} không cần phải hoàn hảo đâu, chỉ cần {em} vẫn đang cố gắng là đủ để {anh} yên tâm rồi.",
  "{anh} chúc {em} một ngày mới mà {em} thấy tự hào về chính mình, dù hôm nay {em} chỉ làm được một việc nhỏ thôi cũng không sao.",
  "chúc {em} sáng nay dậy đúng giờ, ăn đúng bữa và lòng thì thong thả, không phải chạy đua với đồng hồ ngay từ khi vừa mở mắt.",
  "chúc {em} một buổi sáng đẹp trời. Hôm nay {anh} vẫn ở đây, như mọi hôm, dõi theo {em} từ xa dù không thể ở bên cạnh.",
  "chúc {em} ngày mới đầy năng lượng, mà nếu mệt thì cứ nghỉ, không ai giục {em} cả. Sức khoẻ của {em} luôn quan trọng hơn bất kỳ việc gì.",
  "sáng nay chúc {em} nhẹ nhàng bắt đầu, không cần vội vàng với ai hết. Nhịp độ của {em} là nhịp độ đúng, cứ theo nó mà đi.",
  "chúc {em} một buổi sáng mà mọi thứ đều đúng chỗ của nó, từ việc lớn đến việc nhỏ, để {em} không phải mất công lo lắng thừa.",
  "{anh} chúc {em} sáng nay ấm bụng, ấm lòng và đủ tỉnh táo để bắt đầu một ngày mà {anh} tin sẽ tử tế với {em}.",
  "chúc {em} một ngày mới thật hiền. Mong không có chuyện gì làm {em} phải nhíu mày, và nếu có thì cũng chỉ là chuyện nhỏ thôi.",
  "chúc {em} buổi sáng dễ thương như chính {em} vậy, một buổi sáng mà chỉ cần nghĩ đến thôi cũng đã thấy nhẹ lòng.",
  "chúc {em} một sáng trọn vẹn, làm được bao nhiêu cũng đáng khen hết, vì {em} đã cố gắng theo đúng sức của mình rồi.",
  "{anh} chúc {em} sáng nay có tâm trạng tốt, việc gì rồi cũng qua thôi, chỉ là hôm nay có thể hơi khó một chút mà thôi.",
  "chúc {em} buổi sáng thảnh thơi, hít một hơi thật sâu rồi mình bắt đầu, không cần phải lao vào mọi thứ ngay lập tức đâu.",
];

export const AFTERNOON_GREETINGS: string[] = [
  "chúc {em} buổi chiều nhẹ nhàng, việc còn lại cứ từ từ mà làm. Nửa ngày đã trôi qua rồi, {em} không cần phải dồn hết vào mấy tiếng còn lại đâu.",
  "chiều rồi, {anh} chúc {em} một buổi chiều dễ chịu và bớt mệt. Nếu vai {em} đang mỏi thì đứng dậy vươn vai một chút cho đỡ căng nhé.",
  "chúc {em} buổi chiều bình yên. Nhớ đứng dậy đi lại một chút nha, ngồi lâu quá không tốt cho lưng {em} đâu.",
  "chúc {em} chiều nay tỉnh táo, uống thêm nước cho đỡ mệt nhé. Đôi khi chỉ cần một ly nước là đủ để đầu óc tỉnh lại rồi.",
  "nửa ngày trôi qua rồi, chúc {em} nửa còn lại thật suôn sẻ, và những gì chưa làm xong sáng nay cũng không có gì đáng lo cả.",
  "chúc {em} buổi chiều thong thả, không có gì gấp gáp cả. Việc nào quan trọng thì làm trước, việc nào chưa gấp thì để mai cũng được.",
  "{anh} chúc {em} chiều nay giữ được nhịp của mình, đừng để ai làm {em} vội, vì {em} biết rõ nhất mình cần bao nhiêu thời gian.",
  "chúc {em} một buổi chiều êm, mong nắng không làm {em} khó chịu và không khí xung quanh cũng dễ thở như {em} vẫn mong.",
  "chúc {em} chiều nay làm được vừa đủ và thấy hài lòng, vì làm vừa đủ với chính mình cũng đáng quý như làm được thật nhiều.",
  "chúc {em} buổi chiều nhiều năng lượng, cố thêm chút nữa là tới giờ nghỉ rồi, {anh} tin {em} sẽ trụ được tới lúc đó.",
  "chúc {em} chiều nay đầu óc nhẹ, việc gì khó thì để mai tính, hôm nay chỉ cần làm những gì trong tầm tay là đủ.",
  "{anh} chúc {em} một buổi chiều dễ thở, nhớ ăn nhẹ gì đó nha, đừng để bụng đói làm {em} mất tập trung giữa chiều.",
  "chúc {em} buổi chiều an lành. Mệt thì nghỉ, không ai đuổi {em} đâu, chỉ cần {em} biết dừng đúng lúc là đủ tốt rồi.",
  "chúc {em} chiều nay mọi việc trôi chảy, gặp ai cũng dễ chịu, và những cuộc trò chuyện hôm nay đều nhẹ nhàng như {em} mong.",
  "chúc {em} một buổi chiều bình thản, không lo nghĩ quá nhiều, những gì chưa xảy ra thì cứ để nó xảy ra rồi mới tính.",
  "chúc {em} chiều nay có một khoảng lặng nhỏ cho riêng mình, dù chỉ vài phút cũng đủ để {em} lấy lại hơi thở.",
  "{anh} chúc {em} buổi chiều vui vẻ, ngày cũng sắp trọn rồi, chỉ còn một đoạn ngắn nữa thôi là {em} có thể nghỉ ngơi.",
  "chúc {em} chiều nay bớt căng thẳng, thả lỏng vai một chút đi {em}, căng thẳng kéo dài không giúp việc gì nhanh hơn đâu.",
  "chúc {em} một buổi chiều mát mẻ trong lòng, dù ngoài trời thế nào thì bên trong {em} vẫn có thể giữ được sự bình yên riêng.",
  "chúc {em} chiều nay hiệu quả vừa phải thôi, sức khoẻ mới là quan trọng, làm được ít mà khoẻ vẫn tốt hơn làm nhiều mà kiệt sức.",
  "chúc {em} buổi chiều êm đềm, những chuyện lăn tăn rồi cũng qua, giống như mọi lần {em} từng lo lắng rồi mọi thứ vẫn ổn cả.",
  "{anh} chúc {em} chiều nay giữ được tinh thần tốt, {em} làm được mà, {anh} tin ở {em} nhiều hơn {em} tin ở chính mình đấy.",
  "chúc {em} một buổi chiều không áp lực, mình đi từng bước nhỏ thôi, không cần phải nhìn cả chặng đường một lúc.",
  "chúc {em} chiều nay nhớ ngẩng đầu lên khỏi bàn học một lát nhé, nhìn ra ngoài cửa sổ một chút cho mắt và đầu óc được nghỉ.",
  "chúc {em} buổi chiều dịu dàng, giống cách {em} vẫn đối xử với mọi người xung quanh, mong hôm nay ai đó cũng dịu dàng lại với {em}.",
  "chúc {em} chiều nay gặp toàn chuyện thuận, không ai làm {em} phiền lòng, và nếu có ai làm vậy thì {em} cứ kể {anh} nghe.",
  "chúc {em} một buổi chiều đủ đầy, không thiếu cũng không phải gắng quá, một buổi chiều vừa vặn với sức của {em}.",
  "{anh} chúc {em} chiều nay nhẹ lòng, mọi thứ đang đi đúng hướng đấy, chỉ là đôi khi {em} chưa nhìn thấy hết thôi.",
  "chúc {em} buổi chiều tươi tắn, chút nữa thôi là được nghỉ rồi, cố thêm một đoạn ngắn nữa là {em} có thể thở phào.",
  "chúc {em} chiều nay bình tĩnh với mọi thứ, {em} vốn giỏi khoản đó mà, chỉ là đôi lúc quên mất mình giỏi đến đâu thôi.",
  "chúc {em} một buổi chiều yên ả, gió mát và lòng cũng mát, mong không có áp lực nào len vào được khoảng thời gian này của {em}.",
  "{anh} chúc {em} buổi chiều thoải mái, đừng ép mình quá nha, cơ thể và tinh thần của {em} đều cần được đối xử tử tế.",
];

/** Buổi tối (18:00–21:29) — thư giãn sau một ngày dài, cố ý không nhắc chuyện học. */
export const EVENING_GREETINGS: string[] = [
  "chúc {em} một buổi tối thật thư giãn, ngày dài đã trôi qua rồi, giờ là lúc {em} được thuộc về riêng mình.",
  "tối rồi, {anh} chúc {em} ăn tối ngon miệng và bỏ lại hết những bận rộn của cả ngày ở phía sau cửa.",
  "chúc {em} buổi tối nhẹ nhõm, thay bộ đồ thoải mái, ngồi xuống và cho phép mình không làm gì cả một lúc.",
  "chúc {em} tối nay ấm bụng, ấm lòng, một bữa tối tử tế sẽ giúp {em} thấy dễ chịu hơn nhiều sau cả ngày dài.",
  "{anh} chúc {em} một buổi tối chậm rãi, không cần vội vàng làm gì nữa, mọi việc gấp gáp đã ở lại cùng ban ngày rồi.",
  "chúc {em} buổi tối vui vẻ, làm điều gì đó chỉ vì {em} thích thôi, nghe một bài hát hay xem gì đó nhẹ nhàng cũng được.",
  "chúc {em} tối nay có một khoảng lặng dễ chịu, tắt bớt thông báo điện thoại đi cũng được, chẳng có gì gấp tới mức không đợi được tới mai.",
  "chúc {em} một buổi tối ấm áp, dù {anh} không ở cạnh nhưng {anh} vẫn đang nghĩ tới {em} vào đúng lúc này.",
  "{anh} chúc {em} tối nay được nghỉ ngơi đúng nghĩa, không phải nghỉ trong lúc vẫn còn nghĩ tới việc chưa xong.",
  "chúc {em} buổi tối dễ chịu, tắm rửa xong rồi thì cứ thả lỏng người ra, hôm nay {em} đã cố gắng đủ nhiều rồi.",
  "chúc {em} tối nay gặp toàn chuyện nhẹ nhàng, không có tin nhắn công việc nào làm phiền khoảng thời gian này của {em} cả.",
  "chúc {em} một buổi tối yên ả, cứ để căn phòng nhỏ của {em} là nơi duy nhất {em} cần nghĩ tới lúc này.",
  "{anh} chúc {em} tối nay ăn no, cười nhiều, và thấy lòng nhẹ hơn hẳn so với lúc mới tan làm hay tan học.",
  "chúc {em} buổi tối thong thả, {em} không cần tranh thủ làm thêm gì nữa đâu, cứ để buổi tối là buổi tối thôi.",
  "chúc {em} tối nay được là chính mình, không vai trò, không deadline, chỉ có {em} và những gì {em} thật sự muốn làm.",
  "chúc {em} một buổi tối ấm cúng, nếu trời se lạnh thì khoác thêm áo nha {em}, đừng để mình bị lạnh vì mải làm việc khác.",
  "{anh} chúc {em} tối nay thảnh thơi, gọi điện cho ai đó {em} thương hoặc chỉ đơn giản là ngồi yên cũng đều tốt cả.",
  "chúc {em} buổi tối nhẹ nhàng trôi qua, không có gì phải giải quyết gấp, mọi thứ đều có thể đợi đến ngày mai.",
  "chúc {em} tối nay thấy biết ơn một chút về ngày hôm nay, dù nó dễ hay khó thì {em} cũng đã đi qua trọn vẹn rồi.",
  "chúc {em} một buổi tối dịu dàng, giống như cách {em} vẫn dịu dàng với mọi người suốt cả ngày dài.",
  "{anh} chúc {em} tối nay không phải nghĩ ngợi nhiều, cứ để đầu óc trôi theo bất cứ điều gì khiến {em} thấy vui.",
  "chúc {em} buổi tối được sạc lại năng lượng, một tách trà ấm hay một bộ phim quen thuộc cũng đủ để {em} thấy dễ chịu rồi.",
  "chúc {em} tối nay có thời gian cho riêng mình, dù chỉ nửa tiếng thôi cũng đáng quý, vì cả ngày {em} đã dành cho bao nhiêu thứ khác rồi.",
  "chúc {em} một buổi tối êm đềm, ngoài kia ồn ào thế nào cũng được, miễn là góc nhỏ của {em} vẫn yên tĩnh.",
  "{anh} chúc {em} tối nay cười thật nhiều, dù là vì chuyện gì cũng được, chỉ cần {em} vui là {anh} thấy nhẹ lòng rồi.",
  "chúc {em} buổi tối trọn vẹn, ngày hôm nay coi như đã xong, phần còn lại của tối nay là dành để {em} nghỉ ngơi.",
  "chúc {em} tối nay không phải trả lời thêm tin nhắn nào cần suy nghĩ nhiều, để đầu óc {em} được thảnh thơi một chút.",
  "chúc {em} một buổi tối ấm áp bên những gì {em} yêu thích, một cuốn truyện, một bản nhạc, hay đơn giản là sự im lặng dễ chịu.",
  "{anh} chúc {em} tối nay bớt hết mệt mỏi trong người, để lát nữa khi lên giường {em} đã thấy nhẹ nhõm sẵn rồi.",
  "chúc {em} buổi tối an yên, mọi lo toan của ban ngày cứ để nó ở ngoài cửa, tối nay là thời gian dành riêng cho {em} thôi.",
];

/** Dòng phụ dịu nhẹ cho buổi tối (18:00–21:29) — không nhắc học, cũng chưa hẳn là chuyện đi ngủ. */
export const EVENING_SOFT_NOTES: string[] = [
  "Ăn tối chưa {em}? Nhớ ăn đầy đủ nha, đừng để bụng đói kéo dài tới tận khuya.",
  "Cởi bỏ hết những gì gồng suốt ngày dài đi, tối nay {em} chỉ cần là chính mình thôi.",
  "Không cần làm thêm gì nữa đâu {em}, hôm nay như vậy là đủ rồi.",
  "{anh} chỉ mong tối nay {em} thấy thoải mái, không cần gì to tát hơn thế.",
  "Dành chút thời gian cho bản thân trước khi trời tối hẳn nha {em}.",
  "Buổi tối là của {em}, không phải của công việc, {em} nhớ giữ lấy khoảng thời gian này nhé.",
  "Nếu mệt thì cứ ngồi yên một lúc, không cần vội làm gì tiếp theo cả.",
  "{em} đã qua một ngày dài rồi, tối nay cho phép mình chậm lại một chút nha.",
  "Nhắn cho {anh} vài dòng nếu {em} rảnh nhé, không thì {anh} vẫn hiểu {em} đang nghỉ ngơi.",
  "Cứ để tối nay trôi qua thật nhẹ, không deadline nào đáng để {em} đánh đổi sự thoải mái lúc này.",
];

export const NIGHT_GREETINGS: string[] = [
  "chúc {em} một buổi tối bình yên và ngủ thật ngon nhé. Cả ngày dài {em} đã cố gắng nhiều rồi, giờ là lúc để cơ thể {em} được nghỉ ngơi trọn vẹn.",
  "tối rồi, {anh} chúc {em} gác hết mọi thứ lại và nghỉ ngơi. Những gì chưa xong hôm nay thì để ngày mai, đêm nay chỉ dành cho giấc ngủ thôi.",
  "chúc {em} ngủ ngon, mai là một ngày mới hoàn toàn. Đừng mang những lo lắng của hôm nay vào giấc ngủ, để đầu óc {em} được trống trải một chút.",
  "chúc {em} buổi tối nhẹ nhàng, chúc {em} một giấc ngủ sâu. Mong khi {em} nhắm mắt lại, mọi suy nghĩ cũng lắng xuống theo.",
  "chúc {em} tối nay thư giãn, mọi chuyện để sáng mai tính tiếp. Đêm không phải lúc để giải quyết vấn đề, mà là lúc để {em} được thở.",
  "{anh} chúc {em} ngủ ngon. Hôm nay {em} vất vả rồi, cứ để cơ thể được bù đắp bằng một giấc ngủ thật đủ đầy nhé.",
  "chúc {em} một đêm yên tĩnh, không mộng mị gì hết, chỉ có sự tĩnh lặng đủ để {em} hồi phục sau một ngày dài.",
  "chúc {em} tối nay ngủ sớm một chút, cơ thể {em} cần nghỉ hơn là cần thêm vài trang sách nữa đâu.",
  "chúc {em} buổi tối ấm áp và một giấc ngủ thật tròn, để sáng mai {em} thức dậy với đầy đủ năng lượng cho một ngày mới.",
  "chúc {em} ngủ ngon nha, {anh} chúc {em} mơ thấy điều gì đó dễ thương, một giấc mơ không có deadline hay lo lắng nào cả.",
  "chúc {em} một tối bình yên, đèn tắt rồi thì thôi không nghĩ nữa nhé, để đầu óc {em} được nghỉ trọn vẹn như cơ thể vậy.",
  "{anh} chúc {em} đêm nay ngủ ngon, mai dậy sẽ thấy khoẻ hơn, mọi chuyện hôm nay còn dang dở rồi cũng sẽ có cách giải quyết.",
  "chúc {em} buổi tối dịu dàng, chúc {em} thả lỏng hoàn toàn, không cần giữ tư thế nghiêm túc như lúc ban ngày nữa đâu.",
  "chúc {em} ngủ ngon, hôm nay như vậy là đủ rồi, {em} không cần làm thêm gì nữa để chứng minh mình đã cố gắng cả.",
  "chúc {em} một đêm nhẹ nhàng, không lo lắng nào theo {em} vào giấc ngủ, để sáng mai {em} tỉnh dậy với một tâm trí trong trẻo.",
  "chúc {em} tối nay được nghỉ trọn vẹn, {em} xứng đáng mà, sau một ngày dài như vậy thì giấc ngủ ngon là điều {em} nên có.",
  "chúc {em} ngủ thật sâu, {anh} chúc {em} một đêm êm ái, để sáng mai thức dậy {em} thấy người nhẹ nhõm hẳn.",
  "chúc {em} buổi tối an lành. Chúc {em} ngủ ngon nhé, và biết rằng dù mọi chuyện thế nào thì {anh} vẫn luôn ở đây.",
  "{anh} chúc {em} đêm nay ngon giấc, mai mình lại bắt đầu, mỗi ngày mới đều là một cơ hội khác để làm tốt hơn một chút.",
  "chúc {em} một tối thảnh thơi, chăn ấm và lòng cũng ấm, đủ để {em} chìm vào giấc ngủ mà không vướng bận điều gì.",
  "chúc {em} ngủ ngon, chúc {em} không còn nghĩ ngợi gì nữa, mọi câu hỏi hôm nay chưa có lời đáp thì để ngày mai tìm tiếp.",
  "chúc {em} buổi tối yên ả, giấc ngủ đến thật êm, như một cái ôm nhẹ nhàng khép lại một ngày đã qua.",
  "chúc {em} một đêm bình an. Mọi thứ vẫn ổn cả, {em} yên tâm ngủ đi, sáng mai mở mắt ra mọi chuyện sẽ rõ ràng hơn.",
  "chúc {em} tối nay buông hết mệt mỏi xuống và ngủ ngon, để những căng thẳng của cả ngày không theo {em} vào giấc mơ.",
  "{anh} chúc {em} ngủ ngon, mai trời sáng lại rồi tính tiếp, hôm nay {em} đã làm hết sức mình rồi, vậy là đủ.",
  "chúc {em} một đêm thật dài và thật êm, để {em} có đủ thời gian phục hồi sau một ngày đã tiêu tốn không ít năng lượng.",
  "chúc {em} buổi tối dễ chịu, đắp chăn kín một chút cho khỏi lạnh, và để cơ thể được ủ ấm trọn vẹn suốt đêm.",
  "chúc {em} ngủ ngon, chúc {em} có một giấc mơ hiền lành, một giấc mơ không mang theo bất kỳ áp lực nào của ban ngày.",
  "chúc {em} một tối nhẹ nhõm, ngày hôm nay khép lại ở đây thôi, những gì chưa xong sẽ có chỗ của nó vào ngày mai.",
  "chúc {em} đêm nay ngủ sớm, {anh} chỉ mong {em} khoẻ, vì với {anh} sức khoẻ của {em} luôn quan trọng hơn mọi thứ khác.",
  "{anh} chúc {em} một giấc ngủ ngon lành, không giật mình giữa đêm, để {em} có một đêm trọn vẹn từ đầu đến cuối.",
  "chúc {em} buổi tối êm đềm, mọi thứ ồn ào đều đã tắt rồi, chỉ còn lại sự yên tĩnh vừa đủ để {em} chìm vào giấc ngủ.",
];

/** 30+ câu động viên ôn thi — hiển thị như dòng phụ dưới lời chúc chính. */
export const EXAM_ENCOURAGEMENTS: string[] = [
  "Học được bao nhiêu hay bấy nhiêu, {em} đừng tự trách mình nhé, vì mỗi người có một nhịp học khác nhau và {em} đang đi đúng nhịp của mình.",
  "Nghỉ ngơi cũng là một phần của việc ôn thi đấy, không phải lúc nào ngồi vào bàn cũng là đang tiến bộ, đôi khi nghỉ đúng lúc mới là cách học khôn ngoan.",
  "Thi cử chỉ là một chặng thôi, không phải cả con đường của {em}, dù kết quả ra sao thì phía trước {em} vẫn còn rất nhiều cơ hội khác.",
  "{anh} tin vào nỗ lực của {em}, dù kết quả thế nào, vì {anh} biết rõ {em} đã bỏ ra bao nhiêu công sức cho kỳ thi này.",
  "Mỗi trang {em} học hôm nay đều đang cộng dồn lại cả đấy, không có gì là uổng phí, kể cả những phần {em} thấy mình học chậm.",
  "Mệt thì dừng, đừng cố đến mức ốm nha {em}, sức khoẻ mà không còn thì học giỏi đến đâu cũng khó mà phát huy được.",
  "Dù kết quả ra sao thì {anh} vẫn thương {em} y như vậy, tình cảm của {anh} không đặt điều kiện vào bất kỳ con điểm nào cả.",
  "Không ai học tốt khi thiếu ngủ đâu, {em} nhớ ngủ đủ nhé, một cái đầu tỉnh táo còn quan trọng hơn nhiều giờ ngồi bàn học mà lơ mơ.",
  "{em} đã đi được xa hơn {em} tưởng rồi đấy, chỉ là đôi khi đứng giữa hành trình thì khó mà nhìn thấy hết quãng đường mình đã qua.",
  "Hôm nay chưa vào đầu thì mai vào, không sao hết, kiến thức không phải lúc nào cũng chịu ở lại ngay từ lần đọc đầu tiên.",
  "Uống nước, đứng dậy đi lại, rồi hãy học tiếp nha {em}, cơ thể cần được vận động một chút để đầu óc tỉnh táo hơn.",
  "So với chính {em} tháng trước, {em} đã khá hơn nhiều rồi, đừng so mình với ai khác ngoài chính {em} của ngày hôm qua.",
  "Áp lực là bình thường, nhưng {em} không cần gánh nó một mình, có {anh} ở đây để {em} chia sẻ bất cứ lúc nào cần.",
  "Cứ học chậm mà chắc, {anh} không giục {em} đâu, hiểu sâu một chút vẫn tốt hơn là học vội mà quên ngay sau đó.",
  "Một buổi nghỉ không làm hỏng cả quá trình ôn của {em} đâu, ngược lại nó còn giúp {em} học hiệu quả hơn ở những buổi sau.",
  "{em} không cần giỏi nhất, chỉ cần đủ tốt vào đúng hôm thi, vậy nên những ngày ôn tập cứ tích luỹ từ từ là được.",
  "Nếu hôm nay khó quá thì mình học ít lại một chút cũng được, không phải ngày nào cũng cần đạt hiệu suất cao nhất.",
  "{anh} không kỳ vọng gì cả, {anh} chỉ mong {em} khoẻ, vì với {anh} một {em} khoẻ mạnh quan trọng hơn một {em} đạt điểm cao mà kiệt sức.",
  "Kiến thức cần thời gian ngấm, {em} kiên nhẫn với mình chút nha, không phải học một lần là nhớ mãi ngay được.",
  "Sai ở lúc ôn là điều tốt, để lúc thi mình không sai nữa, mỗi lỗi sai bây giờ đều đang giúp {em} chuẩn bị kỹ hơn cho ngày thi.",
  "Đừng so mình với người khác, đường ai nấy đi mà {em}, tốc độ học của mỗi người vốn dĩ không giống nhau.",
  "Nhớ ăn đủ bữa, cái đầu cần năng lượng mới nhớ bài được, đừng để việc ôn thi làm {em} quên chăm sóc chính mình.",
  "{em} đang cố gắng, và điều đó tự nó đã đáng quý rồi, kết quả là chuyện sau này, còn nỗ lực hôm nay của {em} {anh} đều nhìn thấy.",
  "Lo lắng chứng tỏ {em} nghiêm túc, nhưng đừng để nó lấn át, nghiêm túc là tốt, nhưng {em} vẫn cần giữ được sự bình tĩnh cho mình.",
  "Có {anh} ở đây, {em} cứ yên tâm mà học, mọi chuyện khác cứ để {anh} lo, {em} chỉ cần tập trung vào việc của mình thôi.",
  "Kết quả không định nghĩa được {em} là ai đâu, dù thi tốt hay chưa như ý thì {em} vẫn luôn là {em} trong mắt {anh}.",
  "Học xong phần này thì tự thưởng cho mình cái gì đó nha, một món ăn {em} thích hay một giấc ngủ trưa dài hơn thường ngày cũng được.",
  "Não cũng cần nghỉ như chân tay vậy, nghỉ đi rồi học tiếp, ép nó làm việc liên tục sẽ chỉ khiến mọi thứ trôi qua mà không đọng lại.",
  "{em} không đơn độc trong chuyện này đâu, dù {anh} không thể ngồi học cùng {em} thì {anh} vẫn luôn ở phía sau {em}.",
  "Hôm nay khó, không có nghĩa là ngày mai cũng khó, mỗi ngày ôn thi đều có một nhịp độ khác nhau, hôm nay khó thì ngày mai có thể sẽ dễ hơn.",
  "Chậm một chút vẫn tới đích, quan trọng là {em} còn đi, chỉ cần {em} không dừng lại hẳn thì {anh} tin {em} sẽ đến nơi cần đến.",
  "{anh} tự hào về {em}, từ trước khi có kết quả cơ, chỉ riêng việc {em} kiên trì ôn tập mỗi ngày đã là điều đáng tự hào rồi.",
  "Đừng ôn quá khuya, sáng mai đầu óc tỉnh sẽ nhớ nhanh hơn nhiều, một giấc ngủ đủ còn giá trị hơn vài giờ thức khuya cố nhồi thêm kiến thức.",
  "Mỗi ngày {em} ngồi vào bàn là một lần {em} thắng chính mình, dù hôm đó học được nhiều hay ít thì việc {em} bắt đầu đã là một chiến thắng nhỏ.",
  "Dù thế nào, {anh} vẫn ở phía sau {em}, không phải để thúc giục mà là để {em} biết mình luôn có một chỗ dựa khi cần.",
];

/** Dòng phụ dịu nhẹ dùng cho buổi tối muộn — không nhắc chuyện học hành. */
export const NIGHT_SOFT_NOTES: string[] = [
  "Giờ này thì gác sách lại thôi, ngủ mới là việc quan trọng nhất bây giờ, mai tính tiếp cũng không muộn đâu.",
  "Không nghĩ gì nữa nhé, mai tính tiếp, đêm nay chỉ cần {em} nhắm mắt lại và để mọi thứ trôi qua thật nhẹ.",
  "{em} nghỉ đi, mọi thứ vẫn ở đó chờ {em} mà, không có gì biến mất chỉ vì {em} dành thời gian để ngủ đâu.",
  "Đêm là để nghỉ, {em} nhớ nha, ban ngày đã đủ dài rồi, đêm nên là khoảng thời gian dành riêng cho việc hồi phục.",
  "Đắp chăn, nhắm mắt, và để ngày hôm nay trôi qua, những gì đã xảy ra thì cứ để nó ở lại phía sau lưng {em}.",
  "{anh} chỉ mong {em} ngủ ngon, vậy thôi, không cần {em} phải làm gì thêm để {anh} yên tâm cả.",
  "Thả lỏng người ra, {em} đã cố gắng đủ cho hôm nay rồi, không cần phải gồng thêm một chút nào nữa đâu.",
  "Điện thoại để xuống nha {em}, mắt cũng cần nghỉ nữa, ánh sáng màn hình lúc này chỉ khiến {em} khó vào giấc ngủ hơn thôi.",
  "Đêm nay cứ để đầu óc trống rỗng một chút, không phải lúc nào cũng cần nghĩ về điều gì đó, đôi khi trống rỗng lại là lúc dễ chịu nhất.",
  "Ngủ trước đã, mọi câu hỏi rồi sẽ có câu trả lời vào một lúc khác, tối nay không cần phải giải quyết hết mọi thứ đâu {em}.",
];

/**
 * Lời chúc cho ĐÊM TRƯỚC ngày thi — hiển thị hôm trước (daysToExam === 1),
 * vì đúng hôm thi cô ấy đi thi chứ không mở web. Trọng tâm: dặn ngủ sớm,
 * trấn an là đã chuẩn bị đủ, chúc mai thi tốt. Không giục ôn bài nữa.
 */
export const EXAM_EVE_GREETINGS: string[] = [
  "mai là ngày thi của {em} rồi. Tối nay {em} ngủ sớm nha, đừng thức khuya ôn nữa, {em} đã chuẩn bị đủ lâu rồi, giờ chỉ cần một giấc ngủ ngon để sáng mai bước vào phòng thi với một cái đầu thật tỉnh táo.",
  "chỉ còn một đêm nữa thôi là tới ngày thi. {em} gấp sách lại, đi ngủ cho khoẻ, phần còn lại {em} làm được mà, những gì cần học {em} đã học rồi, giờ là lúc để nghỉ ngơi thật trọn vẹn.",
  "mai {em} thi rồi đó. {anh} không mong gì hơn ngoài việc tối nay {em} ngủ thật ngon và sáng mai thật tỉnh táo, vì một cái đầu được nghỉ ngơi đầy đủ sẽ giúp {em} làm bài tốt hơn bất kỳ giờ ôn khuya nào.",
  "ngày mai là ngày quan trọng của {em}. Tối nay nghỉ ngơi thôi nhé, học thêm lúc này cũng không bằng một giấc ngủ đủ đâu, cơ thể {em} cần được chuẩn bị tốt không kém gì kiến thức trong đầu.",
  "mai là hôm thi của {em}. Nhớ soạn sẵn giấy tờ, đặt báo thức, rồi yên tâm đi ngủ, {anh} tin {em} đã sẵn sàng hơn {em} nghĩ, cả một quãng đường dài ôn tập đã đưa {em} tới đây.",
  "còn một ngày nữa là tới lúc {em} bước vào phòng thi. Cả quãng đường dài {em} đã đi rồi, đêm nay chỉ cần nghỉ cho khoẻ thôi, để sáng mai {em} bước vào phòng thi với tâm thế nhẹ nhàng nhất có thể.",
  "mai {em} thi, tối nay mình không lo lắng nữa nha. {em} đã cố gắng rất nhiều, giờ là lúc để cơ thể được nghỉ, và để những gì {em} học được có thời gian lắng lại trong đầu.",
  "ngày mai {em} thi rồi. Hít một hơi thật sâu, buông hết căng thẳng xuống, {em} đã sẵn sàng hơn {em} nghĩ đấy, và dù ngày mai có ra sao thì {anh} vẫn luôn tự hào về {em} từ tối nay.",
];

export const EXAM_EVE_ENCOURAGEMENTS: string[] = [
  "Ngủ đủ giấc tối nay quan trọng hơn mọi thứ khác, {em} nhé, một cái đầu tỉnh táo sẽ giúp {em} nhiều hơn vài trang ôn thêm.",
  "Dù mai thế nào, {anh} vẫn tự hào về {em}, ngay từ bây giờ, chỉ riêng việc {em} đã kiên trì đến tận hôm nay đã là một điều đáng tự hào rồi.",
  "Nhớ soạn giấy tờ và ăn sáng tử tế trước khi vào phòng thi nha, một bữa sáng đầy đủ sẽ giúp {em} tập trung tốt hơn suốt buổi thi.",
  "Bình tĩnh là nửa phần thắng rồi, {em} làm được mà, chỉ cần giữ được sự bình tĩnh thì kiến thức trong đầu {em} sẽ tự tìm đường ra.",
  "Đặt báo thức xong thì thôi không nghĩ nữa, để đầu óc nghỉ ngơi, mọi thứ cần chuẩn bị {em} đã lo xong hết rồi.",
  "{anh} ở phía sau {em}, mai cũng vậy mà mãi về sau cũng vậy, dù kết quả ngày mai ra sao thì vị trí đó của {anh} vẫn không đổi.",
];

/** Lời chúc riêng cho đúng ngày thi (phòng khi cô ấy vẫn mở web hôm đó). */
export const EXAM_DAY_GREETINGS: string[] = [
  "hôm nay là ngày thi rồi. Hít thở thật sâu, {em} đã chuẩn bị đủ lâu cho ngày này, giờ chỉ cần bước vào phòng thi với sự bình tĩnh mà {em} vốn có.",
  "ngày thi tới rồi. {em} cứ bình tĩnh làm bài, phần còn lại để {anh} lo lắng thay, {em} chỉ cần tập trung vào từng câu hỏi trước mắt thôi.",
  "hôm nay {em} đi thi. {anh} không mong gì hơn ngoài việc {em} giữ được sự bình tĩnh, vì {anh} biết khi bình tĩnh thì {em} luôn làm tốt hơn {em} tưởng.",
  "ngày thi của {em} đây rồi. Đọc kỹ đề, làm chắc từng câu, đừng vội nha, thời gian trong phòng thi vẫn đủ cho {em} làm bài cẩn thận.",
];

export const EXAM_DAY_ENCOURAGEMENTS: string[] = [
  "Dù kết quả thế nào, {anh} vẫn tự hào về quãng đường {em} đã đi, cả những đêm {em} ngồi ôn bài đến khuya lẫn hôm nay khi {em} bước vào phòng thi.",
  "Nhớ mang đủ giấy tờ và ăn sáng tử tế trước khi vào phòng thi nhé, để không có gì ngoài bài thi làm {em} phải bận tâm.",
  "Bình tĩnh là nửa phần thắng rồi, {em} làm được mà, cứ tin vào những gì {em} đã chuẩn bị suốt thời gian qua.",
  "{anh} đợi {em} ở ngoài cổng, theo đúng nghĩa đen lẫn nghĩa bóng, dù thi xong thế nào thì việc đầu tiên {anh} muốn làm là ôm {em} một cái thật chặt.",
];

export const GREETINGS_BY_PERIOD: Record<Period, string[]> = {
  morning: MORNING_GREETINGS,
  afternoon: AFTERNOON_GREETINGS,
  evening: EVENING_GREETINGS,
  night: NIGHT_GREETINGS,
};
