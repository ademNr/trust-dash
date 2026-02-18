import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Printer, Truck, Calendar, MapPin, User, Package, FileText } from "lucide-react";
import { getOrderById } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: { id: string };
}

export default async function OrderDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    const statusColor =
        order.status === 'Pending' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' :
            order.status === 'Delivered' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' :
                'text-neutral-600 bg-neutral-100 dark:bg-neutral-800';

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/orders" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mr-4">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-3">
                                Order Details
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                    {order.status}
                                </span>
                            </h1>
                            <span className="text-sm text-neutral-500 font-mono mt-1">{order.code_tracking || "No Tracking Code"}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {order.lien_bl && (
                            <a href={order.lien_bl} target="_blank" rel="noopener noreferrer">
                                <Button variant="emerald" size="sm">
                                    <Printer size={16} className="mr-2" /> Print BL
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <User size={20} className="mr-2 text-emerald-500" /> Receiver Information
                            </h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                <div>
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">Full Name</dt>
                                    <dd className="font-medium">{order.nom}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">Phone</dt>
                                    <dd className="font-medium">{order.tel}</dd>
                                </div>
                                {order.tel2 && (
                                    <div>
                                        <dt className="text-sm text-neutral-500 dark:text-neutral-400">Secondary Phone</dt>
                                        <dd className="font-medium">{order.tel2}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">Address</dt>
                                    <dd className="font-medium">{order.adresse}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">City / Gov</dt>
                                    <dd className="font-medium">{order.ville}, {order.gouvernerat}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">Postal Code</dt>
                                    <dd className="font-medium">{order.cp}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <Package size={20} className="mr-2 text-emerald-500" /> Package Details
                            </h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">Items Description</dt>
                                    <dd className="font-medium">{order.designation}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">Item Count</dt>
                                    <dd className="font-medium">{order.nb_article}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-neutral-500 dark:text-neutral-400">Price (COD)</dt>
                                    <dd className="font-bold text-emerald-600">{order.prix.toFixed(2)} TND</dd>
                                </div>
                                {order.msg && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm text-neutral-500 dark:text-neutral-400">Delivery Note</dt>
                                        <dd className="text-sm bg-neutral-50 dark:bg-neutral-800 p-3 rounded-md mt-1">{order.msg}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <FileText size={20} className="mr-2 text-emerald-500" /> Order Info
                            </h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-neutral-500">Created At</span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-neutral-500">Last Update</span>
                                    <span className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-neutral-500">Exchange</span>
                                    <span className="font-medium">{order.echange ? "Yes" : "No"}</span>
                                </li>
                                {order.echange === 1 && (
                                    <>
                                        <li className="flex justify-between pl-4 border-l-2 border-emerald-100 dark:border-emerald-900">
                                            <span className="text-neutral-500">Exchange Item</span>
                                            <span className="font-medium">{order.article}</span>
                                        </li>
                                        <li className="flex justify-between pl-4 border-l-2 border-emerald-100 dark:border-emerald-900">
                                            <span className="text-neutral-500">Qty</span>
                                            <span className="font-medium">{order.nb_echange}</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
