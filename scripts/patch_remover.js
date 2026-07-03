const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

const startSig = 'window.adicionarTagRIP = function';
const endSig = "const tag = document.querySelector('.rip-tag[data-rip=\"' + rip + '\"]');";

const startIndex = code.indexOf(startSig);
const endIndex = code.indexOf(endSig);

if (startIndex === -1 || endIndex === -1) {
    console.log('Cannot find signatures');
    process.exit(1);
}

const pristineCode = `window.adicionarTagRIP = function(rip, dados) {
    const lista = document.getElementById('listaRIPsAssociados');
    if (lista) lista.style.display = 'flex';
    
    if (document.querySelector('.rip-tag[data-rip="' + rip + '"]')) return;

    const div = document.createElement('div');
    div.className = 'rip-tag';
    div.dataset.rip = rip;
    div.style.padding = '10px 14px';
    div.style.border = '1px solid #c8e6c9';
    div.style.backgroundColor = '#e8f5e9';
    div.style.borderRadius = '6px';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    
    div.innerHTML = \`
        <span><strong style="color: #2e7d32; font-size: 1.1em;">RIP: \${rip}</strong> - \${dados ? (dados.natureza || dados.natureza_terreno || 'Terreno Importado') : 'Terreno Importado'}</span>
        <button type="button" class="btn-remove-rip" style="background: none; border: none; color: #c62828; cursor: pointer; font-weight: bold; font-size: 1.2em;" onclick="removerRIP('\${rip}')" title="Remover RIP">✖</button>
    \`;
    if (lista) lista.appendChild(div);
};

window.removerRIP = function(rip) {
    if (confirm('Tem certeza que deseja remover este RIP do requerimento? (Esta ação afetará as próximas abas)')) {
        `;

const newCode = code.substring(0, startIndex) + pristineCode + code.substring(endIndex);
fs.writeFileSync('foco-02.js', newCode, 'utf8');
console.log('Patch aplicado com sucesso.');
