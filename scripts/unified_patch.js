const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

// 1. Fix ripsPesquisados initialization
code = code.replace("window.pesquisarRip = async function() {\\n    const input", "window.pesquisarRip = async function() {\\n    window.ripsPesquisados = window.ripsPesquisados || {};\\n    const input");

// 2. Fix removerRIP block completely
const startSig = 'window.adicionarTagRIP = function';
const endSig = "const tag = document.querySelector('.rip-tag[data-rip=\"' + rip + '\"]');";
const startIndex = code.indexOf(startSig);
const endIndex = code.indexOf(endSig);

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
if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + pristineCode + code.substring(endIndex);
}

// 3. Fix Orange icon and text
code = code.replace(/color:#ea580c;">[^<]+<\/span>/g, 'color:#ea580c;">⚠️</span>');
code = code.replace(/title="Se voc[^ ]* tiver acesso a esse dado, pode preench[^ ]*-lo"/g, 'title="Se você tiver acesso a esse dado, pode preenchê-lo"');


// 4. Inject Modal HTML & Script globally
const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

const replacementEmpty = `<input type="hidden" name="imoveis[\${index}][flags_manuais][\${name}]" value="true">
                        <span title="Solicitar inclusão deste dado faltante no cadastro SPUnet" 
                            style="cursor:pointer; font-size:1.1em; margin-left:6px; color:#0056b3;"
                            onclick="openSolicitacaoModal('\${rip}', '\${name}', encodeURIComponent(\`\${label}\`), encodeURIComponent(''))">${editIconSVG}</span>
                        <span title="Se você tiver acesso a esse dado, pode preenchê-lo" 
                            style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">⚠️</span>`;

code = code.replace(
    `<input type="hidden" name="imoveis[\${index}][flags_manuais][\${name}]" value="true">
                        <span title="Se você tiver acesso a esse dado, pode preenchê-lo" 
                            style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">⚠️</span>`,
    replacementEmpty
);

const replacementFilled = `<input type="text" name="imoveis[\${index}][\${name}]" value="\${value}" 
                            readonly class="auto-loaded-field" style="width:100%;">
                        <span title="Solicitar alteração deste dado no cadastro SPUnet" 
                            style="cursor:pointer; font-size:1.1em; margin-left:6px; color:#0056b3;"
                            onclick="openSolicitacaoModal('\${rip}', '\${name}', encodeURIComponent(\`\${label}\`), encodeURIComponent(\`\${value}\`))">${editIconSVG}</span>`;

code = code.replace(
    `<input type="text" name="imoveis[\${index}][\${name}]" value="\${value}" 
                            readonly class="auto-loaded-field" style="width:100%;">`,
    replacementFilled
);

const modalScripts = `
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('solicitacaoModal')) {
        const modalHtml = \`
        <div id="solicitacaoModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
            <div class="modal-content" style="background: white; padding: 25px; border-radius: 8px; width: 600px; max-width: 95%; max-height: 90vh; overflow-y: auto;">
                <h3 style="margin-top: 0; color: #0056b3;">Solicitar Alteração / Inclusão Cadastral</h3>
                <p style="font-size: 0.9em; color: #666; margin-bottom: 20px;">Utilize este formulário para sugerir correções aos dados do Datalake SPUnet ao setor de cadastro.</p>
                
                <input type="hidden" id="modal-rip">
                <input type="hidden" id="modal-campo-key">
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Campo</label>
                    <input type="text" id="modal-campo-nome" readonly style="width: 100%; background: #e9ecef; border: 1px solid #ced4da; padding: 8px; border-radius: 4px; color: #495057;">
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Valor Atual no Datalake</label>
                    <input type="text" id="modal-valor-atual" readonly style="width: 100%; background: #e9ecef; border: 1px solid #ced4da; padding: 8px; border-radius: 4px; color: #495057;">
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Valor Correto Desejado</label>
                    <input type="text" id="modal-novo-valor" required placeholder="Digite a correção desejada" style="width: 100%; border: 2px solid #0056b3; padding: 10px; border-radius: 4px;">
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Justificativa da Alteração</label>
                    <textarea id="modal-justificativa" required rows="3" placeholder="Descreva por que a alteração é necessária..." style="width: 100%; border: 2px solid #0056b3; border-radius: 4px; padding: 10px; resize: vertical;"></textarea>
                </div>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Fundamentação (Leis, portarias, documentos)</label>
                    <textarea id="modal-fundamentacao" required rows="3" placeholder="Cite as leis, portarias ou documentos comprobatórios" style="width: 100%; border: 2px solid #0056b3; border-radius: 4px; padding: 10px; resize: vertical;"></textarea>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button type="button" class="btn-cancel" onclick="closeSolicitacaoModal()" style="padding: 10px 20px; border-radius: 6px; background: #6c757d; color: white; border: none; cursor: pointer; font-weight: bold;">Cancelar</button>
                    <button type="button" class="btn-save" onclick="salvarSolicitacao()" style="padding: 10px 20px; border-radius: 6px; background: #28a745; color: white; border: none; cursor: pointer; font-weight: bold;">Salvar Solicitação</button>
                </div>
            </div>
        </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
});

window.openSolicitacaoModal = function(rip, campoKey, encCampoNome, encValorAtual) {
    document.getElementById('modal-rip').value = rip;
    document.getElementById('modal-campo-key').value = campoKey;
    document.getElementById('modal-campo-nome').value = decodeURIComponent(encCampoNome).replace(/<[^>]+>/g, '');
    document.getElementById('modal-valor-atual').value = decodeURIComponent(encValorAtual);
    document.getElementById('modal-novo-valor').value = decodeURIComponent(encValorAtual) || '';
    document.getElementById('modal-justificativa').value = '';
    document.getElementById('modal-fundamentacao').value = '';
    document.getElementById('solicitacaoModal').style.display = 'flex';
};

window.closeSolicitacaoModal = function() {
    document.getElementById('solicitacaoModal').style.display = 'none';
};

window.salvarSolicitacao = function() {
    const rip = document.getElementById('modal-rip').value;
    const campoKey = document.getElementById('modal-campo-key').value;
    const campoNome = document.getElementById('modal-campo-nome').value;
    const valorAtual = document.getElementById('modal-valor-atual').value;
    const novoValor = document.getElementById('modal-novo-valor').value.trim();
    const justificativa = document.getElementById('modal-justificativa').value.trim();
    const fundamentacao = document.getElementById('modal-fundamentacao').value.trim();

    if (!novoValor || !justificativa || !fundamentacao) {
        alert("Por favor, preencha o novo valor, a justificativa e a fundamentação.");
        return;
    }

    if (!window.parent.formDataState) {
        window.parent.formDataState = {};
    }
    if (!window.parent.formDataState.solicitacoes_cadastrais) {
        window.parent.formDataState.solicitacoes_cadastrais = [];
    }

    const sol = {
        id: Date.now(),
        rip: rip,
        campo_key: campoKey,
        campo_nome: campoNome,
        valor_atual: valorAtual,
        novo_valor: novoValor,
        justificativa: justificativa,
        fundamentacao: fundamentacao,
        data: new Date().toISOString()
    };

    const existingIndex = window.parent.formDataState.solicitacoes_cadastrais.findIndex(s => s.rip === rip && s.campo_key === campoKey);
    if (existingIndex > -1) {
        window.parent.formDataState.solicitacoes_cadastrais[existingIndex] = sol;
    } else {
        window.parent.formDataState.solicitacoes_cadastrais.push(sol);
    }
    
    alert("Solicitação salva com sucesso! Ela será anexada ao relatório final.");
    closeSolicitacaoModal();
    
    const imovelBlocks = document.querySelectorAll(\`.imovel-block[data-rip="\${rip}"]\`);
    imovelBlocks.forEach(block => {
        const index = block.getAttribute('data-index');
        const inputVisual = document.querySelector(\`input[name="imoveis[\${index}][\${campoKey}]"]\`);
        if(inputVisual) {
            inputVisual.style.borderColor = "#28a745";
            inputVisual.style.borderWidth = "2px";
            inputVisual.title = "Alteração/Inclusão solicitada para este campo.";
        }
    });
};
`;

code += '\\n' + modalScripts;

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Unified patch applied!');
