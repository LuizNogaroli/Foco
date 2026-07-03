const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

// The empty field
code = code.replace(
    /(<input[^>]+name="imoveis\[\$\{index\}\]\[flags_manuais\]\[\$\{name\}\]"[^>]+value="true">\s*)(<span[^>]+title="Se você tiver acesso a esse dado, pode preenchê-lo"[^>]+>⚠️<\/span>)/g,
    `$1<span title="Solicitar inclusão deste dado faltante no cadastro SPUnet" 
                            style="cursor:pointer; font-size:1.1em; margin-left:6px; color:#0056b3;"
                            onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${label.replace(/'/g, \\"\\\\'\\")}', '')">${editIconSVG}</span>
                        $2`
);

// The filled field
code = code.replace(
    /(<input[^>]+name="imoveis\[\$\{index\}\]\[\$\{name\}\]"[^>]+value="\$\{value\}"[^>]+readonly class="auto-loaded-field" style="width:100%;">)/g,
    `$1
                        <span title="Solicitar alteração deste dado no cadastro SPUnet" 
                            style="cursor:pointer; font-size:1.1em; margin-left:6px; color:#0056b3;"
                            onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${label.replace(/'/g, \\"\\\\'\\")}', '\${value.replace(/'/g, \\"\\\\'\\")}')">${editIconSVG}</span>`
);

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Icon injected successfully.');
