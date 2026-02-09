const axios = require('axios');
const cheerio = require('cheerio');

const STORE_URL = 'https://www.lojabomtrabalho.com.br';
const url = '/epi/protecao-respiratoria';

async function debug() {
    try {
        const { data } = await axios.get(`${STORE_URL}${url}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        console.log('HTML Length:', data.length);
        const $ = cheerio.load(data);
        console.log('Items found with .item:', $('.item').length);
        console.log('Items found with .product-image:', $('.product-image').length);
        console.log('Body classes:', $('body').attr('class'));

        // Save to debug file
        const fs = require('fs');
        fs.writeFileSync('scripts/live-debug.html', data);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

debug();
