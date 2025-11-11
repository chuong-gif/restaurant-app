// FacebookAuth.tsx
'use client';
import React from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { useSocialLogin } from '@/hooks/useSocialLogin';
import Image from 'next/image';

const FACEBOOK_APP_ID = "410687418510018";

function FacebookAuth() {
    const socialLoginMutation = useSocialLogin();

    return (
        <LoginSocialFacebook
            appId={FACEBOOK_APP_ID}
            fields="name,email,picture"
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
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-3 px-4 rounded-lg border border-blue-400/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30 transition-all duration-300 flex items-center justify-center gap-3 group">
                <div className="relative">
                    <Image src="/images/facebook.png" alt="Facebook Logo" width={24} height={24} className="filter brightness-0 invert" />
                    <div className="absolute -inset-1 bg-blue-400/20 blur-sm group-hover:bg-blue-400/30 rounded-full transition-all"></div>
                </div>
                <span className="font-mono font-bold text-sm">FACEBOOK AUTH</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </button>
        </LoginSocialFacebook>
    );
}
export default FacebookAuth;