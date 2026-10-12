"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  UtensilsCrossed,
  ArrowLeft,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  Burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
  Pasta: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=400&q=80",
  Drinks: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
  Dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80",
};

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";

export default function DashboardMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchItems() {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this menu item?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((current) => current.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setDeletingId(null);
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb & Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 transition hover:text-stone-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-800">Menu Inventory</span>
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Menu Management
          </h1>
          <p className="text-xs text-stone-500 sm:text-sm">
            Configure dishes, update prices, and control availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/menu/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-xs font-semibold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Item</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dish name or category..."
            className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-2.5 pl-10 pr-4 text-xs text-stone-800 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 sm:text-sm"
          />
        </div>

        <div className="text-xs font-medium text-stone-500">
          Showing <span className="font-bold text-stone-900">{filteredItems.length}</span>{" "}
          items
        </div>
      </div>

      {/* Main Content: Table or Loading */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="mt-4 text-sm font-medium text-stone-500">
            Loading menu records...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-stone-900">
            No menu items found
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-stone-500 sm:text-sm">
            {searchQuery
              ? "No items match your search term. Try a different query."
              : "Your menu is currently empty. Add your very first culinary item to get started."}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/menu/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Item</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {filteredItems.map((item) => {
                  const fallback =
                    CATEGORY_FALLBACK_IMAGES[item.category] || DEFAULT_IMG;
                  const thumbnail =
                    item.image && item.image.trim() !== "" ? item.image : fallback;

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-stone-50/60"
                    >
                      {/* Name & Thumb */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumbnail}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{item.name}</p>
                            <p className="text-xs text-stone-500 line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-stone-900">
                        ${item.price.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {item.available ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Sold Out
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/menu/edit/${item._id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 shadow-xs"
                            title="Edit Item"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 shadow-xs disabled:opacity-50"
                            title="Delete Item"
                          >
                            {deletingId === item._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}