const axios = require('axios');
const cheerio = require('cheerio');

const STORE_URL = 'https://www.lojabomtrabalho.com.br';
const urls = [
    '/epi/protecao-respiratoria',
    '/epi/calcados-de-seguranca',
    '/epi/luvas-de-protecao',
    '/epi/oculos-de-seguranca'
];

async function check() {
    for (const url of urls) {
        try {
            const { data } = await axios.get(`${STORE_URL}${url}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const $ = cheerio.load(data);
            console.log(`${url}: ${$('.item').length} items found`);
        } catch (e) {
            console.log(`${url}: Failed (${e.message})`);
        }
    }
}

check();
