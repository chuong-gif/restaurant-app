import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import app from "./app";

// 🌱 Load biến môi trường từ file .env vào process.env
dotenv.config();

// 💾 Khởi tạo Prisma Client để kết nối với database
const prisma = new PrismaClient();

// ⚙️ Đặt port cho server (ưu tiên .env, nếu không thì mặc định 3307)
const PORT = process.env.PORT || 3307;

// 🧠 Hàm async tự chạy để khởi động server
(async () => {
    try {
        // 🔌 Kết nối tới database
        await prisma.$connect();
        console.log("✅ Connected to database");

        // 🚀 Khởi chạy server Express
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        // ❌ Nếu kết nối database thất bại
        console.error("❌ Database connection failed:", err);
        process.exit(1); // 🔚 Dừng tiến trình server
    }
})();

// 🛑 Xử lý khi server bị tắt (ví dụ: Ctrl + C)
process.on("SIGINT", async () => {
    await prisma.$disconnect(); // 🔒 Đóng kết nối database an toàn
    console.log("🛑 Database connection closed");
    process.exit(0); // ⛔ Kết thúc tiến trình
});
