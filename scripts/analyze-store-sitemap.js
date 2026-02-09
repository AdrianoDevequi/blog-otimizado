const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

try {
    const xml = fs.readFileSync(path.join(__dirname, 'store-sitemap.xml'), 'utf8');
    const $ = cheerio.load(xml, { xmlMode: true });

    const count = $('url').length;
    console.log(`Found ${count} URLs in sitemap.`);

    // Filter for likely product URLs (approximate by depth or keywords)
    const productUrls = [];
    $('url loc').each((i, el) => {
        const url = $(el).text();
        // Assuming products have at least 2 levels or specific keywords
        // User example: https://www.lojabomtrabalho.com.br/epi/calcado-de-seguranca
        // That looks like a category.
        // Let's check for deeper ones or just list a bunch to inspect.
        if (url.split('/').length > 4) {
            productUrls.push(url);
        }
    });

    console.log(`Found ${productUrls.length} likely product URLs.`);
    console.log('Sample Product URLs:', productUrls.slice(0, 10));

    // Also look for specific EPI keywords
    const epiUrls = productUrls.filter(u => u.includes('respirador'));
    console.log('Sample Respirador URLs:');
    epiUrls.slice(0, 5).forEach(u => console.log(u));

} catch (e) {
    console.error(e.message);
}
