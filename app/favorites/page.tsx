import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import MenuExplorer from "@/components/MenuExplorer";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";
import Favorite from "@/models/Favorite";
import { Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Favorite Dishes | ResHub",
  description: "Your saved favorite dishes.",
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=%2Ffavorites");
  }

  await connectDB();
  const [user, savedFavorites] = await Promise.all([
    User.findById(session.user.id).select("favorites").lean(),
    Favorite.find({ userId: session.user.id }).select("menuItemId").lean(),
  ]);
  const favoriteIds = [
    ...new Set([
      ...(user?.favorites || []),
      ...savedFavorites.map((favorite) => favorite.menuItemId),
    ]),
  ];
  const items = favoriteIds.length
    ? await MenuItem.aggregate([
        {
          $match: {
            $expr: {
              $in: [{ $toString: "$_id" }, favoriteIds],
            },
          },
        },
      ])
    : [];

  const serializedItems = items.map((item) => ({
    _id: item._id.toString(),
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    image: item.image || "",
    available: item.available ?? true,
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
          <Heart className="h-4 w-4" />
          Back to menu
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          Your favorite dishes
        </h1>
        <p className="mt-2 text-stone-600">All the dishes you have saved in one place.</p>
      </div>
      <MenuExplorer items={serializedItems} favoriteIds={favoriteIds} favoritesOnly />
    </div>
  );
}
