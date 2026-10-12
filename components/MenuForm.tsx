"use client";

import { SubmitEvent, useState } from "react";
import MenuCard from "./MenuCard";
import {
  Tag,
  FileText,
  DollarSign,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
} from "lucide-react";

interface MenuFormProps {
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
  };
  onSuccess?: () => void;
}

export default function MenuForm({ initialData, onSuccess }: MenuFormProps) {
  const isEdit = Boolean(initialData?._id);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ? initialData.price.toString() : "",
    category: initialData?.category || "Pizza",
    image: initialData?.image || "",
    available: initialData?.available ?? true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        isEdit ? `/api/menu/${initialData?._id}` : "/api/menu",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save menu item");
        return;
      }

      onSuccess?.();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Temporary item object for live preview
  const previewItem = {
    _id: initialData?._id || "preview-id",
    name: form.name.trim() || "Artisanal Recipe Name",
    description:
      form.description.trim() ||
      "A tantalizing blend of fresh ingredients, slowly roasted to perfection and seasoned with heritage herbs.",
    price: Number(form.price) > 0 ? Number(form.price) : 16.5,
    category: form.category || "Pizza",
    image: form.image,
    available: form.available,
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Form Fields: 7 Columns */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Dish Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Dish Name
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Truffle Sourdough Margherita"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-3 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                required
              />
            </div>
          </div>

          {/* Category & Price in one row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Category
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full appearance-none rounded-2xl border border-stone-200 bg-stone-50/60 py-3 pl-10 pr-8 text-sm text-stone-800 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 cursor-pointer"
                  required
                >
                  <option value="Pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Price (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="14.99"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-3 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Description
            </label>
            <div className="relative">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the ingredients, preparation method, and flavors..."
                rows={4}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 p-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Image URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-3 pl-10 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-stone-400">
              Leave blank to automatically use our high-resolution category photography.
            </p>
          </div>

          {/* Availability Toggle Switch */}
          <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4">
            <div>
              <p className="text-sm font-bold text-stone-800">
                Item Availability
              </p>
              <p className="text-xs text-stone-500">
                When active, customers can order this dish from the menu.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={form.available}
              onClick={() => setForm({ ...form, available: !form.available })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                form.available ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  form.available ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition-all hover:from-orange-700 hover:to-amber-700 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving recipe...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{isEdit ? "Update Menu Item" : "Publish to Menu"}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Live Card Preview: 5 Columns */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
            <Eye className="h-4 w-4" />
            <span>Real-time Card Preview</span>
          </div>

          <p className="text-xs text-stone-500">
            This is exactly how guests will see this item on the live public menu.
          </p>

          <MenuCard item={previewItem} />
        </div>
      </div>
    </div>
  );
}