const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const timestamp = new Date().getTime();
const metaTags = `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Insere as meta tags de cache caso não existam
    if (!content.includes('Cache-Control')) {
        content = content.replace(/<head>/i, `<head>\n${metaTags}`);
    }

    // Atualiza todos os scripts e CSS para ter um timestamp único
    content = content.replace(/(src="[^"]+\.js)(\?v=[0-9]+)?([^"]*")/g, `$1?v=${timestamp}$3`);
    content = content.replace(/(href="[^"]+\.css)(\?v=[0-9]+)?([^"]*")/g, `$1?v=${timestamp}$3`);

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Atualizado: ${file}`);
}
