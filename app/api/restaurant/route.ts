import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";

export async function GET() {
  try {
    await connectDB();

    const restaurant = await Restaurant.findOne();

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch restaurant" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const restaurant = await Restaurant.create(body);

    return NextResponse.json(restaurant, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}