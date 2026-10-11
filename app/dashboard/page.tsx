import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
const session = await getServerSession(authOptions);

return (
    <div className="mx-auto max-w-7xl px-6 py-12">
    <div>
        <p className="text-sm text-gray-500">
        Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
        Welcome, {session?.user?.name}
        </h1>

        <p className="mt-3 text-gray-500">
        Manage your restaurant from here.
        </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Link
        href="/dashboard/menu"
        className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
        <h2 className="text-xl font-bold">
            Menu Management
        </h2>

        <p className="mt-2 text-gray-500">
            Create, edit and delete menu items.
        </p>
        </Link>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">
            Account
        </h2>

        <p className="mt-2 text-gray-500">
            {session?.user?.email}
        </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">
            Role
        </h2>

        <p className="mt-2 capitalize text-orange-600">
            {session?.user?.role}
        </p>
        </div>
    </div>
    </div>
);
}
