import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";

export async function GET() {
    try {
    await connectDB();
    const items = await MenuItem.find().sort({
        createdAt: -1,
    })
    return   NextResponse.json(items)
    } catch (error) {
        console.error(error);

    return NextResponse.json(
    { message: "Failed to fetch menu items" },
    { status: 500 }
    );
    }
}

export async function POST(request: Request){
try {
    const authorizationError = await requireAdmin();
    if (authorizationError) {
        return authorizationError;
    }
    await connectDB();
    const body = await request.json();
    const {name,
    description,
    price,
    category,
    image,
    available,} =body;
    if (!name || !description || price === undefined || !category) {
    return NextResponse.json(
        {
        message:
            "Name, description, price and category are required",
        },
        { status: 400 }
    );
    }
    const item = await MenuItem.create({
        name,
    description,
    price,
    category,
    image: image || "",
    available:
        available === undefined ? true : available
    })
    return NextResponse.json(item, {
    status: 201,
    });
} catch (error) {
    console.error(error);

    return NextResponse.json(
    { message: "Failed to create menu item" },
    { status: 500 }
    );
}
}