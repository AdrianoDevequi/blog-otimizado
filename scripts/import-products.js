const axios = require('axios');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const STORE_URL = 'https://www.lojabomtrabalho.com.br';

// Mapping of blog categories to store category URLs
// We use specific subcategories to avoid SKU overlap and moving products
const CATEGORY_MAPPING = {
    'equipamento-de-protecao-individual': '/epi/protecao-respiratoria',
    'seguranca-no-trabalho': '/epi/calcados-de-seguranca',
};

async function scrapeProducts(categoryUrl) {
    console.log(`\nScraping products from: ${categoryUrl}`);

    try {
        const { data } = await axios.get(`${STORE_URL}${categoryUrl}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const products = [];

        $('.item').each((i, elem) => {
            const $elem = $(elem);

            // Extract product data
            const title = $elem.find('.product-name a').first().text().trim();
            const productLink = $elem.find('.product-name a').first().attr('href');

            // Skip items without title or link
            if (!title || !productLink) return;

            const priceText = $elem.find('.priceAvista .price').first().text().trim() ||
                $elem.find('.regular-price .price').first().text().trim();

            const imageUrl = $elem.find('.product-image img.imagem1').first().attr('src');

            const sku = productLink.split('/').filter(Boolean).pop();
            const fullUrl = productLink.startsWith('http') ? productLink : `${STORE_URL}${productLink}`;

            products.push({
                title,
                sku,
                price: priceText || null,
                imageUrl: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${STORE_URL}${imageUrl}`) : null,
                url: fullUrl,
            });

            if (products.length >= 12) return false;
        });

        console.log(`Found ${products.length} products for ${categoryUrl}`);
        return products;

    } catch (e) {
        console.error(`Error scraping ${categoryUrl}:`, e.message);
        return [];
    }
}

async function importProducts() {
    console.log('Starting product import...');

    // First, clear products to avoid stale assignments if needed, 
    // but better to just let upsert move them to the correct ones in this run.

    for (const [blogSlug, storeUrl] of Object.entries(CATEGORY_MAPPING)) {
        console.log(`\n📦 Processing category: ${blogSlug}`);

        const category = await prisma.category.findUnique({
            where: { slug: blogSlug }
        });

        if (!category) {
            console.log(`❌ Blog category not found: ${blogSlug}`);
            continue;
        }

        const products = await scrapeProducts(storeUrl);

        for (const product of products) {
            try {
                await prisma.product.upsert({
                    where: { sku: product.sku },
                    update: {
                        title: product.title,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        url: product.url,
                        categoryId: category.id
                    },
                    create: {
                        title: product.title,
                        sku: product.sku,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        url: product.url,
                        categoryId: category.id
                    }
                });
                console.log(`  ✓ ${product.title}`);
            } catch (e) {
                console.error(`  ✗ Failed to save ${product.sku}:`, e.message);
            }
        }
    }

    console.log('\n✅ Product import complete!');
}

importProducts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
