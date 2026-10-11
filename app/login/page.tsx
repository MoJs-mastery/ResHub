"use client";

import { SubmitEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const LoginPage =()=>{
const router = useRouter()
const [email,setEmail]=useState("")
const [password,setPassword] =useState("")
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
async function handleSubmit(event:SubmitEvent){
event.preventDefault();
setLoading(true);
setError("");
const result  = await signIn("credentials",{
    email,
    password,
    redirect: false,
})
setLoading(false);
if (result?.error) {
setError("Invalid email or password");
    return;
    }

    router.push("/dashboard");
    router.refresh();
}
return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
    <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
        Login
        </h1>

        <p className="mt-2 text-gray-500">
        Login to your account.
        </p>

        {error && (
        <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
        </div>
        )}

        <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
        >
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            required
        />

        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            required
        />

        <button
            disabled={loading}
            className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
            {loading ? "Logging in..." : "Login"}
        </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
            href="/register"
            className="font-semibold text-orange-600"
        >
            Register
        </Link>
        </p>
    </div>
    </div>
);
}

export default LoginPage