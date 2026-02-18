import Link from "next/link";
import { ArrowLeft, ExternalLink, Package, Search, Calendar } from "lucide-react";
import { getOrders } from "../actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderActions } from "@/components/orders/OrderActions";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrdersPage({ searchParams }: PageProps) {
    const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
    const date = typeof searchParams.date === 'string' ? searchParams.date : undefined;

    const orders = await getOrders(query, date);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <Link href="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mr-4">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Order History</h1>
                    </div>
                    <Link href="/add-order">
                        <Button variant="emerald">New Order</Button>
                    </Link>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-4 mb-6">
                    <form className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                            <Input
                                name="query"
                                placeholder="Search by name, phone, or tracking..."
                                defaultValue={query}
                                className="pl-10"
                            />
                        </div>
                        <div className="w-full md:w-48 relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                            <Input
                                name="date"
                                type="date"
                                defaultValue={date}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit" variant="secondary">Filter</Button>
                        {(query || date) && (
                            <Link href="/orders">
                                <Button variant="ghost" type="button">Clear</Button>
                            </Link>
                        )}
                    </form>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="text-center py-16">
                            <Package className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No orders found</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                                {query || date ? "Try adjusting your filters." : "Create your first shipment to see it here."}
                            </p>
                            {!query && !date && (
                                <Link href="/add-order">
                                    <Button>Create Shipment</Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium border-b border-neutral-200 dark:border-neutral-700">
                                    <tr>
                                        <th className="px-6 py-4">Tracking Code</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Governorate</th>
                                        <th className="px-6 py-4">Price (TND)</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium">{order.code_tracking || "N/A"}</td>
                                            <td className="px-6 py-4 text-neutral-900 dark:text-neutral-100 font-medium">
                                                {order.nom}
                                                <div className="text-xs text-neutral-500 font-normal">{order.tel}</div>
                                            </td>
                                            <td className="px-6 py-4">{order.gouvernerat}</td>
                                            <td className="px-6 py-4 font-semibold">{order.prix.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={
                                                    order.status === 'Pending' ? 'secondary' :
                                                        order.status === 'Delivered' ? 'default' : // default is actually black/white, emulating emerald for 'default' in some systems but let's stick to Badge variants or custom logic
                                                            'outline'
                                                } className={
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : ''
                                                }>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.lien_bl && (
                                                        <a href={order.lien_bl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center mr-2" title="Print BL">
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    )}
                                                    <OrderActions id={order.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
