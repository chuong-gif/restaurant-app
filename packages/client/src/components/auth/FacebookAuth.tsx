'use client';
import React from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { useSocialLogin } from '@/hooks/useSocialLogin';
import Image from 'next/image';

// Lấy từ file FacebookAuth.js 
const FACEBOOK_APP_ID = "410687418510018";

function FacebookAuth() {
    const socialLoginMutation = useSocialLogin();

    return (
        <LoginSocialFacebook
            appId={FACEBOOK_APP_ID}
            fields="name,email,picture" // [cite: 84]
            onResolve={(response: any) => {
                const { name, email, picture } = response.data;
                socialLoginMutation.mutate({
                    fullname: name,
                    email: email,
                    avatar: picture?.data?.url,
                });
            }}
            onReject={(error: any) => {
                console.error('Đăng nhập Facebook thất bại:', error);
            }}
        >
            {/* Tái tạo lại button từ file cũ [cite: 87-90] */}
            <button className="btn btn-light btn-sm mx-2 d-flex justify-content-center align-items-center shadow-sm">
                {/* Bạn cần đặt logo fb vào /public/images/facebook.png */}
                <Image src="/images/facebook.png" alt="Facebook Logo" width={20} height={20} />
                <span className="mx-2">Facebook</span>
            </button>
        </LoginSocialFacebook>
    );
}
export default FacebookAuth;