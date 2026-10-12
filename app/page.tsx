import Link from "next/link";
import { ArrowRight, UtensilsCrossed, Sparkles, ChefHat, HeartHandshake, Leaf } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import MenuCard from "@/components/MenuCard";
import Favorite from "@/models/Favorite";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let serializedItems: Array<{
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
  }> = [];
  let favoriteIds: string[] = [];

  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (session) {
      const [user, savedFavorites] = await Promise.all([
        User.findById(session.user.id).select("favorites").lean(),
        Favorite.find({ userId: session.user.id }).select("menuItemId").lean(),
      ]);
      favoriteIds = [
        ...new Set([
          ...(user?.favorites || []),
          ...savedFavorites.map((favorite) => favorite.menuItemId),
        ]),
      ];
    }
    const items = await MenuItem.find().sort({ createdAt: -1 }).limit(3).lean();
    serializedItems = items.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image || "",
      available: item.available ?? true,
    }));
  } catch (error) {
    console.error("Could not fetch items for home page:", error);
  }

  const values = [
    {
      icon: Leaf,
      title: "Fresh Ingredients",
      desc: "Selected with care every day to guarantee maximum flavor and authentic taste in every dish.",
    },
    {
      icon: ChefHat,
      title: "Handcrafted Recipes",
      desc: "Carefully prepared meals cooked to order with passion, technique, and dedication.",
    },
    {
      icon: HeartHandshake,
      title: "Warm Hospitality",
      desc: "A welcoming dining experience created to make every meal memorable and enjoyable.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-400/20 to-amber-300/20 blur-3xl pointer-events-none" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8">
          {/* Hero Left Content */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-orange-600" />
              <span>WELCOME TO RESHUB</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl sm:leading-[1.1]">
              Great food. <br />
              <span className="gradient-text-warm">Great moments.</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-stone-600 sm:text-xl">
              Discover delicious meals prepared with fresh ingredients and served with care.
              Browse our seasonal menu and enjoy an exceptional dining experience.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-orange-600/25 transition-all hover:from-orange-700 hover:to-amber-700 hover:shadow-orange-600/40 active:scale-98"
              >
                <span>View Menu</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-300/80 bg-white/80 px-6 py-4 text-base font-semibold text-stone-700 shadow-xs backdrop-blur-md transition hover:bg-stone-50 hover:text-stone-900 active:scale-98"
              >
                <span>Create Account</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xl shadow-orange-500/10">
                <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                    alt="ResHub"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-lg font-bold">Artisanal Kitchen & Dining</p>
                    <p className="text-xs text-stone-200 mt-1">Fresh • Delicious • Simple</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Real Menu Items (Only if items exist in Database) */}
      {serializedItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                FROM OUR KITCHEN
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-stone-900 sm:text-4xl">
                Featured Dishes
              </h2>
            </div>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              <span>View Full Menu</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {serializedItems.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                isFavorite={favoriteIds.includes(item._id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Values / Highlights Section */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xs transition hover:shadow-lg hover:border-orange-200"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-stone-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Clean Call to Action */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-8 sm:p-14 text-center text-white shadow-xl shadow-orange-600/20">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Explore Our Delicious Menu Today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-orange-100 sm:text-base">
            Find your favorite dish, created with quality ingredients and ready to enjoy.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/menu"
              className="rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-orange-700 shadow-md transition hover:bg-stone-50 active:scale-95"
            >
              Explore Menu
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}