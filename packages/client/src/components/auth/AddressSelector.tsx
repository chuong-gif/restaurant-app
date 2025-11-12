// AddressSelector.tsx
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
    const [street, setStreet] = useState(parseAddress(value).street);
    const [selectedProvinceName, setSelectedProvinceName] = useState(parseAddress(value).province);
    const [selectedDistrictName, setSelectedDistrictName] = useState(parseAddress(value).district);
    const [selectedWardName, setSelectedWardName] = useState(parseAddress(value).ward);

    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | undefined>();
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | undefined>();

    const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
    const { data: districts, isLoading: isLoadingDistricts } = useDistricts(selectedProvinceCode || '');
    const { data: wards, isLoading: isLoadingWards } = useWards(selectedDistrictCode || '');

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

    useEffect(() => {
        const fullAddress = [street, selectedWardName, selectedDistrictName, selectedProvinceName]
            .filter(Boolean)
            .join(", ")
            .trim();
        onChange(fullAddress);
    }, [street, selectedWardName, selectedDistrictName, selectedProvinceName, onChange]);

    const handleProvinceChange = (code: string) => {
        const province = provinces?.find(p => p.code.toString() === code);
        setSelectedProvinceCode(code);
        setSelectedProvinceName(province?.name || '');
        setSelectedDistrictCode(undefined);
        setSelectedDistrictName('');
        setSelectedWardName('');
    };

    const handleDistrictChange = (code: string) => {
        const district = districts?.find(d => d.code.toString() === code);
        setSelectedDistrictCode(code);
        setSelectedDistrictName(district?.name || '');
        setSelectedWardName('');
    };

    const handleWardChange = (code: string) => {
        const ward = wards?.find(w => w.name === selectedWardName)?.code.toString();
        setSelectedWardName(ward || '');
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-cyan-300 font-mono text-sm">Hệ tọa độ</label>
                <Select
                    value={selectedProvinceCode}
                    onValueChange={handleProvinceChange}
                >
                    <SelectTrigger className="bg-[#0a0a0f]/60 border border-cyan-500/30 text-cyan-100 backdrop-blur-lg hover:border-cyan-400/50 transition-all duration-300">
                        <SelectValue placeholder="🛸 Select Primary Sector" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-[#0a0a0f] border border-cyan-500/30 text-cyan-100">
                        {isLoadingProvinces && <SelectItem value="loading" disabled>🌀 Scanning sectors...</SelectItem>}
                        {provinces?.map(p => (
                            <SelectItem key={p.code} value={p.code.toString()} className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-cyan-300 font-mono text-sm">LƯỚI QUẬN</label>
                <Select
                    value={selectedDistrictCode}
                    onValueChange={handleDistrictChange}
                    disabled={!selectedProvinceCode || isLoadingDistricts || districts?.length === 0}
                >
                    <SelectTrigger className="bg-[#0a0a0f]/60 border border-cyan-500/30 text-cyan-100 backdrop-blur-lg hover:border-cyan-400/50 transition-all duration-300">
                        <SelectValue placeholder="📡 Select District Zone" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-[#0a0a0f] border border-cyan-500/30 text-cyan-100">
                        {isLoadingDistricts && <SelectItem value="loading" disabled>⚡ Loading grid data...</SelectItem>}
                        {districts?.map(d => (
                            <SelectItem key={d.code} value={d.code.toString()} className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">
                                {d.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-cyan-300 font-mono text-sm">LƯỚI PHƯỜNG</label>
                <Select
                    value={wards?.find(w => w.name === selectedWardName)?.code.toString()}
                    onValueChange={handleWardChange}
                    disabled={!selectedDistrictCode || isLoadingWards || wards?.length === 0}
                >
                    <SelectTrigger className="bg-[#0a0a0f]/60 border border-cyan-500/30 text-cyan-100 backdrop-blur-lg hover:border-cyan-400/50 transition-all duration-300">
                        <SelectValue placeholder="📍 Select Ward Sector" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-[#0a0a0f] border border-cyan-500/30 text-cyan-100">
                        {isLoadingWards && <SelectItem value="loading" disabled>🔍 Mapping coordinates...</SelectItem>}
                        {wards?.map(w => (
                            <SelectItem key={w.code} value={w.code.toString()} className="hover:bg-cyan-500/20 focus:bg-cyan-500/20">
                                {w.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-cyan-300 font-mono text-sm">TỌA ĐỘ ĐƯỜNG PHỐ</label>
                <Input
                    placeholder="Enter street coordinates..."
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="bg-[#0a0a0f]/60 border border-cyan-500/30 text-cyan-100 placeholder-cyan-300/50 backdrop-blur-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                />
            </div>

            <div className="pt-2 border-t border-cyan-500/20">
                <p className="text-cyan-400/60 text-xs font-mono">📍 Vị trí đã được đồng bộ</p>
            </div>
        </div>
    );
}