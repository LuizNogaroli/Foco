const fs = require('fs');

let html = fs.readFileSync('manifestacao-uf-tecnica.html', 'utf8');

// Change the cache buster for manifestacao-scripts.js
if (html.includes('manifestacao-scripts.js?v=')) {
    const newVersion = Date.now();
    html = html.replace(/manifestacao-scripts\.js\?v=\d+/, 'manifestacao-scripts.js?v=' + newVersion);
    fs.writeFileSync('manifestacao-uf-tecnica.html', html, 'utf8');
    console.log('Updated cache buster in manifestacao-uf-tecnica.html');
} else {
    console.log('Cache buster not found');
}
