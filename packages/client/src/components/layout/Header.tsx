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
import { cn } from '@/lib/utils'; // Import hàm 'cn'

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

    // Định nghĩa style cho NavLink
    const navLinkClass = "bg-transparent text-light hover:text-primary focus:text-primary data-[active]:text-primary";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-dark text-light shadow-sm">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/logo.jpg" alt="EnViSi Logo" width={40} height={40} />
                    <span className="font-secondary text-2xl text-primary">EnViSi</span>
                </Link>

                {/* === SỬA LỖI `<a> in <a>` BẰNG `asChild` === */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            {/* Dùng `asChild` và đặt `Link` BÊN TRONG */}
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/"
                                    className={cn(navigationMenuTriggerStyle(), navLinkClass)}
                                    data-active={pathname === '/'}
                                >
                                    Trang chủ
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/menu"
                                    className={cn(navigationMenuTriggerStyle(), navLinkClass)}
                                    data-active={pathname === '/menu'}
                                >
                                    Thực đơn
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/service"
                                    className={cn(navigationMenuTriggerStyle(), navLinkClass)}
                                    data-active={pathname === '/service'}
                                >
                                    Dịch vụ
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/blog"
                                    className={cn(navigationMenuTriggerStyle(), navLinkClass)}
                                    data-active={pathname === '/blog'}
                                >
                                    Tin tức
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                {/* =================================== */}

                {/* Actions (Booking & Auth) */}
                <div className="flex items-center gap-3">
                    <Button asChild className="hidden sm:flex" style={{ color: 'black' }}>
                        <Link href="/booking">Đặt bàn</Link>
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-9 w-9 cursor-pointer border border-primary">
                                    <AvatarImage src={(user.media_files as any)?.file_url || ''} alt={user.ho_ten} />
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
                </div>
            </div>
        </header>
    );
}