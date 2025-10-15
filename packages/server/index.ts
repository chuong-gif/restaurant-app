import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import app from "./src/app";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3307;

(async () => {
    try {
        await prisma.$connect();
        console.log("✅ Connected to database");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
})();

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("🛑 Database connection closed");
    process.exit(0);
});
