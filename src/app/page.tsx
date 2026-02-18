import Link from "next/link";
import { MoveRight, Package, Plus, Truck, TrendingUp, Calendar, History, ArrowUpRight } from "lucide-react";
import { getStats } from "./actions";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { KPICards } from "@/components/dashboard/KPICards";

export const dynamic = 'force-dynamic';

interface StatCardProps {
  title: string;
  value: number;
  subValue?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  colorClass: string;
  bgClass: string;
}

function StatCard({ title, value, subValue, icon: Icon, colorClass, bgClass }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${bgClass}`}>
          <Icon className={colorClass} size={20} />
        </div>
        {subValue && (
          <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
            {subValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Welcome back to your overview.
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-sm font-medium text-neutral-500 bg-white dark:bg-neutral-900 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center">
          <Calendar size={14} className="mr-2 text-emerald-500" />
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Today"
          value={stats.today.count}
          subValue={`${stats.today.revenue.toFixed(2)} TND`}
          icon={Calendar}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
          colorClass="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Yesterday"
          value={stats.yesterday.count}
          subValue={`${stats.yesterday.revenue.toFixed(2)} TND`}
          icon={History}
          bgClass="bg-purple-50 dark:bg-purple-900/20"
          colorClass="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="This Week"
          value={stats.week.count}
          subValue={`${stats.week.revenue.toFixed(2)} TND`}
          icon={TrendingUp}
          bgClass="bg-emerald-50 dark:bg-emerald-900/20"
          colorClass="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="This Month"
          value={stats.month.count}
          subValue={`${stats.month.revenue.toFixed(2)} TND`}
          icon={Package}
          bgClass="bg-orange-50 dark:bg-orange-900/20"
          colorClass="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          title="All Time"
          value={stats.total.count}
          subValue={`${stats.total.revenue.toFixed(2)} TND`}
          icon={ArrowUpRight}
          bgClass="bg-indigo-50 dark:bg-indigo-900/20"
          colorClass="text-indigo-600 dark:text-indigo-400"
        />
      </div>



      {/* COD KPIs */}
      <h2 className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-200">Business Performance</h2>
      <KPICards data={stats.cod} />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AnalyticsCharts data={stats.chartData} />
        </div>
        <div className="lg:col-span-1">
          <RecentOrders orders={stats.recentOrders || []} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/add-order" className="group p-6 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all flex flex-col items-center justify-center text-center">
          <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full group-hover:scale-110 transition-transform">
            <Plus className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <h3 className="font-bold text-neutral-900 dark:text-white">New Order</h3>
          <p className="text-sm text-neutral-500 mt-1">Create a shipment</p>
        </Link>


        <Link href="/orders" className="group p-6 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center text-center">
          <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full group-hover:scale-110 transition-transform">
            <History className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <h3 className="font-bold text-neutral-900 dark:text-white">History</h3>
          <p className="text-sm text-neutral-500 mt-1">View all orders</p>
        </Link>
      </div>
    </div >
  );
}
