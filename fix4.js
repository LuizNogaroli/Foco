const fs = require('fs');
const path = require('path');

const map = {
    'conex\uFFFDo': 'conexão',
    'Fun\uFFFD\uFFFDo': 'Função',
    'Fun\uFFFDo': 'Função',
    'dispon\uFFFDvel': 'disponível',
    'dispon\uFFFD': 'disponível', // in case it was cut off
};

function fixEncoding(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix regular words
    for (const [broken, correct] of Object.entries(map)) {
        content = content.split(broken).join(correct);
    }
    
    // Fix corrupted BOMs or corrupted decorative comments at start of lines
    content = content.replace(/^\uFFFD\/\//gm, '//');
    content = content.replace(/^\uFFFD\/\*\*/gm, '/**');
    content = content.replace(/^\uFFFDdocument/gm, 'document');
    content = content.replace(/\/\/ \uFFFD"\uFFFD\uFFFD"\uFFFD\uFFFD"\uFFFD\uFFFD"\uFFFD\uFFFD"\uFFFD/g, '// ==============================');
    content = content.replace(/\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD/g, '======');
    
    // General cleanup of stray \uFFFD used as borders or dividers
    content = content.replace(/\/\/ \uFFFD+/g, '// ==============================');
    
    // Remove isolated \uFFFD from start of file
    if (content.startsWith('\uFFFD')) {
        content = content.substring(1);
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
            // For inspect.js, let's just rewrite it correctly if it's UTF-16 LE
            if (file === 'inspect.js') {
                const buf = fs.readFileSync(fullPath);
                // Check if UTF-16 LE BOM
                if (buf[0] === 0xFF && buf[1] === 0xFE) {
                    const utf16Content = buf.toString('utf16le');
                    fs.writeFileSync(fullPath, utf16Content, 'utf8');
                    console.log('Converted to UTF-8:', fullPath);
                }
            } else {
                fixEncoding(fullPath);
            }
        }
    }
}

processDir('.');
