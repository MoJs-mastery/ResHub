"use client";

import { useState, useMemo } from "react";
import MenuCard from "./MenuCard";
import { Search, Filter, Sparkles, X, Utensils } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

interface MenuExplorerProps {
  items: MenuItem[];
  favoriteIds?: string[];
  favoritesOnly?: boolean;
}

const CATEGORIES = ["All", "Pizza", "Burger", "Pasta", "Drinks", "Dessert"];

export default function MenuExplorer({
  items,
  favoriteIds = [],
  favoritesOnly = false,
}: MenuExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [savedFavoriteIds, setSavedFavoriteIds] = useState(() => new Set(favoriteIds));

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (favoritesOnly && !savedFavoriteIds.has(item._id)) return false;
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAvailability = onlyAvailable ? item.available : true;

      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [items, selectedCategory, searchQuery, onlyAvailable, favoritesOnly, savedFavoriteIds]);

  const handleFavoriteChange = (itemId: string, favorite: boolean) => {
    setSavedFavoriteIds((current) => {
      const updated = new Set(current);
      if (favorite) updated.add(itemId);
      else updated.delete(itemId);
      return updated;
    });
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    CATEGORIES.slice(1).forEach((cat) => {
      counts[cat] = items.filter(
        (i) => i.category.toLowerCase() === cat.toLowerCase()
      ).length;
    });
    return counts;
  }, [items]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setOnlyAvailable(false);
  };

  return (
    <div className="space-y-10">
      {/* Controls Container */}
      <div className="flex flex-col gap-6 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
        {/* Search bar & Available Toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name or ingredient..."
              className="w-full rounded-2xl border border-stone-200/90 bg-stone-50/50 py-3.5 pl-12 pr-10 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer self-start sm:self-center select-none rounded-xl border border-stone-200/80 px-4 py-3 bg-stone-50/50 hover:bg-stone-100/60 transition">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 cursor-pointer accent-orange-600"
            />
            <span className="text-xs font-semibold text-stone-700">
              In Stock Only
            </span>
          </label>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/25"
                    : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-medium text-stone-500">
          Showing{" "}
          <span className="font-bold text-stone-900">
            {filteredItems.length}
          </span>{" "}
          {filteredItems.length === 1 ? "dish" : "dishes"}
        </p>

        {(selectedCategory !== "All" || searchQuery || onlyAvailable) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Utensils className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-stone-900">
            {favoritesOnly && savedFavoriteIds.size === 0 ? "No favorite dishes yet" : "No dishes found"}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
            {favoritesOnly && savedFavoriteIds.size === 0
              ? "Tap the heart on any dish you love to save it here."
              : "We couldn't find any items matching your criteria. Try adjusting your search keyword or category filter."}
          </p>
          {favoritesOnly && savedFavoriteIds.size === 0 ? (
            <a href="/menu" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-700">
              Explore the menu
            </a>
          ) : (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-700"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              isFavorite={savedFavoriteIds.has(item._id)}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
