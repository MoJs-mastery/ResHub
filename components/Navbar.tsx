"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
const Navbar = () => {
    const {data: session } = useSession()
return (
    <nav className=" border-b bg-white">
    <div className="mx-auto  flex max-w-7  items-center justify-between px-6 py-4">
    <Link href={"/"} className="text-2xl font-bold text-orange-700">
    Restaurant App
    </Link>
    <div className="flex items-center gap-6">
    <Link href="/">Home</Link>

        <Link href="/menu">Menu</Link>

        <Link href="/about">About</Link>
        {
        session?(
            <>
            <Link href="/dashboard">
                Dashboard
            </Link>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-black px-4 py-2 text-white"
            >
                Logout
            </button>
            </>
        ) :(
            <>
            <Link href="/login">Login</Link>

            <Link
                href="/register"
                className="rounded-lg bg-orange-600 px-4 py-2 text-white"
            >
                Register
            </Link>
            </>
        )  
        }
    </div>
    </div>
    </nav>
)
}

export default Navbar
