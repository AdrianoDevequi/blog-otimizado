const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function importData() {
    const prisma = new PrismaClient();
    console.log('🚀 Starting data import to production database...');

    try {
        const backup = JSON.parse(fs.readFileSync('scripts/local_backup.json', 'utf8'));

        // 1. Categories
        console.log('📂 Importing Categories...');
        for (const cat of backup.categories) {
            await prisma.category.upsert({
                where: { id: cat.id },
                update: { name: cat.name, slug: cat.slug },
                create: { id: cat.id, name: cat.name, slug: cat.slug }
            });
        }

        // 2. Products (Dependencies: Categories)
        console.log('📦 Importing Products...');
        for (const prod of backup.products) {
            await prisma.product.upsert({
                where: { id: prod.id },
                update: {
                    title: prod.title,
                    sku: prod.sku,
                    price: prod.price,
                    imageUrl: prod.imageUrl,
                    url: prod.url,
                    categoryId: prod.categoryId
                },
                create: {
                    id: prod.id,
                    title: prod.title,
                    sku: prod.sku,
                    price: prod.price,
                    imageUrl: prod.imageUrl,
                    url: prod.url,
                    categoryId: prod.categoryId
                }
            });
        }

        // 3. Posts (Dependencies: Categories)
        console.log('📝 Importing Posts...');
        for (const post of backup.posts) {
            await prisma.post.upsert({
                where: { id: post.id },
                update: {
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content: post.content,
                    imageUrl: post.imageUrl,
                    categoryId: post.categoryId,
                    categoryName: post.categoryName,
                    createdAt: new Date(post.createdAt),
                    updatedAt: new Date(post.updatedAt)
                },
                create: {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content: post.content,
                    imageUrl: post.imageUrl,
                    categoryId: post.categoryId,
                    categoryName: post.categoryName,
                    createdAt: new Date(post.createdAt),
                    updatedAt: new Date(post.updatedAt)
                }
            });
        }

        // 4. Users
        console.log('👤 Importing Users...');
        for (const user of backup.users) {
            await prisma.user.upsert({
                where: { id: user.id },
                update: { username: user.username, password: user.password },
                create: { id: user.id, username: user.username, password: user.password }
            });
        }

        console.log('✅ Data migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importData();
