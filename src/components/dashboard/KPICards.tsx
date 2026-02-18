"use client";

import { CheckCircle2, DollarSign, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface KPICardsProps {
    data: {
        successRate: number;
        collected: number;
        collectedCount: number;
        pending: number;
        pendingCount: number;
        lost: number;
        lostCount: number;
    }
}

export function KPICards({ data }: KPICardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Success Rate Card */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={100} className="text-emerald-500" />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full">
                            Rate
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Success Rate</p>
                        <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{data.successRate.toFixed(1)}%</h3>
                    </div>
                </div>
                <div className="mt-4">
                    <Progress value={data.successRate} className="h-2 bg-neutral-100 dark:bg-neutral-800" />
                    <p className="text-xs text-neutral-400 mt-2 font-medium">Based on delivery vs returns</p>
                </div>
            </div>

            {/* Collected Revenue */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Collected Cash</p>
                        <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{data.collected.toFixed(2)} <span className="text-sm font-semibold text-neutral-400">TND</span></h3>
                    </div>
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <DollarSign size={20} />
                    </div>
                </div>
                <div className="mt-2 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Orders</span>
                    <span className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold px-3 py-1 rounded-full">
                        {data.collectedCount}
                    </span>
                </div>
            </div>

            {/* Pending Revenue */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Pending Cash</p>
                        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">{data.pending.toFixed(2)} <span className="text-sm font-semibold text-neutral-400">TND</span></h3>
                    </div>
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="mt-2 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Orders</span>
                    <span className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold px-3 py-1 rounded-full">
                        {data.pendingCount}
                    </span>
                </div>
            </div>

            {/* Lost Revenue */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Lost Revenue</p>
                        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 tracking-tight">{data.lost.toFixed(2)} <span className="text-sm font-semibold text-neutral-400">TND</span></h3>
                    </div>
                    <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                        <AlertCircle size={20} />
                    </div>
                </div>
                <div className="mt-2 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Returns</span>
                    <span className="bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-bold px-3 py-1 rounded-full">
                        {data.lostCount}
                    </span>
                </div>
            </div>
        </div>
    );
}
