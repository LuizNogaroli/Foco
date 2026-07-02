const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix the butchered cdn.js...delivr URL
    content = content.replace(/cdn\.js\?v=\d+delivr/g, 'cdn.jsdelivr');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Corrigido URL no arquivo: ${file}`);
}
