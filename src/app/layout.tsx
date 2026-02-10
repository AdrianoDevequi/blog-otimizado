import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter from Google Fonts via Next.js
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Blog de Segurança | Performance Extrema",
  description: "Blog especializado em equipamentos de segurança.",
};

import { prisma } from "@/lib/prisma";
import SidebarMenu from "@/components/SidebarMenu";

// ...

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch ALL categories for the sidebar, limit topmost relevant ones for the main header if needed.
  // We'll fetch all and slice in the JSX for the desktop nav.
  const categories = await prisma.category.findMany({
    where: {
      posts: {
        some: {} // Only categories with posts
      }
    },
    orderBy: {
      posts: {
        _count: 'desc'
      }
    },
    // Removed take: 5 to get all categories for the sidebar
  });

  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <div className="flex flex-col min-h-screen relative z-10">
          <header className="site-header">
            <div className="container flex justify-between items-center w-full">
              <Link href="/" className="logo block">
                <Image
                  src="/logo.png"
                  alt="Bom Trabalho Blog"
                  width={200}
                  height={48}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>

              {/* Right Side: Nav + Sidebar Menu */}
              <div className="flex items-center gap-6">
                {/* Desktop Nav - Limited to 4 items */}
                <nav className="hidden xl:flex gap-6 main-nav">
                  {categories.slice(0, 4).map(cat => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>

                {/* Unified Sidebar Menu - Visible on all devices */}
                <SidebarMenu categories={categories} />
              </div>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="site-footer border-t border-gray-100 py-16 text-center text-gray-500 text-sm bg-white relative z-10">
            <div className="container">
              <p>&copy; 2024 SegurançaPro. Referência em Segurança Eletrônica.</p>
            </div>
          </footer>
        </div>
      </body >
    </html >
  );
}
