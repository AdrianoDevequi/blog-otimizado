import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import FAQSection from "@/components/FAQSection";
import SeoContent from "@/components/SeoContent";
import { Rocket } from "lucide-react";
import ProductCarousel from "@/components/ProductCarousel";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch specific categories or all categories with posts
  const categories = await prisma.category.findMany({
    where: {
      posts: { some: {} } // Only categories with posts
    },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 3, // Take 3 latest per category
      },
    },
    take: 5, // Limit homepage sections
  });

  // Fetch random products for the bottom carousel
  // Strategy: Fetch a pool of latest products and shuffle them
  const productsPool = await prisma.product.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      imageUrl: true,
      sku: true,
      url: true // We need the external URL
    }
  });

  // Client-side shuffle for randomness
  const randomProducts = productsPool.sort(() => 0.5 - Math.random()).slice(0, 10);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center hero-content">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-8 bg-[var(--color-primary)]/5 shadow-[0_0_20px_rgba(217,37,37,0.15)]">
              <Rocket className="w-4 h-4" />
              <span>Referência Técnica em Segurança</span>
            </div>
            <h1>Segurança Profissional Começa Aqui: Guia de EPIs e Proteção no Trabalho</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-[800px] mx-auto">
              Descubra como proteger sua saúde com EPIs certificados e de qualidade. Conheça as melhores opções de botas, luvas, óculos e outros equipamentos, além de dicas essenciais para trabalhar com segurança e confiança em qualquer profissão.
            </p>
            <a href="#artigos" className="inline-block mt-8 group" aria-label="Rolar para o conteúdo">
              <div className="mouse-scroll"></div>
            </a>
          </div>
        </div>
      </section>

      <section id="artigos" className="py-16">
        <div className="container">
          {categories.map((category) => {
            // Logic to fill empty slots if fewer than 3 posts
            const postsToDisplay = [...category.posts];
            if (postsToDisplay.length > 0 && postsToDisplay.length < 3) {
              while (postsToDisplay.length < 3) {
                const original = postsToDisplay[0];
                postsToDisplay.push({
                  ...original,
                  id: `${original.id}-duplicate-${postsToDisplay.length}`, // Unique key
                  title: original.title // Keep title identical for visual consistency
                });
              }
            }

            return (
              <div key={category.id} className="mb-16 last:mb-0">
                <div className="flex justify-between items-end mb-8 mt-12">
                  <h2 className="text-3xl font-bold text-[var(--color-text)] relative inline-block">
                    {category.name}
                    <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[var(--color-primary)] rounded-full"></span>
                  </h2>
                  <Link href={`/category/${category.slug}`} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
                    Ver todos &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 posts-grid">
                  {postsToDisplay.map((post) => (
                    <article key={post.id} className="post-card group">
                      <div className="aspect-video bg-neutral-200 overflow-hidden post-image-wrapper relative">
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl.startsWith('/') ? post.imageUrl : `/${post.imageUrl}`}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={categories.indexOf(category) === 0} // Priority for first category
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
              </div>
            )
          })}
        </div>
      </section>
      <FAQSection />
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2 block">Loja Bom Trabalho</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Destaques da Loja</h2>
          </div>
          <ProductCarousel products={randomProducts} />
        </div>
      </section>
      <SeoContent />
    </>
  );
}
