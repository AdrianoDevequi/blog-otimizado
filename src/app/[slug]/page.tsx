import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

import ProductCarousel from "@/components/ProductCarousel";
import PostCarousel from "@/components/PostCarousel";

export const revalidate = 60;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
    });

    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | Blog de Segurança`,
        description: post.excerpt,
    };
}

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        select: { slug: true },
    });
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            category: true
        }
    });

    if (!post) {
        notFound();
    }

    // Fetch related products (limit to 12)
    let relatedProducts = await prisma.product.findMany({
        where: { categoryId: post.categoryId },
        take: 12,
        orderBy: { createdAt: 'desc' }
    });

    // Fallback: If no products for this category, get random ones
    if (relatedProducts.length === 0) {
        const totalProducts = await prisma.product.count();
        if (totalProducts > 0) {
            const skip = Math.max(0, Math.floor(Math.random() * Math.max(0, totalProducts - 12)));
            relatedProducts = await prisma.product.findMany({
                take: 12,
                skip: skip,
            });
        }
    }

    // Fetch related posts (same category, excluding current)
    const relatedPosts = await prisma.post.findMany({
        where: {
            categoryId: post.categoryId,
            id: { not: post.id }
        },
        take: 6,
        orderBy: { createdAt: 'desc' }
    });

    // Ensure image path is correct (handle if it starts with / or not)
    const imageUrl = post.imageUrl?.startsWith('/')
        ? post.imageUrl
        : `/${post.imageUrl}`;

    return (
        <article className="post-container container mx-auto px-4 py-16 max-w-[1000px]">
            <div className="max-w-[850px] mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-[var(--color-primary)] hover:underline text-sm font-medium flex items-center gap-1">
                        &larr; Voltar para Home
                    </Link>
                </div>

                <header className="post-header text-center mb-12">
                    <div className="flex justify-center items-center gap-2 text-[var(--color-primary)] uppercase tracking-wider text-xs font-bold mb-4">
                        <span>{post.category?.name || 'Geral'}</span>
                        <span>•</span>
                        <span>{post.createdAt.toLocaleDateString("pt-BR")}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[var(--color-text)] mb-6">
                        {post.title}
                    </h1>
                </header>

                {post.imageUrl && (
                    <div className="w-full aspect-video bg-neutral-100 rounded-lg overflow-hidden mb-12 shadow-xl border border-gray-100">
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="post-content-body prose prose-lg max-w-none text-neutral-900 mb-16">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="mt-20 pt-12 border-t border-gray-200">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2 block">Loja Bom Trabalho</span>
                            <h2 className="text-3xl font-bold text-gray-900">Produtos sugeridos para você</h2>
                        </div>
                        <a
                            href="https://www.lojabomtrabalho.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                        >
                            Ver loja completa &rarr;
                        </a>
                    </div>
                    <ProductCarousel products={relatedProducts as any} />
                </section>
            )}

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
                <section className="mt-20 pt-12 border-t border-gray-200">
                    <PostCarousel posts={relatedPosts as any} />
                </section>
            )}
        </article>
    );
}
