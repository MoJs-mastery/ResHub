"use client";

import { useRouter } from "next/navigation";

import MenuForm from "@/components/MenuForm";

export const  CreateMenuPage=()=> {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm text-gray-500">
          Dashboard / Menu / Create
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Create Menu Item
        </h1>
      </div>

      <MenuForm
        onSuccess={() =>
          router.push("/dashboard/menu")
        }
      />
    </div>
  );
}