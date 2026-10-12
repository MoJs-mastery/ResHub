"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import MenuForm from "@/components/MenuForm";

export default function CreateMenuPage() {
  const router = useRouter();

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
          <span className="font-semibold text-stone-800">Add Item</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Create Menu Item
          </h1>
          <Sparkles className="h-5 w-5 text-orange-600" />
        </div>
        <p className="text-xs text-stone-500 sm:text-sm">
          Add a new handcrafted dish with custom pricing and live preview.
        </p>
      </div>

      <MenuForm onSuccess={() => router.push("/dashboard/menu")} />
    </div>
  );
}