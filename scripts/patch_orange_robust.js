const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// Match everything from color:#ea580c;"> until </span>
code = code.replace(/color:#ea580c;">[^<]+<\/span>/g, 'color:#ea580c;">⚠️</span>');

// Also fix the tooltip text
code = code.replace(/title="Se vocé tiver acesso a esse dado, pode preenché-lo"/g, 'title="Se você tiver acesso a esse dado, pode preenchê-lo"');
// Or match by prefix just in case the "é" is weird
code = code.replace(/title="Se voc[^ ]* tiver acesso a esse dado, pode preench[^ ]*-lo"/g, 'title="Se você tiver acesso a esse dado, pode preenchê-lo"');

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Orange icon and title patched.');
