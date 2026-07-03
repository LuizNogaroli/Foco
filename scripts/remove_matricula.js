const fs = require('fs');

// 1. Remove HTML block
let html = fs.readFileSync('foco-02.html', 'utf8');

const matriculaRegex = /<!-- Matrícula -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
if (html.match(matriculaRegex)) {
    html = html.replace(matriculaRegex, '');
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Removed Matrícula from HTML');
} else {
    // try fallback regex
    const fallbackRegex = /<!-- Matrícula -->[\s\S]*?id="secaoMatricula"[\s\S]*?<!-- Geolocalização -->/i;
    if (html.match(fallbackRegex)) {
        html = html.replace(fallbackRegex, '<!-- Geolocalização -->');
        fs.writeFileSync('foco-02.html', html, 'utf8');
        console.log('Removed Matrícula from HTML using fallback');
    } else {
        console.log('Could not find Matrícula in HTML');
    }
}

// 2. Add Cartório to JS
let js = fs.readFileSync('foco-02.js', 'utf8');

const searchJs = "\\${buildField('Número do Processo', 'numero_processo', dados.numero_processo)}\n            \\${buildField('Matrícula', 'matricula', dados.matricula)}";
const replaceJs = "\\${buildField('Número do Processo', 'numero_processo', dados.numero_processo)}\n            \\${buildField('Cartório', 'cartorio', dados.cartorio)}\n            \\${buildField('Matrícula', 'matricula', dados.matricula)}";

if (js.includes(searchJs)) {
    js = js.replace(searchJs, replaceJs);
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Added Cartório to JS');
} else {
    console.log('Could not find Matrícula in JS to insert Cartório');
}
