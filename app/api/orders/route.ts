import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";

// POST /api/orders — logged-in user places an order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in to place an order." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    if (items.length > 100) {
      return NextResponse.json(
        { message: "An order cannot contain more than 100 items." },
        { status: 400 }
      );
    }

    if (notes !== undefined && (typeof notes !== "string" || notes.length > 500)) {
      return NextResponse.json(
        { message: "Order notes must be 500 characters or fewer." },
        { status: 400 }
      );
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      const menuItemId =
        item && typeof item.menuItemId === "string" ? item.menuItemId.trim() : "";
      const quantity =
        item?.quantity === undefined ? 1 : Number(item.quantity);

      if (menuItemId.length === 0 || menuItemId.length > 128) {
        return NextResponse.json(
          { message: "An order item has an invalid menu item ID." },
          { status: 400 }
        );
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json(
          { message: "Each item quantity must be a whole number between 1 and 99." },
          { status: 400 }
        );
      }

      quantities.set(
        menuItemId,
        (quantities.get(menuItemId) || 0) + quantity
      );
    }

    if ([...quantities.values()].some((quantity) => quantity > 99)) {
      return NextResponse.json(
        { message: "A dish cannot be ordered more than 99 times." },
        { status: 400 }
      );
    }

    await connectDB();

    const menuItems = await MenuItem.aggregate([
      {
        $match: {
          available: true,
          $expr: {
            $in: [{ $toString: "$_id" }, [...quantities.keys()]],
          },
        },
      },
    ]);
    if (menuItems.length !== quantities.size) {
      return NextResponse.json(
        { message: "One or more dishes are unavailable. Refresh the menu and try again." },
        { status: 400 }
      );
    }

    const orderItems = menuItems.map((item) => ({
      menuItemId: item._id.toString(),
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image || "",
      quantity: quantities.get(item._id.toString())!,
    }));
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      userEmail: session.user.email || "",
      items: orderItems,
      total,
      notes: notes || "",
      status: "pending",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("[Orders POST]", error);
    return NextResponse.json(
      { message: "Failed to place order." },
      { status: 500 }
    );
  }
}

// GET /api/orders — admin sees all orders, user sees own orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    let orders;

    if (session.user.role === "admin") {
      orders = await Order.find().sort({ createdAt: -1 }).lean();
    } else {
      orders = await Order.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean();
    }

    const serialized = orders.map((o) => ({
      ...o,
      _id: o._id.toString(),
      createdAt: (o as typeof o & { createdAt?: Date }).createdAt?.toISOString(),
      updatedAt: (o as typeof o & { updatedAt?: Date }).updatedAt?.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("[Orders GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
