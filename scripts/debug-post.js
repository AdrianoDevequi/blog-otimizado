const axios = require('axios');
const fs = require('fs');

async function check() {
    try {
        const { data } = await axios.get('http://localhost:3000/botina-para-trabalho-em-superficies-escorregadias-tracao-e-aderencia-como-prioridade');
        fs.writeFileSync('scripts/debug-post-page.html', data);
        console.log('Post page HTML captured.');

        if (data.includes('Produtos sugeridos para você')) {
            console.log('Carousel section found!');
        } else {
            console.log('Carousel section NOT found in HTML.');
        }

        if (data.includes('text-neutral-900')) {
            console.log('Dark text class found!');
        }
    } catch (e) {
        console.error('Error fetching post page:', e.message);
    }
}

check();
