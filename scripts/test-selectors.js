const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('scripts/category-page.html', 'utf8');
const $ = cheerio.load(html);

const products = [];
$('.item').each((i, elem) => {
    const $elem = $(elem);
    const title = $elem.find('.product-name a').first().text().trim();
    const productLink = $elem.find('.product-name a').first().attr('href');
    const priceText = $elem.find('.priceAvista .price').first().text().trim() ||
        $elem.find('.regular-price .price').first().text().trim();
    const imageUrl = $elem.find('.product-image img.imagem1').first().attr('src');

    if (title) {
        products.push({ title, priceText, imageUrl, productLink });
    }
});

console.log(`Found ${products.length} products in local HTML`);
console.log('Sample:', products.slice(0, 2));
