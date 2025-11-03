'use client';
import React from 'react';
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

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const truncateName = (name: string, maxLength: number) => {
        return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-dark text-light shadow-sm">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/logo.png" alt="EnViSi Logo" width={40} height={40} />
                    <span className="font-secondary text-2xl text-primary">EnViSi</span>
                </Link>

                {/* Navigation */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink active={pathname === '/'} className={navigationMenuTriggerStyle() + " bg-transparent text-light hover:text-primary focus:text-primary"}>
                                    Trang chủ
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/menu" legacyBehavior passHref>
                                <NavigationMenuLink active={pathname === '/menu'} className={navigationMenuTriggerStyle() + " bg-transparent text-light hover:text-primary focus:text-primary"}>
                                    Thực đơn
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/service" legacyBehavior passHref>
                                <NavigationMenuLink active={pathname === '/service'} className={navigationMenuTriggerStyle() + " bg-transparent text-light hover:text-primary focus:text-primary"}>
                                    Dịch vụ
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/blog" legacyBehavior passHref>
                                <NavigationMenuLink active={pathname === '/blog'} className={navigationMenuTriggerStyle() + " bg-transparent text-light hover:text-primary focus:text-primary"}>
                                    Tin tức
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        {/* Thêm Dropdown "Khác" nếu cần */}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Actions (Booking & Auth) */}
                <div className="flex items-center gap-3">
                    <Button asChild className="hidden sm:flex" style={{ color: 'black' }}>
                        <Link href="/booking">Đặt bàn</Link>
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-9 w-9 cursor-pointer border border-primary">
                                    <AvatarImage src={user.anh_dai_dien_url || ''} alt={user.ho_ten} />
                                    <AvatarFallback className="bg-primary text-black">
                                        {user.ho_ten.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>{truncateName(user.ho_ten, 20)}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/account">Tài khoản</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-bookings">Đơn đặt bàn</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="outline" asChild className="text-light hover:text-dark">
                            <Link href="/login">
                                <i className="fa-solid fa-user me-2"></i>
                                Đăng nhập
                            </Link>
                        </Button>
                    )}
                    {/* Nút menu mobile (sẽ thêm sau) */}
                </div>
            </div>
        </header>
    );
}