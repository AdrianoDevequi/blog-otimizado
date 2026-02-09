const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SITEMAP_URL = 'https://blog.lojabomtrabalho.com.br/post-sitemap.xml';
const UPLOAD_DIR = path.join(__dirname, '../public/uploads/imported');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configured Axios instance
const client = axios.create({
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
});

async function fetchWithRetry(url, options = {}, retries = 3) {
    try {
        return await client.get(url, options);
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying ${url} (${retries} left)...`);
            await new Promise(res => setTimeout(res, 2000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

async function downloadImage(url, filename) {
    try {
        const response = await client({
            url,
            responseType: 'stream',
        });
        const filepath = path.join(UPLOAD_DIR, filename);
        const writer = fs.createWriteStream(filepath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(true));
            writer.on('error', (err) => reject(err));
            setTimeout(() => {
                writer.destroy();
                reject(new Error('Timeout'));
            }, 60000);
        });
    } catch (error) {
        // console.error(`    > Failed to download image ${url}:`, error.message);
        return null;
    }
}

async function scrapePost(url) {
    // console.log(`Processing: ${url}`);
    try {
        const { data } = await fetchWithRetry(url);
        const $ = cheerio.load(data);
        const article = $('article').first();

        // Title
        let title = $('h1.entry-title').text().trim() || $('h1').first().text().trim();
        if (!title) {
            console.log(`  Skipping ${url} - No title found`);
            return;
        }

        // Slug
        let slug = url.replace('https://blog.lojabomtrabalho.com.br/', '').replace(/^\//, '').replace(/\/$/, '');
        if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Check Metadata
        const dateStr = $('time[itemprop="datePublished"]').attr('datetime') || $('time').attr('datetime');
        const createdAt = dateStr ? new Date(dateStr) : new Date();

        // Content
        let content = $('.entry-content').html() || $('article').html();

        // Image
        let featuredImageSrc =
            $('[itemprop="image"]').attr('content') ||
            $('.entry-content img').first().attr('src') ||
            $('meta[property="og:image"]').attr('content');

        let featuredImageUrl = null;
        if (featuredImageSrc) {
            const ext = path.extname(featuredImageSrc.split('?')[0]) || '.jpg';
            const filename = `featured-${slug}-${Date.now()}${ext}`;

            // Check if exists in DB to avoid re-download logic if strictly needed, 
            // but here we just download if we don't have it locally? 
            // Ideally we check DB.
            // For simplicity, let's assume valid.
            await downloadImage(featuredImageSrc, filename);
            featuredImageUrl = `/uploads/imported/${filename}`;
        }

        // Categories
        let categoryName = '';
        let categorySlug = '';

        const catSelectors = [
            '.cat-links a',
            '.entry-categories a',
            'a[rel="category tag"]',
            '.meta-category a'
        ];

        for (const sel of catSelectors) {
            const el = $(sel).first();
            if (el.length) {
                categoryName = el.text().trim();
                const href = el.attr('href');
                if (href) {
                    const match = href.match(/\/category\/([^\/]+)\/?/);
                    if (match && match[1]) categorySlug = match[1];
                }
                break;
            }
        }

        if (!categoryName) categoryName = 'Geral';

        // Normalize EPI
        if (categoryName.toUpperCase() === 'EPI' || categoryName === 'EPIs') {
            categoryName = 'Equipamento de Proteção Individual';
        }

        if (!categorySlug) categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (categorySlug === 'epi') categorySlug = 'equipamento-de-protecao-individual';

        // Upsert Category
        const categoryRecord = await prisma.category.upsert({
            where: { slug: categorySlug },
            update: { name: categoryName },
            create: { name: categoryName, slug: categorySlug }
        });

        // Upsert Post
        await prisma.post.upsert({
            where: { slug },
            update: {
                imageUrl: featuredImageUrl, // Update if new one found
                categoryId: categoryRecord.id,
                categoryName: categoryName
            },
            create: {
                title: title.substring(0, 191),
                slug,
                content: content || '',
                excerpt: $('.entry-content p').first().text().substring(0, 191) || '',
                categoryId: categoryRecord.id,
                categoryName: categoryName,
                imageUrl: featuredImageUrl,
                createdAt
            }
        });

        process.stdout.write('.');

    } catch (e) {
        console.error(`\nError processing ${url}: ${e.message}`);
    }
}

async function main() {
    console.log('Fetching sitemap...');
    try {
        const { data } = await axios.get(SITEMAP_URL);
        const $ = cheerio.load(data, { xmlMode: true });

        const urls = [];
        $('loc').each((i, el) => {
            const url = $(el).text().trim();
            if (url.includes('https://blog.lojabomtrabalho.com.br/') && !url.includes('.xml')) {
                urls.push(url);
            }
        });

        console.log(`Found ${urls.length} posts in sitemap.`);

        // Process in chunks/batches to avoid overloading
        for (let i = 0; i < urls.length; i++) {
            await scrapePost(urls[i]);
            if (i % 10 === 0) await new Promise(r => setTimeout(r, 100));
        }

        console.log('\nDone!');

    } catch (e) {
        console.error("Fatal error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
