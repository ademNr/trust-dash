"use server";

import dbConnect from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import { createOrder as apiCreateOrder } from "@/lib/api";
import { revalidatePath } from "next/cache";

// Re-export types if needed, or define return types for actions
export interface ActionResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export async function createOrderAction(formData: FormData): Promise<ActionResponse> {
    await dbConnect();

    try {
        const rawData = {
            nom: formData.get("nom") as string,
            gouvernerat: formData.get("gouvernerat") as string,
            ville: formData.get("ville") as string,
            adresse: formData.get("adresse") as string,
            cp: formData.get("cp") as string,
            tel: formData.get("tel") as string,
            tel2: formData.get("tel2") as string,
            designation: formData.get("designation") as string,
            nb_article: Number(formData.get("nb_article")),
            msg: formData.get("msg") as string,
            prix: Number(formData.get("prix")),
            echange: formData.get("echange") === "on" ? 1 : 0,
            // Handle conditional fields
            article: formData.get("article") as string || undefined,
            nb_echange: formData.get("nb_echange") ? Number(formData.get("nb_echange")) : undefined,
            open: 0, // default
        };

        // 1. Call Trust Delivery API
        // Note: The API function expects a specific shape. We map it here.
        const apiData = {
            ...rawData,
            prix: rawData.prix.toString(),
            ouvrir: 0
        };

        // console.log("Submitting to Trust API:", apiData);

        const apiRes = await apiCreateOrder(apiData);

        if (apiRes.status !== 1) {
            return { success: false, message: apiRes.status_message || "Trust Delivery API Failed" };
        }

        // 2. Save to MongoDB
        const newOrder = new Order({
            ...rawData,
            code_tracking: apiRes.code_tracking,
            status_api: apiRes.status,
            status_message: apiRes.status_message,
            lien_bl: apiRes.lien,
            status: 'Pending' // Initial internal status
        });

        await newOrder.save();

        revalidatePath("/orders");

        return {
            success: true,
            data: {
                tracking: apiRes.code_tracking,
                link: apiRes.lien
            }
        };

    } catch (error) {
        console.error("Action Error:", error);
        return { success: false, message: "Server Error: Failed to create order." };
    }
}

export async function getOrders(query?: string, date?: string) {
    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (query) {
        // Escape special regex characters to prevent errors
        const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeQuery, 'i');
        filter.$or = [
            { nom: regex },
            { tel: regex },
            { code_tracking: regex }
        ];
    }

    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        filter.createdAt = {
            $gte: startDate,
            $lte: endDate
        };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);

    return orders.map(order => ({
        id: order._id.toString(),
        nom: order.nom,
        tel: order.tel,
        gouvernerat: order.gouvernerat,
        prix: order.prix,
        code_tracking: order.code_tracking,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        lien_bl: order.lien_bl
    }));
}

export async function getOrderById(id: string) {
    await dbConnect();
    try {
        const order = await Order.findById(id);
        if (!order) return null;

        return {
            ...order.toObject(),
            _id: order._id.toString(),
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
        };
    } catch (error) {
        return null;
    }
}

export async function deleteOrderAction(id: string) {
    await dbConnect();
    try {
        await Order.findByIdAndDelete(id);
        revalidatePath("/orders");
        return { success: true };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, message: "Failed to delete order" };
    }
}

export async function getStats() {
    await dbConnect();

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayStart); yesterdayEnd.setMilliseconds(-1);

    // Start of week (Monday)
    const weekStart = new Date(todayStart);
    const day = weekStart.getDay() || 7; // Get current day number, converting Sun (0) to 7
    if (day !== 1) weekStart.setHours(-24 * (day - 1));

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        totalOrders,
        todayOrders,
        yesterdayOrders,
        weekOrders,
        monthOrders,
        revenueAgg,
        codStats
    ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: todayStart } }),
        Order.countDocuments({ createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } }),
        Order.countDocuments({ createdAt: { $gte: weekStart } }),
        Order.countDocuments({ createdAt: { $gte: monthStart } }),
        Order.aggregate([
            {
                $facet: {
                    total: [{ $group: { _id: null, sum: { $sum: "$prix" } } }],
                    today: [{ $match: { createdAt: { $gte: todayStart } } }, { $group: { _id: null, sum: { $sum: "$prix" } } }],
                    yesterday: [{ $match: { createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } } }, { $group: { _id: null, sum: { $sum: "$prix" } } }],
                    week: [{ $match: { createdAt: { $gte: weekStart } } }, { $group: { _id: null, sum: { $sum: "$prix" } } }],
                    month: [{ $match: { createdAt: { $gte: monthStart } } }, { $group: { _id: null, sum: { $sum: "$prix" } } }]
                }
            }
        ]),
        // COD Specific Stats
        Order.aggregate([
            {
                $group: {
                    _id: null,
                    collected: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Delivered", "Payée"]] }, "$prix", 0]
                        }
                    },
                    pending: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Pending", "Shipped", "En cours"]] }, "$prix", 0]
                        }
                    },
                    lost: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Returned", "Cancelled", "Refused", "Retour"]] }, "$prix", 0]
                        }
                    },
                    collectedCount: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Delivered", "Payée"]] }, 1, 0]
                        }
                    },
                    pendingCount: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Pending", "Shipped", "En cours"]] }, 1, 0]
                        }
                    },
                    lostCount: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Returned", "Cancelled", "Refused", "Retour"]] }, 1, 0]
                        }
                    },
                    deliveredCount: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Delivered", "Payée"]] }, 1, 0]
                        }
                    },
                    returnedCount: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Returned", "Cancelled", "Refused", "Retour"]] }, 1, 0]
                        }
                    }
                }
            }
        ])
    ]);

    // Chart Data (Last 7 Days)
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const chartDataAgg = await Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                orders: { $sum: 1 },
                revenue: { $sum: "$prix" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Fill in missing days
    const chartData = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = chartDataAgg.find((c: any) => c._id === dateStr);
        chartData.push({
            date: dateStr,
            orders: found ? found.orders : 0,
            revenue: found ? found.revenue : 0
        });
    }

    const rev = revenueAgg[0];
    const cod = codStats[0] || { collected: 0, pending: 0, lost: 0, collectedCount: 0, pendingCount: 0, lostCount: 0, deliveredCount: 0, returnedCount: 0 };

    // Calculate Delivery Rate
    const totalFinished = cod.deliveredCount + cod.returnedCount;
    const deliveryRate = totalFinished > 0 ? (cod.deliveredCount / totalFinished) * 100 : 0;

    // Recent Orders (Limit 5)
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const formattedRecentOrders = recentOrders.map(order => ({
        id: order._id.toString(),
        nom: order.nom,
        status: order.status,
        prix: order.prix,
        createdAt: order.createdAt.toISOString(),
        code_tracking: order.code_tracking
    }));

    return {
        total: { count: totalOrders, revenue: rev.total[0]?.sum || 0 },
        today: { count: todayOrders, revenue: rev.today[0]?.sum || 0 },
        yesterday: { count: yesterdayOrders, revenue: rev.yesterday[0]?.sum || 0 },
        week: { count: weekOrders, revenue: rev.week[0]?.sum || 0 },
        month: { count: monthOrders, revenue: rev.month[0]?.sum || 0 },
        chartData,
        recentOrders: formattedRecentOrders,
        cod: {
            successRate: deliveryRate,
            collected: cod.collected,
            collectedCount: cod.collectedCount,
            pending: cod.pending,
            pendingCount: cod.pendingCount,
            lost: cod.lost,
            lostCount: cod.lostCount
        }
    };
}
