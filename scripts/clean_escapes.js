const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('foco-02.js', code, 'utf8');
