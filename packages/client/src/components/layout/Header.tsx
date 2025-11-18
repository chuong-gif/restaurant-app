// Header.tsx - THÊM SHEET TITLE
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet"; // THÊM SheetTitle

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const truncateName = (name: string, maxLength: number) => {
        return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    };

    const navLinkClass = "bg-transparent text-cyan-100 hover:text-cyan-400 focus:text-cyan-400 data-[active]:text-cyan-400 data-[active]:bg-cyan-500/10 data-[active]:border-b-2 data-[active]:border-cyan-400";

    const navItems = [
        { href: '/', label: 'Trang Chủ' },
        { href: '/menu', label: 'Thực Đơn' },
        { href: '/service', label: 'Dịch Vụ' },
        { href: '/blog', label: 'Tin Tức & Mẹo Vặt' },
        { href: '/about', label: 'Về Chúng Tôi' },
        { href: '/contact', label: 'Liên Hệ' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-cyan-500/30 bg-[#0a0a0f]/90 backdrop-blur-xl text-cyan-100 shadow-2xl shadow-cyan-500/10">
            {/* Animated scanning line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 animate-pulse"></div>

            <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
                {/* Logo với Mobile Menu Button */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button - HIỆN TRÊN MOBILE */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-cyan-100 hover:text-cyan-400 hover:bg-cyan-500/10"
                            >
                                <i className="fa fa-bars text-xl"></i>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-[#0a0a0f] border-r border-cyan-500/30 w-80">
                            {/* THÊM SHEET TITLE ẨN ĐỂ FIX LỖI ACCESSIBILITY */}
                            <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>

                            <div className="flex flex-col h-full">
                                {/* Logo trong mobile menu */}
                                <div className="flex items-center gap-3 p-4 border-b border-cyan-500/30">
                                    <Image
                                        src="/images/logo.png"
                                        alt="EnViSi Logo"
                                        width={40}
                                        height={40}
                                        className="filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                                    />
                                    <span className="font-mono text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        ENVISI
                                    </span>
                                </div>

                                {/* Navigation Items */}
                                <nav className="flex-1 p-4 space-y-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "block px-4 py-3 rounded-lg font-mono text-sm tracking-wider transition-all duration-300",
                                                pathname === item.href
                                                    ? "text-cyan-400 bg-cyan-500/10 border-l-4 border-cyan-400"
                                                    : "text-cyan-100 hover:text-cyan-400 hover:bg-cyan-500/10"
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Booking Button trong mobile menu */}
                                <div className="p-4 border-t border-cyan-500/30">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono text-sm tracking-wider"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Link href="/booking">Đặt Bàn Ngay</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                            <Image
                                src="/images/logo.png"
                                alt="EnViSi Logo"
                                width={45}
                                height={45}
                                className="relative z-10 filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                            />
                        </div>
                        <span className="font-mono text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all">
                            ENVISI
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation - ẨN TRÊN MOBILE */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-1">
                        {navItems.slice(0, 4).map((item) => (
                            <NavigationMenuItem key={item.href}>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            navLinkClass,
                                            "font-mono text-sm tracking-wider hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                                        )}
                                        data-active={pathname === item.href}
                                    >
                                        {item.label}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Desktop Dropdown Menu - ẨN TRÊN MOBILE */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                navLinkClass,
                                "hidden lg:inline-flex font-mono text-sm tracking-wider hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20 border border-cyan-500/30 rounded-lg transition-all duration-300"
                            )}
                        >
                            Khác <i className="fa fa-chevron-down ml-2 h-3 w-3 text-xs"></i>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#0a0a0f] border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
                        {navItems.slice(4).map((item) => (
                            <DropdownMenuItem key={item.href} asChild className="font-mono text-cyan-100 hover:text-cyan-400 hover:bg-cyan-500/10 focus:bg-cyan-500/10 focus:text-cyan-400">
                                <Link href={item.href}>{item.label}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Actions (Booking & Auth) */}
                <div className="flex items-center gap-4">
                    {/* Booking Button - ẨN TRÊN MOBILE NHỎ */}
                    <Button asChild className="hidden sm:flex bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 font-mono text-sm tracking-wider transition-all duration-300">
                        <Link href="/booking">Đặt Bàn Ngay</Link>
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="relative cursor-pointer group">
                                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
                                    <Avatar className="h-10 w-10 cursor-pointer border-2 border-cyan-400/50 relative z-10 group-hover:border-cyan-400 group-hover:scale-110 transition-all">
                                        <AvatarImage src={(user.media_files as any)?.file_url || ''} alt={user.ho_ten} />
                                        <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-purple-400 text-[#0a0a0f] font-bold">
                                            {user.ho_ten.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Online indicator */}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#0a0a0f] z-20 shadow-lg shadow-cyan-400/50"></div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#0a0a0f] border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 w-64">
                                <DropdownMenuLabel className="font-mono text-cyan-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        Người Dùng: {truncateName(user.ho_ten, 15)}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-cyan-500/30" />
                                <DropdownMenuItem asChild className="font-mono text-cyan-100 hover:text-cyan-400 hover:bg-cyan-500/10 focus:bg-cyan-500/10 focus:text-cyan-400">
                                    <Link href="/account">Tài Khoản</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="font-mono text-cyan-100 hover:text-cyan-400 hover:bg-cyan-500/10 focus:bg-cyan-500/10 focus:text-cyan-400">
                                    <Link href="/my-bookings">Lịch Sử Đặt Bàn</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-cyan-500/30" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
                                >
                                    Đăng Xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="outline"
                            asChild
                            className="text-cyan-100 border-cyan-500/50 hover:text-[#0a0a0f] hover:bg-cyan-400 font-mono text-sm tracking-wider transition-all duration-300"
                        >
                            <Link href="/login">
                                <i className="fa-solid fa-terminal me-2 text-xs"></i>
                                Đăng Nhập
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}