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

        console.log('--- Links found ---');
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            if (href && href.includes(BASE_URL)) {
                // Heuristic for category links: often have /category/ or are in specific classes
                if (href.includes('/category/') || $(el).parent().attr('class')?.includes('cat')) {
                    console.log(`[CATEGORY?] Text: "${text}" | Href: ${href}`);
                }
            }
        });
        console.log('--- End ---');

    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
