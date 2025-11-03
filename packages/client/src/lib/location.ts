import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = "https://provinces.open-api.vn/api"; // [cite: 3]

// --- Định nghĩa kiểu dữ liệu ---
type Province = {
    name: string;
    code: number;
};
type District = {
    name: string;
    code: number;
};
type Ward = {
    name: string;
    code: number;
};

// --- Các hàm Fetch ---
const fetchProvinces = async (): Promise<Province[]> => {
    const response = await fetch(`${API_BASE_URL}/p/`); // [cite: 5-7]
    if (!response.ok) throw new Error("Failed to fetch provinces");
    return response.json(); // [cite: 8]
};

const fetchDistricts = async (provinceCode: string): Promise<District[]> => {
    if (!provinceCode) return [];
    const response = await fetch(`${API_BASE_URL}/p/${provinceCode}?depth=2`); // [cite: 14-16]
    if (!response.ok) throw new Error("Failed to fetch districts");
    const data = await response.json();
    return data.districts; // [cite: 18]
};

const fetchWards = async (districtCode: string): Promise<Ward[]> => {
    if (!districtCode) return [];
    const response = await fetch(`${API_BASE_URL}/d/${districtCode}?depth=2`); // [cite: 24-26]
    if (!response.ok) throw new Error("Failed to fetch wards");
    const data = await response.json();
    return data.wards; // [cite: 28]
};

// --- Các React Query Hooks ---
export const useProvinces = () => {
    return useQuery({
        queryKey: ['provinces'],
        queryFn: fetchProvinces,
        staleTime: Infinity, // Dữ liệu tỉnh/thành hiếm khi thay đổi
    });
};

export const useDistricts = (provinceCode: string) => {
    return useQuery({
        queryKey: ['districts', provinceCode],
        queryFn: () => fetchDistricts(provinceCode),
        staleTime: Infinity,
        enabled: !!provinceCode, // Chỉ chạy khi provinceCode tồn tại
    });
};

export const useWards = (districtCode: string) => {
    return useQuery({
        queryKey: ['wards', districtCode],
        queryFn: () => fetchWards(districtCode),
        staleTime: Infinity,
        enabled: !!districtCode, // Chỉ chạy khi districtCode tồn tại
    });
};