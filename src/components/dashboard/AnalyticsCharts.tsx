"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface AnalyticsChartsProps {
    data: {
        date: string;
        orders: number;
        revenue: number;
    }[];
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
    // Format date to short day name if needed, but YYYY-MM-DD is fine for XAxis logic

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg shadow-lg">
                    <p className="font-medium mb-2">{label}</p>
                    <div className="text-sm">
                        <span className="text-blue-500">Orders:</span> {payload[0].value}
                    </div>
                    <div className="text-sm">
                        <span className="text-emerald-500">Revenue:</span> {payload[1].value.toFixed(2)} TND
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm mt-8">
            <h3 className="text-lg font-bold mb-6 text-neutral-800 dark:text-neutral-200">Weekly Performance</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", { weekday: 'short' });
                            }}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="orders" name="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
