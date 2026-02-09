const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'homepage.html'), 'utf8');
const $ = cheerio.load(html);

console.log('--- Links ---');
$('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim().substring(0, 50);
    if (href && !href.startsWith('#')) {
        console.log(`${text} -> ${href}`);
    }
});

console.log('--- Buttons ---');
$('button').each((i, el) => {
    console.log($(el).text().trim());
});

console.log('--- Meta ---');
console.log('Count of articles:', $('article').length);
console.log('Count of uagb-post__inner-wrap:', $('.uagb-post__inner-wrap').length);
