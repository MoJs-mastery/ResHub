"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Package,
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  ShoppingBag,
  Search,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

interface Order {
  _id: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

type OrderStatus = Order["status"];

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_CONFIG: Record<
  OrderStatus,
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (pendingDeleteId && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!pendingDeleteId && dialog?.open) {
      dialog.close();
    }
  }, [pendingDeleteId]);

  async function fetchOrders() {
    setLoading(true);
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

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete() {
    if (!pendingDeleteId) return;
    const orderId = pendingDeleteId;
    setDeletingId(orderId);
    setDeleteError("");
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setPendingDeleteId(null);
      } else {
        const data = await res.json();
        setDeleteError(data.message || "Failed to delete this order. Please try again.");
      }
    } catch {
      setDeleteError("Could not reach the server. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, filterStatus]);

  // Summary counts
  const summary = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    STATUS_OPTIONS.forEach(({ value }) => {
      counts[value] = orders.filter((o) => o.status === value).length;
    });
    return counts;
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-stone-900 transition">
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-800">Orders</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Customer Orders
          </h1>
          <p className="text-xs text-stone-500 sm:text-sm">
            View, update status, and manage all incoming orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs font-semibold text-stone-700 shadow-xs transition hover:bg-stone-50 active:scale-95 self-start sm:self-center"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Summary Counts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "All", value: "all", count: summary.all },
          ...STATUS_OPTIONS.map((s) => ({
            label: STATUS_CONFIG[s.value].label,
            value: s.value,
            count: summary[s.value] || 0,
          })),
        ].map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setFilterStatus(s.value as "all" | OrderStatus)}
            className={`rounded-2xl border p-4 text-left transition hover:shadow-md ${
              filterStatus === s.value
                ? "border-orange-300 bg-orange-50 shadow-sm"
                : "border-stone-200/80 bg-white shadow-xs"
            }`}
          >
            <p
              className={`text-2xl font-extrabold ${
                filterStatus === s.value ? "text-orange-600" : "text-stone-900"
              }`}
            >
              {s.count}
            </p>
            <p className="text-xs font-medium text-stone-500 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, order ID or dish..."
            className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-3 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-stone-200/80 bg-white shadow-xs">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            <p className="text-sm text-stone-500">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/80 bg-white p-16 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-stone-900">No orders found</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
            {searchQuery || filterStatus !== "all"
              ? "No orders match your current filters."
              : "No customer orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = STATUS_CONFIG[order.status];
            const date = new Date(order.createdAt).toLocaleString();

            return (
              <div
                key={order._id}
                className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 text-sm font-bold">
                      {order.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{order.userName}</p>
                      <p className="text-xs text-stone-500">{order.userEmail}</p>
                      <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                        #{order._id.slice(-8).toUpperCase()} · {date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setDeleteError("");
                        setPendingDeleteId(order._id);
                      }}
                      disabled={deletingId === order._id}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Delete order"
                    >
                      {deletingId === order._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-stone-100 rounded-2xl border border-stone-100 overflow-hidden mb-5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-3 bg-stone-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 rounded-lg px-2 py-0.5">
                          ×{item.quantity}
                        </span>
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

                {/* Status Changer & Total */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Update Status:
                    </label>
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value as OrderStatus)
                        }
                        disabled={updatingId === order._id}
                        className="appearance-none rounded-xl border border-stone-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-stone-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      {updatingId === order._id && (
                        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-orange-600" />
                      )}

                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-stone-400 uppercase tracking-wide">Order Total</p>
                    <p className="text-xl font-extrabold text-orange-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic border-t border-stone-100 pt-3">
                    Customer note: {order.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pendingDeleteId && (
        <dialog
          ref={deleteDialogRef}
          onCancel={(event) => {
            if (deletingId) {
              event.preventDefault();
              return;
            }
            setPendingDeleteId(null);
            setDeleteError("");
          }}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl backdrop:bg-stone-950/60 backdrop:backdrop-blur-sm sm:p-7"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 id="delete-order-title" className="mt-5 text-xl font-bold text-stone-900">
            Delete this order?
          </h2>
          <p id="delete-order-description" className="mt-2 text-sm leading-relaxed text-stone-600">
            This permanently removes the order and its details. This action cannot be undone.
          </p>
          {deleteError && (
            <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {deleteError}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={Boolean(deletingId)}
              onClick={() => {
                setPendingDeleteId(null);
                setDeleteError("");
              }}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Keep order
            </button>
            <button
              type="button"
              disabled={Boolean(deletingId)}
              onClick={() => void handleDelete()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {deletingId ? "Deleting..." : "Delete order"}
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
