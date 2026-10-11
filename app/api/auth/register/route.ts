import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
export async function POST(request: Request){
    try {
    const body = await  request.json()
    const {name,email,password}= body;
    if(!name || !email ||!password){
    return NextResponse.json({
        message:"Name, email and password are required",
    }, {
        status: 400,
        })
    }
    if(password.length < 6){
        return NextResponse.json({
            message:"Password must be at least 6 character"
        },{
            status:400
        })
    }
    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
    email:normalizedEmail
    })
    if(existingUser){
        NextResponse.json({
            message:"User already exists"
        },{
            status:409
        })

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        name:name.trim(),
        email:normalizedEmail,
        password:hashedPassword
    }) 
    return NextResponse.json({
        message:"User registered successfully",
        user:{
        id: user._id,
        name: user.name,
        email: user.email,
        },
        
    },{
        status:201
    })  
    }
    } catch (error) {
    console.error(error);

    return NextResponse.json(
    {
        message: "Something went wrong",
    },
    {
        status: 500,
    }
    );
}
}