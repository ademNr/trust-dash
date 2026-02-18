"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteOrderAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderActionsProps {
    id: string;
}

export function OrderActions({ id }: OrderActionsProps) {
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

        setIsDeleting(true);
        startTransition(async () => {
            await deleteOrderAction(id);
            setIsDeleting(false);
            // Optional: router.refresh() handled by revalidatePath, but safe to add if needed
        });
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Link href={`/orders/${id}`}>
                <Button variant="ghost" size="sm" title="View Details">
                    <Eye size={16} className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200" />
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isPending || isDeleting}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                title="Delete Order"
            >
                {isPending || isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Trash2 size={16} />
                )}
            </Button>
        </div>
    );
}
