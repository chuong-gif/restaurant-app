/** @type {import('next').NextConfig} */
const nextConfig = {
  // === THÊM KHỐI NÀY VÀO ===
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '**', // Cho phép tất cả các đường dẫn ảnh từ host này
      },
    ],
  },
  // ==========================
};

module.exports = nextConfig;

// HOẶC nếu bạn đang dùng ES Modules (file là next.config.mjs)
// export default nextConfig;