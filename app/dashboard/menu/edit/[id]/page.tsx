"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import MenuForm from "@/components/MenuForm";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export const EditMenuPage=()=> {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      const response = await fetch(`/api/menu/${id}`);

      if (!response.ok) {
        router.push("/dashboard/menu");
        return;
      }

      const data = await response.json();

      setItem(data);
      setLoading(false);
    }

    loadItem();
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        Menu item not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm text-gray-500">
          Dashboard / Menu / Edit
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Edit Menu Item
        </h1>
      </div>

      <MenuForm
        initialData={item}
        onSuccess={() =>
          router.push("/dashboard/menu")
        }
      />
    </div>
  );
}