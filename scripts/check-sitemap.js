const axios = require('axios');

const urls = [
    'https://blog.lojabomtrabalho.com.br/sitemap.xml',
    'https://blog.lojabomtrabalho.com.br/sitemap_index.xml',
    'https://blog.lojabomtrabalho.com.br/wp-sitemap.xml',
    'https://blog.lojabomtrabalho.com.br/post-sitemap.xml'
];

async function check(url) {
    try {
        console.log(`Checking ${url}...`);
        const res = await axios.head(url, { validateStatus: false });
        console.log(`  Status: ${res.status}`);
        if (res.status === 200) return true;
    } catch (e) {
        console.log(`  Error: ${e.message}`);
    }
    return false;
}

async function main() {
    for (const url of urls) {
        if (await check(url)) {
            console.log(`Found sitemap: ${url}`);
            // We can break or find more specific ones
        }
    }
}

main();
