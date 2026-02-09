const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany();
    console.log('Categories in DB:');
    categories.forEach(c => console.log(`- ${c.name} (${c.slug})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
