const fs = require('fs');
let text = fs.readFileSync('foco-02.js', 'utf8');

const targetStr = 'if (key.match(/^imoveis\\[\\d+\\]\\[rip\\]$/)) {';
if (text.includes(targetStr)) {
    text = text.replace(targetStr, `if (key === 'rip' || key.match(/^imoveis\\[\\d+\\]\\[rip\\]$/)) {`);
    fs.writeFileSync('foco-02.js', text, 'utf8');
    console.log('Fixed RIP reading logic!');
} else {
    console.log('Could not find logic to replace.');
}
