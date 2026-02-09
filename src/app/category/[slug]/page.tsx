import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from 'next';
import Pagination from "@/components/Pagination";
import ProductCarousel from "@/components/ProductCarousel";

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Find category
    const category = await prisma.category.findUnique({
        where: { slug }
    });

    if (!category) return { title: 'Categoria não encontrada' };

    return {
        title: `${category.name} - Bom Trabalho Blog`,
        description: `Artigos sobre ${category.name}`,
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page } = await searchParams;

    const currentPage = Number(page) || 1;
    const pageSize = 24;
    const skip = (currentPage - 1) * pageSize;

    // Fetch category and its posts count
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            _count: {
                select: { posts: true, products: true }
            }
        }
    });

    if (!category) {
        notFound();
    }

    const posts = await prisma.post.findMany({
        where: { categoryId: category.id },
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: skip,
    });

    // Fetch products for this category (limit to 12 for carousel)
    let products = await prisma.product.findMany({
        where: { categoryId: category.id },
        take: 12,
        orderBy: { createdAt: 'desc' }
    });

    // Fallback: If no products for this category, get random ones
    if (products.length === 0) {
        const totalProducts = await prisma.product.count();
        if (totalProducts > 0) {
            const skip = Math.max(0, Math.floor(Math.random() * Math.max(0, totalProducts - 12)));
            products = await prisma.product.findMany({
                take: 12,
                skip: skip,
            });
        }
    }

    const totalPosts = category._count.posts;
    const totalPages = Math.ceil(totalPosts / pageSize);

    return (
        <div className="container py-16">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                <p className="text-gray-600">
                    Mostrando {posts.length} de {totalPosts} artigos em <strong>{category.name}</strong>
                </p>
            </header>

            {/* Products Section - Carousel */}
            {products.length > 0 && (
                <section className="mb-16">
                    <div className="flex justify-between items-end mb-6 pb-3 border-b border-gray-200">
                        <h2 className="text-2xl font-bold font-heading">Produtos em Destaque</h2>
                        <a
                            href="https://www.lojabomtrabalho.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                        >
                            Ver todos na loja <span className="text-lg">→</span>
                        </a>
                    </div>
                    <ProductCarousel products={products as any} />
                </section>
            )}

            {/* Posts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <article key={post.id} className="post-card group">
                        <div className="aspect-video bg-neutral-200 overflow-hidden post-image-wrapper relative">
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl.startsWith('/') ? post.imageUrl : `/${post.imageUrl}`}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-gray-200 to-gray-300" />
                            )}
                        </div>
                        <div className="p-6 flex flex-col flex-1 post-content">
                            <div className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2 post-meta">
                                {category.name} • {post.createdAt.toLocaleDateString('pt-BR')}
                            </div>
                            <h3 className="text-xl font-bold mb-4 leading-snug post-title">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 post-excerpt">
                                {post.excerpt}
                            </p>
                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500 post-footer">
                                <Link href={`/${post.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                                    Ler mais &rarr;
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {posts.length === 0 && (
                <p className="text-center text-gray-500 py-12">Nenhum post encontrado nesta categoria.</p>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/category/${slug}`}
            />
        </div>
    );
}
