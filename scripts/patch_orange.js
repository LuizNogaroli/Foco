const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// The line is:
// style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">é </span>

code = code.replace(/>é <\/span>/g, '>⚠️</span>');

// Let's also fix: "Se vocé tiver acesso a esse dado, pode preenché-lo"
code = code.replace(/Se vocé tiver acesso a esse dado, pode preenché-lo/g, 'Se você tiver acesso a esse dado, pode preenchê-lo');

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Fixed orange icon.');
