import React from 'react';

// Dùng forwardRef để react-to-print lấy được DOM
const InvoiceComponent = React.forwardRef<HTMLDivElement, { reservation: any, cart: any[] }>(({ reservation, cart }, ref) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const date = new Date().toLocaleString('vi-VN');

    return (
        <div ref={ref} className="p-4 bg-white text-black" style={{ width: '80mm', fontSize: '12px', fontFamily: 'monospace' }}>
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold uppercase mb-1">Nhà Hàng Hương Sen</h1>
                <p>ĐC: 123 Phường Trái Đất</p>
                <p>Hotline: 0123.456.789</p>
            </div>

            <div className="border-b-2 border-dashed border-black my-2"></div>

            <div className="mb-2">
                <p><strong>Phiếu thanh toán</strong></p>
                <p>Mã đơn: {reservation?.ma_dat_ban}</p>
                <p>Bàn: {reservation?.ban_an?.[0]?.so_ban}</p>
                <p>Ngày: {date}</p>
                <p>Thu ngân: Admin</p>
            </div>

            <div className="border-b border-black my-2"></div>

            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="w-5/12">Tên</th>
                        <th className="w-2/12 text-center">SL</th>
                        <th className="w-5/12 text-right">TT</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, idx) => (
                        <tr key={idx}>
                            <td className="truncate pr-1">{item.name}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right">{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="border-b border-black my-2"></div>

            <div className="flex justify-between font-bold text-base mt-2">
                <span>TỔNG CỘNG:</span>
                <span>{total.toLocaleString()} đ</span>
            </div>

            <div className="text-center mt-6 italic">
                <p>Cảm ơn quý khách & Hẹn gặp lại!</p>
                <p>Wifi: HuongSen / Pass: 12345678</p>
            </div>
        </div>
    );
});

export default InvoiceComponent;