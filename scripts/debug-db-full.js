const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        include: {
            products: {
                take: 1
            },
            _count: {
                select: { products: true }
            }
        }
    });

    console.log('--- DATABASE STATUS ---');
    for (const cat of categories) {
        console.log(`Slug: ${cat.slug}`);
        console.log(`Name: ${cat.name}`);
        console.log(`Products Count: ${cat._count.products}`);
        if (cat.products.length > 0) {
            console.log(`Example: ${cat.products[0].title}`);
        }
        console.log('------------------------');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
