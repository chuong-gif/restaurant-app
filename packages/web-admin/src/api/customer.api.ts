import api from "@/Utils/Http";
import type { Customer } from "@/types/customer"; // ✅ thêm "type" ở đây

export const fetchCustomers = async (): Promise<Customer[]> => {
    const res = await api.get("/customers");
    return res.data;
};
