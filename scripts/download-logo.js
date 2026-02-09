const fs = require('fs');
const https = require('https');
const path = require('path');

const fileUrl = "https://blog.lojabomtrabalho.com.br/wp-content/uploads/2024/08/logo-blog-300.png";
const output = path.join(__dirname, '../public/logo.png');

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
};

const file = fs.createWriteStream(output);

console.log(`Downloading ${fileUrl} to ${output}...`);

https.get(fileUrl, options, function (response) {
    if (response.statusCode !== 200) {
        console.error(`Failed to download: status code ${response.statusCode}`);
        process.exit(1);
    }
    response.pipe(file);
    file.on('finish', function () {
        file.close(() => {
            console.log("Download completed.");
        });
    });
}).on('error', function (err) {
    fs.unlink(output, () => { }); // Delete the file async. (But we don't check the result)
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
