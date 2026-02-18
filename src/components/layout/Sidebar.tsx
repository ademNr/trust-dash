"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    Package,
    Truck,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/add-order", label: "New Order", icon: PlusCircle },
    { href: "/orders", label: "Orders", icon: Package },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-neutral-900 rounded-md shadow-md border border-neutral-200 dark:border-neutral-800"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col p-6">
                    {/* Logo */}
                    <div className="mb-8 px-2">
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            Trust
                        </h1>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Delivery</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group",
                                        isActive
                                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200"
                                    )}
                                >
                                    <Icon size={20} className={cn("mr-3", isActive ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
