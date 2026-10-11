"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="relative border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-700"
          onClick={closeMenu}
        >
          Restaurant App
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>

        <div
          id="primary-navigation"
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full z-10 flex-col gap-4 border-b bg-white px-4 py-4 shadow-md md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:p-0 md:shadow-none`}
        >
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/menu" onClick={closeMenu}>Menu</Link>
          <Link href="/about" onClick={closeMenu}>About</Link>
          {session?.user.role === "admin" ? (
            <>
              <Link href="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-fit rounded-lg bg-black px-4 py-2 text-white"
              >
                Logout
              </button>
            </>
          ) : session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-fit rounded-lg bg-black px-4 py-2 text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" onClick={closeMenu}>Login</Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="w-fit rounded-lg bg-orange-600 px-4 py-2 text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
