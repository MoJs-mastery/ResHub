import MenuExplorer from "@/components/MenuExplorer";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";
import Favorite from "@/models/Favorite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sparkles, UtensilsCrossed } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Seasonal Menu | ResHub",
  description:
    "Explore our handcrafted selection of artisan pizzas, fresh pastas, prime burgers, and decadent house desserts.",
};

const MenuPage = async () => {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user = session
    ? await User.findById(session.user.id).select("favorites").lean()
    : null;
  const savedFavorites = session
    ? await Favorite.find({ userId: session.user.id }).select("menuItemId").lean()
    : [];
  const favoriteIds = [
    ...new Set([
      ...(user?.favorites || []),
      ...savedFavorites.map((favorite) => favorite.menuItemId),
    ]),
  ];
  const items = await MenuItem.find().sort({ createdAt: -1 }).lean();

  const serializedItems = items.map((item) => ({
    _id: item._id.toString(),
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    image: item.image || "",
    available: item.available ?? true,
    createdAt: (item as typeof item & { createdAt?: Date }).createdAt?.toISOString(),
    updatedAt: (item as typeof item & { updatedAt?: Date }).updatedAt?.toISOString(),
  }));

  return (
    <div className="pb-24 pt-10">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-stone-200/60 bg-gradient-to-b from-orange-50/60 to-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-100/70 px-4 py-1.5 text-xs font-semibold text-orange-800 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            <span>SEASONAL CULINARY COLLECTION</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Our Handcrafted <span className="gradient-text-warm">Menu</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-600 sm:text-lg">
            Every dish is prepared to order using local heirloom produce, slow-aged
            cheeses, and heritage recipes fired in our masonry oven.
          </p>
        </div>
      </section>

      {/* Explorer Content */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <MenuExplorer items={serializedItems} favoriteIds={favoriteIds} />
      </section>
    </div>
  );
};

export default MenuPage;