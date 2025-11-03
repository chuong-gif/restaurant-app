'use client';
import React, { useState } from 'react';

// Đây là component giữ chỗ.
// Logic thật (từ ChatPopup.js) sẽ được tái cấu trúc sau.
export default function ChatPopupPlaceholder() {
    const [isOpen, setIsOpen] = useState(false);

    if (isOpen) {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    right: '20px',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px 8px 0 0',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        background: '#FEA115',
                        color: 'black',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span>Chat với EnViSi</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'none', border: 'none', color: 'black', fontSize: '20px', cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                </div>
                <div style={{ padding: '20px', textAlign: 'center', flexGrow: 1 }}>
                    <p>Chức năng chat đang được tái cấu trúc.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsOpen(true)}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#FEA115',
                color: 'black',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px #8a8a8a',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <i className="fa fa-comments me-2"></i>
            <span>Chat với chúng tôi</span>
        </div>
    );
}