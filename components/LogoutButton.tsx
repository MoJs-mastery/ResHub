"use client";

import { signOut } from "next-auth/react";

export const LogoutButton=()=> {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg bg-black px-4 py-2 text-white"
    >
      Logout
    </button>
  );
}