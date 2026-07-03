const fs = require('fs');

let html = fs.readFileSync('foco-02.html', 'utf8');
const ts = Date.now();

// Substitui ?v=... por timestamp atual em foco-02.js e sync.js
html = html.replace(/foco-02\.js\?v=\d+/g, `foco-02.js?v=${ts}`);
html = html.replace(/sync\.js\?v=\d+/g, `sync.js?v=${ts}`);

fs.writeFileSync('foco-02.html', html, 'utf8');
console.log('Cache busters updated in foco-02.html');
