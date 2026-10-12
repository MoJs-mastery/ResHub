import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import Favorite from "@/models/Favorite";
import User from "@/models/User";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please sign in to view favorites." }, { status: 401 });
    }
    await connectDB();
    const [user, favorites] = await Promise.all([
      User.findById(session.user.id).select("favorites").lean(),
      Favorite.find({ userId: session.user.id }).select("menuItemId").lean(),
    ]);
    const favoriteIds = new Set([
      ...(user?.favorites || []),
      ...favorites.map((favorite) => favorite.menuItemId),
    ]);
    return NextResponse.json([...favoriteIds]);
  } catch (error) {
    console.error("[Favorites GET]", error);
    return NextResponse.json({ message: "Failed to load favorites." }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Please sign in to save favorites." }, { status: 401 });
    }

    const body = await request.json();
    const menuItemId =
      typeof body.menuItemId === "string" ? body.menuItemId.trim() : "";
    const favorite = body.favorite;
    if (!menuItemId || menuItemId.length > 128 || typeof favorite !== "boolean") {
      return NextResponse.json({ message: "Invalid favorite selection." }, { status: 400 });
    }

    await connectDB();
    const item = await MenuItem.aggregate([
      { $match: { $expr: { $eq: [{ $toString: "$_id" }, menuItemId] } } },
      { $project: { _id: 1 } },
      { $limit: 1 },
    ]);
    if (!item.length) {
      return NextResponse.json({ message: "Menu item not found." }, { status: 404 });
    }

    const user = await User.findById(session.user.id).select("_id").lean();
    if (!user) {
      return NextResponse.json({ message: "User account not found." }, { status: 404 });
    }

    if (favorite) {
      await Favorite.updateOne(
        { userId: session.user.id, menuItemId },
        { $setOnInsert: { userId: session.user.id, menuItemId } },
        { upsert: true, runValidators: true }
      );
    } else {
      await Favorite.deleteOne({ userId: session.user.id, menuItemId });
    }

    const userUpdate = await User.updateOne(
      { _id: session.user.id },
      favorite
        ? { $addToSet: { favorites: menuItemId } }
        : { $pull: { favorites: menuItemId } },
      { runValidators: true }
    );
    if (userUpdate.matchedCount === 0) {
      return NextResponse.json({ message: "User account not found." }, { status: 404 });
    }

    const [legacyUser, savedFavorites] = await Promise.all([
      User.findById(session.user.id).select("favorites").lean(),
      Favorite.find({ userId: session.user.id }).select("menuItemId").lean(),
    ]);
    const favoriteIds = new Set([
      ...(legacyUser?.favorites || []),
      ...savedFavorites.map((savedFavorite) => savedFavorite.menuItemId),
    ]);
    return NextResponse.json({ favorites: [...favoriteIds] });
  } catch (error) {
    console.error("[Favorites POST]", error);
    return NextResponse.json({ message: "Failed to update favorites." }, { status: 500 });
  }
}
