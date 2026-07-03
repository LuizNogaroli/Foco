const fs = require('fs');
let js = fs.readFileSync('foco-02.js', 'utf8');

// The new openSolicitacaoModal logic
const modalHtmlRegex = /<div id="solicitacaoModal"[\s\S]*?<\/div>\s*<\/div>\s*`;/m;

const newModalHtml = `<div id="solicitacaoModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
            <div class="modal-content" style="background: white; padding: 25px; border-radius: 8px; width: 600px; max-width: 95%; max-height: 90vh; overflow-y: auto;">
                <h3 style="margin-top: 0; color: #0056b3;">Solicitar Alteração / Inclusão Cadastral</h3>
                <p style="font-size: 0.9em; color: #666; margin-bottom: 20px;">Utilize este formulário para sugerir correções aos dados do Datalake SPUnet ao setor de cadastro.</p>
                
                <input type="hidden" id="modal-rip">
                <input type="hidden" id="modal-campo-key">
                <input type="hidden" id="modal-campo-tipo" value="text">
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Campo</label>
                    <input type="text" id="modal-campo-nome" readonly style="width: 100%; background: #e9ecef; border: 1px solid #ced4da; padding: 8px; border-radius: 4px; color: #495057;">
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Valor Atual no Datalake</label>
                    <textarea id="modal-valor-atual" readonly rows="2" style="width: 100%; background: #e9ecef; border: 1px solid #ced4da; padding: 8px; border-radius: 4px; color: #495057;"></textarea>
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Valor Correto Desejado</label>
                    <div id="modal-input-container">
                        <!-- Renderizado dinamicamente -->
                        <input type="text" id="modal-novo-valor" required placeholder="Digite a correção desejada" style="width: 100%; border: 2px solid #0056b3; padding: 10px; border-radius: 4px;">
                    </div>
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
        </div>\`;`;

const openModalRegex = /window\.openSolicitacaoModal = function\([\s\S]*?\n\};/m;

const newOpenModal = `window.openSolicitacaoModal = function(rip, campoKey, encCampoNome, encValorAtual, tipo = 'text', opcoesExtras = '') {
    document.getElementById('modal-rip').value = rip || document.getElementById('hidden_lista_rips')?.value.split(',')[0] || '';
    document.getElementById('modal-campo-key').value = campoKey;
    document.getElementById('modal-campo-nome').value = decodeURIComponent(encCampoNome).replace(/<[^>]+>/g, '');
    
    const valorAtual = decodeURIComponent(encValorAtual);
    document.getElementById('modal-valor-atual').value = valorAtual;
    document.getElementById('modal-campo-tipo').value = tipo;
    
    const container = document.getElementById('modal-input-container');
    container.innerHTML = '';
    
    if (tipo === 'text') {
        container.innerHTML = \`<input type="text" id="modal-novo-valor" required placeholder="Digite a correção desejada" style="width: 100%; border: 2px solid #0056b3; padding: 10px; border-radius: 4px;" value="\${valorAtual}">\`;
    } else if (tipo === 'textarea') {
        container.innerHTML = \`<textarea id="modal-novo-valor" required rows="3" style="width: 100%; border: 2px solid #0056b3; padding: 10px; border-radius: 4px;">\${valorAtual}</textarea>\`;
    } else if (tipo === 'options') {
        const optionsArr = decodeURIComponent(opcoesExtras).split('|');
        const atuaisArr = valorAtual.split(',').map(s => s.trim());
        let html = '<div style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto; padding: 10px; border: 2px solid #0056b3; border-radius: 4px; background: #f8fafc;">';
        optionsArr.forEach(opt => {
            const checked = atuaisArr.includes(opt) ? 'checked' : '';
            html += \`<label style="cursor:pointer; display:flex; gap:8px; align-items:center;"><input type="checkbox" name="modal_opcoes_selecionadas" value="\${opt}" \${checked} style="width: 18px; height: 18px; cursor: pointer;"> \${opt}</label>\`;
        });
        html += '</div>';
        container.innerHTML = html;
    }
    
    document.getElementById('modal-justificativa').value = '';
    document.getElementById('modal-fundamentacao').value = '';
    document.getElementById('solicitacaoModal').style.display = 'flex';
};`;

const salvarModalRegex = /window\.salvarSolicitacao = function\([\s\S]*?\}\n\};/m;

const newSalvarModal = `window.salvarSolicitacao = function() {
    const rip = document.getElementById('modal-rip').value;
    const campoKey = document.getElementById('modal-campo-key').value;
    const campoNome = document.getElementById('modal-campo-nome').value;
    const valorAtual = document.getElementById('modal-valor-atual').value;
    const tipo = document.getElementById('modal-campo-tipo').value;
    
    let novoValor = '';
    if (tipo === 'options') {
        const checks = document.querySelectorAll('input[name="modal_opcoes_selecionadas"]:checked');
        novoValor = Array.from(checks).map(c => c.value).join(', ');
    } else {
        novoValor = document.getElementById('modal-novo-valor').value.trim();
    }
    
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
    
    // Destaca o input visual, se existir (agora buscando por name ou id)
    let inputVisual = document.querySelector(\`input[name="imoveis[\${document.querySelector('.imovel-block[data-rip="'+rip+'"]')?.getAttribute('data-index') || 0}][\${campoKey}]"]\`);
    if (!inputVisual) {
        inputVisual = document.getElementById(campoKey);
    }
    if(inputVisual) {
        inputVisual.style.borderColor = "#28a745";
        inputVisual.style.borderWidth = "2px";
        inputVisual.title = "Alteração/Inclusão solicitada para este campo.";
    }
};`;

if (js.match(modalHtmlRegex) && js.match(openModalRegex) && js.match(salvarModalRegex)) {
    js = js.replace(modalHtmlRegex, newModalHtml);
    js = js.replace(openModalRegex, newOpenModal);
    js = js.replace(salvarModalRegex, newSalvarModal);
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Successfully updated modal logic in foco-02.js');
} else {
    console.log('Regex did not match modal logic in foco-02.js');
}
