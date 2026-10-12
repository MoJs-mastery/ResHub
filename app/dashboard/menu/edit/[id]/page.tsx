"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, UtensilsCrossed } from "lucide-react";
import MenuForm from "@/components/MenuForm";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export default function EditMenuPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const response = await fetch(`/api/menu/${id}`);

        if (!response.ok) {
          router.push("/dashboard/menu");
          return;
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error("Failed to load item:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadItem();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="mt-4 text-sm font-medium text-stone-500">
          Loading recipe details...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <UtensilsCrossed className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-stone-900">
          Menu item not found
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
          The requested menu dish does not exist or may have been removed.
        </p>
        <Link
          href="/dashboard/menu"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Back breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Link
            href="/dashboard/menu"
            className="flex items-center gap-1 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Menu List</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-800">Edit Dish</span>
        </div>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          Edit Menu Item
        </h1>
        <p className="text-xs text-stone-500 sm:text-sm">
          Modify recipe ingredients, adjust price, or update availability.
        </p>
      </div>

      <MenuForm
        initialData={item}
        onSuccess={() => router.push("/dashboard/menu")}
      />
    </div>
  );
}