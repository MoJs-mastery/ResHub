import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PlaceOrderForm from "@/components/PlaceOrderForm";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Place an Order | ResHub",
  description: "Choose dishes from the menu and place your order.",
};

export default async function OrderPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=%2Forder");
  }

  await connectDB();
  const items = await MenuItem.find({ available: true })
    .sort({ category: 1, name: 1 })
    .lean();

  const menuItems = items.map((item) => ({
    _id: item._id.toString(),
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    image: item.image || "",
  }));

  return <PlaceOrderForm items={menuItems} />;
}
