'use client';
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useSocialLogin } from '@/hooks/useSocialLogin';
import Image from 'next/image';

// Lấy từ file GoogleAuth.js 
const GOOGLE_CLIENT_ID = '951595549566-p3mihmpipb7go6loejm0hfq7t55chr5r.apps.googleusercontent.com';

export default function GoogleAuth() {
    const socialLoginMutation = useSocialLogin();

    return (
        // Phải bọc trong Provider
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                        // Giải mã JWT (một cách đơn giản, không an toàn bằng server)
                        // Tốt hơn là gửi thẳng token này lên server để xác thực
                        const base64Url = credentialResponse.credential.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64)
                                .split('')
                                .map(function (c) {
                                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                                })
                                .join('')
                        );

                        const profile = JSON.parse(jsonPayload);

                        // Gọi mutation
                        socialLoginMutation.mutate({
                            email: profile.email,
                            fullname: profile.name,
                            avatar: profile.picture,
                        });
                    }
                }}
                onError={() => {
                    socialLoginMutation.error; // Kích hoạt lỗi (dù hook đã xử lý)
                }}
                shape="rectangular"
                size="medium"
                theme="outline"
                text="continue_with"
                logo_alignment="left"
            />
        </GoogleOAuthProvider>
    );
}