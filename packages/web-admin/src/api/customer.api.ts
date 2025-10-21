import api from "@/Utils/Http";
import type { Customer } from "@/types/customer"; // ✅ thêm "type" ở đây
import axiosInstance from "./axiosInstance";


export const fetchCustomers = async (): Promise<Customer[]> => {
    const res = await api.get("/customers");
    return res.data;
};

export const getAllCustomers = async (): Promise<Customer[]> => {
    const response = await axiosInstance.get("/customers");
    return response.data;
};