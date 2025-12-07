-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 05, 2025 lúc 01:28 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `restaurant_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bai_viet`
--

CREATE TABLE `bai_viet` (
  `id` int(11) NOT NULL,
  `anh_bia_id` int(11) DEFAULT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `nguoi_dung_id` int(11) DEFAULT NULL,
  `danh_muc_blog_id` int(11) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bai_viet`
--

INSERT INTO `bai_viet` (`id`, `anh_bia_id`, `tieu_de`, `noi_dung`, `nguoi_dung_id`, `danh_muc_blog_id`, `slug`, `created_at`, `updated_at`) VALUES
(1, 46, 'Tinh hoa ẩm thực Việt tại Hương Sen', '<p>ẩm thực ngon nhất việt nam</p><p><img src=\"https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2Fimages%2F1762513979534_am-thuc-viet.jpg?alt=media&amp;token=dccae505-498f-46ad-afca-60f86a18f25e\"></p>', 1, 3, 'tinh-hoa-am-thuc-viet-tai-huong-sen', '2025-10-28 12:33:23', '2025-11-06 21:13:08'),
(2, 45, 'Khuyến mãi đặc biệt tháng 11', '<p>Chào đón tháng 11 với nhiều ưu đãi hấp dẫn dành cho thực khách...</p>', 1, 2, 'khuyen-mai-djac-biet-thang-11', '2025-10-28 12:33:23', '2025-10-29 06:35:31'),
(3, 47, 'Giới thiệu nhà hàng đệ nhất Việt Nam', '<p>Không gian ấm cúng, món ăn ngon, phục vụ tận tình...</p>', NULL, 1, 'gioi-thieu-nha-hang-dje-nhat-viet-nam', '2025-10-28 12:33:23', '2025-10-29 06:36:52'),
(4, 66, 'Bài Viết test', '<p>đây là nội dung test (thêm nội dung)</p><p><img src=\"https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2Fimages%2F1762512357786_9e576ec44147da445655f86df3910791.jpg?alt=media&amp;token=d8ffc8f1-6dc1-493f-b682-b38c57768d56\"></p><p><br></p><p>bài test về video test, thử cập nhật</p><p><br></p><p><br></p><iframe class=\"ql-video\" frameborder=\"0\" allowfullscreen=\"true\" src=\"https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2Fvideos%2F1762512457127_Screen%20Recording%202025-11-04%20002521.mp4?alt=media&amp;token=c72a1d2d-8283-4cce-a897-0626fdae9602\"></iframe>', 1, 6, 'bai-viet-test', '2025-11-06 19:57:12', '2025-11-10 05:26:10'),
(5, 120, 'Nghêu hấp thái', '<p>Nghêu hấp Thái là món hải sản nổi tiếng với hương vị <strong>chua cay đặc trưng</strong> của ẩm thực Thái Lan, kết hợp với <strong>nghêu tươi ngọt tự nhiên</strong>, tạo nên trải nghiệm ẩm thực hấp dẫn cho bữa cơm gia đình hay bữa tiệc cuối tuần.</p><h4><strong>Nguyên liệu</strong></h4><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Nghêu tươi: 1 kg</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Sả: 3-4 cây, đập dập</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Ớt tươi: 2-3 trái (tùy khẩu vị)</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Tỏi: 3 tép, băm nhỏ</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Gừng: 1 miếng nhỏ, thái sợi</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Lá chanh: 5-6 lá</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Nước cốt chanh: 2 thìa</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Nước mắm: 1-2 thìa</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Đường: 1 thìa</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Rau mùi, ngò gai: 1 ít để trang trí</li></ol><h4><strong>Cách làm</strong></h4><ol><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>Sơ chế nghêu:</strong> Rửa sạch nghêu, ngâm trong nước có chút muối khoảng 30 phút để nghêu nhả hết cát.</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>Chuẩn bị gia vị:</strong> Băm tỏi, sả đập dập, ớt thái lát, gừng thái sợi, lá chanh rửa sạch và xé nhỏ.</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>Hấp nghêu:</strong></li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Cho một nồi lớn lên bếp, xếp sả, lá chanh, gừng xuống đáy.</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Cho nghêu lên trên, rắc tỏi và ớt.</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Thêm 1-2 thìa nước mắm, đường và 1 chút nước lọc (khoảng 50 ml).</li><li data-list=\"bullet\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Đậy nắp, hấp khoảng <strong>5-7 phút</strong> cho đến khi nghêu mở miệng.</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>Hoàn thiện:</strong> Vắt nước cốt chanh, rắc rau mùi và ngò gai lên trên. Trộn nhẹ để gia vị thấm đều.</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>Thưởng thức:</strong> Dùng nóng, ăn kèm với bánh mì hoặc cơm trắng.</li></ol>', 1, 6, 'ngheu-hap-thai', '2025-11-13 07:00:45', '2025-11-17 07:21:11'),
(6, 121, 'Tôm hấp nước dừa', '<p>Tôm hấp nước dừa là một trong những món ăn dung hòa được cả vị ngọt tự nhiên của hải sản và hương thơm dịu dàng của nước dừa tươi. Không cần quá nhiều gia vị, món ăn giữ trọn vẹn sự tinh khiết của nguyên liệu, mang lại cảm giác vừa dân dã vừa sang trọng.</p><p>Tôm hấp nước dừa ngon nhất khi ăn ngay lúc còn nóng. Chấm cùng muối tiêu chanh hoặc muối ớt xanh, thịt tôm ngọt lịm kết hợp vị chua cay nhẹ tạo cảm giác vô cùng gây nghiện. Món ăn này thích hợp trong bữa cơm gia đình, tiệc cuối tuần hoặc mâm hải sản nhẹ.</p><p>Tôm cung cấp nhiều protein, canxi và khoáng chất, trong khi nước dừa bổ sung vitamin và độ ngọt tự nhiên. Nhờ phương pháp hấp không dầu mỡ, món ăn vừa lành mạnh vừa đảm bảo giữ được dưỡng chất.</p><p><strong>Tôm hấp nước dừa</strong> là lựa chọn hoàn hảo cho những ai yêu thích món ăn thanh đạm nhưng vẫn muốn sự trọn vị và tươi ngon. Một món ăn đơn giản, nhanh gọn nhưng đủ làm nổi bật sự tinh tế của ẩm thực Việt.</p>', 1, 3, 'tom-hap-nuoc-dua', '2025-11-17 07:27:51', '2025-11-17 07:27:51'),
(7, 122, '🎉 TƯNG BỪNG KHAI TRƯƠNG – NGẬP TRÀN ƯU ĐÃI TẠI ENVISI RESTAURANT ! 🎉', '<p>Để đánh dấu cột mốc quan trọng trong hành trình mang đến trải nghiệm ẩm thực tinh tế cho khách hàng, <strong>EnViSi Restaurant</strong>, chính thức khai trương và gửi đến quý thực khách loạt <strong>khuyến mãi cực hấp dẫn</strong> trong tuần lễ mở cửa!</p><h3>⭐ <strong>1. Ưu đãi giảm giá lên đến 30%</strong></h3><p>Trong 7 ngày đầu khai trương, thực khách khi dùng bữa tại nhà hàng sẽ được <strong>giảm 20–30% tổng hoá đơn</strong> tùy theo khung giờ. Đây là cơ hội tuyệt vời để bạn và gia đình thưởng thức những món ăn đặc sắc với mức giá cực kỳ ưu đãi.</p><h3>⭐ <strong>2. Tặng món đặc biệt cho nhóm từ 4 người trở lên</strong></h3><p>Chỉ cần đặt bàn trước, nhóm từ 4 khách trở lên sẽ được <strong>tặng ngay 1 món bánh chessecake</strong> của nhà hàng – lựa chọn từ:</p><p>🍤 Tôm hấp nước dừa</p><p>🥩 Bò bít tết</p><p>🥩 Bò lúc lắc</p><p>🐟 Nghêu hấp thái</p><h3>⭐ <strong>3. Check-in nhận quà liền tay</strong></h3><p>Chỉ cần chụp hình check-in tại nhà hàng và đăng lên Facebook hoặc TikTok kèm hashtag <strong>#EnViSi Restaurant</strong>, bạn sẽ nhận ngay:</p><p>🎁 1 phần nước uống miễn phí hoặc</p><p>🎁 Phiếu giảm giá 10% cho lần dùng bữa tiếp theo</p><h2>🎊 <strong>Hẹn gặp bạn tại Nhà hàng [Tên Nhà Hàng]!</strong></h2><p>Với không gian sang trọng, món ăn tinh tế, nguyên liệu tươi ngon và phong cách phục vụ chuyên nghiệp, chúng tôi tin rằng [Tên Nhà Hàng] sẽ mang đến trải nghiệm ẩm thực khiến bạn hài lòng từ lần đầu ghé thăm.</p><p><strong>📍 Địa chỉ:</strong> <span style=\"background-color: rgba(255, 255, 255, 0.05);\">Phường Trái Đất, Hệ Mặt Trời</span></p><p> <strong>📞 Hotline đặt bàn:</strong> 0123456789</p><p> <strong>⏰ Thời gian áp dụng ưu đãi:</strong> Từ 25/12/2025 đến 30/12/2025</p>', 1, 2, 'tung-bung-khai-truong-ngap-tran-uu-djai-tai-envisi-restaurant', '2025-11-17 07:36:50', '2025-11-17 07:41:03'),
(8, 130, 'Mẹo Nấu Ăn Ngon – Đơn Giản Nhưng Hiệu Quả Bất Ngờ', '<h3>⭐ <strong>1. Chọn nguyên liệu tươi – 50% thành công</strong></h3><p>Nguyên liệu càng tươi, món ăn càng ngon.</p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Hải sản: mắt trong, thịt đàn hồi.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Rau củ: cuống tươi, lá xanh, không dập.</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Thịt: màu sáng, thớ săn, không có mùi lạ.</li></ol><h3>⭐ <strong>2. Ướp gia vị đúng thời gian</strong></h3><p>Ướp quá lâu sẽ làm thực phẩm bị bở, còn quá nhanh sẽ không thấm.</p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Thịt đỏ: 20–30 phút</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Thịt gà: 15–20 phút</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Hải sản: 5–10 phút</li></ol><h3>⭐ <strong>3. Làm nóng chảo trước khi chiên xào</strong></h3><p>Chảo nóng giúp thực phẩm không bị dính, và giữ được độ giòn – màu đẹp cho món ăn.</p><h3>⭐ <strong>4. Nấu canh bằng nước sôi để giữ dưỡng chất</strong></h3><p>Thả rau vào nước sôi sẽ giúp rau xanh hơn, không bị vàng, giữ vị tự nhiên.</p><h3>⭐ <strong>5. Thêm chút đường khi kho</strong></h3><p>Đường giúp tạo màu đẹp tự nhiên và cân bằng vị mặn – ngọt cho món kho, món rim.</p><h3>⭐ <strong>6. Nêm gia vị từng chút một</strong></h3><p>Không nên cho gia vị quá tay. Nêm từ từ sẽ dễ cân chỉnh vị hơn, tránh món ăn bị mặn hoặc ngọt gắt.</p><h3>⭐ <strong>7. Dùng chanh hoặc giấm để làm sáng vị món ăn</strong></h3><p>Một giọt chanh cho vào phút cuối giúp món canh, món nướng, salad thơm và dậy vị hơn.</p><h3>⭐ <strong>8. Dao sắc – nấu nhanh và đẹp mắt</strong></h3><p>Dao bén giúp cắt gọn, không làm dập nát thực phẩm, và giúp bạn chuẩn bị món ăn nhanh hơn.</p><h3>⭐ <strong>9. Tỏi phi – “vũ khí” tăng mùi thơm</strong></h3><p>Rắc chút tỏi phi lên các món xào, trộn, cháo hay bún là món ăn đã thơm lừng và hấp dẫn hơn hẳn.</p><h3>⭐ <strong>10. Không mở nắp nồi quá sớm khi hấp hoặc luộc</strong></h3><p>Hơi nước ổn định giúp giữ độ ngọt, độ giòn và chín đều hơn.</p>', 1, 5, 'meo-nau-an-ngon-djon-gian-nhung-hieu-qua-bat-ngo', '2025-11-17 07:52:25', '2025-11-18 02:57:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ban_an`
--

CREATE TABLE `ban_an` (
  `id` int(11) NOT NULL,
  `so_ban` int(11) NOT NULL,
  `suc_chua` int(11) NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `anh_ban_id` int(11) DEFAULT NULL,
  `video_ban_id` int(11) DEFAULT NULL,
  `mo_ta_vi_tri` text DEFAULT NULL,
  `tang` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ban_an`
--

INSERT INTO `ban_an` (`id`, `so_ban`, `suc_chua`, `trang_thai`, `anh_ban_id`, `video_ban_id`, `mo_ta_vi_tri`, `tang`, `created_at`, `updated_at`) VALUES
(1, 1, 8, 1, 15, 85, 'Gần cửa ra vào', 1, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(2, 2, 4, 1, 131, 90, 'Trong góc yên tĩnh', 1, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(3, 3, 4, 1, 86, 56, NULL, 1, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(4, 4, 4, 1, 133, 58, 'Ban công', 2, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(5, 5, 6, 1, 88, NULL, 'Phòng VIP', 2, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(6, 6, 8, 1, 89, 62, 'bàn demo', 1, '2025-11-03 19:38:11', '2025-11-03 19:38:11'),
(7, 9, 10, 1, 136, 137, NULL, 2, '2025-11-18 07:50:23', '2025-11-18 07:50:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `binh_luan_blog`
--

CREATE TABLE `binh_luan_blog` (
  `id` int(11) NOT NULL,
  `bai_viet_id` int(11) NOT NULL,
  `nguoi_dung_id` int(11) NOT NULL,
  `noi_dung` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `binh_luan_blog`
--

INSERT INTO `binh_luan_blog` (`id`, `bai_viet_id`, `nguoi_dung_id`, `noi_dung`, `created_at`, `updated_at`) VALUES
(1, 4, 8, 'bình luận test', '2025-11-08 22:16:05', '2025-11-08 22:16:05'),
(2, 4, 11, 'hay quá', '2025-11-10 05:20:10', '2025-11-10 05:20:10'),
(3, 5, 12, 'Thật là bổ ích', '2025-11-17 07:14:04', '2025-11-17 07:14:04'),
(4, 8, 11, 'rất hay\n', '2025-11-18 03:45:30', '2025-11-18 03:45:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_dat_ban`
--

CREATE TABLE `chi_tiet_dat_ban` (
  `id` int(11) NOT NULL,
  `dat_ban_id` int(11) NOT NULL,
  `san_pham_id` int(11) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `gia_tai_thoi_diem` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_dat_ban`
--

INSERT INTO `chi_tiet_dat_ban` (`id`, `dat_ban_id`, `san_pham_id`, `so_luong`, `gia_tai_thoi_diem`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 2, 40000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(2, 1, 5, 4, 15000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(3, 1, 4, 1, 30000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(4, 2, 6, 1, 1200000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(5, 2, 4, 3, 15000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(6, 3, 1, 1, 55000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(7, 3, 5, 2, 15000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(8, 4, 3, 1, 30000, '2025-10-28 16:37:04', '2025-10-28 16:37:04'),
(9, 4, 6, 1, 1200000, '2025-10-28 16:37:04', '2025-10-28 16:37:04'),
(10, 4, 4, 1, 15000, '2025-10-28 16:37:04', '2025-10-28 16:37:04'),
(11, 5, 6, 1, 1200000, '2025-10-29 07:37:22', '2025-10-29 07:37:22'),
(12, 5, 4, 1, 15000, '2025-10-29 07:37:22', '2025-10-29 07:37:22'),
(13, 5, 2, 1, 55000, '2025-10-29 07:37:22', '2025-10-29 07:37:22'),
(14, 6, 3, 1, 40000, '2025-10-29 08:03:52', '2025-10-29 08:03:52'),
(15, 6, 4, 1, 15000, '2025-10-29 08:03:52', '2025-10-29 08:03:52'),
(16, 6, 4, 1, 30000, '2025-10-29 08:03:52', '2025-10-29 08:03:52'),
(17, 6, 2, 1, 55000, '2025-10-29 08:03:52', '2025-10-29 08:03:52'),
(18, 7, 3, 2, 11000000, '2025-11-03 19:39:51', '2025-11-03 19:39:51'),
(19, 7, 1, 2, 30000, '2025-11-03 19:39:51', '2025-11-03 19:39:51'),
(20, 8, 2, 1, 11000000, '2025-11-03 19:43:17', '2025-11-03 19:43:17'),
(21, 8, 2, 1, 55000, '2025-11-03 19:43:17', '2025-11-03 19:43:17'),
(22, 9, 4, 1, 11000000, '2025-11-04 13:28:54', '2025-11-04 13:28:54'),
(23, 9, 5, 1, 30000, '2025-11-04 13:28:54', '2025-11-04 13:28:54'),
(24, 9, 2, 1, 55000, '2025-11-04 13:28:54', '2025-11-04 13:28:54'),
(25, 18, 45, 1, 50000, '2025-12-04 23:39:06', '2025-12-04 23:39:06'),
(26, 18, 44, 1, 75000, '2025-12-04 23:39:06', '2025-12-04 23:39:06'),
(27, 18, 43, 1, 100000, '2025-12-04 23:39:06', '2025-12-04 23:39:06'),
(28, 18, 3, 1, 40000, '2025-12-04 23:39:06', '2025-12-04 23:39:06'),
(29, 20, 44, 1, 75000, '2025-12-04 23:48:08', '2025-12-04 23:48:08'),
(30, 20, 45, 1, 50000, '2025-12-04 23:48:08', '2025-12-04 23:48:08'),
(31, 20, 42, 1, 100000, '2025-12-04 23:48:08', '2025-12-04 23:48:08'),
(32, 20, 40, 1, 30000, '2025-12-04 23:48:08', '2025-12-04 23:48:08'),
(33, 21, 44, 1, 75000, '2025-12-04 23:49:07', '2025-12-04 23:49:07'),
(34, 21, 43, 1, 100000, '2025-12-04 23:49:07', '2025-12-04 23:49:07'),
(35, 21, 17, 1, 179000, '2025-12-04 23:49:07', '2025-12-04 23:49:07'),
(36, 21, 40, 1, 30000, '2025-12-04 23:49:07', '2025-12-04 23:49:07'),
(37, 21, 13, 1, 59000, '2025-12-04 23:49:07', '2025-12-04 23:49:07'),
(38, 23, 37, 7, 28000, '2025-12-05 04:40:30', '2025-12-05 04:40:30'),
(39, 23, 1, 5, 55000, '2025-12-05 04:40:30', '2025-12-05 04:40:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_phieu_nhap`
--

CREATE TABLE `chi_tiet_phieu_nhap` (
  `id` int(11) NOT NULL,
  `phieu_nhap_id` int(11) NOT NULL,
  `nguyen_lieu_id` int(11) NOT NULL,
  `so_luong` double NOT NULL,
  `don_gia` int(11) NOT NULL,
  `thanh_tien` int(11) NOT NULL,
  `han_su_dung` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cong_thuc`
--

CREATE TABLE `cong_thuc` (
  `id` int(11) NOT NULL,
  `san_pham_id` int(11) NOT NULL,
  `nguyen_lieu_id` int(11) NOT NULL,
  `so_luong_can` double NOT NULL,
  `don_vi_tinh` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cong_thuc`
--

INSERT INTO `cong_thuc` (`id`, `san_pham_id`, `nguyen_lieu_id`, `so_luong_can`, `don_vi_tinh`) VALUES
(1, 37, 25, 1, 'chai'),
(2, 1, 1, 0.15, 'kg'),
(3, 1, 14, 0.0005, 'kg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc_blog`
--

CREATE TABLE `danh_muc_blog` (
  `id` int(11) NOT NULL,
  `ten_danh_muc` varchar(255) NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_muc_blog`
--

INSERT INTO `danh_muc_blog` (`id`, `ten_danh_muc`, `trang_thai`, `created_at`, `updated_at`) VALUES
(1, 'Tin tức Nhà hàng', 1, '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(2, 'Khuyến mãi', 1, '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(3, 'Ẩm thực & Món ăn', 1, '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(4, 'Chưa phân loại', 1, '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(5, 'Mẹo nấu ăn', 1, '2025-10-28 23:39:53', '2025-10-28 23:39:53'),
(6, 'Công thức nấu ăn', 1, '2025-10-29 06:05:05', '2025-10-29 06:05:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc_san_pham`
--

CREATE TABLE `danh_muc_san_pham` (
  `id` int(11) NOT NULL,
  `ten_danh_muc` varchar(255) NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_muc_san_pham`
--

INSERT INTO `danh_muc_san_pham` (`id`, `ten_danh_muc`, `trang_thai`, `created_at`, `updated_at`) VALUES
(1, 'Món chính', 1, '2025-11-09 10:55:59', '2025-11-09 10:55:59'),
(2, 'Món khai vị', 1, '2025-11-09 10:55:59', '2025-11-09 10:55:59'),
(3, 'Món tráng miệng', 1, '2025-11-09 10:55:59', '2025-11-09 10:55:59'),
(4, 'Đồ uống', 1, '2025-11-09 10:55:59', '2025-11-09 10:55:59'),
(5, 'Món gọi thêm', 1, '2025-11-09 10:55:59', '2025-11-09 10:55:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dat_ban`
--

CREATE TABLE `dat_ban` (
  `id` int(11) NOT NULL,
  `ma_dat_ban` varchar(50) DEFAULT NULL,
  `khach_hang_id` int(11) DEFAULT NULL,
  `so_lan_doi` int(11) NOT NULL DEFAULT 0,
  `khuyen_mai_id` int(11) DEFAULT NULL,
  `ho_ten_khach` varchar(255) NOT NULL,
  `dien_thoai` varchar(15) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `ngay_dat_ban` datetime NOT NULL,
  `so_luong_khach` int(11) NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `tong_tien` int(11) DEFAULT NULL,
  `tien_dat_coc` int(11) NOT NULL DEFAULT 0,
  `trang_thai` int(11) NOT NULL DEFAULT 1,
  `momo_order_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `dat_ban`
--

INSERT INTO `dat_ban` (`id`, `ma_dat_ban`, `khach_hang_id`, `so_lan_doi`, `khuyen_mai_id`, `ho_ten_khach`, `dien_thoai`, `email`, `ngay_dat_ban`, `so_luong_khach`, `ghi_chu`, `tong_tien`, `tien_dat_coc`, `trang_thai`, `momo_order_id`, `created_at`, `updated_at`) VALUES
(1, 'DB-1001', 4, 0, 1, 'Khách Hàng An', '0987654321', 'khachan@email.com', '2025-11-05 19:00:00', 4, 'Cho bàn gần cửa sổ', 150000, 45000, 5, NULL, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(2, 'DB-1002', 6, 0, NULL, 'Chương Đẹp Zai', '0372760485', 'chuong@email.com', '2025-11-08 18:30:00', 6, 'Có trẻ em', 1230000, 369000, 5, NULL, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(3, 'DB-1003', 4, 0, NULL, 'Khách Hàng An', '0987654321', 'khachan@email.com', '2025-10-27 12:00:00', 2, NULL, 75000, 22500, 5, NULL, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(4, 'DB-1761719824742', NULL, 0, NULL, 'Nguyễn Văn An', '0987654321', NULL, '2025-10-29 02:30:00', 8, NULL, 1245000, 373500, 5, NULL, '2025-10-28 16:37:04', '2025-10-28 16:37:04'),
(5, 'DB-1761773842715', NULL, 0, NULL, 'chương đẹp zai', '0372760485', 'chuong17102005@gmail.com', '2025-10-30 02:45:00', 6, NULL, 1270000, 381000, 5, NULL, '2025-10-29 07:37:22', '2025-10-29 07:37:22'),
(6, 'DB-1761775432440', NULL, 0, NULL, 'Hồ Sĩ Tuấn Lười', '0987654321', NULL, '2025-10-30 03:45:00', 7, NULL, 140000, 42000, 5, NULL, '2025-10-29 08:03:52', '2025-10-29 08:03:52'),
(7, 'DB-1762249191393', NULL, 0, NULL, 'chương Envisi', '0123456789', 'testuser@gmail.com', '2025-11-05 04:16:00', 3, NULL, 22060000, 6618000, 4, NULL, '2025-11-03 19:39:51', '2025-11-03 19:39:51'),
(8, 'DB-1762249397306', 8, 0, NULL, 'chương Envisi', '0372760485', 'John@gmail.com', '2025-11-06 02:42:00', 5, NULL, 11055000, 3316500, 1, NULL, '2025-11-03 19:43:17', '2025-11-03 19:43:17'),
(9, 'DB-1762313334604', 8, 0, NULL, 'Chương Ngô Văn', '0372760485', 'chuong17102005@gmail.com', '2025-11-07 03:38:00', 2, NULL, 11085000, 3325500, 1, NULL, '2025-11-04 13:28:54', '2025-11-04 13:28:54'),
(10, NULL, NULL, 0, NULL, 'Chương Ngô Văn', '0372760485', 'chuong17102005@gmail.com', '2025-11-11 03:45:00', 10, NULL, 0, 0, 1, NULL, '2025-11-10 06:27:12', '2025-11-10 06:27:12'),
(11, NULL, NULL, 0, NULL, 'chương đẹp zai', '0372760485', 'chuong17102005@gmail.com', '2025-11-15 03:00:00', 10, NULL, 0, 0, 1, NULL, '2025-11-10 06:29:19', '2025-11-10 06:29:19'),
(12, 'DB-1762784651887', NULL, 0, NULL, 'chương đẹp zai', '0987654321', NULL, '2025-11-12 02:00:00', 10, NULL, 0, 0, 1, NULL, '2025-11-10 07:24:11', '2025-11-10 07:24:11'),
(13, 'DB-1762784815838', NULL, 0, NULL, 'admin', '0123456789', NULL, '2025-11-14 08:00:00', 5, NULL, 0, 0, 1, NULL, '2025-11-10 07:26:55', '2025-11-10 07:26:55'),
(14, 'DB-1762786139843', NULL, 0, NULL, 'chương đẹp zai', '0372760485', 'chuong17102005@gmail.com', '2025-11-17 02:00:00', 10, NULL, 1215000, 364500, 1, NULL, '2025-11-10 07:48:59', '2025-11-10 07:48:59'),
(15, 'DB-1762792500035', 11, 0, NULL, 'chương Envisi', '0372760485', 'John1@gmail.com', '2025-11-11 02:22:00', 10, NULL, 2730000, 819000, 1, NULL, '2025-11-10 09:35:00', '2025-11-10 09:35:00'),
(16, 'DB-1763477316998', 11, 0, NULL, 'chương đẹp zai', '0123456788', 'John1@gmail.com', '2025-11-19 04:50:00', 10, NULL, 359000, 107700, 5, NULL, '2025-11-18 07:48:37', '2025-11-18 07:48:37'),
(17, 'DB-1764624957468', NULL, 0, NULL, 'chương Envisi', '0123456789', NULL, '2025-12-02 02:30:00', 10, NULL, 155000, 46500, 1, NULL, '2025-12-01 14:35:57', '2025-12-01 14:35:57'),
(18, 'DB-1764916710451', NULL, 1, NULL, 'Khách lẻ', '', NULL, '2025-12-05 06:38:30', 8, 'Khách vãng lai tại quầy', 265000, 0, 5, NULL, '2025-12-04 23:38:30', '2025-12-04 23:38:30'),
(19, 'DB-1764916761260', NULL, 0, NULL, 'Khách lẻ', '', NULL, '2025-12-05 06:39:21', 8, 'Khách vãng lai tại quầy', 0, 0, 5, NULL, '2025-12-04 23:39:21', '2025-12-04 23:39:21'),
(20, 'DB-1764917288332', 11, 0, NULL, 'chương đẹp zai', '0123456788', 'John1@gmail.com', '2025-12-08 03:41:00', 5, NULL, 255000, 76500, 1, NULL, '2025-12-04 23:48:08', '2025-12-04 23:48:08'),
(21, 'DB-1764917347451', 11, 0, 10, 'chương đẹp zai', '0123456788', 'John1@gmail.com', '2025-12-09 02:48:00', 6, NULL, 443000, 132900, 1, NULL, '2025-12-04 23:49:07', '2025-12-04 23:49:07'),
(22, 'DB-1764925150736', NULL, 0, NULL, 'Khách lẻ', '', NULL, '2025-12-05 08:59:10', 8, 'Khách vãng lai tại quầy', 0, 0, 5, NULL, '2025-12-05 01:59:10', '2025-12-05 01:59:10'),
(23, 'DB-1764934777199', NULL, 1, NULL, 'Khách lẻ', '', NULL, '2025-12-05 11:39:37', 4, 'Khách vãng lai tại quầy', 471000, 0, 5, NULL, '2025-12-05 04:39:37', '2025-12-05 04:39:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hang_thanh_vien`
--

CREATE TABLE `hang_thanh_vien` (
  `id` int(11) NOT NULL,
  `ten_hang` varchar(50) NOT NULL,
  `diem_toi_thieu` int(11) NOT NULL,
  `mo_ta_uu_dai` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hang_thanh_vien`
--

INSERT INTO `hang_thanh_vien` (`id`, `ten_hang`, `diem_toi_thieu`, `mo_ta_uu_dai`, `created_at`, `updated_at`) VALUES
(1, 'Mới', 0, 'Chào mừng bạn đến với Hương Sen!', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(2, 'Bạc', 1000, 'Giảm giá 5% cho hóa đơn tiếp theo.', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(3, 'Vàng', 5000, 'Giảm giá 10% và ưu tiên đặt bàn.', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(4, 'Kim Cương', 10000, 'Giảm giá 15%, ưu tiên đặt bàn và quà tặng đặc biệt.', '2025-10-28 12:33:22', '2025-10-28 12:33:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khuyen_mai`
--

CREATE TABLE `khuyen_mai` (
  `id` int(11) NOT NULL,
  `ma_khuyen_mai` varchar(255) NOT NULL,
  `giam_gia` int(11) NOT NULL,
  `loai_giam_gia` tinyint(1) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `ngay_hieu_luc` datetime NOT NULL,
  `ngay_ket_thuc` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `khuyen_mai`
--

INSERT INTO `khuyen_mai` (`id`, `ma_khuyen_mai`, `giam_gia`, `loai_giam_gia`, `so_luong`, `ngay_hieu_luc`, `ngay_ket_thuc`, `created_at`, `updated_at`) VALUES
(1, 'GIAM10', 100000, 0, 100, '2025-11-01 00:00:00', '2025-11-30 23:59:59', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(3, 'NOEL2025', 150000, 0, 200, '2025-12-01 00:00:00', '2025-12-25 23:59:59', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(4, 'ENVISI', 20000, 0, 100, '2025-10-29 17:00:00', '2025-10-30 17:00:00', '2025-10-29 06:04:20', '2025-10-29 06:04:20'),
(5, 'KHAITRUONG', 200000, 0, 10, '2025-10-29 17:00:00', '2025-10-30 17:00:00', '2025-10-29 06:38:02', '2025-10-29 06:38:02'),
(6, 'MaDemo', 20000, 0, 2, '2025-11-03 17:00:00', '2025-11-28 17:00:00', '2025-11-03 19:36:50', '2025-11-03 19:36:50'),
(7, 'MaDemo2', 120000, 0, 10, '2025-12-02 17:00:00', '2025-12-24 17:00:00', '2025-12-01 15:31:15', '2025-12-01 15:31:15'),
(8, 'MaDemo3', 100000, 0, 6, '2025-12-02 17:00:00', '2025-12-30 17:00:00', '2025-12-02 14:39:40', '2025-12-02 14:39:40'),
(9, 'NOEL2026', 10, 1, 10, '2025-12-02 17:00:00', '2025-12-30 17:00:00', '2025-12-02 21:50:46', '2025-12-02 21:50:46'),
(10, 'NOEL', 10, 1, 1, '2025-12-02 17:00:00', '2025-12-30 17:00:00', '2025-12-02 22:08:10', '2025-12-02 22:08:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `media_files`
--

CREATE TABLE `media_files` (
  `id` int(11) NOT NULL,
  `file_path` text NOT NULL,
  `file_url` text NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `storage_service` varchar(50) DEFAULT 'firebase',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `media_files`
--

INSERT INTO `media_files` (`id`, `file_path`, `file_url`, `file_type`, `storage_service`, `created_at`, `updated_at`) VALUES
(1, 'products/pho-bo.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Fpho-bo.jpg?alt=media', 'image/jpeg', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(2, 'products/mi-quang.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Fmi-quang.jpg?alt=media', 'image/jpeg', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(3, 'products/xien-ban.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Fxien-ban.jpg?alt=media', 'image/jpeg', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(4, 'products/pepsi.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Fpepsi.png?alt=media', 'image/png', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(5, 'products/coca-cola.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Fcoca-cola.png?alt=media', 'image/png', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(6, 'products/tom-hum.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Ftom-hum.png?alt=media', 'image/png', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(7, 'products/ca-muoi.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2Fca-muoi.jpg?alt=media', 'image/jpeg', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(8, 'avatars/avatar-default.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2Favatar-default.png?alt=media', 'image/png', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(9, 'avatars/admin.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2Fadmin.png?alt=media', 'image/png', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(10, 'avatars/nhanvien.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2Fnhanvien.png?alt=media', 'image/png', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(11, 'tables/ban-8-nguoi.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2Fban-8-nguoi.jpg?alt=media', 'image/jpeg', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(12, 'tables/video-review.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2Fvideo-review.mp4?alt=media', 'video/mp4', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(13, 'blogs/am-thuc-viet.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2Fam-thuc-viet.jpg?alt=media', 'image/jpeg', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(14, 'blogs/khuyen-mai-thang-11.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2Fkhuyen-mai-thang-11.jpg?alt=media', 'image/jpeg', 'firebase', '2025-10-28 12:33:22', '2025-10-28 12:33:22'),
(15, 'products/1761682359812_images (1).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682359812_images%20(1).jpg?alt=media&token=8a0f31b5-384a-48f3-82a6-eddf060a5dd5', 'image/jpeg', 'firebase', '2025-10-28 06:12:41', '2025-10-28 06:12:41'),
(16, 'products/1761682396134_images (2).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682396134_images%20(2).jpg?alt=media&token=9f79bcbd-71b9-4208-8a81-661c4934ab63', 'image/jpeg', 'firebase', '2025-10-28 06:13:17', '2025-10-28 06:13:17'),
(17, 'products/1761682408740_images (2).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682408740_images%20(2).jpg?alt=media&token=26bffb3b-048a-49c6-b551-5641acfbebea', 'image/jpeg', 'firebase', '2025-10-28 06:13:30', '2025-10-28 06:13:30'),
(18, 'products/1761682440233_images (3).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682440233_images%20(3).jpg?alt=media&token=8293cff4-d428-4589-b9a5-c3409a803f23', 'image/jpeg', 'firebase', '2025-10-28 06:14:01', '2025-10-28 06:14:01'),
(19, 'products/1761682470008_images (4).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682470008_images%20(4).jpg?alt=media&token=df4f41ed-d102-4df7-8c33-85f20668d2a6', 'image/jpeg', 'firebase', '2025-10-28 06:14:31', '2025-10-28 06:14:31'),
(20, 'products/1761682485590_images (5).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682485590_images%20(5).jpg?alt=media&token=a054238e-9080-4660-848e-2e409b83b632', 'image/jpeg', 'firebase', '2025-10-28 06:14:47', '2025-10-28 06:14:47'),
(21, 'products/1761682528148_images (6).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682528148_images%20(6).jpg?alt=media&token=6a1215b2-3211-4712-a89c-a1112445e90e', 'image/jpeg', 'firebase', '2025-10-28 06:15:29', '2025-10-28 06:15:29'),
(22, 'products/1761682559591_images (7).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682559591_images%20(7).jpg?alt=media&token=0429188e-4a64-4e78-9a4f-c7c4b4d6e9f2', 'image/jpeg', 'firebase', '2025-10-28 06:16:00', '2025-10-28 06:16:00'),
(23, 'products/1761682570077_images (8).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682570077_images%20(8).jpg?alt=media&token=42d1307b-8395-467f-8d76-52c6f671c2af', 'image/jpeg', 'firebase', '2025-10-28 06:16:11', '2025-10-28 06:16:11'),
(24, 'products/1761682606558_tom-hum.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682606558_tom-hum.png?alt=media&token=1801ff55-2d6f-48d5-b6d4-893d5f30ef48', 'image/png', 'firebase', '2025-10-28 06:16:47', '2025-10-28 06:16:47'),
(25, 'products/1761682622760_coca-cola.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682622760_coca-cola.png?alt=media&token=592d34a4-282d-450b-8d5c-9303d778d6dd', 'image/png', 'firebase', '2025-10-28 06:17:04', '2025-10-28 06:17:04'),
(26, 'products/1761682629738_pepsi.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682629738_pepsi.png?alt=media&token=3e804561-3965-4f40-b4ec-f316279f0452', 'image/png', 'firebase', '2025-10-28 06:17:10', '2025-10-28 06:17:10'),
(27, 'products/1761682662994_pho-bo.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682662994_pho-bo.jpg?alt=media&token=0b67e7c9-4a74-4b47-b30f-481358a946b5', 'image/jpeg', 'firebase', '2025-10-28 06:17:44', '2025-10-28 06:17:44'),
(28, 'products/1761682695504_mi-quang.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682695504_mi-quang.jpg?alt=media&token=5b0981b2-11a5-48b4-82a0-43187c9360cc', 'image/jpeg', 'firebase', '2025-10-28 06:18:16', '2025-10-28 06:18:16'),
(29, 'products/1761682708365_xien-ban.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682708365_xien-ban.jpg?alt=media&token=f0147926-d183-4a0b-80df-6e210170a417', 'image/jpeg', 'firebase', '2025-10-28 06:18:29', '2025-10-28 06:18:29'),
(30, 'products/1761682743588_images (9).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682743588_images%20(9).jpg?alt=media&token=c1f4e0c3-5c02-4011-85e4-230d31b01777', 'image/jpeg', 'firebase', '2025-10-28 06:19:04', '2025-10-28 06:19:04'),
(31, 'products/1761682855110_images (10).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682855110_images%20(10).jpg?alt=media&token=ff4c5f93-4a87-43a0-b570-58c0c822709e', 'image/jpeg', 'firebase', '2025-10-28 06:20:56', '2025-10-28 06:20:56'),
(32, 'products/1761682882199_images (11).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682882199_images%20(11).jpg?alt=media&token=ec58721c-4b57-4180-aa1e-089a80e4618a', 'image/jpeg', 'firebase', '2025-10-28 06:21:23', '2025-10-28 06:21:23'),
(33, 'products/1761682977457_images (12).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761682977457_images%20(12).jpg?alt=media&token=b3671f69-95e5-470a-86b2-6c19f2a08892', 'image/jpeg', 'firebase', '2025-10-28 06:23:00', '2025-10-28 06:23:00'),
(34, 'products/1761683053702_images (13).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761683053702_images%20(13).jpg?alt=media&token=c1936499-5264-47f2-a083-d23630f5b13d', 'image/jpeg', 'firebase', '2025-10-28 06:24:14', '2025-10-28 06:24:14'),
(35, 'products/1761683064434_images (14).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761683064434_images%20(14).jpg?alt=media&token=7c706d7e-0ccf-4224-ad8b-9d41c19b88e1', 'image/jpeg', 'firebase', '2025-10-28 06:24:26', '2025-10-28 06:24:26'),
(36, 'tables/1761684346890_images (15).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1761684346890_images%20(15).jpg?alt=media&token=962f3a2c-f37c-47ff-99d9-23c34d471550', 'image/jpeg', 'firebase', '2025-10-28 06:45:48', '2025-10-28 06:45:48'),
(37, 'tables/1761684391697_images (16).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1761684391697_images%20(16).jpg?alt=media&token=1d743a41-b66e-44d4-9d11-534d0b0058e1', 'image/jpeg', 'firebase', '2025-10-28 06:46:33', '2025-10-28 06:46:33'),
(38, 'tables/1761684405373_images (17).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1761684405373_images%20(17).jpg?alt=media&token=c176718d-3d44-46c5-a46a-73c38b4d8d47', 'image/jpeg', 'firebase', '2025-10-28 06:46:46', '2025-10-28 06:46:46'),
(39, 'tables/1761684457723_ban-8-nguoi.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1761684457723_ban-8-nguoi.jpg?alt=media&token=15b22537-8178-4ff4-b333-68d7120794e7', 'image/jpeg', 'firebase', '2025-10-28 06:47:38', '2025-10-28 06:47:38'),
(40, 'tables/1761684469796_images (18).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1761684469796_images%20(18).jpg?alt=media&token=4806a6c0-d38a-4c28-971c-be59a9af5d3b', 'image/jpeg', 'firebase', '2025-10-28 06:47:51', '2025-10-28 06:47:51'),
(41, 'tables/1761684478335_images (19).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1761684478335_images%20(19).jpg?alt=media&token=474c106b-3d6d-4708-a54b-d74af52be141', 'image/jpeg', 'firebase', '2025-10-28 06:48:00', '2025-10-28 06:48:00'),
(42, 'tables/1761684510006_images (20).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1761684510006_images%20(20).jpg?alt=media&token=182d8c3f-c9d3-4a1a-a53b-e1c750b691cc', 'image/jpeg', 'firebase', '2025-10-28 06:48:31', '2025-10-28 06:48:31'),
(43, 'products/1761748584824_images (5).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761748584824_images%20(5).jpg?alt=media&token=9635b719-756d-4af1-9c3f-42f0a1c1206d', 'image/jpeg', 'firebase', '2025-10-28 23:36:26', '2025-10-28 23:36:26'),
(44, 'products/1761766789559_24-01-2023-doc-dao-van-hoa-am-thuc-viet-ngay-tet-4CBDB0B0.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761766789559_24-01-2023-doc-dao-van-hoa-am-thuc-viet-ngay-tet-4CBDB0B0.jpg?alt=media&token=c679a2eb-ad87-41da-8b14-43262bdbf424', 'image/jpeg', 'firebase', '2025-10-29 05:39:52', '2025-10-29 05:39:52'),
(45, 'products/1761770124163_images (6).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761770124163_images%20(6).jpg?alt=media&token=54b5bb3f-e339-4ee6-a2bc-5192990b87f6', 'image/jpeg', 'firebase', '2025-10-29 06:35:26', '2025-10-29 06:35:26'),
(46, 'products/1761770150397_24-01-2023-doc-dao-van-hoa-am-thuc-viet-ngay-tet-4CBDB0B0.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761770150397_24-01-2023-doc-dao-van-hoa-am-thuc-viet-ngay-tet-4CBDB0B0.jpg?alt=media&token=bb8ae064-0e46-4e2b-94a2-4bf9f25cb445', 'image/jpeg', 'firebase', '2025-10-29 06:35:52', '2025-10-29 06:35:52'),
(47, 'products/1761770206222_ảnh nền khóa.jpeg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761770206222_%E1%BA%A3nh%20n%E1%BB%81n%20kh%C3%B3a.jpeg?alt=media&token=2592986a-746f-4e84-a0f0-9b3052af442a', 'image/jpeg', 'firebase', '2025-10-29 06:36:50', '2025-10-29 06:36:50'),
(48, 'products/1761774646422_Raging Wolf Set.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761774646422_Raging%20Wolf%20Set.png?alt=media&token=9dcdd31a-3420-4c96-8bab-490c9bc97a0a', 'image/png', 'firebase', '2025-10-29 07:50:47', '2025-10-29 07:50:47'),
(49, 'products/1761775791696_images (1).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761775791696_images%20(1).jpg?alt=media&token=8d6a8f6d-3e5f-4a0d-9ff4-4d8964d8583c', 'image/jpeg', 'firebase', '2025-10-29 08:09:53', '2025-10-29 08:09:53'),
(50, 'products/1761775988179_images (2).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761775988179_images%20(2).jpg?alt=media&token=784c172a-6091-4993-85f0-d020e9871784', 'image/jpeg', 'firebase', '2025-10-29 08:13:09', '2025-10-29 08:13:09'),
(51, 'products/1761776001007_images (3).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761776001007_images%20(3).jpg?alt=media&token=992ed8b6-a19e-4c7b-b352-78d1283e33b6', 'image/jpeg', 'firebase', '2025-10-29 08:13:22', '2025-10-29 08:13:22'),
(52, 'products/1761776014496_images (4).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761776014496_images%20(4).jpg?alt=media&token=4fa12711-6d76-47b1-b9cd-9b93285c5b52', 'image/jpeg', 'firebase', '2025-10-29 08:13:36', '2025-10-29 08:13:36'),
(53, 'products/1761776033877_images (5).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1761776033877_images%20(5).jpg?alt=media&token=c1981881-2267-4286-981f-e8b813b246a0', 'image/jpeg', 'firebase', '2025-10-29 08:13:55', '2025-10-29 08:13:55'),
(54, 'tables/1762247738222_Screen Recording 2025-11-04 002340.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1762247738222_Screen%20Recording%202025-11-04%20002340.mp4?alt=media&token=7c7ed1a8-7097-4089-a36c-2f4728d11c75', 'video/mp4', 'firebase', '2025-11-03 19:15:38', '2025-11-03 19:15:38'),
(55, 'tables/1762247761108_Screen Recording 2025-11-04 002340.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1762247761108_Screen%20Recording%202025-11-04%20002340.mp4?alt=media&token=18012015-ab1b-4f7f-855c-20412803b9f4', 'video/mp4', 'firebase', '2025-11-03 19:16:02', '2025-11-03 19:16:02'),
(56, 'tables/1762247781352_Screen Recording 2025-11-04 002340.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1762247781352_Screen%20Recording%202025-11-04%20002340.mp4?alt=media&token=737299a9-7a5d-4f18-97fe-90d5658e3e4a', 'video/mp4', 'firebase', '2025-11-03 19:16:22', '2025-11-03 19:16:22'),
(57, 'tables/1762247806554_video-review.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1762247806554_video-review.mp4?alt=media&token=5a570c91-10c3-4d76-80f0-8272506e768e', 'video/mp4', 'firebase', '2025-11-03 19:16:47', '2025-11-03 19:16:47'),
(58, 'tables/1762247833177_Screen Recording 2025-11-04 002447.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1762247833177_Screen%20Recording%202025-11-04%20002447.mp4?alt=media&token=3b5646f9-0524-4f40-84a8-6f519532849e', 'video/mp4', 'firebase', '2025-11-03 19:17:13', '2025-11-03 19:17:13'),
(59, 'products/1762248557283_images (1).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762248557283_images%20(1).jpg?alt=media&token=d1f4d96c-b3a6-4299-813c-0e78c8574163', 'image/jpeg', 'firebase', '2025-11-03 19:29:18', '2025-11-03 19:29:18'),
(60, 'products/1762248849767_Raging Wolf Set.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762248849767_Raging%20Wolf%20Set.png?alt=media&token=119b4b57-a548-4034-8c83-7c151cc572b6', 'image/png', 'firebase', '2025-11-03 19:34:11', '2025-11-03 19:34:11'),
(61, 'tables/1762249089775_images (15).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1762249089775_images%20(15).jpg?alt=media&token=c41d3b0e-6f8e-4a87-8141-94944d18617d', 'image/jpeg', 'firebase', '2025-11-03 19:38:11', '2025-11-03 19:38:11'),
(62, 'tables/1762249102431_Screen Recording 2025-11-04 002340.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/tables%2F1762249102431_Screen%20Recording%202025-11-04%20002340.mp4?alt=media&token=24806a14-469b-43cc-89d8-1e4e16d4838b', 'video/mp4', 'firebase', '2025-11-03 19:38:23', '2025-11-03 19:38:23'),
(63, 'avatars/1762310137452_admin.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2F1762310137452_admin.png?alt=media&token=a860edc7-4589-4d6f-98c4-e4063df478d1', 'image/png', 'firebase', '2025-11-04 12:35:38', '2025-11-04 12:35:38'),
(64, 'avatars/1762391032338_215033722_555805362106362_8907865225492978396_n.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2F1762391032338_215033722_555805362106362_8907865225492978396_n.jpg?alt=media&token=1d6b055d-2256-4b2a-8ef7-789a72173516', 'image/jpeg', 'firebase', '2025-11-05 11:23:53', '2025-11-05 11:23:53'),
(65, 'blogs/1762512128821_images (7).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2F1762512128821_images%20(7).jpg?alt=media&token=489e2467-33af-4903-85f0-51c07044f51e', 'image/jpeg', 'firebase', '2025-11-06 19:55:30', '2025-11-06 19:55:30'),
(66, 'blogs/images/1762512357786_9e576ec44147da445655f86df3910791.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2Fimages%2F1762512357786_9e576ec44147da445655f86df3910791.jpg?alt=media&token=d8ffc8f1-6dc1-493f-b682-b38c57768d56', 'image/jpeg', 'firebase', '2025-11-06 19:59:18', '2025-11-06 19:59:18'),
(67, 'blogs/videos/1762512457127_Screen Recording 2025-11-04 002521.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/blogs%2Fvideos%2F1762512457127_Screen%20Recording%202025-11-04%20002521.mp4?alt=media&token=c72a1d2d-8283-4cce-a897-0626fdae9602', 'video/mp4', 'firebase', '2025-11-06 20:00:58', '2025-11-06 20:00:58'),
(68, 'avatars/1762602752174_images (1).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2F1762602752174_images%20(1).jpg?alt=media&token=9635e808-11f6-4f9e-a16f-d92b957e8492', 'image/jpeg', 'firebase', '2025-11-07 21:52:33', '2025-11-07 21:52:33'),
(69, 'avatars/1762602766343_images (1).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2F1762602766343_images%20(1).jpg?alt=media&token=f0310243-7f8a-4952-b91c-99d9b4b6005c', 'image/jpeg', 'firebase', '2025-11-07 21:52:47', '2025-11-07 21:52:47'),
(70, 'avatars/1762603882736_images (2).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2F1762603882736_images%20(2).jpg?alt=media&token=0b678c7c-482a-44af-880e-660c63c95781', 'image/jpeg', 'firebase', '2025-11-07 22:11:23', '2025-11-07 22:11:23'),
(71, 'avatars/1762747180554_images (3).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/avatars%2F1762747180554_images%20(3).jpg?alt=media&token=14392686-90c0-4828-b80c-a95c9a039750', 'image/jpeg', 'firebase', '2025-11-09 13:39:41', '2025-11-09 13:39:41'),
(72, 'products/1762721724512_tom-hung.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721724512_tom-hung.png?alt=media&token=92a0870a-ddaa-45d5-8147-d7e997c01642', 'image/png', 'firebase', '2025-11-09 13:55:28', '2025-11-09 13:55:28'),
(73, 'products/1762721743993_coca-cola-original-20oz.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721743993_coca-cola-original-20oz.png?alt=media&token=15827234-67eb-4bd5-841e-51ae835653b1', 'image/png', 'firebase', '2025-11-09 13:55:45', '2025-11-09 13:55:45'),
(74, 'products/1762721763544_OIP.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721763544_OIP.jpg?alt=media&token=ca1941d9-3972-493f-9518-0350eb2ce992', 'image/jpeg', 'firebase', '2025-11-09 13:56:04', '2025-11-09 13:56:04'),
(75, 'products/1762721785305_images (5).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721785305_images%20(5).jpg?alt=media&token=f0352550-9bb7-428f-ac99-bbdc4da3aee9', 'image/jpeg', 'firebase', '2025-11-09 13:56:26', '2025-11-09 13:56:26'),
(76, 'products/1762721808109_maxresdefault.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721808109_maxresdefault.jpg?alt=media&token=8ef5a705-db26-4635-9a84-2da67f0a70bc', 'image/jpeg', 'firebase', '2025-11-09 13:56:49', '2025-11-09 13:56:49'),
(77, 'products/1762721828178_R.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721828178_R.jpg?alt=media&token=a6e3450c-14a1-4372-bea8-89bed0ac1aa0', 'image/jpeg', 'firebase', '2025-11-09 13:57:10', '2025-11-09 13:57:10'),
(78, 'products/1762721945787_logo.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721945787_logo.jpg?alt=media&token=12d673ee-6d7c-450b-b19b-d4e74adb0ea6', 'image/jpeg', 'firebase', '2025-11-09 13:59:07', '2025-11-09 13:59:07'),
(79, 'products/1762721974294_c6f5115c7f5a96afc8a3292fda4c2381.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762721974294_c6f5115c7f5a96afc8a3292fda4c2381.jpg?alt=media&token=08078e07-5ddc-4eac-a4b4-348f12972264', 'image/jpeg', 'firebase', '2025-11-09 13:59:36', '2025-11-09 13:59:36'),
(80, 'products/1762722007477_0f3b210daddc4c5469bffdc9d1ff12a1.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762722007477_0f3b210daddc4c5469bffdc9d1ff12a1.jpg?alt=media&token=750f36e7-4cf0-4c64-847d-b0e6bff2a811', 'image/jpeg', 'firebase', '2025-11-09 14:00:09', '2025-11-09 14:00:09'),
(81, 'images/avatars/1762777131399_download (7).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/images%2Favatars%2F1762777131399_download%20(7).jpg?alt=media&token=8cad0bde-7a19-4e72-a650-62166683cf19', 'image/jpeg', 'firebase', '2025-11-10 05:18:54', '2025-11-10 05:18:54'),
(82, 'products/1762777850979_download (9).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762777850979_download%20(9).jpg?alt=media&token=0487ddcc-b45d-40d1-8d90-0847dc197c4e', 'image/jpeg', 'firebase', '2025-11-10 05:30:53', '2025-11-10 05:30:53'),
(83, 'products/1762778911761_download (8).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762778911761_download%20(8).jpg?alt=media&token=5b412f98-0e69-4844-ba5f-f15393fc2685', 'image/jpeg', 'firebase', '2025-11-10 05:48:33', '2025-11-10 05:48:33'),
(84, 'products/1762778956835_434194689_810226384485391_8693168775507448862_n.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762778956835_434194689_810226384485391_8693168775507448862_n.jpg?alt=media&token=f3367bec-6fd2-4239-8f57-71ced9426d81', 'image/jpeg', 'firebase', '2025-11-10 05:49:18', '2025-11-10 05:49:18'),
(85, 'products/1762779000697_Wuthering Waves 2025.10.21 - 22.04.30.11.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762779000697_Wuthering%20Waves%202025.10.21%20-%2022.04.30.11.mp4?alt=media&token=088b0a43-e55b-4533-8a25-3bf931ddb215', 'video/mp4', 'firebase', '2025-11-10 05:50:33', '2025-11-10 05:50:33'),
(86, 'products/1762779090742_images (2).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762779090742_images%20(2).jpg?alt=media&token=5266d50e-7be3-4241-86b2-8b5ea00de467', 'image/jpeg', 'firebase', '2025-11-10 05:51:32', '2025-11-10 05:51:32'),
(87, 'products/1762779107813_images.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762779107813_images.jpg?alt=media&token=b25c2584-fbf2-4a89-a739-9428b3a65e7e', 'image/jpeg', 'firebase', '2025-11-10 05:51:49', '2025-11-10 05:51:49'),
(88, 'products/1762779128329_kich-thuoc-ban-an-nha-hang-13_08d12ae37a144bcc860138859b72091b.jpeg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762779128329_kich-thuoc-ban-an-nha-hang-13_08d12ae37a144bcc860138859b72091b.jpeg?alt=media&token=00fa8ab2-7b03-4eaa-bab9-a980809c29b4', 'image/jpeg', 'firebase', '2025-11-10 05:52:10', '2025-11-10 05:52:10'),
(89, 'products/1762779145395_images (3).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762779145395_images%20(3).jpg?alt=media&token=ee10aba0-1446-4b8b-b82b-15f504a46a9b', 'image/jpeg', 'firebase', '2025-11-10 05:52:26', '2025-11-10 05:52:26'),
(90, 'products/1762807918221_Screen Recording 2025-11-02 143623.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1762807918221_Screen%20Recording%202025-11-02%20143623.mp4?alt=media&token=3576f418-e305-472d-b9d3-6d25ec909a65', 'video/mp4', 'firebase', '2025-11-10 13:52:03', '2025-11-10 13:52:03'),
(91, 'products/1763032396847_cua-hoang-de.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763032396847_cua-hoang-de.jpg?alt=media&token=38c8a29a-a694-430b-bb3c-d22d85370efd', 'image/jpeg', 'firebase', '2025-11-13 04:13:19', '2025-11-13 04:13:19'),
(92, 'products/1763032613141_Ngêu hấp thái.webp', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763032613141_Ng%C3%AAu%20h%E1%BA%A5p%20th%C3%A1i.webp?alt=media&token=08756666-1e22-42e0-a4a5-f41469f042b1', 'image/webp', 'firebase', '2025-11-13 04:16:54', '2025-11-13 04:16:54'),
(93, 'products/1763032836403_Tôm hấp dừa.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763032836403_T%C3%B4m%20h%E1%BA%A5p%20d%E1%BB%ABa.jpg?alt=media&token=0d8c0f83-3de7-49a1-95e2-b1011380f590', 'image/jpeg', 'firebase', '2025-11-13 04:20:37', '2025-11-13 04:20:37'),
(94, 'products/1763032921039_Cơm chiên dương châu.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763032921039_C%C6%A1m%20chi%C3%AAn%20d%C6%B0%C6%A1ng%20ch%C3%A2u.jpg?alt=media&token=e978abc5-45ce-4168-9f4e-7dd3f13fe36e', 'image/jpeg', 'firebase', '2025-11-13 04:22:03', '2025-11-13 04:22:03'),
(95, 'products/1763033053206_Vodka 300', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763033053206_Vodka%20300?alt=media&token=44715c10-005e-49ab-a215-f36aefe4d6bd', 'image', 'firebase', '2025-11-13 04:24:15', '2025-11-13 04:24:15'),
(96, 'products/1763033124415_Mực hấp kiểu thái.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763033124415_M%E1%BB%B1c%20h%E1%BA%A5p%20ki%E1%BB%83u%20th%C3%A1i.jpg?alt=media&token=81defa81-ad9f-4a36-ba9d-5649f4b326ac', 'image/jpeg', 'firebase', '2025-11-13 04:25:26', '2025-11-13 04:25:26'),
(97, 'products/1763033240411_salad trộn.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763033240411_salad%20tr%E1%BB%99n.jpg?alt=media&token=27ec2e86-1386-4d54-9e59-cbd6b7793985', 'image/jpeg', 'firebase', '2025-11-13 04:27:22', '2025-11-13 04:27:22'),
(98, 'products/1763033309118_Bò lúc lắc.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763033309118_B%C3%B2%20l%C3%BAc%20l%E1%BA%AFc.jpg?alt=media&token=22afc073-7553-48ea-a34a-989bc88aa738', 'image/jpeg', 'firebase', '2025-11-13 04:28:31', '2025-11-13 04:28:31'),
(99, 'products/1763033940145_Flan.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763033940145_Flan.jpg?alt=media&token=d21c2f1d-6ff9-4f72-a5da-fd18736bc616', 'image/jpeg', 'firebase', '2025-11-13 04:39:03', '2025-11-13 04:39:03'),
(100, 'products/1763034007320_Panna cotta.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763034007320_Panna%20cotta.jpg?alt=media&token=845de8e0-a3d3-423b-9e36-2dfe68ae7617', 'image/jpeg', 'firebase', '2025-11-13 04:40:09', '2025-11-13 04:40:09'),
(101, 'products/1763034096265_tiramisu.webp', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763034096265_tiramisu.webp?alt=media&token=bd4ded11-6532-41e9-a6e7-584d7f92a38d', 'image/webp', 'firebase', '2025-11-13 04:41:38', '2025-11-13 04:41:38'),
(102, 'products/1763034172838_Crème Brûlée.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763034172838_Cr%C3%A8me%20Br%C3%BBl%C3%A9e.jpg?alt=media&token=c7494ad4-3f04-4c77-bf67-229fcc2638f6', 'image/jpeg', 'firebase', '2025-11-13 04:42:54', '2025-11-13 04:42:54'),
(103, 'products/1763034236460_Vải thiều.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763034236460_V%E1%BA%A3i%20thi%E1%BB%81u.png?alt=media&token=2d9d7c52-c5c1-4781-999b-4e7e9686061a', 'image/png', 'firebase', '2025-11-13 04:44:02', '2025-11-13 04:44:02'),
(104, 'products/1763034355025_Bánh cheesecake.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763034355025_B%C3%A1nh%20cheesecake.jpg?alt=media&token=949cd63b-7651-4267-928c-136b5302b534', 'image/jpeg', 'firebase', '2025-11-13 04:45:56', '2025-11-13 04:45:56'),
(105, 'products/1763034414818_Banana-split.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763034414818_Banana-split.jpg?alt=media&token=46e71eb0-5fc2-4e68-98c9-e5f4f3115a04', 'image/jpeg', 'firebase', '2025-11-13 04:46:56', '2025-11-13 04:46:56'),
(106, 'products/1763036286418_pepsi.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763036286418_pepsi.jpg?alt=media&token=bb71a495-8c96-478e-bad2-ecd621a3b24e', 'image/jpeg', 'firebase', '2025-11-13 05:18:09', '2025-11-13 05:18:09'),
(107, 'products/1763041799225_Rượu vang đỏ.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763041799225_R%C6%B0%E1%BB%A3u%20vang%20%C4%91%E1%BB%8F.jpg?alt=media&token=a645af9b-74f2-4eb8-8c87-9a2932f98654', 'image/jpeg', 'firebase', '2025-11-13 06:50:01', '2025-11-13 06:50:01'),
(108, 'products/1763041854570_Rượu vang trắng', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763041854570_R%C6%B0%E1%BB%A3u%20vang%20tr%E1%BA%AFng?alt=media&token=2b4c701a-3c60-4f6d-b904-6f187d8fe161', 'image', 'firebase', '2025-11-13 06:50:56', '2025-11-13 06:50:56'),
(109, 'products/1763041901579_sprite', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763041901579_sprite?alt=media&token=8bde9fca-31fa-4b83-b570-0cc772efffee', 'image', 'firebase', '2025-11-13 06:51:42', '2025-11-13 06:51:42'),
(110, 'products/1763041929416_Trà trái cây.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763041929416_Tr%C3%A0%20tr%C3%A1i%20c%C3%A2y.jpg?alt=media&token=f8a75bbf-7143-4237-be96-d0c7de9ae06b', 'image/jpeg', 'firebase', '2025-11-13 06:52:10', '2025-11-13 06:52:10'),
(111, 'products/1763041969842_Cam vắt.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763041969842_Cam%20v%E1%BA%AFt.png?alt=media&token=ed11ac5d-6e96-49a3-b9f6-201998ffae69', 'image/png', 'firebase', '2025-11-13 06:52:54', '2025-11-13 06:52:54'),
(112, 'products/1763041994387_Nước rau má.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763041994387_N%C6%B0%E1%BB%9Bc%20rau%20m%C3%A1.jpg?alt=media&token=fc804f2e-5888-4053-a365-24a71dbd4dfc', 'image/jpeg', 'firebase', '2025-11-13 06:53:18', '2025-11-13 06:53:18'),
(113, 'products/1763042025525_aquafina 500ml.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042025525_aquafina%20500ml.jpg?alt=media&token=b64df3d3-3f59-44f1-b45c-397e22e66a60', 'image/jpeg', 'firebase', '2025-11-13 06:53:47', '2025-11-13 06:53:47'),
(114, 'products/1763042061269_Rượu nho.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042061269_R%C6%B0%E1%BB%A3u%20nho.jpg?alt=media&token=4990ad06-53df-44d7-b7c7-4f8103205f24', 'image/jpeg', 'firebase', '2025-11-13 06:54:22', '2025-11-13 06:54:22'),
(115, 'products/1763042101106_ruou-soju.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042101106_ruou-soju.jpg?alt=media&token=822c126f-752f-4492-b68a-3e0352dd24de', 'image/jpeg', 'firebase', '2025-11-13 06:55:03', '2025-11-13 06:55:03'),
(116, 'products/1763042147855_bia heiniken.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042147855_bia%20heiniken.jpg?alt=media&token=3c144972-2b67-4a0f-a511-b3ccd4118783', 'image/jpeg', 'firebase', '2025-11-13 06:55:49', '2025-11-13 06:55:49'),
(117, 'products/1763042185968_Bia 333.webp', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042185968_Bia%20333.webp?alt=media&token=82f02f04-baf7-4c6d-ba7f-8e117efb238f', 'image/webp', 'firebase', '2025-11-13 06:56:27', '2025-11-13 06:56:27'),
(118, 'products/1763042214420_Bia tiger.jpeg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042214420_Bia%20tiger.jpeg?alt=media&token=14d93a3d-d975-48c8-902b-b7e41a2c6d89', 'image/jpeg', 'firebase', '2025-11-13 06:56:55', '2025-11-13 06:56:55'),
(119, 'products/1763042249829_Bia sg.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042249829_Bia%20sg.jpg?alt=media&token=fcd220f2-68f6-44a4-a0df-e51d4d6c6970', 'image/jpeg', 'firebase', '2025-11-13 06:57:31', '2025-11-13 06:57:31'),
(120, 'products/1763042441444_Ngêu hấp thái.webp', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763042441444_Ng%C3%AAu%20h%E1%BA%A5p%20th%C3%A1i.webp?alt=media&token=8203e1cc-43df-414b-9018-35b91378d2e5', 'image/webp', 'firebase', '2025-11-13 07:00:42', '2025-11-13 07:00:42'),
(121, 'products/1763389662468_Tôm hấp dừa.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763389662468_T%C3%B4m%20h%E1%BA%A5p%20d%E1%BB%ABa.jpg?alt=media&token=ef3c7e65-1728-4bf8-91b7-5f6724a2a699', 'image/jpeg', 'firebase', '2025-11-17 07:27:44', '2025-11-17 07:27:44'),
(122, 'products/1763390203065_Screenshot 2025-11-17 213616.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763390203065_Screenshot%202025-11-17%20213616.png?alt=media&token=3612f357-b1b0-4297-93f2-a03a191572b1', 'image/png', 'firebase', '2025-11-17 07:36:48', '2025-11-17 07:36:48'),
(123, 'products/1763456113852_2023_10_23_638336575818808816_cach-lam-com-chien-trung-thumb.webp', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763456113852_2023_10_23_638336575818808816_cach-lam-com-chien-trung-thumb.webp?alt=media&token=8fcb9eff-c7a2-48c4-aa5e-56654584fe97', 'image/webp', 'firebase', '2025-11-18 01:55:15', '2025-11-18 01:55:15'),
(124, 'products/1763456450928_thit-kho-tau-1_e1cff6f8909d46d5bae6b89f6f08a5e6.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763456450928_thit-kho-tau-1_e1cff6f8909d46d5bae6b89f6f08a5e6.jpg?alt=media&token=092fddbe-fd6b-4f13-b113-300a9c45a22a', 'image/jpeg', 'firebase', '2025-11-18 02:00:51', '2025-11-18 02:00:51'),
(125, 'products/1763456575924_hoa-qua-trang-mieng-dam-cuoi-luon-duoc-yeu-thich-boi-su-tuoi-mat-tot-cho-suc-khoe.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763456575924_hoa-qua-trang-mieng-dam-cuoi-luon-duoc-yeu-thich-boi-su-tuoi-mat-tot-cho-suc-khoe.jpg?alt=media&token=72c3fd03-dcd4-4724-9970-15949e35755b', 'image/jpeg', 'firebase', '2025-11-18 02:02:58', '2025-11-18 02:02:58'),
(126, 'products/1763456757685_lau-thai-chua-cay-tmt.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763456757685_lau-thai-chua-cay-tmt.jpg?alt=media&token=e9c100d5-c3ed-438c-a936-0c3c5a4ba9bb', 'image/jpeg', 'firebase', '2025-11-18 02:06:01', '2025-11-18 02:06:01'),
(127, 'products/1763457380549_heo-sua-quay-1.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763457380549_heo-sua-quay-1.jpg?alt=media&token=7f3dde77-e80d-4b7a-a422-18708e244d89', 'image/jpeg', 'firebase', '2025-11-18 02:16:23', '2025-11-18 02:16:23'),
(128, 'products/1763457478865_lam-vit-quay-bang-noi-chien-khong-dau_75c656e24c7e467da076f1dc23bb5af9.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763457478865_lam-vit-quay-bang-noi-chien-khong-dau_75c656e24c7e467da076f1dc23bb5af9.jpg?alt=media&token=f55aa9ea-c21b-4e56-ba91-0a23e2b13c3b', 'image/jpeg', 'firebase', '2025-11-18 02:18:00', '2025-11-18 02:18:00'),
(129, 'products/1763457554930_suon-xao-chua-ngot-mien-bac-1.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763457554930_suon-xao-chua-ngot-mien-bac-1.jpg?alt=media&token=e7b3b671-2839-41a3-b62c-dd4be0d4b02c', 'image/jpeg', 'firebase', '2025-11-18 02:19:16', '2025-11-18 02:19:16'),
(130, 'products/1763459850669_Screenshot 2025-11-18 165711.png', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763459850669_Screenshot%202025-11-18%20165711.png?alt=media&token=44cf2a33-b974-4367-bd97-b397ed101e1b', 'image/png', 'firebase', '2025-11-18 02:57:36', '2025-11-18 02:57:36'),
(131, 'products/1763463799775_images.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763463799775_images.jpg?alt=media&token=fb8dfdbd-5dcc-4183-b66b-2faa7fcbcc5a', 'image/jpeg', 'firebase', '2025-11-18 04:03:20', '2025-11-18 04:03:20'),
(132, 'products/1763463828231_images (1).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763463828231_images%20(1).jpg?alt=media&token=3e01a65b-91fe-469b-bba2-5b75228ce3a6', 'image/jpeg', 'firebase', '2025-11-18 04:03:49', '2025-11-18 04:03:49'),
(133, 'products/1763463871209_images (4).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763463871209_images%20(4).jpg?alt=media&token=e58547ff-84dd-4f2e-85d0-80af618a34a2', 'image/jpeg', 'firebase', '2025-11-18 04:04:32', '2025-11-18 04:04:32'),
(134, 'products/1763467828612_download (9).jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763467828612_download%20(9).jpg?alt=media&token=8531c844-b852-4369-b3e5-69bbce854931', 'image/jpeg', 'firebase', '2025-11-18 05:10:31', '2025-11-18 05:10:31'),
(135, 'products/1763467872302_logo.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763467872302_logo.jpg?alt=media&token=d8c0c421-c9eb-4859-b8c1-169be18700d0', 'image/jpeg', 'firebase', '2025-11-18 05:11:13', '2025-11-18 05:11:13'),
(136, 'products/1763477404431_kich-thuoc-ban-an-nha-hang-13_08d12ae37a144bcc860138859b72091b.jpeg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763477404431_kich-thuoc-ban-an-nha-hang-13_08d12ae37a144bcc860138859b72091b.jpeg?alt=media&token=69ce9732-9104-407f-b0bd-66eddfd49623', 'image/jpeg', 'firebase', '2025-11-18 07:50:06', '2025-11-18 07:50:06'),
(137, 'products/1763477414100_Yêu_cầu_thêm_khung_cảnh_ban_công.mp4', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763477414100_Y%C3%AAu_c%E1%BA%A7u_th%C3%AAm_khung_c%E1%BA%A3nh_ban_c%C3%B4ng.mp4?alt=media&token=1d9e6e71-3646-4aa5-9f34-1f088a5864bd', 'video/mp4', 'firebase', '2025-11-18 07:50:21', '2025-11-18 07:50:21'),
(138, 'products/1763477717955_c6f5115c7f5a96afc8a3292fda4c2381.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763477717955_c6f5115c7f5a96afc8a3292fda4c2381.jpg?alt=media&token=99016edb-c63c-4a62-8ba4-f9aac0c99349', 'image/jpeg', 'firebase', '2025-11-18 07:55:19', '2025-11-18 07:55:19'),
(139, 'products/1763477733630_c6f5115c7f5a96afc8a3292fda4c2381.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763477733630_c6f5115c7f5a96afc8a3292fda4c2381.jpg?alt=media&token=7b5d2570-7bfe-4c40-851f-4a6c62da0fe3', 'image/jpeg', 'firebase', '2025-11-18 07:55:35', '2025-11-18 07:55:35'),
(140, 'products/1763477792188_c6f5115c7f5a96afc8a3292fda4c2381.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1763477792188_c6f5115c7f5a96afc8a3292fda4c2381.jpg?alt=media&token=54a1e22a-4999-49da-986d-2a12426d35eb', 'image/jpeg', 'firebase', '2025-11-18 07:56:34', '2025-11-18 07:56:34'),
(141, 'products/1764627689514_541887971_1447124483501169_5050420605614481565_n.jpg', 'https://firebasestorage.googleapis.com/v0/b/huong-sen-restaurant.appspot.com/o/products%2F1764627689514_541887971_1447124483501169_5050420605614481565_n.jpg?alt=media&token=dc319399-058f-490b-82d1-da640e88f25e', 'image/jpeg', 'firebase', '2025-12-01 15:21:32', '2025-12-01 15:21:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `tai_khoan` varchar(255) DEFAULT NULL,
  `anh_dai_dien_id` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `dien_thoai` varchar(20) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `vai_tro_id` int(11) DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  `loai_nguoi_dung` enum('Khách Hàng','Nhân Viên') NOT NULL,
  `luong` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `ho_ten`, `tai_khoan`, `anh_dai_dien_id`, `email`, `dien_thoai`, `dia_chi`, `mat_khau`, `vai_tro_id`, `trang_thai`, `loai_nguoi_dung`, `luong`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin User', 'superadmin', 135, 'superadmin@gmail.com', '0123456780', '1 Admin Way', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 1, 1, 'Nhân Viên', 50000000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(2, 'Nhân Viên Phục Vụ A', 'nv_phucvu_a', 10, 'phucvua@huongsen.com', '0123456781', 'Nhà hàng Hương Sen', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 2, 1, 'Nhân Viên', 7000000, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(4, 'Khách Hàng An', NULL, 8, 'khachan@email.com', '0987654321', '30 Khách Hàng Street', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 4, 1, 'Khách Hàng', NULL, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(5, 'Nguyễn Văn C', NULL, 8, 'nguyenvanc@email.com', '0912345678', NULL, '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 4, 1, 'Khách Hàng', NULL, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(6, 'Chương Đẹp Zai', 'chuongdz', 69, 'chuong@email.com', '0372760485', '123 Chương Street', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 4, 1, 'Khách Hàng', NULL, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(7, 'Nhân viên test', 'nvtest', 63, 'nvtest@gmail.com', '0372760480', '123 test street', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 2, 1, 'Nhân Viên', 8000000, '2025-11-04 12:35:38', '2025-11-04 12:35:38'),
(8, 'Khách hàng test', 'khtest', 134, 'John@gmail.com', '0372760485', '123 Chương street', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 4, 1, 'Khách Hàng', NULL, '2025-11-05 11:23:53', '2025-11-05 11:23:53'),
(9, 'Nhân viên test 2', 'nvtest2', 140, 'nvtest2@gmail.com', '0372760482', '123 test street 2', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 5, 1, 'Nhân Viên', 9000000, '2025-11-07 22:11:23', '2025-11-07 22:11:23'),
(10, 'Nhân viên test 3', 'nvtest3', 83, 'nvtest3@gmail.com', '0372760483', '123 test street 3', '$2b$10$k7VvYiVoZ.asEBYCPtLws.UTtBB5jq3ub/QX8xbC.Zbn5D1DklZS2', 5, 1, 'Nhân Viên', 9000000, '2025-11-09 13:39:41', '2025-11-09 13:39:41'),
(11, 'chương đẹp zai', NULL, 81, 'John1@gmail.com', '0123456788', '123 trái đất, Phường 10, Thành phố Đà Lạt, Tỉnh Lâm Đồng', '$2b$10$0bFpI0TVTfoN7xXJxQ6AgOd5KkGBtpdVjWTmIYPNYYBOUDRBJRO3S', NULL, 1, 'Khách Hàng', NULL, '2025-11-10 05:19:50', '2025-11-10 05:19:50'),
(12, 'Nguyễn Công Quang', NULL, NULL, 'quang@gmail.com', '0215564565', '99 Nguyễn Trãi, Huyện Đồng Văn, Tỉnh Hà Giang', '$2b$10$u2tKRbiVjue4iAKa/jFsFuGhQRj3lgw4QU6L2S.S38oAIGGqnr0YG', NULL, 1, 'Khách Hàng', NULL, '2025-11-17 07:10:52', '2025-11-17 07:10:52'),
(13, 'Tài Khoản test', NULL, 141, 'TKhoanTest@gmail.com', '0999999999', '123 phường 8 Đà Lạt', '$2b$10$2WBvOT5KtWMzvzT59xu8IOdobayDi0l1COJfGips.yXqohlF3LnGi', NULL, 1, 'Khách Hàng', NULL, '2025-12-01 15:20:55', '2025-12-01 15:20:55'),
(14, 'Nhân viên test 4', NULL, NULL, 'NhanVienTest@gmail.com', '0888888888', '123 test street 2', '$2b$10$2rSMVSOu2Fz89yaV6gs6yOZ9.ytR6ry8MIz5HATJ9/JJ6iAdVE2pC', 5, 1, 'Nhân Viên', NULL, '2025-12-01 15:27:58', '2025-12-01 15:27:58');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguyen_lieu`
--

CREATE TABLE `nguyen_lieu` (
  `id` int(11) NOT NULL,
  `ten_nguyen_lieu` varchar(255) NOT NULL,
  `don_vi_tinh` varchar(50) NOT NULL,
  `so_luong_ton` double NOT NULL DEFAULT 0,
  `muc_canh_bao` double NOT NULL DEFAULT 0,
  `gia_nhap_cuoi` int(11) DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `ghi_chu` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguyen_lieu`
--

INSERT INTO `nguyen_lieu` (`id`, `ten_nguyen_lieu`, `don_vi_tinh`, `so_luong_ton`, `muc_canh_bao`, `gia_nhap_cuoi`, `trang_thai`, `ghi_chu`, `created_at`, `updated_at`) VALUES
(1, 'Thịt bò thăn', 'kg', 14.75, 5, 280000, 1, 'Dùng cho Phở Bò, Bò Lúc Lắc', '2025-12-05 11:01:12', '2025-12-05 04:40:35'),
(2, 'Nạm bò', 'kg', 20, 5, 190000, 1, 'Dùng cho Phở Nạm', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(3, 'Xương ống bò', 'kg', 50, 10, 80000, 1, 'Hầm nước dùng Phở', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(4, 'Thịt heo ba chỉ', 'kg', 12, 3, 140000, 1, 'Dùng cho thịt kho tàu', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(5, 'Sườn non heo', 'kg', 10, 3, 160000, 1, 'Sườn xào chua ngọt', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(6, 'Gà ta nguyên con', 'kg', 25, 5, 120000, 1, 'Gà hấp, Gà nướng', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(7, 'Tôm sú tươi', 'kg', 8, 2, 320000, 1, 'Gỏi cuốn, Mì quảng, Tôm hấp', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(8, 'Tôm hùm Alaska', 'kg', 5, 2, 950000, 1, 'Món cao cấp', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(9, 'Cua Hoàng Đế', 'kg', 3, 1, 1800000, 1, 'Hàng cao cấp nhập khẩu', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(10, 'Mực ống', 'kg', 7.5, 2, 250000, 1, 'Mực hấp Thái', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(11, 'Nghêu', 'kg', 20, 5, 45000, 1, 'Nghêu hấp Thái', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(12, 'Cá mú', 'kg', 6, 2, 350000, 1, 'Cá mú hấp xì dầu', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(13, 'Hành tây', 'kg', 30, 5, 18000, 1, 'Nguyên liệu phổ biến', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(14, 'Hành lá & Ngò rí', 'kg', 4.9975, 1, 25000, 1, 'Gia vị nêm', '2025-12-05 11:01:12', '2025-12-05 04:40:35'),
(15, 'Sả cây', 'kg', 10, 2, 15000, 1, 'Dùng cho món hấp Thái', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(16, 'Ớt hiểm', 'kg', 2, 0.5, 40000, 1, '', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(17, 'Gừng', 'kg', 5, 1, 30000, 1, '', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(18, 'Rau sống tổng hợp', 'kg', 15, 5, 20000, 1, 'Xà lách, rau thơm ăn kèm', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(19, 'Cà chua', 'kg', 10, 2, 22000, 1, '', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(20, 'Dừa xiêm', 'trai', 50, 10, 12000, 1, 'Tôm hấp nước dừa, Nước giải khát', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(21, 'Bánh phở tươi', 'kg', 40, 10, 15000, 1, 'Nhập mới mỗi ngày', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(22, 'Mì quảng sợi', 'kg', 20, 5, 18000, 1, '', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(23, 'Gạo tẻ', 'kg', 100, 20, 18000, 1, 'Nấu cơm trắng, cơm chiên', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(24, 'Bánh tráng cuốn', 'xap', 50, 5, 10000, 1, 'Gỏi cuốn', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(25, 'Bia Tiger', 'thung', 13, 5, 340000, 1, 'Thùng 24 lon', '2025-12-05 11:01:12', '2025-12-05 04:40:35'),
(26, 'Bia Heineken', 'thung', 15, 5, 420000, 1, 'Thùng 24 lon', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(27, 'Coca Cola', 'thung', 30, 5, 180000, 1, 'Thùng 24 lon', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(28, 'Rượu Vang Đỏ Đà Lạt', 'chai', 12, 3, 150000, 1, '', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(29, 'Sữa tươi không đường', 'hop', 48, 12, 30000, 1, 'Pha chế, làm bánh (Hộp 1L)', '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(30, 'Trứng gà', 'qua', 200, 30, 3000, 1, 'Cơm chiên, làm bánh', '2025-12-05 11:01:12', '2025-12-05 11:01:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nha_cung_cap`
--

CREATE TABLE `nha_cung_cap` (
  `id` int(11) NOT NULL,
  `ten_nha_cung_cap` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nha_cung_cap`
--

INSERT INTO `nha_cung_cap` (`id`, `ten_nha_cung_cap`, `so_dien_thoai`, `email`, `dia_chi`, `ghi_chu`, `trang_thai`, `created_at`, `updated_at`) VALUES
(1, 'Nông Sản Sạch Đà Lạt', '0905111222', 'contact@nongsandala.com', 'Phường 8, Đà Lạt, Lâm Đồng', 'Cung cấp rau củ quả tươi hàng ngày', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(2, 'Hải Sản Biển Đông', '0912333444', 'sales@biendongseafood.vn', 'Cảng cá Vũng Tàu', 'Chuyên tôm hùm, cua, ghẹ, cá mú', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(3, 'Thịt Bò Nhập Khẩu Hùng Á', '0988777666', 'hungabeef@gmail.com', 'Quận 7, TP.HCM', 'Bò Mỹ, Bò Úc, Ba chỉ bò', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(4, 'Đại Lý Bia Nước Ngọt Thành Đạt', '0933555888', 'thanhdat_drinks@gmail.com', 'Quận 1, TP.HCM', 'Pepsi, Coca, Tiger, Heineken', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(5, 'Gia Vị Thực Phẩm Minh Khai', '0283888999', 'minhkhai_spices@yahoo.com', 'Chợ Lớn, Quận 5', 'Nước mắm, đường, bột ngọt, dầu ăn', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(6, 'Lò Bún Phở Gia Truyền', '0909123123', NULL, 'Thủ Đức, TP.HCM', 'Giao bánh phở tươi, bún tươi mỗi sáng', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(7, 'Trại Gà Ba Huân', '0901234567', 'sales@bahuan.vn', 'Bình Dương', 'Trứng gà, thịt gà ta', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(8, 'Công Ty Rượu Vang Đa Lộc', '0912999888', 'daloc_wine@gmail.com', 'Quận 1, TP.HCM', 'Rượu vang đỏ, vang trắng nhập khẩu', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(9, 'Vựa Gạo Miền Tây', '0977665544', NULL, 'Cái Bè, Tiền Giang', 'Gạo thơm lài, gạo nếp', 1, '2025-12-05 11:01:12', '2025-12-05 11:01:12'),
(10, 'Bao Bì Đen', '0944556677', 'info@baobixanh.com', 'Tân Bình, TP.HCM', 'Hộp đựng, túi giấy, ống hút', 1, '2025-12-05 11:01:12', '2025-12-05 04:02:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_nhap`
--

CREATE TABLE `phieu_nhap` (
  `id` int(11) NOT NULL,
  `ma_phieu` varchar(50) NOT NULL,
  `nha_cung_cap_id` int(11) NOT NULL,
  `nguoi_nhap_id` int(11) NOT NULL,
  `tong_tien` int(11) NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_nhap` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phuong_thuc_thanh_toan`
--

CREATE TABLE `phuong_thuc_thanh_toan` (
  `id` int(11) NOT NULL,
  `dat_ban_id` int(11) NOT NULL,
  `nguoi_thanh_toan_id` int(11) NOT NULL,
  `phuong_thuc` varchar(50) NOT NULL,
  `so_tien` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quyen`
--

CREATE TABLE `quyen` (
  `id` int(11) NOT NULL,
  `ten_nhom_quyen` varchar(255) DEFAULT NULL,
  `ten_chuc_nang` varchar(255) NOT NULL,
  `ma_quyen` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `quyen`
--

INSERT INTO `quyen` (`id`, `ten_nhom_quyen`, `ten_chuc_nang`, `ma_quyen`, `created_at`, `updated_at`) VALUES
(1, 'Quản lý Danh mục Sản phẩm', 'Xem Danh mục SP', 'view_product_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(2, 'Quản lý Danh mục Sản phẩm', 'Xem Thùng rác Danh mục SP', 'view_product_category_trash', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(3, 'Quản lý Danh mục Sản phẩm', 'Thêm Danh mục SP', 'add_product_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(4, 'Quản lý Danh mục Sản phẩm', 'Sửa Danh mục SP', 'edit_product_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(5, 'Quản lý Danh mục Sản phẩm', 'Xóa Danh mục SP', 'delete_product_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(6, 'Quản lý Sản phẩm', 'Xem Sản phẩm', 'view_product', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(7, 'Quản lý Sản phẩm', 'Thêm Sản phẩm', 'add_product', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(8, 'Quản lý Sản phẩm', 'Sửa Sản phẩm', 'edit_product', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(9, 'Quản lý Sản phẩm', 'Xóa mềm Sản phẩm', 'soft_delete_product', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(10, 'Quản lý Sản phẩm', 'Xem Thùng rác SP', 'view_product_trash', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(11, 'Quản lý Sản phẩm', 'Khôi phục Sản phẩm', 'restore_product', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(12, 'Quản lý Sản phẩm', 'Xóa vĩnh viễn Sản phẩm', 'force_delete_product', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(13, 'Quản lý Danh mục Blog', 'Xem Danh mục Blog', 'view_blog_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(14, 'Quản lý Danh mục Blog', 'Thêm Danh mục Blog', 'add_blog_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(15, 'Quản lý Danh mục Blog', 'Sửa Danh mục Blog', 'edit_blog_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(16, 'Quản lý Danh mục Blog', 'Xóa Danh mục Blog', 'delete_blog_category', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(17, 'Quản lý Bài viết', 'Xem Bài viết', 'view_blog', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(18, 'Quản lý Bài viết', 'Thêm Bài viết', 'add_blog', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(19, 'Quản lý Bài viết', 'Sửa Bài viết', 'edit_blog', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(20, 'Quản lý Bài viết', 'Xóa Bài viết', 'delete_blog', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(21, 'Quản lý Bình luận Blog', 'Xem Bình luận', 'view_blog_comment', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(22, 'Quản lý Bình luận Blog', 'Thêm Bình luận', 'add_blog_comment', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(23, 'Quản lý Bình luận Blog', 'Sửa Bình luận', 'edit_blog_comment', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(24, 'Quản lý Bình luận Blog', 'Xóa Bình luận', 'delete_blog_comment', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(25, 'Quản lý Khuyến mãi', 'Xem Khuyến mãi', 'view_promotion', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(26, 'Quản lý Khuyến mãi', 'Thêm Khuyến mãi', 'add_promotion', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(27, 'Quản lý Khuyến mãi', 'Sửa Khuyến mãi', 'edit_promotion', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(28, 'Quản lý Khuyến mãi', 'Xóa Khuyến mãi', 'delete_promotion', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(29, 'Quản lý Đặt bàn', 'Xem Đặt bàn', 'view_reservation', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(30, 'Quản lý Đặt bàn', 'Xem Chi tiết Đặt bàn', 'view_reservation_detail', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(31, 'Quản lý Đặt bàn', 'Cập nhật Trạng thái Đặt bàn', 'update_reservation_status', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(32, 'Quản lý Đặt bàn', 'Sửa món ăn Đặt bàn', 'edit_reservation_dishes', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(33, 'Quản lý Đặt bàn', 'Hủy Đặt bàn (Xóa mềm)', 'soft_delete_reservation', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(34, 'Quản lý Đặt bàn', 'Xem Đơn đã hủy', 'view_reservation_trash', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(35, 'Quản lý Đặt bàn', 'Xóa vĩnh viễn Đặt bàn', 'force_delete_reservation', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(36, 'Quản lý Bàn ăn', 'Xem Bàn ăn', 'view_table', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(37, 'Quản lý Bàn ăn', 'Thêm Bàn ăn', 'add_table', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(38, 'Quản lý Bàn ăn', 'Sửa Bàn ăn', 'edit_table', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(39, 'Quản lý Bàn ăn', 'Xóa Bàn ăn', 'delete_table', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(40, 'Quản lý Tài khoản', 'Xem Tài khoản', 'view_user', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(41, 'Quản lý Tài khoản', 'Xem Chi tiết Tài khoản', 'view_user_detail', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(42, 'Quản lý Tài khoản', 'Thêm Tài khoản', 'add_user', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(43, 'Quản lý Tài khoản', 'Sửa Tài khoản', 'edit_user', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(44, 'Quản lý Tài khoản', 'Xóa Tài khoản', 'delete_user', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(45, 'Quản lý Vai trò & Quyền', 'Xem Vai trò', 'view_role', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(46, 'Quản lý Vai trò & Quyền', 'Thêm Vai trò', 'add_role', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(47, 'Quản lý Vai trò & Quyền', 'Sửa Vai trò', 'edit_role', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(48, 'Quản lý Vai trò & Quyền', 'Xóa Vai trò', 'delete_role', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(49, 'Quản lý Vai trò & Quyền', 'Gán Quyền cho Vai trò', 'assign_permission_to_role', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(50, 'Quản lý Media', 'Xem Media', 'view_media', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(51, 'Quản lý Media', 'Upload Media', 'upload_media', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(52, 'Quản lý Media', 'Xóa Media', 'delete_media', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(53, 'Quản lý Thành viên', 'Xem Hạng thành viên', 'view_member_rank', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(54, 'Quản lý Thành viên', 'Thêm Hạng thành viên', 'add_member_rank', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(55, 'Quản lý Thành viên', 'Sửa Hạng thành viên', 'edit_member_rank', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(56, 'Quản lý Thành viên', 'Xóa Hạng thành viên', 'delete_member_rank', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(57, 'Quản lý Thành viên', 'Xem Thẻ thành viên', 'view_member_card', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(58, 'Quản lý Thành viên', 'Cập nhật điểm thành viên', 'update_member_points', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(59, 'Quản lý Tài khoản', 'Xóa mềm Tài khoản', 'soft_delete_user', '2025-11-18 09:51:55', '2025-11-18 09:51:55'),
(60, 'Quản lý Tài khoản', 'Xóa vĩnh viễn Tài khoản', 'force_delete_user', '2025-11-18 09:51:55', '2025-11-18 09:51:55'),
(61, 'Quản lý POS', 'Truy cập POS/Sơ đồ bàn', 'view_pos', '2025-12-05 06:15:58', '2025-12-05 06:15:58'),
(62, 'Quản lý Kho', 'Xem Nguyên Liệu', 'view_material', '2025-12-05 07:19:24', '2025-12-05 07:19:24'),
(63, 'Quản lý Kho', 'Thêm/Sửa Nguyên Liệu', 'manage_material', '2025-12-05 07:19:24', '2025-12-05 07:19:24'),
(64, 'Quản lý Kho', 'Xem Nhà Cung Cấp', 'view_supplier', '2025-12-05 07:19:24', '2025-12-05 07:19:24'),
(65, 'Quản lý Kho', 'Quản lý Nhà Cung Cấp', 'manage_supplier', '2025-12-05 07:19:24', '2025-12-05 07:19:24'),
(66, 'Quản lý Kho', 'Nhập Kho', 'import_inventory', '2025-12-05 07:19:24', '2025-12-05 07:19:24'),
(67, 'Quản lý Kho', 'Xem Tồn Kho', 'view_inventory', '2025-12-05 07:19:24', '2025-12-05 07:19:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `san_pham`
--

CREATE TABLE `san_pham` (
  `id` int(11) NOT NULL,
  `ma_san_pham` varchar(10) NOT NULL,
  `ten_san_pham` varchar(255) NOT NULL,
  `gia_ban` int(11) NOT NULL,
  `gia_khuyen_mai` int(11) NOT NULL DEFAULT 0,
  `hinh_anh_id` int(11) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `danh_muc_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `san_pham`
--

INSERT INTO `san_pham` (`id`, `ma_san_pham`, `ten_san_pham`, `gia_ban`, `gia_khuyen_mai`, `hinh_anh_id`, `mo_ta`, `trang_thai`, `danh_muc_id`, `created_at`, `updated_at`) VALUES
(1, 'HS-PHOBO', 'Phở Bò Đặc Biệt', 55000, 0, 77, 'Phở bò truyền thống Việt Nam, nước dùng đậm đà.', 1, 1, '2025-10-28 12:33:23', '2025-12-05 04:38:12'),
(2, 'HS-MIQUANG', 'Mì Quảng Tôm Thịt', 55000, 0, 76, 'Mì Quảng chuẩn vị miền Trung.', 1, 1, '2025-10-28 12:33:23', '2025-11-09 13:56:53'),
(3, 'HS-GOICUON', 'Gỏi Cuốn Tôm Thịt', 40000, 0, 75, 'Gỏi cuốn tươi ngon với tôm, thịt, bún và rau sống.', 1, 2, '2025-10-28 12:33:23', '2025-11-09 13:56:29'),
(4, 'HS-PEPSI', 'Pepsi Lon', 15000, 0, 74, 'Nước ngọt Pepsi mát lạnh.', 1, 4, '2025-10-28 12:33:23', '2025-11-09 13:56:11'),
(5, 'HS-COCA', 'Coca Cola Lon', 15000, 0, 73, 'Nước ngọt Coca Cola.', 1, 4, '2025-10-28 12:33:23', '2025-11-09 13:55:47'),
(6, 'HS-TOMHUM', 'Tôm Hùm Alaska Nướng', 1200000, 0, 72, 'Tôm hùm Alaska tươi sống nướng phô mai hoặc bơ tỏi.', 1, 1, '2025-10-28 12:33:23', '2025-11-09 13:55:29'),
(7, 'HS-CHEMUOI', 'Cá Mú Hấp Xì Dầu', 500000, 0, 32, 'Cá mú tươi ngon hấp cùng xì dầu và gừng.', 0, 1, '2025-10-28 12:33:23', '2025-10-29 08:13:36'),
(10, 'HS-469743', 'Cua Hoàng Đế', 5500000, 4999999, 91, 'Cua hoàng đế hấp là món ăn tinh tế, cua tươi được hấp chín giữ nguyên vị ngọt tự nhiên, thịt mềm dai, thơm nhẹ, chấm cùng muối tiêu chanh càng thêm đậm đà.', 1, 1, '2025-11-13 04:14:29', '2025-11-13 04:26:45'),
(11, 'HS-617159', 'Nghêu Hấp Thái', 250000, 229000, 92, 'Nghêu hấp Thái là món hải sản thơm ngon, nghêu tươi được hấp cùng sả, ớt, lá chanh và gia vị kiểu Thái, tạo vị chua cay, đậm đà và dậy mùi hấp dẫn.', 1, 1, '2025-11-13 04:16:57', '2025-11-13 04:27:09'),
(12, 'HS-847068', 'Tôm hấp dừa tươi', 199999, 0, 93, 'Khi hấp, nước dừa thấm vào tôm, làm thịt tôm ngọt tự nhiên, săn chắc, có mùi thơm béo nhẹ của dừa. Nước dừa đồng thời giúp giữ độ ẩm cho tôm, khiến tôm không bị khô hay tanh.', 1, 1, '2025-11-13 04:20:47', '2025-11-13 04:20:47'),
(13, 'HS-939180', 'Cơm Chiên Dương Châu', 59000, 0, 94, 'Cơm chiên Dương Châu là món cơm chiên nổi tiếng, có màu vàng hấp dẫn, kết hợp hài hòa giữa cơm, trứng, tôm, lạp xưởng, rau củ… tạo nên hương vị đậm đà, thơm ngon và bắt mắt.', 1, 1, '2025-11-13 04:22:19', '2025-11-13 04:22:19'),
(14, 'HS-101578', 'Vodka 300', 79000, 0, 95, 'Vodka 300 là loại rượu mạnh trong suốt, có nồng độ cồn khoảng 300 ml hoặc mang tên thương hiệu “300”, thường được dùng để uống lạnh, pha cocktail hoặc dùng trong các buổi tiệc. Hương vị đặc trưng là mạnh, cay nồng và êm dịu sau khi uống.', 1, 4, '2025-11-13 04:25:01', '2025-11-13 04:25:01'),
(15, 'HS-159313', 'Mực hấp thái', 119000, 0, 96, 'Mực hấp Thái là món hải sản tươi ngon, mực được hấp chín cùng sả, ớt, lá chanh và gia vị kiểu Thái, tạo hương vị chua cay, thơm lừng và đậm đà đặc trưng.', 1, 1, '2025-11-13 04:25:59', '2025-11-13 04:26:07'),
(16, 'HS-282844', 'Salad trộn', 30000, 0, 97, 'Salad trộn là món ăn nhẹ, gồm rau củ tươi được cắt nhỏ, trộn đều với nước sốt chua ngọt, mayonnaise hoặc dầu giấm, tạo vị tươi mát, giòn ngon và thanh nhẹ.', 1, 2, '2025-11-13 04:28:02', '2025-11-13 04:28:02'),
(17, 'HS-361272', 'Bò Lúc Lắc', 179000, 0, 98, 'Bò lúc lắc là món thịt bò tươi được cắt hạt lựu, xào nhanh với tỏi, hành tây và gia vị, giữ thịt ngọt mềm, thơm nức và đậm đà, thường ăn kèm cơm hoặc bánh mì.', 1, 1, '2025-11-13 04:29:21', '2025-11-13 04:29:21'),
(18, 'HS-987702', 'Bánh Flan', 29000, 0, 99, 'Bánh flan là món tráng miệng mềm mịn, làm từ trứng và sữa, có vị ngọt dịu, béo thơm, thường ăn kèm caramen caramel tạo màu vàng óng hấp dẫn.', 1, 3, '2025-11-13 04:39:47', '2025-11-13 04:39:47'),
(19, 'HS-073708', 'Panna Cotta', 39000, 32000, 100, 'Panna cotta là món tráng miệng Ý mịn màng, làm từ kem tươi, sữa và đường, có vị ngọt dịu, béo nhẹ, thường được ăn kèm sốt trái cây hoặc caramel.', 1, 3, '2025-11-13 04:41:13', '2025-11-13 04:41:13'),
(20, 'HS-143280', 'Tiramisu', 40000, 0, 101, 'Tiramisu là món tráng miệng Ý nổi tiếng, gồm bánh savoiardi nhúng cà phê, kem mascarpone và cacao, có vị ngọt nhẹ, thơm cà phê và béo mịn, đem lại trải nghiệm mềm mại, tinh tế.', 1, 3, '2025-11-13 04:42:23', '2025-11-13 04:42:23'),
(21, 'HS-206017', 'Crème Brûlée', 87000, 0, 102, 'Crème Brûlée là món tráng miệng Pháp, gồm kem trứng béo mịn được nướng và phủ lớp đường caramel giòn tan trên bề mặt, tạo vị ngọt dịu, béo thơm và hấp dẫn.', 1, 3, '2025-11-13 04:43:26', '2025-11-13 04:43:32'),
(22, 'HS-304701', 'Vải Thiều', 25000, 0, 103, 'Vải thiều là loại trái cây nhiệt đới, có vỏ đỏ mỏng, thịt ngọt thanh, mọng nước và hạt nhỏ ở giữa, thường ăn tươi hoặc làm mứt, sinh tố, nước giải khát.', 1, 3, '2025-11-13 04:45:04', '2025-11-13 04:45:04'),
(23, 'HS-385129', 'Bánh cheesecake', 59000, 0, 104, 'Bánh cheesecake là món tráng miệng béo mịn, làm từ phô mai, trứng và đường, có lớp đế bánh quy giòn. Vị bánh ngọt nhẹ, béo thơm, thường ăn kèm sốt trái cây hoặc caramel.', 1, 3, '2025-11-13 04:46:25', '2025-11-13 04:46:25'),
(24, 'HS-465129', 'Banana Split', 45000, 0, 105, 'Banana Split là món tráng miệng mát lạnh, gồm chuối cắt đôi kèm kem, sốt socola hoặc caramel, kem tươi và hạt hạnh nhân. Vị bánh ngọt dịu, béo ngậy và hấp dẫn.', 1, 3, '2025-11-13 04:47:45', '2025-11-13 04:47:45'),
(25, 'HS-510988', 'Pepsi', 15000, 0, 106, '', 1, 4, '2025-11-13 05:21:50', '2025-11-13 05:21:50'),
(26, 'HS-830052', 'Rượu vang đỏ', 399000, 0, 107, '', 1, 4, '2025-11-13 06:50:30', '2025-11-13 06:50:30'),
(27, 'HS-882408', 'Rượu vang trắng', 559900, 0, 108, '', 1, 4, '2025-11-13 06:51:22', '2025-11-13 06:51:22'),
(28, 'HS-918837', 'Sprite', 15000, 0, 109, '', 1, 4, '2025-11-13 06:51:58', '2025-11-13 06:51:58'),
(29, 'HS-955251', 'Trà trái cây', 30000, 0, 110, '', 1, 4, '2025-11-13 06:52:35', '2025-11-13 06:52:35'),
(30, 'HS-978576', 'Cam vắt', 25000, 0, 111, '', 1, 4, '2025-11-13 06:52:58', '2025-11-13 06:52:58'),
(31, 'HS-005685', 'Nước rau má', 25000, 0, 112, '', 1, 4, '2025-11-13 06:53:25', '2025-11-13 06:53:25'),
(32, 'HS-046558', 'Nước suối aquafina', 10000, 0, 113, '', 1, 4, '2025-11-13 06:54:06', '2025-11-13 06:54:06'),
(33, 'HS-080202', 'Rượu nho', 99000, 0, 114, '', 1, 4, '2025-11-13 06:54:40', '2025-11-13 06:54:40'),
(34, 'HS-128965', 'Rượu Joju', 79000, 0, 115, '', 1, 4, '2025-11-13 06:55:28', '2025-11-13 06:55:28'),
(35, 'HS-165164', 'Bia Heiniken', 26000, 0, 116, '', 1, 4, '2025-11-13 06:56:05', '2025-11-13 06:56:05'),
(36, 'HS-200408', 'Bia 333', 30000, 0, 117, '', 1, 4, '2025-11-13 06:56:40', '2025-11-13 06:56:40'),
(37, 'HS-230767', 'Bia Tiger', 28000, 0, 118, '', 1, 4, '2025-11-13 06:57:10', '2025-12-05 04:30:50'),
(38, 'HS-265281', 'Bia Saigon', 28000, 0, 119, '', 1, 4, '2025-11-13 06:57:45', '2025-11-17 07:07:26'),
(39, 'HS-119125', 'cơm chiên trứng', 15000, 0, 123, '', 1, 5, '2025-11-18 01:55:19', '2025-11-18 01:55:19'),
(40, 'HS-453853', 'Thịt Kho Tàu', 30000, 0, 124, '', 1, 1, '2025-11-18 02:00:53', '2025-11-18 02:00:53'),
(41, 'HS-581683', 'Hoa quả tráng miệng', 20000, 0, 125, '', 1, 3, '2025-11-18 02:03:01', '2025-11-18 02:03:01'),
(42, 'HS-763802', 'Lẩu thái', 100000, 0, 126, '', 1, 1, '2025-11-18 02:06:03', '2025-11-18 02:06:03'),
(43, 'HS-384792', 'Lợn quay', 100000, 0, 127, '', 1, 1, '2025-11-18 02:16:24', '2025-11-18 02:16:24'),
(44, 'HS-482842', 'Vịt quay', 75000, 0, 128, '', 1, 1, '2025-11-18 02:18:02', '2025-11-18 02:18:02'),
(45, 'HS-570254', 'sườn xào chua ngọt', 50000, 0, 129, '', 1, 1, '2025-11-18 02:19:30', '2025-11-18 02:19:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thay_doi_mon_an`
--

CREATE TABLE `thay_doi_mon_an` (
  `id` int(11) NOT NULL,
  `dat_ban_id` int(11) NOT NULL,
  `san_pham_id` int(11) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `gia_tai_thoi_diem` int(11) NOT NULL,
  `loai_thay_doi` tinyint(1) NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `the_thanh_vien`
--

CREATE TABLE `the_thanh_vien` (
  `id` int(11) NOT NULL,
  `khach_hang_id` int(11) NOT NULL,
  `hang_thanh_vien_id` int(11) NOT NULL,
  `diem_tich_luy` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `the_thanh_vien`
--

INSERT INTO `the_thanh_vien` (`id`, `khach_hang_id`, `hang_thanh_vien_id`, `diem_tich_luy`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 500, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(2, 5, 2, 1200, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(3, 6, 2, 2300, '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(4, 8, 1, 0, '2025-11-05 11:23:53', '2025-11-05 11:23:53'),
(5, 11, 1, 0, '2025-11-10 05:19:50', '2025-11-10 05:19:50'),
(6, 12, 1, 0, '2025-11-17 07:10:52', '2025-11-17 07:10:52');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vai_tro`
--

CREATE TABLE `vai_tro` (
  `id` int(11) NOT NULL,
  `ten_vai_tro` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vai_tro`
--

INSERT INTO `vai_tro` (`id`, `ten_vai_tro`, `mo_ta`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'Quản lý cao nhất, không thể sửa/xóa', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(2, 'Nhân viên Phục vụ', 'Ghi order, phục vụ khách', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(3, 'Nhân viên Thu ngân', 'Quản lý hóa đơn, thanh toán', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(4, 'Chưa phân loại', 'Vai trò mặc định khi xóa vai trò khác', '2025-10-28 12:33:23', '2025-10-28 12:33:23'),
(5, 'Vài trò test', 'Phục vụ việc test chức năng', '2025-12-01 14:57:54', '2025-12-01 14:57:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vai_tro_quyen`
--

CREATE TABLE `vai_tro_quyen` (
  `id` int(11) NOT NULL,
  `vai_tro_id` int(11) NOT NULL,
  `quyen_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vai_tro_quyen`
--

INSERT INTO `vai_tro_quyen` (`id`, `vai_tro_id`, `quyen_id`) VALUES
(1, 1, 7),
(2, 1, 3),
(3, 1, 38),
(4, 1, 42),
(5, 1, 46),
(6, 1, 51),
(7, 1, 54),
(8, 1, 26),
(9, 1, 18),
(10, 1, 14),
(11, 2, 6),
(12, 2, 29),
(13, 2, 30),
(14, 2, 31),
(15, 2, 32),
(16, 2, 36),
(17, 3, 25),
(18, 3, 27),
(19, 3, 28),
(20, 3, 33),
(21, 3, 34),
(22, 3, 35),
(23, 3, 40),
(24, 3, 41),
(25, 3, 43),
(26, 3, 44),
(27, 3, 45),
(28, 3, 47),
(29, 3, 48),
(30, 3, 49),
(31, 3, 50),
(32, 3, 52),
(33, 3, 53),
(34, 3, 55),
(35, 3, 56),
(36, 3, 57),
(37, 3, 58),
(38, 1, 1),
(39, 1, 2),
(40, 1, 4),
(41, 1, 5),
(42, 1, 6),
(43, 1, 8),
(44, 1, 9),
(45, 1, 10),
(46, 1, 11),
(47, 1, 12),
(48, 1, 13),
(49, 1, 15),
(50, 1, 16),
(51, 1, 17),
(52, 1, 19),
(53, 1, 20),
(54, 1, 21),
(55, 1, 22),
(56, 1, 23),
(57, 1, 24),
(58, 1, 25),
(59, 1, 27),
(60, 1, 28),
(61, 1, 29),
(62, 1, 30),
(63, 1, 31),
(64, 1, 32),
(65, 1, 33),
(66, 1, 34),
(67, 1, 35),
(68, 1, 36),
(69, 1, 37),
(70, 1, 39),
(71, 1, 40),
(72, 1, 41),
(73, 1, 43),
(74, 1, 44),
(75, 1, 45),
(76, 1, 47),
(77, 1, 48),
(78, 1, 49),
(79, 1, 50),
(80, 1, 52),
(81, 1, 53),
(82, 1, 55),
(83, 1, 56),
(84, 1, 57),
(85, 1, 58),
(86, 1, 60),
(87, 1, 59),
(96, 5, 36),
(97, 5, 37),
(98, 5, 38),
(99, 5, 39),
(100, 5, 17),
(101, 5, 18),
(102, 5, 19),
(103, 5, 20),
(104, 5, 29),
(105, 5, 30),
(106, 5, 31),
(107, 5, 32),
(108, 5, 33),
(109, 5, 34),
(110, 5, 35),
(111, 1, 61),
(112, 1, 66),
(113, 1, 63),
(114, 1, 65),
(115, 1, 67),
(116, 1, 62),
(117, 1, 64);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_ban_antodat_ban`
--

CREATE TABLE `_ban_antodat_ban` (
  `A` int(11) NOT NULL,
  `B` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_ban_antodat_ban`
--

INSERT INTO `_ban_antodat_ban` (`A`, `B`) VALUES
(1, 10),
(1, 11),
(1, 12),
(1, 14),
(1, 17),
(1, 18),
(1, 19),
(1, 22),
(2, 13),
(2, 15),
(2, 16),
(3, 17),
(3, 23),
(4, 10),
(4, 11),
(4, 12),
(4, 13),
(4, 14),
(5, 16),
(5, 20),
(5, 21),
(6, 15);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('4207206a-b46c-4867-b306-8f3b581a485c', 'e9e98b64bcc663c80beb6423f41a636a51612253003bade1bbe98ea7925b3c86', '2025-11-09 17:55:54.013', '20251103154817_fix_media_url_length', NULL, NULL, '2025-11-09 17:55:53.961', 1),
('518f601b-4152-4d7b-9df3-2cf895439afa', '14ca94d4dcc42295c7dc1e46b3732dc20d112a39d3a57a788674c82d9cdf506d', '2025-12-05 07:18:35.524', '20251205071834_init_inventory_tables', NULL, NULL, '2025-12-05 07:18:34.956', 1),
('a16f596c-f453-4e57-a2a8-f52df6eaa53f', '2fc52507f20d8e13f7c6b7105e6d54b48a6cdb9dff59497cfe3d6495b853232a', '2025-11-09 17:55:53.958', '20251028192344_init', NULL, NULL, '2025-11-09 17:55:51.498', 1),
('f858d361-5937-42e9-ae1d-f5e0df970499', '2b4e0c97fb097d6afaef3ac7e62e295c1969be94d6d54bb846bc7987efd3f7fc', '2025-11-09 18:57:56.139', '20251109185755_upgrade_booking_many_to_many', NULL, NULL, '2025-11-09 18:57:55.931', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bai_viet_slug_key` (`slug`),
  ADD KEY `fk_baiviet_danhmuc` (`danh_muc_blog_id`),
  ADD KEY `fk_baiviet_media` (`anh_bia_id`),
  ADD KEY `bai_viet_nguoi_dung_id_idx` (`nguoi_dung_id`);

--
-- Chỉ mục cho bảng `ban_an`
--
ALTER TABLE `ban_an`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `so_ban` (`so_ban`),
  ADD KEY `fk_banan_anh` (`anh_ban_id`),
  ADD KEY `fk_banan_video` (`video_ban_id`);

--
-- Chỉ mục cho bảng `binh_luan_blog`
--
ALTER TABLE `binh_luan_blog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_binhluan_baiviet` (`bai_viet_id`),
  ADD KEY `fk_binhluan_nguoidung` (`nguoi_dung_id`);

--
-- Chỉ mục cho bảng `chi_tiet_dat_ban`
--
ALTER TABLE `chi_tiet_dat_ban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_chitietdatban_datban` (`dat_ban_id`),
  ADD KEY `fk_chitietdatban_sanpham` (`san_pham_id`);

--
-- Chỉ mục cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chi_tiet_phieu_nhap_phieu_nhap_id_idx` (`phieu_nhap_id`),
  ADD KEY `chi_tiet_phieu_nhap_nguyen_lieu_id_idx` (`nguyen_lieu_id`);

--
-- Chỉ mục cho bảng `cong_thuc`
--
ALTER TABLE `cong_thuc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cong_thuc_san_pham_id_idx` (`san_pham_id`),
  ADD KEY `cong_thuc_nguyen_lieu_id_idx` (`nguyen_lieu_id`);

--
-- Chỉ mục cho bảng `danh_muc_blog`
--
ALTER TABLE `danh_muc_blog`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_danh_muc` (`ten_danh_muc`);

--
-- Chỉ mục cho bảng `danh_muc_san_pham`
--
ALTER TABLE `danh_muc_san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_danh_muc` (`ten_danh_muc`);

--
-- Chỉ mục cho bảng `dat_ban`
--
ALTER TABLE `dat_ban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_datban_khachhang` (`khach_hang_id`),
  ADD KEY `fk_datban_khuyenmai` (`khuyen_mai_id`);

--
-- Chỉ mục cho bảng `hang_thanh_vien`
--
ALTER TABLE `hang_thanh_vien`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `media_files`
--
ALTER TABLE `media_files`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_nguoidung_media` (`anh_dai_dien_id`),
  ADD KEY `fk_nguoidung_vaitro` (`vai_tro_id`);

--
-- Chỉ mục cho bảng `nguyen_lieu`
--
ALTER TABLE `nguyen_lieu`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nha_cung_cap`
--
ALTER TABLE `nha_cung_cap`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phieu_nhap_ma_phieu_key` (`ma_phieu`),
  ADD KEY `phieu_nhap_nha_cung_cap_id_idx` (`nha_cung_cap_id`),
  ADD KEY `phieu_nhap_nguoi_nhap_id_idx` (`nguoi_nhap_id`);

--
-- Chỉ mục cho bảng `phuong_thuc_thanh_toan`
--
ALTER TABLE `phuong_thuc_thanh_toan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_thanhtoan_datban` (`dat_ban_id`),
  ADD KEY `fk_thanhtoan_nguoidung` (`nguoi_thanh_toan_id`);

--
-- Chỉ mục cho bảng `quyen`
--
ALTER TABLE `quyen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_quyen` (`ma_quyen`);

--
-- Chỉ mục cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_san_pham` (`ma_san_pham`),
  ADD KEY `fk_sanpham_danhmuc` (`danh_muc_id`),
  ADD KEY `fk_sanpham_media` (`hinh_anh_id`);

--
-- Chỉ mục cho bảng `thay_doi_mon_an`
--
ALTER TABLE `thay_doi_mon_an`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_thaydoi_datban` (`dat_ban_id`),
  ADD KEY `fk_thaydoi_sanpham` (`san_pham_id`);

--
-- Chỉ mục cho bảng `the_thanh_vien`
--
ALTER TABLE `the_thanh_vien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `khach_hang_id` (`khach_hang_id`),
  ADD KEY `fk_thethanhvien_hang` (`hang_thanh_vien_id`);

--
-- Chỉ mục cho bảng `vai_tro`
--
ALTER TABLE `vai_tro`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_vai_tro` (`ten_vai_tro`);

--
-- Chỉ mục cho bảng `vai_tro_quyen`
--
ALTER TABLE `vai_tro_quyen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_vaitroquyen_quyen` (`quyen_id`),
  ADD KEY `fk_vaitroquyen_vaitro` (`vai_tro_id`);

--
-- Chỉ mục cho bảng `_ban_antodat_ban`
--
ALTER TABLE `_ban_antodat_ban`
  ADD UNIQUE KEY `_ban_anTodat_ban_AB_unique` (`A`,`B`),
  ADD KEY `_ban_anTodat_ban_B_index` (`B`);

--
-- Chỉ mục cho bảng `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `ban_an`
--
ALTER TABLE `ban_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `binh_luan_blog`
--
ALTER TABLE `binh_luan_blog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_dat_ban`
--
ALTER TABLE `chi_tiet_dat_ban`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cong_thuc`
--
ALTER TABLE `cong_thuc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `danh_muc_blog`
--
ALTER TABLE `danh_muc_blog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `danh_muc_san_pham`
--
ALTER TABLE `danh_muc_san_pham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `dat_ban`
--
ALTER TABLE `dat_ban`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `hang_thanh_vien`
--
ALTER TABLE `hang_thanh_vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `media_files`
--
ALTER TABLE `media_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `nguyen_lieu`
--
ALTER TABLE `nguyen_lieu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `nha_cung_cap`
--
ALTER TABLE `nha_cung_cap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `phuong_thuc_thanh_toan`
--
ALTER TABLE `phuong_thuc_thanh_toan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `quyen`
--
ALTER TABLE `quyen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT cho bảng `thay_doi_mon_an`
--
ALTER TABLE `thay_doi_mon_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `the_thanh_vien`
--
ALTER TABLE `the_thanh_vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `vai_tro`
--
ALTER TABLE `vai_tro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `vai_tro_quyen`
--
ALTER TABLE `vai_tro_quyen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_nguoi_dung_id_fkey` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_baiviet_danhmucblog` FOREIGN KEY (`danh_muc_blog_id`) REFERENCES `danh_muc_blog` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_baiviet_media` FOREIGN KEY (`anh_bia_id`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `ban_an`
--
ALTER TABLE `ban_an`
  ADD CONSTRAINT `fk_banan_anh` FOREIGN KEY (`anh_ban_id`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_banan_video` FOREIGN KEY (`video_ban_id`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `binh_luan_blog`
--
ALTER TABLE `binh_luan_blog`
  ADD CONSTRAINT `fk_binhluan_baiviet` FOREIGN KEY (`bai_viet_id`) REFERENCES `bai_viet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_binhluan_nguoidung` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chi_tiet_dat_ban`
--
ALTER TABLE `chi_tiet_dat_ban`
  ADD CONSTRAINT `fk_chitietdatban_datban` FOREIGN KEY (`dat_ban_id`) REFERENCES `dat_ban` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chitietdatban_sanpham` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chi_tiet_phieu_nhap`
--
ALTER TABLE `chi_tiet_phieu_nhap`
  ADD CONSTRAINT `chi_tiet_phieu_nhap_nguyen_lieu_id_fkey` FOREIGN KEY (`nguyen_lieu_id`) REFERENCES `nguyen_lieu` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `chi_tiet_phieu_nhap_phieu_nhap_id_fkey` FOREIGN KEY (`phieu_nhap_id`) REFERENCES `phieu_nhap` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `cong_thuc`
--
ALTER TABLE `cong_thuc`
  ADD CONSTRAINT `cong_thuc_nguyen_lieu_id_fkey` FOREIGN KEY (`nguyen_lieu_id`) REFERENCES `nguyen_lieu` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cong_thuc_san_pham_id_fkey` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `dat_ban`
--
ALTER TABLE `dat_ban`
  ADD CONSTRAINT `fk_datban_khachhang` FOREIGN KEY (`khach_hang_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_datban_khuyenmai` FOREIGN KEY (`khuyen_mai_id`) REFERENCES `khuyen_mai` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD CONSTRAINT `fk_nguoidung_media` FOREIGN KEY (`anh_dai_dien_id`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nguoidung_vaitro` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phieu_nhap`
--
ALTER TABLE `phieu_nhap`
  ADD CONSTRAINT `phieu_nhap_nguoi_nhap_id_fkey` FOREIGN KEY (`nguoi_nhap_id`) REFERENCES `nguoi_dung` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `phieu_nhap_nha_cung_cap_id_fkey` FOREIGN KEY (`nha_cung_cap_id`) REFERENCES `nha_cung_cap` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phuong_thuc_thanh_toan`
--
ALTER TABLE `phuong_thuc_thanh_toan`
  ADD CONSTRAINT `fk_thanhtoan_datban` FOREIGN KEY (`dat_ban_id`) REFERENCES `dat_ban` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_thanhtoan_nguoidung` FOREIGN KEY (`nguoi_thanh_toan_id`) REFERENCES `nguoi_dung` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `fk_sanpham_danhmuc` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc_san_pham` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sanpham_media` FOREIGN KEY (`hinh_anh_id`) REFERENCES `media_files` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `thay_doi_mon_an`
--
ALTER TABLE `thay_doi_mon_an`
  ADD CONSTRAINT `fk_thaydoi_datban` FOREIGN KEY (`dat_ban_id`) REFERENCES `dat_ban` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_thaydoi_sanpham` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `the_thanh_vien`
--
ALTER TABLE `the_thanh_vien`
  ADD CONSTRAINT `fk_thethanhvien_hang` FOREIGN KEY (`hang_thanh_vien_id`) REFERENCES `hang_thanh_vien` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_thethanhvien_khachhang` FOREIGN KEY (`khach_hang_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `vai_tro_quyen`
--
ALTER TABLE `vai_tro_quyen`
  ADD CONSTRAINT `fk_vaitroquyen_quyen` FOREIGN KEY (`quyen_id`) REFERENCES `quyen` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vaitroquyen_vaitro` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `_ban_antodat_ban`
--
ALTER TABLE `_ban_antodat_ban`
  ADD CONSTRAINT `_ban_anTodat_ban_A_fkey` FOREIGN KEY (`A`) REFERENCES `ban_an` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_ban_anTodat_ban_B_fkey` FOREIGN KEY (`B`) REFERENCES `dat_ban` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
