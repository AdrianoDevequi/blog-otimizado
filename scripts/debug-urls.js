const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const STORE_URL = 'https://www.lojabomtrabalho.com.br';
const urls = ['/epi', '/epi/protecao-respiratoria'];

async function debug() {
    for (const url of urls) {
        console.log(`\nChecking URL: ${url}`);
        try {
            const { data } = await axios.get(`${STORE_URL}${url}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);
            console.log('Items found with .item:', $('.item').length);
            console.log('Items found with .product-image:', $('.product-image').length);

            // If .item not found, look for other common Magento/Bis2Bis grid classes
            if ($('.item').length === 0) {
                console.log('Body classes:', $('body').attr('class'));
                console.log('Found .product-item?', $('.product-item').length);
                console.log('Found [class*="product"]?', $('[class*="product"]').length);
            }

            fs.writeFileSync(`scripts/debug-${url.replace(/\//g, '-')}.html`, data);
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
}

debug();
