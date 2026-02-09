import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Link
                    href="/admin/post/new"
                    className="bg-[var(--color-primary)] text-black font-bold py-2 px-4 rounded hover:brightness-110"
                >
                    + Novo Post
                </Link>
            </div>

            <div className="bg-neutral-900 rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-800 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Título</th>
                            <th className="p-4">Categoria</th>
                            <th className="p-4">Data</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium">{post.title}</td>
                                <td className="p-4 text-gray-400">{post.category}</td>
                                <td className="p-4 text-gray-400">
                                    {post.createdAt.toLocaleDateString("pt-BR")}
                                </td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/admin/post/${post.id}`}
                                        className="text-[var(--color-primary)] hover:underline mr-4"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Nenhum post encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
