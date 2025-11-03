'use client';
import React, { useState, useEffect } from 'react';
import { useProvinces, useDistricts, useWards } from '@/lib/location';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

type AddressSelectorProps = {
    value: string; // fullAddress
    onChange: (fullAddress: string) => void;
};

// Hàm phân tích địa chỉ
const parseAddress = (fullAddress: string) => {
    const parts = fullAddress.split(',').map(s => s.trim());
    return {
        street: parts.slice(0, -3).join(', ').trim() || '',
        ward: parts[parts.length - 3] || '',
        district: parts[parts.length - 2] || '',
        province: parts[parts.length - 1] || '',
    };
};

export default function AddressSelector({ value, onChange }: AddressSelectorProps) {
    // Tách state cho Tên và Code
    const [street, setStreet] = useState(parseAddress(value).street);
    const [selectedProvinceName, setSelectedProvinceName] = useState(parseAddress(value).province);
    const [selectedDistrictName, setSelectedDistrictName] = useState(parseAddress(value).district);
    const [selectedWardName, setSelectedWardName] = useState(parseAddress(value).ward);

    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | undefined>();
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | undefined>();

    // Tải dữ liệu
    const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
    const { data: districts, isLoading: isLoadingDistricts } = useDistricts(selectedProvinceCode || '');
    const { data: wards, isLoading: isLoadingWards } = useWards(selectedDistrictCode || '');

    // Effect để tìm code khi Tên thay đổi (dùng cho việc load `initialAddress` trên trang Account)
    useEffect(() => {
        if (provinces && selectedProvinceName && !selectedProvinceCode) {
            const p = provinces.find(p => p.name === selectedProvinceName);
            if (p) setSelectedProvinceCode(p.code.toString());
        }
    }, [provinces, selectedProvinceName, selectedProvinceCode]);

    useEffect(() => {
        if (districts && selectedDistrictName && !selectedDistrictCode) {
            const d = districts.find(d => d.name === selectedDistrictName);
            if (d) setSelectedDistrictCode(d.code.toString());
        }
    }, [districts, selectedDistrictName, selectedDistrictCode]);

    // Effect để cập nhật output `fullAddress` khi bất kỳ phần nào thay đổi
    useEffect(() => {
        const fullAddress = [street, selectedWardName, selectedDistrictName, selectedProvinceName]
            .filter(Boolean) // Loại bỏ các giá trị rỗng
            .join(", ")
            .trim();
        onChange(fullAddress);
    }, [street, selectedWardName, selectedDistrictName, selectedProvinceName, onChange]);

    // Xử lý khi chọn Tỉnh
    const handleProvinceChange = (code: string) => {
        const province = provinces?.find(p => p.code.toString() === code);
        setSelectedProvinceCode(code);
        setSelectedProvinceName(province?.name || '');
        // Reset quận/huyện/phường
        setSelectedDistrictCode(undefined);
        setSelectedDistrictName('');
        setSelectedWardName('');
    };

    // Xử lý khi chọn Quận
    const handleDistrictChange = (code: string) => {
        const district = districts?.find(d => d.code.toString() === code);
        setSelectedDistrictCode(code);
        setSelectedDistrictName(district?.name || '');
        // Reset phường
        setSelectedWardName('');
    };

    // Xử lý khi chọn Phường
    const handleWardChange = (code: string) => {
        const ward = wards?.find(w => w.code.toString() === code);
        setSelectedWardName(ward?.name || '');
    };

    return (
        <div className="space-y-3">
            <Select
                value={selectedProvinceCode}
                onValueChange={handleProvinceChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                </SelectTrigger>
                {/* === THÊM `position="popper"` VÀO ĐÂY === */}
                <SelectContent position="popper">
                    {isLoadingProvinces && <SelectItem value="loading" disabled>Đang tải...</SelectItem>}
                    {provinces?.map(p => (
                        <SelectItem key={p.code} value={p.code.toString()}>{p.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedDistrictCode}
                onValueChange={handleDistrictChange}
                disabled={!selectedProvinceCode || isLoadingDistricts || districts?.length === 0}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Chọn Quận/Huyện" />
                </SelectTrigger>
                {/* === THÊM `position="popper"` VÀO ĐÂY === */}
                <SelectContent position="popper">
                    {isLoadingDistricts && <SelectItem value="loading" disabled>Đang tải...</SelectItem>}
                    {districts?.map(d => (
                        <SelectItem key={d.code} value={d.code.toString()}>{d.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={wards?.find(w => w.name === selectedWardName)?.code.toString()}
                onValueChange={handleWardChange}
                disabled={!selectedDistrictCode || isLoadingWards || wards?.length === 0}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Chọn Phường/Xã" />
                </SelectTrigger>
                {/* === THÊM `position="popper"` VÀO ĐÂY === */}
                <SelectContent position="popper">
                    {isLoadingWards && <SelectItem value="loading" disabled>Đang tải...</SelectItem>}
                    {wards?.map(w => (
                        <SelectItem key={w.code} value={w.code.toString()}>{w.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                placeholder="Số nhà, tên đường"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
            />
        </div>
    );
}