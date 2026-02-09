const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function debugCategoryPage() {
    const url = 'https://www.lojabomtrabalho.com.br/epi/protecao-respiratoria';
    console.log(`Fetching: ${url}\n`);

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Save HTML for inspection
        fs.writeFileSync('scripts/category-page.html', data);
        console.log('✓ Saved HTML to scripts/category-page.html\n');

        const $ = cheerio.load(data);

        // Try to find product containers
        console.log('=== Looking for product containers ===');
        console.log('Elements with "product" in class:', $('[class*="product"]').length);
        console.log('Elements with "item" in class:', $('[class*="item"]').length);
        console.log('Elements with "card" in class:', $('[class*="card"]').length);

        // Look for links to product pages
        console.log('\n=== Product Links ===');
        const links = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.match(/\/\d+$/)) { // Links ending with numbers (like /8822)
                links.push(href);
            }
        });
        console.log(`Found ${links.length} links to products (ending with numbers)`);
        console.log('Sample links:', links.slice(0, 5));

        // Look for price elements
        console.log('\n=== Price Elements ===');
        console.log('Elements with "price":', $('[class*="price"]').length);
        console.log('Elements with "preco":', $('[class*="preco"]').length);
        console.log('Elements with "valor":', $('[class*="valor"]').length);
        console.log('Elements with R$:', $('*:contains("R$")').length);

        // Sample first potential product
        if (links.length > 0) {
            console.log('\n=== First Product Link Analysis ===');
            const firstLink = links[0];
            const $parent = $(`a[href="${firstLink}"]`).closest('[class*="product"], [class*="item"], li, div');
            console.log('Parent element classes:', $parent.attr('class'));
            console.log('Parent HTML preview:', $parent.html()?.substring(0, 300));
        }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

debugCategoryPage();
