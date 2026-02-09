import Link from "next/link";
import "../admin.css"; // Reuse global/admin styles

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-white/10 bg-neutral-900">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/admin" className="text-xl font-bold">
                        Admin Panel
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/" target="_blank" className="text-sm text-gray-400 hover:text-white">
                            Ver Site
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
