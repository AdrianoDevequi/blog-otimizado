const fs = require('fs');
const cheerio = require('cheerio');

const xml = fs.readFileSync('./scripts/store-sitemap.xml', 'utf8');
const $ = cheerio.load(xml, { xmlMode: true });

$('loc').each((i, el) => {
    const txt = $(el).text();
    if (txt.includes('8822')) {
        console.log(txt);
    }
});
