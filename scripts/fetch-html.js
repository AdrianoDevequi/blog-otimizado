const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('blog_source.html', 'utf8');
const $ = cheerio.load(html);

// Find the first post container by looking for the title
const titleLink = $('h4 a').first();
const container = titleLink.closest('article'); // Guessing 'article' or similar

if (container.length > 0) {
    console.log('Container found:', container.prop('tagName'), container.attr('class'));
    console.log('Title:', titleLink.text());
    console.log('Link:', titleLink.attr('href'));
    console.log('Image:', container.find('img').attr('src'));
    console.log('Excerpt:', container.find('p').first().text());
} else {
    // If no article tag, try to find a common parent
    console.log('No <article> container found. identifying parent...');
    console.log('Parent of h4:', titleLink.parent().parent().prop('tagName'), titleLink.parent().parent().attr('class'));
}

// List all h4 titles to verify
console.log('\nAll Titles found:');
$('h4 a').each((i, el) => {
    console.log($(el).text().trim());
});
