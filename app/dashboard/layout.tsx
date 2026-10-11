import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
children,
}: {
children: React.ReactNode;
}) {
const session = await getServerSession(authOptions);

if (!session) {
    redirect("/login");
}

return (
    <section className="min-h-screen bg-gray-50">
    {children}
    </section>
);
}