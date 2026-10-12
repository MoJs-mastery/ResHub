import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResHub | Restaurant Hub & Fine Dining",
  description:
    "Experience culinary excellence at ResHub. Discover delicious meals, handcrafted pizzas, gourmet burgers, fresh pasta, and artisan desserts.",
  keywords: ["restaurant", "reshub", "gourmet", "dining", "menu", "food app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable} scroll-smooth`}>
      <body className="min-h-screen font-sans bg-[#fdfbf7] text-stone-900 antialiased flex flex-col selection:bg-orange-500 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}