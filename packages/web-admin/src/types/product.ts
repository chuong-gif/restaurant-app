// src/types/product.ts
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
    categoryId?: number;
    createdAt?: string;
    updatedAt?: string;
}
