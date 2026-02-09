const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://blog.lojabomtrabalho.com.br';

async function main() {
    try {
        console.log(`Fetching ${BASE_URL}...`);
        const { data } = await axios.get(BASE_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        // Find first article link
        let firstPostLink = null;
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            // Heuristic: http(s), from domain, not category/page/admin, not anchor
            if (href && href.startsWith('http') && href.includes('blog.lojabomtrabalho.com.br') &&
                !href.includes('/category/') && !href.includes('/page/') && !href.includes('wp-admin') && !href.includes('#')) {

                // Exclude some common non-post pages if known, but this should be enough
                if (!firstPostLink) firstPostLink = href;
            }
        });

        if (!firstPostLink) {
            console.log("No post link found on homepage.");
            return;
        }

        console.log(`Fetching post: ${firstPostLink}`);
        const postRes = await axios.get(firstPostLink, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $post = cheerio.load(postRes.data);

        console.log("--- Analyzing Post Page for Categories ---");

        // Try common selectors
        const selectors = [
            '.cat-links',
            '.entry-categories',
            '.post-categories',
            'a[rel="category tag"]',
            '.meta-category',
            '.entry-meta .category',
            'header .category',
            '.ast-post-meta a',
            '.uagb-post__text-object a'
        ];

        selectors.forEach(sel => {
            let found = false;
            $post(sel).each((i, el) => {
                found = true;
                console.log(`Selector '${sel}' [${i}] Text: "${$post(el).text().trim()}" | Href: ${$post(el).attr('href')}`);
            });
            if (!found) console.log(`Selector '${sel}': Not found`);
        });

        // Also check if we can find purely by text
        console.log("--- Searching for links containing '/category/' ---");
        $post('a[href*="/category/"]').each((i, el) => {
            console.log(`  [${i}] Text: "${$post(el).text().trim()}" | Href: ${$post(el).attr('href')} | Parent Class: ${$post(el).parent().attr('class')}`);
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
