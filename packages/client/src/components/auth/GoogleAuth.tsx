// GoogleAuth.tsx
'use client';
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useSocialLogin } from '@/hooks/useSocialLogin';

const GOOGLE_CLIENT_ID = '951595549566-p3mihmpipb7go6loejm0hfq7t55chr5r.apps.googleusercontent.com';

export default function GoogleAuth() {
    const socialLoginMutation = useSocialLogin();

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="w-full">
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        if (credentialResponse.credential) {
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
                            socialLoginMutation.mutate({
                                email: profile.email,
                                fullname: profile.name,
                                avatar: profile.picture,
                            });
                        }
                    }}
                    onError={() => {
                        socialLoginMutation.error;
                    }}
                    shape="rectangular"
                    size="large"
                    theme="filled_black"
                    text="continue_with"
                    logo_alignment="left"
                    width="100%"
                />
            </div>
        </GoogleOAuthProvider>
    );
}