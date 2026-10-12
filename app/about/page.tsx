import Link from "next/link";
import {
  Sparkles,
  Award,
  Heart,
  Flame,
  Wheat,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "About Us | ResHub",
  description:
    "Learn the story of ResHub, our culinary philosophy, and our dedication to fresh, handcrafted cuisine.",
};

export default function AboutPage() {
  const stats = [
    { value: "15+", label: "Years of Culinary Passion" },
    { value: "100%", label: "Locally Sourced Organic Produce" },
    { value: "900°F", label: "Artisan Oak Wood-Fired Ovens" },
    { value: "50,000+", label: "Delighted Guests Welcomed" },
  ];

  const pillars = [
    {
      icon: Wheat,
      title: "Farm-to-Table Freshness",
      desc: "We partner exclusively with regenerative family farms within a 50-mile radius, ensuring peak seasonal freshness and sustainable soil stewardship.",
    },
    {
      icon: Flame,
      title: "Artisanal Craftsmanship",
      desc: "Our sourdough undergoes a patient 72-hour cold fermentation process before entering hand-built refractory brick ovens to develop unmatched flavor.",
    },
    {
      icon: Heart,
      title: "Heartfelt Hospitality",
      desc: "Dining is an intimate communion of people and taste. We curate every detail of our kitchen to make you feel like cherished family.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 pb-24 pt-10">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-stone-200/60 bg-gradient-to-b from-orange-50/60 to-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-100/70 px-4 py-1.5 text-xs font-semibold text-orange-800 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            <span>OUR CULINARY ODYSSEY</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Food Made for <span className="gradient-text-warm">Timeless Moments</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
            ResHub was born out of an unyielding reverence for honest ingredients,
            old-world fire roasting, and the joyous energy of sharing an extraordinary meal.
          </p>
        </div>
      </section>

      {/* Story & Visual Section */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Visual card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-3 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                alt="Chefs cooking in restaurant kitchen"
                className="h-[420px] w-full rounded-2xl object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Michelin Guide Recommended</p>
                  <p className="text-[11px] text-stone-500">Excellence in Gastronomy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              HUMBLE ROOTS & NOBLE AMBITIONS
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">
              Reimagining the Essence of Comfort Dining
            </h2>
            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
              Founded by chefs united by a passion for slow food, ResHub began with a single wood oven and a simple vision: to eliminate artificial shortcuts and let the natural character of raw ingredients speak.
            </p>
            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
              Every sauce is simmered for hours, every pasta ribbon is hand-rolled with egg yolks from pasture-raised hens, and every steak is seared over fragrant oak wood coals.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "Certified organic stone-ground flours imported directly",
                "Non-GMO, antibiotic-free ethically raised meats",
                "Heirloom produce harvested within 48 hours of service",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-stone-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xs sm:grid-cols-4 sm:p-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-orange-600 sm:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-medium text-stone-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Pillars */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
            OUR PHILOSOPHY
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Guiding Principles of Our Kitchen
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-orange-200"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-stone-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-stone-900 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Experience Our Culinary Passion in Person
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-stone-300 sm:text-base">
            Join us for lunch, dinner, or reserve our private dining room for your next celebration.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700"
            >
              <span>Explore The Menu</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}