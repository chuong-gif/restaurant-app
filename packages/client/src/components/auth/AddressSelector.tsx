'use client';
import React from 'react';
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

// Hàm trợ giúp để phân tích địa chỉ
const parseAddress = (fullAddress: string) => {
    const parts = fullAddress.split(',').map(s => s.trim());
    return {
        street: parts.slice(0, -3).join(', ').trim(),
        ward: parts[parts.length - 3] || '',
        district: parts[parts.length - 2] || '',
        province: parts[parts.length - 1] || '',
    };
};

export default function AddressSelector({ value, onChange }: AddressSelectorProps) {
    const [internal, setInternal] = React.useState(parseAddress(value));

    const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();

    // Tìm code từ tên
    const selectedProvinceCode = React.useMemo(() => {
        return provinces?.find(p => p.name === internal.province)?.code.toString();
    }, [provinces, internal.province]);

    const { data: districts, isLoading: isLoadingDistricts } = useDistricts(selectedProvinceCode || '');

    const selectedDistrictCode = React.useMemo(() => {
        return districts?.find(d => d.name === internal.district)?.code.toString();
    }, [districts, internal.district]);

    const { data: wards, isLoading: isLoadingWards } = useWards(selectedDistrictCode || '');

    // Khi bất kỳ phần nào của địa chỉ thay đổi, cập nhật `fullAddress`
    React.useEffect(() => {
        const { street, ward, district, province } = internal;
        const fullAddress = [street, ward, district, province]
            .filter(Boolean)
            .join(", ")
            .trim();
        onChange(fullAddress);
    }, [internal, onChange]);

    const handleSelectChange = (type: 'province' | 'district' | 'ward', value: string) => {
        const newInternal = { ...internal, street: internal.street }; // Đảm bảo street được giữ lại

        if (type === 'province') {
            const provinceName = provinces?.find(p => p.code.toString() === value)?.name || '';
            newInternal.province = provinceName;
            newInternal.district = '';
            newInternal.ward = '';
        }
        if (type === 'district') {
            const districtName = districts?.find(d => d.code.toString() === value)?.name || '';
            newInternal.district = districtName;
            newInternal.ward = '';
        }
        if (type === 'ward') {
            const wardName = wards?.find(w => w.code.toString() === value)?.name || '';
            newInternal.ward = wardName;
        }
        setInternal(newInternal);
    };

    const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternal(prev => ({ ...prev, street: e.target.value }));
    };

    return (
        <div className="space-y-3">
            <Select
                value={selectedProvinceCode || ""}
                onValueChange={(value) => handleSelectChange('province', value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                </SelectTrigger>
                <SelectContent>
                    {isLoadingProvinces && <SelectItem value="loading" disabled>Đang tải...</SelectItem>}
                    {provinces?.map(p => (
                        <SelectItem key={p.code} value={p.code.toString()}>{p.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedDistrictCode || ""}
                onValueChange={(value) => handleSelectChange('district', value)}
                disabled={!selectedProvinceCode || isLoadingDistricts}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Chọn Quận/Huyện" />
                </SelectTrigger>
                <SelectContent>
                    {isLoadingDistricts && <SelectItem value="loading" disabled>Đang tải...</SelectItem>}
                    {districts?.map(d => (
                        <SelectItem key={d.code} value={d.code.toString()}>{d.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={wards?.find(w => w.name === internal.ward)?.code.toString() || ""}
                onValueChange={(value) => handleSelectChange('ward', value)}
                disabled={!selectedDistrictCode || isLoadingWards}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Chọn Phường/Xã" />
                </SelectTrigger>
                <SelectContent>
                    {isLoadingWards && <SelectItem value="loading" disabled>Đang tải...</SelectItem>}
                    {wards?.map(w => (
                        <SelectItem key={w.code} value={w.code.toString()}>{w.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                placeholder="Số nhà, tên đường"
                value={internal.street}
                onChange={handleStreetChange}
            />
        </div>
    );
}