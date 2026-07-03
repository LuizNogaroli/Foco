const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// Inside criarBlocoImovel, ensure dados is at least an empty object
const search = 'window.criarBlocoImovel = function(rip, dados) {\n    const container = document.getElementById(\'imoveis-container\');';
const replacement = 'window.criarBlocoImovel = function(rip, dados) {\n    dados = dados || {};\n    const container = document.getElementById(\'imoveis-container\');';

if (code.includes(search)) {
    code = code.replace(search, replacement);
    fs.writeFileSync('foco-02.js', code, 'utf8');
    console.log('Fixed dados = dados || {} in criarBlocoImovel');
} else {
    // try another regex if formatting differs
    code = code.replace(/window\.criarBlocoImovel = function\(rip, dados\) \{/, 'window.criarBlocoImovel = function(rip, dados) {\n    dados = dados || {};');
    fs.writeFileSync('foco-02.js', code, 'utf8');
    console.log('Fixed using regex.');
}
