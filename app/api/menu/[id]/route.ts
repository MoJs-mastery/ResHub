import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
interface Params{
params:Promise<{
id: string;
}>
}
export async function GET(request: Request,
{ params }: Params){
try {
const  {id} = await params;
if(!mongoose.Types.ObjectId.isValid(id)) {
return NextResponse.json({ message: "Invalid ID" },
    { status: 400 })
}
await connectDB();
const item = await MenuItem.findById(id)
if(!item){
    return NextResponse.json({
        message:"Menu Item not found"
    },{
        status:404
    })
}
return NextResponse.json(item);
} catch (error) {
    console.error(error);

    return NextResponse.json(
    { message: "Failed to fetch item" },
    { status: 500 }
    );
}
}

export async function PUT(
request: Request,
{ params }: Params
) {
try {
    const authorizationError = await requireAdmin();
    if (authorizationError) {
    return authorizationError;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
    );
    }

    await connectDB();

    const body = await request.json();

    const item = await MenuItem.findByIdAndUpdate(
    id,
    body,
    {
        new: true,
        runValidators: true,
    }
    );

    if (!item) {
    return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
    );
    }

    return NextResponse.json(item);
} catch (error) {
    console.error(error);

    return NextResponse.json(
    { message: "Failed to update item" },
    { status: 500 }
    );
}
}

export async function DELETE(
request: Request,
{ params }: Params
) {
try {
    const authorizationError = await requireAdmin();
    if (authorizationError) {
    return authorizationError;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
        { message: "Invalid ID" },
        { status: 400 }
    );
    }

    await connectDB();

    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
    return NextResponse.json(
        { message: "Menu item not found" },
        { status: 404 }
    );
    }

    return NextResponse.json({
    message: "Menu item deleted successfully",
    });
} catch (error) {
    console.error(error);

    return NextResponse.json(
    { message: "Failed to delete item" },
    { status: 500 }
    );
}
}