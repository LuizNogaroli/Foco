const fs = require('fs');
const path = require('path');

const map = {
    'cuidar\uFFFD': 'cuidará',
    'TAXON\uFFFD\u001dMICO': 'TAXONÔMICO',
    'TAXON\uFFFDMICO': 'TAXONÔMICO',
    '\u001d\uFFFD\uFFFD\u001d\uFFFD': '',
    '\uFFFD"': '"',
    '\uFFFD"': '"',
    '\uFFFD': 'é' // fallback for anything else
};

function fixEncoding(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const [broken, correct] of Object.entries(map)) {
        content = content.split(broken).join(correct);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file.startsWith('.')) continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            fixEncoding(fullPath);
        }
    }
}

processDir('.');
