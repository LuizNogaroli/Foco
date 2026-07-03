const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// Replace the buggy onclicks
code = code.replace(/onclick="openSolicitacaoModal\('\$\{rip\}', '\$\{name\}', '[^']+', '[^']+'\)"/g, 
    `onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${encodeURIComponent(label)}', '\${encodeURIComponent(value || \\'\\')}')"`);

// Replace the other buggy onclick
code = code.replace(/onclick="openSolicitacaoModal\('\$\{rip\}', '\$\{name\}', '[^']+', ''\)"/g, 
    `onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${encodeURIComponent(label)}', '')"`);

// Update openSolicitacaoModal function to decode
let modalCode = `window.openSolicitacaoModal = function(rip, campoKey, campoNome, valorAtual) {
    document.getElementById('modal-rip').value = rip;
    document.getElementById('modal-campo-key').value = campoKey;
    document.getElementById('modal-campo-nome').value = decodeURIComponent(campoNome).replace(/<[^>]+>/g, '');
    document.getElementById('modal-valor-atual').value = decodeURIComponent(valorAtual);
    document.getElementById('modal-novo-valor').value = decodeURIComponent(valorAtual) || '';
    document.getElementById('modal-justificativa').value = '';
    document.getElementById('modal-fundamentacao').value = '';
    document.getElementById('solicitacaoModal').style.display = 'flex';
};`;

code = code.replace(/window\.openSolicitacaoModal = function[\s\S]*?solicitacaoModal'\)\.style\.display = 'flex';\n\};/m, modalCode);

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Fixed onclick string escaping.');
