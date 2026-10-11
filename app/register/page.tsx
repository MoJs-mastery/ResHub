"use client";
import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const RegisterPage =()=>{
const router = useRouter();
const [form ,setForm]=useState({
    name:"",
    email:"",
    password:""
})
const[error ,setError] =useState("")
const [loading, setLoading] = useState(false);
async function handleSubmit(event:SubmitEvent){
event.preventDefault();
setError("");
setLoading(true);
try {
const response = await fetch("/api/auth/register",{
    method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
}) 
const data = await response.json();
if(!response.ok){
setError(data.message || "Registration failed");
    return;
}
router.push("/login");
} catch (error) {
setError("Something went wrong");
    } finally {
    setLoading(false); 
}
}
return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
    <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
        Create Account
        </h1>

        <p className="mt-2 text-gray-500">
        Create your restaurant account.
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
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
            setForm({
                ...form,
                name: e.target.value,
            })
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            required
        />

        <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
            setForm({
                ...form,
                email: e.target.value,
            })
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            required
        />

        <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
            setForm({
                ...form,
                password: e.target.value,
            })
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            required
            minLength={6}
        />

        <button
            disabled={loading}
            className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
            {loading ? "Creating..." : "Create Account"}
        </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
            href="/login"
            className="font-semibold text-orange-600"
        >
            Login
        </Link>
        </p>
    </div>
    </div>
);
}
export default RegisterPage