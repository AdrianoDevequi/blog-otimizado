const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function exportData() {
    const prisma = new PrismaClient();
    console.log('📦 Starting data export from local database...');

    try {
        const categories = await prisma.category.findMany();
        const posts = await prisma.post.findMany();
        const products = await prisma.product.findMany();
        const users = await prisma.user.findMany();

        const data = {
            categories,
            posts,
            products,
            users
        };

        fs.writeFileSync('scripts/local_backup.json', JSON.stringify(data, null, 2));

        console.log(`✅ Export complete!`);
        console.log(`- Categories: ${categories.length}`);
        console.log(`- Posts: ${posts.length}`);
        console.log(`- Products: ${products.length}`);
        console.log(`- Users: ${users.length}`);
    } catch (error) {
        console.error('❌ Export failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

exportData();
