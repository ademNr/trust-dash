"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecentOrdersProps {
    orders: {
        id: string;
        nom: string;
        status: string;
        prix: number;
        createdAt: string;
        code_tracking?: string;
    }[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Recent Orders</h3>
                <Link
                    href="/orders"
                    className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center"
                >
                    View All <ArrowUpRight size={14} className="ml-1" />
                </Link>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50">
                        <tr>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                                    <div className="flex flex-col">
                                        <span>{order.nom}</span>
                                        <span className="text-xs text-neutral-500 font-normal">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={order.status === "Delivered" || order.status === "Payée" ? "default" : "secondary"}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right font-medium">
                                    {order.prix.toFixed(2)} TND
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-neutral-500">
                                    No recent orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
