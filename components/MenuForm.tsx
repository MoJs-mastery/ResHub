"use client";

import { SubmitEvent, useState } from "react"
interface MenuFormProps {
initialData?: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
}
onSuccess?: () => void;
}
const MenuForm=({initialData,
onSuccess,}:MenuFormProps)=>{
const isEdit = Boolean(initialData?._id);
const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    category: initialData?.category || "",
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
        isEdit
        ? `/api/menu/${initialData?._id}`
        : "/api/menu",
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
        setError(data.message || "Something went wrong");
        return;
    }

    onSuccess?.();
    } catch {
    setError("Something went wrong");
    } finally {
    setLoading(false);
    }
}
return (
    <form
    onSubmit={handleSubmit}
    className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
    >
    {error && (
        <div className="rounded-lg bg-red-50 p-3 text-red-600">
        {error}
        </div>
    )}

    <div>
        <label className="mb-2 block font-medium">
        Name
        </label>

        <input
        value={form.name}
        onChange={(e) =>
            setForm({
            ...form,
            name: e.target.value,
            })
        }
        className="w-full rounded-lg border px-4 py-3"
        required
        />
    </div>

    <div>
        <label className="mb-2 block font-medium">
        Description
        </label>

        <textarea
        value={form.description}
        onChange={(e) =>
            setForm({
            ...form,
            description: e.target.value,
            })
        }
        className="min-h-32 w-full rounded-lg border px-4 py-3"
        required
        />
    </div>

    <div>
        <label className="mb-2 block font-medium">
        Price
        </label>

        <input
        type="number"
        step="0.01"
        min="0"
        value={form.price}
        onChange={(e) =>
            setForm({
            ...form,
            price: e.target.value,
            })
        }
        className="w-full rounded-lg border px-4 py-3"
        required
        />
    </div>

    <div>
        <label className="mb-2 block font-medium">
        Category
        </label>

        <select
        value={form.category}
        onChange={(e) =>
            setForm({
            ...form,
            category: e.target.value,
            })
        }
        className="w-full rounded-lg border px-4 py-3"
        required
        >
        <option value="">Select category</option>
        <option value="Pizza">Pizza</option>
        <option value="Burger">Burger</option>
        <option value="Pasta">Pasta</option>
        <option value="Drinks">Drinks</option>
        <option value="Dessert">Dessert</option>
        </select>
    </div>

    <div>
        <label className="mb-2 block font-medium">
        Image URL
        </label>

        <input
        value={form.image}
        onChange={(e) =>
            setForm({
            ...form,
            image: e.target.value,
            })
        }
        className="w-full rounded-lg border px-4 py-3"
        placeholder="https://..."
        />
    </div>

    <label className="flex items-center gap-3">
        <input
        type="checkbox"
        checked={form.available}
        onChange={(e) =>
            setForm({
            ...form,
            available: e.target.checked,
            })
        }
        />

        Available
    </label>

    <button
        disabled={loading}
        className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
    >
        {loading
        ? "Saving..."
        : isEdit
        ? "Update Item"
        : "Create Item"}
    </button>
    </form>
);
}

export default MenuForm