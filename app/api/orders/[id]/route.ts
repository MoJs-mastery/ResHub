import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// PATCH /api/orders/[id] — admin updates order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;
    const { id } = await params;

    const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value." },
        { status: 400 }
      );
    }

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json({ message: "Invalid order ID." }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[Orders PATCH]", error);
    return NextResponse.json(
      { message: "Failed to update order." },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] — admin deletes an order
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json({ message: "Invalid order ID." }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted." });
  } catch (error) {
    console.error("[Orders DELETE]", error);
    return NextResponse.json(
      { message: "Failed to delete order." },
      { status: 500 }
    );
  }
}
