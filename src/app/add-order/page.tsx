"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2, Printer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GOVERNORATES, createOrder, type OrderResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AddOrderPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<OrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isExchange, setIsExchange] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        const formData = new FormData(event.currentTarget);

        // Explicitly handle exchange logic for checkbox
        if (isExchange) {
            formData.append("echange", "on");
        } else {
            formData.delete("echange");
        }

        try {
            // Dynamically import server action to avoid client-side bundling issues if any
            // (Standard approach in Next.js 14+ is usually direct import, but let's be safe with previous error context)
            const { createOrderAction } = await import("../actions");
            const result = await createOrderAction(formData);

            if (result.success && result.data) {
                setResponse({
                    status: 1,
                    code_tracking: result.data.tracking,
                    lien: result.data.link,
                    status_message: "Order created successfully"
                });
            } else {
                setError(result.message || "Erreur lors de la création de la commande.");
            }
        } catch (err) {
            console.error(err);
            setError("Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    }

    // If successfully created, show success view
    if (response?.status === 1) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 flex items-center justify-center">
                <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Order Created!</h2>
                    <p className="text-neutral-500 mb-6">Tracking Code: <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{response.code_tracking}</span></p>

                    <div className="flex flex-col gap-3">
                        {response.lien && (
                            <a href={response.lien} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full" variant="emerald">
                                    <Printer className="mr-2" size={16} /> Print Waybill (BL)
                                </Button>
                            </a>
                        )}
                        <Button variant="outline" onClick={() => {
                            setResponse(null);
                            // Optional: reset form if needed, or just let them add another
                            window.location.reload();
                        }}>
                            Create Another Order
                        </Button>
                        <Link href="/">
                            <Button variant="ghost" className="w-full">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center">
                    <Link href="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mr-4">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">New Shipment</h1>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <form onSubmit={onSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-md flex items-center">
                                    <AlertCircle size={20} className="mr-2" />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Receiver Info */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-lg font-semibold border-b pb-2">Receiver Information</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nom">Full Name *</Label>
                                    <Input id="nom" name="nom" required placeholder="John Doe" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tel">PhoneNumber *</Label>
                                    <Input id="tel" name="tel" required placeholder="22334455" type="tel" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tel2">Secondary Phone</Label>
                                    <Input id="tel2" name="tel2" placeholder="Optional" type="tel" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gouvernerat">Governorate *</Label>
                                    <select
                                        id="gouvernerat"
                                        name="gouvernerat"
                                        required
                                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-emerald-800 transition-all"
                                    >
                                        <option value="">Select Governorate</option>
                                        {GOVERNORATES.map(gov => (
                                            <option key={gov} value={gov}>{gov}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ville">City/Delegation *</Label>
                                    <Input id="ville" name="ville" required placeholder="L'aouina" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cp">Postal Code *</Label>
                                    <Input id="cp" name="cp" required placeholder="1002" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="adresse">Full Address *</Label>
                                    <Input id="adresse" name="adresse" required placeholder="07, rue de ...." />
                                </div>

                                {/* Package Info */}
                                <div className="space-y-4 md:col-span-2 mt-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Package Details</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="designation">Items Description *</Label>
                                    <Input id="designation" name="designation" required placeholder="Pantalon, Chemise..." />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="prix">COD Amount (TND) *</Label>
                                    <Input id="prix" name="prix" required placeholder="50.6" type="number" step="0.1" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nb_article">Number of Items *</Label>
                                    <Input id="nb_article" name="nb_article" required defaultValue={1} type="number" min="1" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="msg">Delivery Note</Label>
                                    <Textarea id="msg" name="msg" placeholder="à livrer le mardi svp..." />
                                </div>

                                {/* Exchange Logic */}
                                <div className="space-y-4 md:col-span-2 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="echange"
                                            checked={isExchange}
                                            onChange={(e) => setIsExchange(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <Label htmlFor="echange" className="font-semibold text-neutral-900 dark:text-neutral-100">This is an Exchange Order</Label>
                                    </div>

                                    {isExchange && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="article">Items to Exchange *</Label>
                                                <Input id="article" name="article" required={isExchange} placeholder="Old Item Description" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="nb_echange">Exchange Quantity *</Label>
                                                <Input id="nb_echange" name="nb_echange" type="number" required={isExchange} defaultValue={1} min="1" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="pt-6 border-t flex justify-end">
                                <Button type="submit" size="lg" className="w-full md:w-auto font-semibold" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                                        </>
                                    ) : (
                                        "Create Order"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
