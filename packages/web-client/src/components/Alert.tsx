// packages/web-client/src/components/Alert.tsx

import React from 'react';

// Định nghĩa các kiểu Alert khác nhau
type AlertType = 'success' | 'error' | 'warning';

interface AlertProps {
    type: AlertType;
    message: string;
}

// Map các kiểu alert với class của TailwindCSS
const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
};

const Alert: React.FC<AlertProps> = ({ type, message }) => {
    if (!message) {
        return null; // Không hiển thị gì nếu không có tin nhắn
    }

    return (
        <div
            className={`border-l-4 p-4 ${alertStyles[type]}`}
            role="alert"
        >
            <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <p>{message}</p>
        </div>
    );
};

export default Alert;