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

        console.log('--- Images found ---');
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            const dataSrc = $(el).attr('data-src');
            const dataLazySrc = $(el).attr('data-lazy-src');
            const alt = $(el).attr('alt');
            const className = $(el).attr('class');

            if (alt && alt.toLowerCase().includes('logo') || (className && className.toLowerCase().includes('logo'))) {
                console.log(`[POTENTIAL LOGO] Index: ${i}`);
                console.log(`  Src: ${src}`);
                console.log(`  DataSrc: ${dataSrc}`);
                console.log(`  DataLazySrc: ${dataLazySrc}`);
                console.log(`  Alt: ${alt}`);
                console.log(`  Class: ${className}`);
            }
        });
        console.log('--- End ---');

    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
