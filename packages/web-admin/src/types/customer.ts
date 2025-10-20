// src/types/customer.ts
export interface Customer {
    id: number;
    fullname: string;
    email?: string;
    phone?: string;
    createdAt?: string;
    // thêm trường khác nếu cần
}
