"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface PlaceOrderFormProps {
  items: MenuItem[];
}

export default function PlaceOrderForm({ items }: PlaceOrderFormProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const selectedItems = items.filter((item) => (quantities[item._id] || 0) > 0);
  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * quantities[item._id],
    0
  );

  function changeQuantity(id: string, amount: number) {
    setQuantities((current) => {
      const next = (current[id] || 0) + amount;
      const updated = { ...current };
      if (next <= 0) delete updated[id];
      else updated[id] = Math.min(next, 99);
      return updated;
    });
  }

  async function placeOrder() {
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems.map((item) => ({
            menuItemId: item._id,
            quantity: quantities[item._id],
          })),
          notes,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not place your order. Please try again.");
        return;
      }

      setPlaced(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-stone-900">Order placed!</h1>
        <p className="mt-2 text-stone-600">Your order is on its way to the kitchen.</p>
        <Link
          href="/orders"
          className="mt-7 inline-flex items-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Track your order
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-orange-600">FRESH FROM OUR KITCHEN</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          Place your order
        </h1>
        <p className="mt-2 text-stone-600">Choose your dishes and quantities below.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-stone-400" />
          <h2 className="mt-4 text-xl font-bold text-stone-900">No dishes available right now</h2>
          <p className="mt-2 text-sm text-stone-500">Please check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-3" aria-label="Available dishes">
            {items.map((item) => {
              const quantity = quantities[item._id] || 0;
              return (
                <article
                  key={item._id}
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-stone-900">{item.name}</h2>
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">{item.description}</p>
                    <p className="mt-2 font-bold text-orange-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item._id, -1)}
                      disabled={quantity === 0 || submitting}
                      aria-label={`Remove one ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-700 transition hover:bg-stone-50 disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-6 text-center font-semibold tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item._id, 1)}
                      disabled={quantity >= 99 || submitting}
                      aria-label={`Add one ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white transition hover:bg-orange-700 disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-stone-900">Your order</h2>
            {selectedItems.length === 0 ? (
              <p className="mt-4 text-sm text-stone-500">Choose dishes to get started.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {selectedItems.map((item) => (
                  <li key={item._id} className="flex justify-between gap-3 text-sm">
                    <span className="text-stone-600">
                      {quantities[item._id]} × {item.name}
                    </span>
                    <span className="font-semibold text-stone-900">
                      ${(item.price * quantities[item._id]).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <label className="mt-5 block text-sm font-semibold text-stone-700" htmlFor="order-notes">
              Notes for the kitchen
            </label>
            <textarea
              id="order-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Allergies or special requests"
              disabled={submitting}
              className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-800 outline-none transition focus:border-orange-500 focus:bg-white"
            />
            {error && (
              <p role="alert" className="mt-4 flex gap-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
              <span className="font-semibold text-stone-700">Total</span>
              <span className="text-xl font-extrabold text-orange-600">${total.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={placeOrder}
              disabled={selectedItems.length === 0 || submitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
