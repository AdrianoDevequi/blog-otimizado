"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface SidebarMenuProps {
    categories: Category[];
}

export default function SidebarMenu({ categories }: SidebarMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const [mounted, setMounted] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Use Portal to render drawer outside of header stacking context
    const DrawerContent = (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <span className="font-bold text-lg text-gray-800">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Fechar menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Search Bar */}
                    <form action="/search" method="GET" className="relative">
                        <input
                            type="text"
                            name="q"
                            placeholder="Buscar artigos..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm text-gray-800"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </form>

                    {/* Categories List */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                            Categorias
                        </h3>
                        <nav className="flex flex-col space-y-1">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === `/category/${cat.slug}`
                                        ? "bg-red-50 text-[var(--color-primary)]"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <a
                        href="https://www.lojabomtrabalho.com.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        <span>Ir para a Loja</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Trigger Button - Visible on all devices */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors focus:outline-none z-50 relative"
                aria-label="Abrir menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>

            {/* Render Drawer via Portal */}
            {mounted && typeof document !== "undefined"
                ? createPortal(DrawerContent, document.body)
                : null}
        </>
    );
}
