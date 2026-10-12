"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  UtensilsCrossed,
  Menu as MenuIcon,
  X,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ShoppingBag,
  ClipboardList,
  Loader2,
  Heart,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setMenuOpen(false);
  const closeProfile = () => setProfileOpen(false);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        closeProfile();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeProfile();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError("");

    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      setSigningOut(false);
      setSignOutError("Unable to sign out. Please try again.");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20">
            <UtensilsCrossed className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-stone-900">
              ResHub<span className="text-orange-600">.</span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-wider text-orange-600/90 font-semibold sm:block">
              Restaurant Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-orange-600" />
                )}
              </Link>
            );
          })}

          {session?.user.role === "admin" && (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-amber-100/70 text-amber-900 font-semibold"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-orange-600" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/orders"
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  pathname.startsWith("/dashboard/orders")
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </>
          )}
          {session?.user.role === "user" && (
            <>
              <Link
                href="/order"
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  pathname === "/order"
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                Place Order
              </Link>
              <Link
                href="/orders"
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  pathname === "/orders"
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                My Orders
              </Link>
            </>
          )}
          {session && (
            <Link
              href="/favorites"
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                pathname === "/favorites"
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              Favorites
            </Link>
          )}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-2.5 py-2 text-left shadow-xs transition hover:border-orange-200 hover:bg-orange-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-700">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="max-w-32">
                  <span className="block truncate text-xs font-semibold leading-tight text-stone-800">
                    {session.user.name || "User"}
                  </span>
                  <span className="mt-0.5 block text-[10px] capitalize leading-tight text-stone-500">
                    {session.user.role}
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-stone-200 bg-white py-2 shadow-xl"
                >
                  <div className="border-b border-stone-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {session.user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-stone-500">{session.user.email}</p>
                  </div>
                  {session.user.role === "user" ? (
                    <>
                      <Link role="menuitem" href="/orders" onClick={closeProfile} className="block px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50">
                        My Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link role="menuitem" href="/dashboard" onClick={closeProfile} className="block px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50">
                        Admin Dashboard
                      </Link>
                      <Link role="menuitem" href="/dashboard/orders" onClick={closeProfile} className="block px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50">
                        Manage Orders
                      </Link>
                    </>
                  )}
                  <Link role="menuitem" href="/favorites" onClick={closeProfile} className="block px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50">
                    Favorite Dishes
                  </Link>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                  {signOutError && (
                    <p role="alert" className="px-4 py-2 text-xs text-red-600">
                      {signOutError}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-600/20 transition hover:from-orange-700 hover:to-amber-700 active:scale-98"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-xs hover:bg-stone-50 md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="border-b border-orange-100/60 bg-white/95 px-5 py-6 shadow-xl backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                    active
                      ? "bg-orange-50 font-semibold text-orange-600"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}

            {session?.user.role === "admin" && (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl bg-amber-50/80 px-4 py-3 text-base font-semibold text-amber-900"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-orange-600" />
                    Admin Dashboard
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                <Link
                  href="/dashboard/orders"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                    pathname.startsWith("/dashboard/orders")
                      ? "bg-orange-50 font-semibold text-orange-600"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Manage Orders
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              </>
            )}
            {session?.user.role === "user" && (
              <>
                <Link
                  href="/order"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                    pathname === "/order"
                      ? "bg-orange-50 font-semibold text-orange-600"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Place Order
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                <Link
                  href="/orders"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                    pathname === "/orders"
                      ? "bg-orange-50 font-semibold text-orange-600"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>My Orders</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              </>
            )}
            {session && (
              <Link
                href="/favorites"
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                  pathname === "/favorites"
                    ? "bg-orange-50 font-semibold text-orange-600"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            )}

            <div className="my-2 border-t border-stone-100" />

            {session ? (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 font-bold text-orange-800">
                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{session.user.name}</p>
                    <p className="text-xs text-stone-500">{session.user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    void handleSignOut();
                  }}
                  disabled={signingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-wait disabled:opacity-60"
                >
                  {signingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>{signingOut ? "Signing out..." : "Sign out"}</span>
                </button>
                {signOutError && (
                  <p role="alert" className="text-center text-xs text-red-600">
                    {signOutError}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-xl border border-stone-200 py-3 text-center font-medium text-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-3 text-center font-semibold text-white shadow-md shadow-orange-600/20"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
