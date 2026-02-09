const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://blog.lojabomtrabalho.com.br';

async function getTitles(url) {
    console.log(`Fetching ${url}...`);
    const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(data);

    const pageTitle = $('title').text();
    const canonical = $('link[rel="canonical"]').attr('href');
    console.log(`  Page Title: ${pageTitle}`);
    console.log(`  Canonical: ${canonical}`);

    // Check for pagination links
    const nextLink = $('a.next').attr('href') || $('a.next-page').attr('href') || $('.pagination .next a').attr('href') || $('a.page-numbers').last().attr('href');
    console.log(`  Next Link found: ${nextLink}`);

    // Try query param
    if (url === BASE_URL) {
        console.log("  Checking ?page=2...");
        await getTitles(`${BASE_URL}/?page=2`);
        console.log("  Checking ?paged=2...");
        await getTitles(`${BASE_URL}/?paged=2`);
    }

    const titles = [];
    $('article.uagb-post__inner-wrap h4 a').each((i, el) => {
        titles.push($(el).text().trim());
    });

    // Check for other article selectors if UAGB is just a widget
    const otherArticles = [];
    $('main article h2 a, main article h3 a').each((i, el) => {
        otherArticles.push($(el).text().trim());
    });
    if (otherArticles.length > 0) {
        console.log(`  Found ${otherArticles.length} other articles (h2/h3).`);
        // titles.push(...otherArticles);
    }

    return titles;
}

async function main() {
    try {
        const page1 = await getTitles(BASE_URL);
        console.log(`Page 1 has ${page1.length} posts.`);
        console.log('Page 1 Titles:', page1.slice(0, 3));

        const page2 = await getTitles(`${BASE_URL}/page/2/`);
        console.log(`Page 2 has ${page2.length} posts.`);
        console.log('Page 2 Titles:', page2.slice(0, 3));

        // Compare
        const duplicates = page1.filter(t => page2.includes(t));
        if (duplicates.length > 0) {
            console.log('Found duplicates between page 1 and 2:', duplicates.length);
        } else {
            console.log('Page 1 and 2 are distinct.');
        }

    } catch (e) {
        console.error(e);
    }
}

main();
