const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BASE_URL = 'https://blog.lojabomtrabalho.com.br';

async function main() {
    try {
        const posts = await prisma.post.findMany();
        console.log(`Found ${posts.length} posts to check.`);

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            const originalUrl = `${BASE_URL}/${post.slug}/`; // Assuming original URL structure matches slug

            console.log(`[${i + 1}/${posts.length}] Checking ${post.title}...`);

            try {
                const { data } = await axios.get(originalUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0' }
                });
                const $ = cheerio.load(data);

                let categoryName = '';
                let categorySlug = '';

                // Try common selectors in detail page
                const catSelectors = [
                    '.uagb-post__taxonomy a',
                    '.cat-links a',
                    '.entry-categories a',
                    '.post-categories a',
                    'a[rel="category tag"]',
                    '.meta-category a',
                    '.uagb-post__text-object a'
                ];

                for (const sel of catSelectors) {
                    const el = $(sel).first();
                    if (el.length) {
                        categoryName = el.text().trim();
                        if (el.attr('href')) {
                            const match = el.attr('href').match(/\/category\/([^\/]+)\/?/);
                            if (match && match[1]) categorySlug = match[1];
                        }
                        break;
                    }
                }

                if (categoryName) {
                    if (!categorySlug) categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                    console.log(`  -> Found Category: ${categoryName} (${categorySlug})`);

                    const category = await prisma.category.upsert({
                        where: { slug: categorySlug },
                        update: {},
                        create: { name: categoryName, slug: categorySlug }
                    });

                    await prisma.post.update({
                        where: { id: post.id },
                        data: {
                            categoryId: category.id,
                            categoryName: categoryName
                        }
                    });
                } else {
                    console.log("  -> No category found.");
                }

            } catch (err) {
                console.error(`  -> Error fetching ${originalUrl}: ${err.message}`);
                // Try alternate URL structure if 404?
            }

            // Random delay
            await new Promise(r => setTimeout(r, 200));
        }

    } catch (e) {
        console.error("Fatal error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
