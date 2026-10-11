"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export const  DashboardMenuPage=()=> {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    const response = await fetch("/api/menu");
    const data = await response.json();

    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setItems((current) =>
        current.filter((item) => item._id !== id)
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Dashboard / Menu
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Menu Items
          </h1>
        </div>

        <Link
          href="/dashboard/menu/create"
          className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white"
        >
          + Add Menu Item
        </Link>
      </div>

      {loading ? (
        <div className="mt-10 text-gray-500">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white p-10 text-center">
          <p className="text-gray-500">
            No menu items found.
          </p>

          <Link
            href="/dashboard/menu/create"
            className="mt-4 inline-block font-semibold text-orange-600"
          >
            Create your first menu item
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-hidden rounded-2xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="px-6 py-4">
                      {item.category}
                    </td>

                    <td className="px-6 py-4">
                      ${item.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      {item.available ? (
                        <span className="text-green-600">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Unavailable
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link
                          href={`/dashboard/menu/edit/${item._id}`}
                          className="font-medium text-blue-600"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          className="font-medium text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}