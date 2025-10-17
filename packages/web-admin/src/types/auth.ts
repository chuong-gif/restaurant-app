// packages/web-admin/src/types/auth.ts
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        fullname?: string;
        email?: string;
        role?: string;
    };
}

export interface UpdateProfilePayload {
    fullname?: string;
    email?: string;
    avatar?: string;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}
