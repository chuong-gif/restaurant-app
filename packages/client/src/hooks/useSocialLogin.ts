import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api, { AUTH_ENDPOINTS } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from "@/hooks/use-toast"; // Dùng shadcn/ui
import { AuthResponse } from '@/types/user';
import { AxiosError } from 'axios';

type SocialLoginData = {
    email: string;
    fullname: string;
    avatar?: string;
};

export const useSocialLogin = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { setUserToken } = useAuthStore();

    const mutation = useMutation<AuthResponse, AxiosError<{ message: string }>, SocialLoginData>({
        mutationFn: (data) => {
            // Gọi API server của bạn
            return api.post(AUTH_ENDPOINTS.SOCIAL_LOGIN, data).then(res => res.data);
        },
        onSuccess: (data) => {
            // Lưu vào Zustand
            setUserToken(data.user, data.accessToken);
            // Chuyển hướng
            router.push('/');
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Đăng nhập thất bại",
                description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
            });
        },
    });

    return mutation;
};