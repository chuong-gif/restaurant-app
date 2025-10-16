// 📁 packages/server/src/app.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
// ⚙️ Sẽ tạo sau - file tổng hợp tất cả route API
import apiRoutes from './routes/index';

const app: Application = express();                             // 🚀 Khởi tạo ứng dụng Express

// 🧩 Middleware cấu hình cho server
app.use(cors());                                                // 🌍 Cho phép truy cập từ domain khác (Cross-Origin)
app.use(express.json());                                        // 📦 Cho phép server đọc dữ liệu JSON trong request body
app.use(express.urlencoded({ extended: true }));                // 🧾 Hỗ trợ parse dữ liệu form URL-encoded

// ❤️ Health check route (kiểm tra server có hoạt động không)
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Server is healthy!');                 // ✅ Trả phản hồi khi server ok
});

// 🔗 Kết nối route API chính (được định nghĩa trong ./routes/index)
app.use('/api/v1', apiRoutes);                                  // 🌐 Tất cả endpoint sẽ bắt đầu bằng /api/v1/...

export default app;                                             // 📤 Xuất app để dùng trong file server chính (vd: server.ts)
