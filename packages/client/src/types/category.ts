// packages/client/src/types/category.ts

// Dựa trên schema.prisma và productCategory.service.ts
export type ProductCategory = {
    id: number;
    ten_danh_muc: string;
    trang_thai: boolean;
};

// Dựa trên productCategory.controller.ts 
export type CategoriesApiResponse = {
    message: string;
    data: ProductCategory[];
};