const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// Replace the buggy replace syntax
code = code.replace(/\$\{label\.replace\(\/'\/g, \\"\\\\'\\"\)\}/g, "\\${label.replace(/'/g, \\\"\\\\\\\\\\\"\\\")}");
code = code.replace(/\$\{value\.replace\(\/'\/g, \\"\\\\'\\"\)\}/g, "\\${value.replace(/'/g, \\\"\\\\\\\\\\\"\\\")}");

// But wait, the easiest way is to just remove the replace entirely inside the HTML and handle it outside!
code = code.replace(/\$\{label\.replace\(\/'\/g, \\"\\\\'\\"\)\}/g, "${label}");
code = code.replace(/\$\{value\.replace\(\/'\/g, \\"\\\\'\\"\)\}/g, "${value}");
// Actually, if label or value contains single quotes, it will break the HTML.
// So let's replace `\"\\'\"` with `\"'\"` or something valid.
// The literal in the file is `\"\\'\"`. I will replace it with `\'` inside the file:
code = code.replace(/\\\"\\\\\'\\\"/g, `"\\\\'"`);

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Fixed syntax error.');
