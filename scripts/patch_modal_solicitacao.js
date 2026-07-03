const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

const regexEmpty = /<input type="hidden" name="imoveis\[\$\{index\}\]\[\$\{name\}\]" value="true">\s*<span title="Se você tiver acesso a esse dado, pode preenchê-lo"\s*style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">⚠️<\/span>/g;
const replacementEmpty = `<input type="hidden" name="imoveis[\${index}][flags_manuais][\${name}]" value="true">
                        <span title="Solicitar inclusão deste dado faltante no cadastro SPUnet" 
                            style="cursor:pointer; font-size:1.1em; margin-left:6px; color:#0056b3;"
                            onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${label.replace(/'/g, \\"\\\\'\\")}', '')">✏️</span>
                        <span title="Se você tiver acesso a esse dado, pode preenchê-lo" 
                            style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">⚠️</span>`;

// The empty block string replacement
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
                            onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${label.replace(/'/g, \\"\\\\'\\")}', '\${value.replace(/'/g, \\"\\\\'\\")}')">✏️</span>`;

code = code.replace(
    `<input type="text" name="imoveis[\${index}][\${name}]" value="\${value}" 
                            readonly class="auto-loaded-field" style="width:100%;">`,
    replacementFilled
);


const modalScripts = `
// ================================================================
// LÓGICA DO MODAL DE SOLICITAÇÃO CADASTRAL
// ================================================================

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

window.openSolicitacaoModal = function(rip, campoKey, campoNome, valorAtual) {
    document.getElementById('modal-rip').value = rip;
    document.getElementById('modal-campo-key').value = campoKey;
    document.getElementById('modal-campo-nome').value = campoNome.replace(/<[^>]+>/g, ''); // limpa HTML se houver
    document.getElementById('modal-valor-atual').value = valorAtual;
    document.getElementById('modal-novo-valor').value = valorAtual || '';
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

    // Atualiza ou insere
    const existingIndex = window.parent.formDataState.solicitacoes_cadastrais.findIndex(s => s.rip === rip && s.campo_key === campoKey);
    if (existingIndex > -1) {
        window.parent.formDataState.solicitacoes_cadastrais[existingIndex] = sol;
    } else {
        window.parent.formDataState.solicitacoes_cadastrais.push(sol);
    }
    
    // Alerta visual de sucesso e fechar modal
    alert("Solicitação salva com sucesso! Ela será anexada ao relatório final.");
    closeSolicitacaoModal();
    
    // Destacar visualmente o input correspondente se existir na DOM
    // Como os blocos usam imovelCount como índice, precisamos encontrar o input baseado no RIP e campoKey
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

if (code.indexOf('window.openSolicitacaoModal = function') === -1) {
    fs.writeFileSync('foco-02.js', code + '\n' + modalScripts, 'utf8');
    console.log('Patch aplicado com sucesso.');
} else {
    console.log('Patch ja aplicado.');
}
