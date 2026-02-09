const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProduct() {
    const url = 'https://www.lojabomtrabalho.com.br/8822';
    console.log(`Scraping: ${url}`);

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(data);

        // Try common selectors for product data
        const title = $('h1').first().text().trim() ||
            $('.product-name').text().trim() ||
            $('[itemprop="name"]').text().trim();

        const price = $('.price').first().text().trim() ||
            $('[itemprop="price"]').attr('content') ||
            $('.product-price').text().trim() ||
            $('.valor').text().trim();

        const image = $('img[itemprop="image"]').attr('src') ||
            $('.product-image img').attr('src') ||
            $('.gallery img').first().attr('src');

        console.log('\n=== Product Data ===');
        console.log('Title:', title);
        console.log('Price:', price);
        console.log('Image:', image);

        // Look for category/breadcrumbs
        const breadcrumbs = [];
        $('.breadcrumb a, .breadcrumbs a').each((i, el) => {
            breadcrumbs.push($(el).text().trim());
        });
        console.log('Breadcrumbs:', breadcrumbs);

    } catch (e) {
        console.error('Error:', e.message);
    }
}

scrapeProduct();
