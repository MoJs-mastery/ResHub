"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, ShoppingBag, Check, LogIn, Loader2 } from "lucide-react";

interface MenuCardProps {
  isFavorite?: boolean;
  onFavoriteChange?: (itemId: string, isFavorite: boolean) => void;
  item: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
  };
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  Burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  Pasta: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80",
  Drinks: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
  Dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Pizza: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Burger: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Pasta: { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200" },
  Drinks: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Dessert: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

const MenuCard = ({
  item,
  isFavorite = false,
  onFavoriteChange,
}: MenuCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [favoriteState, setFavoriteState] = useState(isFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [orderState, setOrderState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [orderMessage, setOrderMessage] = useState("");

  const fallbackUrl = CATEGORY_FALLBACK_IMAGES[item.category] || DEFAULT_IMAGE;
  const initialImageUrl = item.image && item.image.trim() !== "" ? item.image : fallbackUrl;
  const [currentImg, setCurrentImg] = useState(initialImageUrl);

  const categoryStyle = CATEGORY_COLORS[item.category] || {
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-200",
  };

  const handleFavorite = async () => {
    if (!session) {
      router.push("/login?callbackUrl=%2Fmenu");
      return;
    }
    if (favoriteLoading) return;

    setFavoriteLoading(true);
    setFavoriteMessage("");
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId: item._id, favorite: !favoriteState }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFavoriteMessage(data.message || "Could not update favorites.");
        return;
      }
      setFavoriteState(!favoriteState);
      onFavoriteChange?.(item._id, !favoriteState);
    } catch {
      setFavoriteMessage("Could not reach the server. Please try again.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!item.available) return;

    // Not logged in → redirect to login
    if (!session) {
      router.push("/login");
      return;
    }

    setOrderState("loading");
    setOrderMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              menuItemId: item._id,
              quantity: 1,
            },
          ],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setOrderMessage(data.message || "Could not place your order. Please try again.");
        setOrderState("error");
        setTimeout(() => setOrderState("idle"), 3000);
        return;
      }

      setOrderState("success");
      setOrderMessage("Order placed. You can track it in My Orders.");
      setTimeout(() => setOrderState("idle"), 3000);
    } catch {
      setOrderMessage("Could not reach the server. Please check your connection and try again.");
      setOrderState("error");
      setTimeout(() => setOrderState("idle"), 3000);
    }
  };

  const buttonLabel = () => {
    if (!session) return { icon: <LogIn className="h-3.5 w-3.5" />, text: "Login to Order" };
    if (orderState === "loading") return { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, text: "Placing..." };
    if (orderState === "success") return { icon: <Check className="h-3.5 w-3.5" />, text: "Ordered!" };
    if (orderState === "error") return { icon: null, text: "Try Again" };
    return { icon: <ShoppingBag className="h-3.5 w-3.5" />, text: "Order Now" };
  };

  const buttonClass = () => {
    if (!item.available) return "bg-stone-100 text-stone-400 cursor-not-allowed";
    if (orderState === "success") return "bg-emerald-600 text-white";
    if (orderState === "error") return "bg-red-500 text-white";
    if (!session) return "bg-stone-800 text-white hover:bg-stone-900";
    return "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/20";
  };

  const { icon, text } = buttonLabel();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-600/8 hover:border-orange-200/80">
      {/* Media Container */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <img
          src={currentImg}
          alt={item.name}
          onError={() => setCurrentImg(fallbackUrl)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-xs ${categoryStyle.bg}/90 ${categoryStyle.text} ${categoryStyle.border}`}
          >
            {item.category}
          </span>

          <button
            type="button"
            onClick={handleFavorite}
            disabled={favoriteLoading}
            aria-label={favoriteState ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favoriteState}
            title={session ? (favoriteState ? "Remove from favorites" : "Save to favorites") : "Sign in to save favorites"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm backdrop-blur-md transition hover:scale-110 hover:bg-white active:scale-95 disabled:opacity-60"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                favoriteState ? "fill-red-500 text-red-500" : "text-stone-600"
              }`}
            />
          </button>
        </div>

        {/* Availability Pill */}
        <div className="absolute bottom-3 left-3.5">
          {item.available ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 backdrop-blur-md border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-900/80 px-2.5 py-0.5 text-[11px] font-medium text-rose-300 backdrop-blur-md border border-rose-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
            <span className="shrink-0 text-xl font-extrabold text-orange-600">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Action button */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Chef Crafted
          </span>

          <button
            type="button"
            onClick={handleOrder}
            disabled={!item.available || orderState === "loading"}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-60 ${buttonClass()}`}
          >
            {icon}
            <span>{text}</span>
          </button>
        </div>
        {favoriteMessage && (
          <p role="alert" className="mt-2 text-right text-xs text-red-600">
            {favoriteMessage}
          </p>
        )}
        {orderMessage && (
          <p
            role={orderState === "error" ? "alert" : "status"}
            className={`mt-2 text-right text-xs ${
              orderState === "error" ? "text-red-600" : "text-emerald-700"
            }`}
          >
            {orderMessage}
          </p>
        )}
      </div>
    </article>
  );
};

export default MenuCard;