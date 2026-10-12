"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Loader2,
  ArrowRight,
  Package,
} from "lucide-react";

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  preparing: {
    label: "Preparing",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: <ChefHat className="h-3.5 w-3.5" />,
  },
  ready: {
    label: "Ready",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: <Package className="h-3.5 w-3.5" />,
  },
  completed: {
    label: "Completed",
    bg: "bg-stone-100",
    text: "text-stone-600",
    border: "border-stone-200",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-sm text-stone-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <Link href="/menu" className="hover:text-stone-800 transition">
            Menu
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-800">My Orders</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Track the status of your food orders in real time.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-16 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-stone-900">No orders yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
            You haven't placed any orders. Head to the menu to discover delicious dishes.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <span>Browse Menu</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const statusInfo = STATUS_CONFIG[order.status];
            const date = new Date(order.createdAt).toLocaleString();

            return (
              <div
                key={order._id}
                className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs font-mono text-stone-400">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">{date}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-xs font-bold">
                          ×{item.quantity}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-400">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                  {order.notes ? (
                    <p className="text-xs text-stone-500 italic max-w-xs">
                      Note: {order.notes}
                    </p>
                  ) : (
                    <span />
                  )}
                  <div className="text-right">
                    <p className="text-xs text-stone-400 uppercase tracking-wide">
                      Total
                    </p>
                    <p className="text-lg font-extrabold text-orange-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
