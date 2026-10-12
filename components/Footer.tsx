import Link from "next/link";
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-stone-800 bg-[#141210] text-stone-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                ResHub<span className="text-orange-500">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              Crafting unforgettable culinary memories through artisanal wood-fired
              dishes, farm-fresh ingredients, and heartfelt hospitality.
            </p>
            <div className="pt-2 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-800/80 px-3 py-1 text-amber-400 border border-stone-700/60">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Kitchen Open Today
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-orange-400 hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="transition hover:text-orange-400 hover:translate-x-1 inline-block"
                >
                  Our Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-orange-400 hover:translate-x-1 inline-block"
                >
                  About Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition hover:text-orange-400 hover:translate-x-1 inline-block"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Opening Hours
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <div>
                  <p className="font-medium text-stone-200">Monday - Friday</p>
                  <p className="text-xs text-stone-400">11:00 AM – 10:30 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <div>
                  <p className="font-medium text-stone-200">Saturday - Sunday</p>
                  <p className="text-xs text-stone-400">10:00 AM – 11:30 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Visit Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <span>42 Gourmet Avenue, Culinary District</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                <span>+252097798877</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                <span>ResHub@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-800/80 pt-8 sm:flex-row text-xs text-stone-500">
          <p>© {new Date().getFullYear()} ResHub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 fill-orange-500 text-orange-500" /> for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
