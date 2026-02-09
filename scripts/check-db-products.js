const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    console.log('Category Overview:');
    categories.forEach(c => {
        console.log(`- ${c.name} (${c.slug}): ${c._count.products} products`);
    });

    const products = await prisma.product.findMany({
        take: 5,
        include: { category: true }
    });
    console.log('\nSample Products:');
    products.forEach(p => {
        console.log(`- ${p.title} (Cat: ${p.category.name})`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
