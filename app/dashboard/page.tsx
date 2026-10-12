import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import Order from "@/models/Order";
import {
  UtensilsCrossed,
  PlusCircle,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowUpRight,
  ClipboardList,
  DollarSign,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | ResHub",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  await connectDB();
  const totalItems = await MenuItem.countDocuments();
  const availableItems = await MenuItem.countDocuments({ available: true });
  const categoriesCount = (await MenuItem.distinct("category")).length;
  const [orderTotals] = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: null,
        total: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
  ]);
  const totalOrderValue = orderTotals?.total || 0;
  const activeOrderCount = orderTotals?.count || 0;

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 font-bold text-white text-xl shadow-md shadow-orange-600/20">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-800">
                Administrator
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Session
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
              Welcome back, {session?.user?.name || "Admin"}
            </h1>
            <p className="text-xs text-stone-500 sm:text-sm">
              Manage your kitchen inventory, menu cards, and culinary offerings.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/menu/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-xs font-semibold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Menu Item</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Metric 1 */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Menu Items
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-stone-900">
            {totalItems}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {availableItems} active & available
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Active Categories
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-stone-900">
            {categoriesCount || 5}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Pizzas, burgers, pastas, & more
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Kitchen Status
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-emerald-700">
            Operational
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Ovens preheated to 900°F
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Admin Account
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-lg font-bold text-stone-900 truncate">
            {session?.user?.email}
          </p>
          <p className="mt-1 text-xs text-orange-600 font-semibold uppercase tracking-wide">
            Full Privileges
          </p>
        </div>

        {/* Order Revenue */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Order Value
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-stone-900">
            ${totalOrderValue.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Across {activeOrderCount} non-cancelled {activeOrderCount === 1 ? "order" : "orders"}
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/dashboard/menu"
          className="group flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xs transition hover:border-orange-300 hover:shadow-xl"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-transform group-hover:scale-110">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
              Menu Item Inventory
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              Review current dishes, modify pricing, change availability status, or
              remove discontinued meals from the public menu.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-orange-600">
            <span>Open menu manager</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/menu/create"
          className="group flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xs transition hover:border-orange-300 hover:shadow-xl"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition-transform group-hover:scale-110">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
              Create New Recipe
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              Launch a brand-new seasonal pizza, burger, pasta, or dessert dish with
              instant image preview and live menu updates.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-orange-600">
            <span>Create new dish</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/orders"
          className="group flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xs transition hover:border-orange-300 hover:shadow-xl"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition-transform group-hover:scale-110">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-stone-900 transition-colors group-hover:text-orange-600">
              Customer Orders
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              Review incoming orders, search by customer or dish, update preparation status, and remove cancelled orders.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-orange-600">
            <span>Open order manager</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
