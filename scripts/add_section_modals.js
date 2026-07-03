const fs = require('fs');

const editIconSVG = `<span class="edit-icon section-edit-icon" style="cursor: pointer; margin-left: 10px; color: #ea580c; font-size: 0.9em; vertical-align: middle;" title="Solicitar Alteração na Seção Inteira" onclick="openModalSecao('__SECAO_NOME__')"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span>`;

// 1. UPDATE foco-02.html for global sections
let html = fs.readFileSync('foco-02.html', 'utf8');

// Replace standard h4 titles with ones containing the edit icon
html = html.replace(
    /<h4([^>]*)>Avaliação do Imóvel<\/h4>/g,
    `<h4$1>Avaliação do Imóvel${editIconSVG.replace('__SECAO_NOME__', 'Avaliação do Imóvel')}</h4>`
);

html = html.replace(
    /<h4([^>]*)>Ocupação<\/h4>/g,
    `<h4$1>Ocupação${editIconSVG.replace('__SECAO_NOME__', 'Ocupação')}</h4>`
);

html = html.replace(
    /<h4([^>]*)>Riscos e Restrições<\/h4>/g,
    `<h4$1>Riscos e Restrições${editIconSVG.replace('__SECAO_NOME__', 'Riscos e Restrições')}</h4>`
);

fs.writeFileSync('foco-02.html', html, 'utf8');
console.log('Added section edit icons to foco-02.html');


// 2. UPDATE foco-02.js for modal logic and Accordion H4
let js = fs.readFileSync('foco-02.js', 'utf8');

// Add the modal HTML and logic to DOMContentLoaded if not already there
const sectionModalLogic = `
// ==================== Modal de Seção ====================
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('modalSecao')) {
        const html = \`
        <div id="modalSecao" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; justify-content: center; align-items: center;">
            <div class="modal-content" style="background: white; padding: 25px; border-radius: 8px; width: 650px; max-width: 95%; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <h3 style="margin-top: 0; color: #ea580c; border-bottom: 2px solid #fdba74; padding-bottom: 8px;">Solicitação de Alteração de Seção</h3>
                
                <input type="hidden" id="modal-secao-nome">
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Seção a ser contestada</label>
                    <input type="text" id="modal-secao-display" readonly style="width: 100%; background: #e9ecef; border: 1px solid #ced4da; padding: 10px; border-radius: 4px; color: #495057; font-weight: bold;">
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Solicitação de Alterações (Texto Livre)</label>
                    <textarea id="modal-secao-alteracoes" required rows="5" placeholder="Descreva tudo o que precisa ser alterado, incluído ou excluído nesta seção..." style="width: 100%; border: 2px solid #ea580c; border-radius: 4px; padding: 10px; resize: vertical;"></textarea>
                </div>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Justificativa / Fundamentação</label>
                    <textarea id="modal-secao-justificativa" required rows="3" placeholder="Explique os motivos ou cite documentos/leis que embasam essa solicitação..." style="width: 100%; border: 2px solid #ea580c; border-radius: 4px; padding: 10px; resize: vertical;"></textarea>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button type="button" onclick="closeModalSecao()" style="padding: 10px 20px; border-radius: 6px; background: #6c757d; color: white; border: none; cursor: pointer; font-weight: bold;">Cancelar</button>
                    <button type="button" onclick="salvarModalSecao()" style="padding: 10px 20px; border-radius: 6px; background: #ea580c; color: white; border: none; cursor: pointer; font-weight: bold;">Salvar Solicitação da Seção</button>
                </div>
            </div>
        </div>\`;
        document.body.insertAdjacentHTML('beforeend', html);
    }
});

window.openModalSecao = function(secaoNome, rip = null) {
    if (!rip) {
        const ripInput = document.getElementById('hidden_lista_rips');
        if (ripInput && ripInput.value) {
            rip = ripInput.value.split(',')[0];
        }
    }
    
    const titulo = rip ? secaoNome + ' (RIP: ' + rip + ')' : secaoNome;
    document.getElementById('modal-secao-nome').value = secaoNome;
    document.getElementById('modal-secao-display').value = titulo;
    document.getElementById('modal-secao-alteracoes').value = '';
    document.getElementById('modal-secao-justificativa').value = '';
    
    document.getElementById('modalSecao').style.display = 'flex';
};

window.closeModalSecao = function() {
    document.getElementById('modalSecao').style.display = 'none';
};

window.salvarModalSecao = function() {
    const secaoNome = document.getElementById('modal-secao-nome').value;
    const alteracoes = document.getElementById('modal-secao-alteracoes').value.trim();
    const justificativa = document.getElementById('modal-secao-justificativa').value.trim();
    
    const ripInput = document.getElementById('hidden_lista_rips');
    let rip = '';
    if (ripInput && ripInput.value) {
        rip = ripInput.value.split(',')[0];
    }
    
    if (!alteracoes || !justificativa) {
        alert("Por favor, preencha a solicitação de alterações e a justificativa.");
        return;
    }
    
    if (!window.parent.formDataState) {
        window.parent.formDataState = {};
    }
    if (!window.parent.formDataState.solicitacoes_secao) {
        window.parent.formDataState.solicitacoes_secao = [];
    }
    
    const sol = {
        id: Date.now(),
        rip: rip,
        secao_nome: secaoNome,
        alteracoes_solicitadas: alteracoes,
        justificativa: justificativa,
        data: new Date().toISOString()
    };
    
    // Sobrescreve se já houver contestação para a mesma seção e rip
    const existingIndex = window.parent.formDataState.solicitacoes_secao.findIndex(s => s.rip === rip && s.secao_nome === secaoNome);
    if (existingIndex > -1) {
        window.parent.formDataState.solicitacoes_secao[existingIndex] = sol;
    } else {
        window.parent.formDataState.solicitacoes_secao.push(sol);
    }
    
    alert("Solicitação de Seção salva com sucesso!");
    closeModalSecao();
};
`;

if (!js.includes('window.openModalSecao')) {
    js += '\n' + sectionModalLogic;
}

// Add edit icon to H4 inside accordion (Identificação do Imóvel)
const accordionH4Regex = /<h4([^>]*)>Identificação do Imóvel<\/h4>/;
if (js.match(accordionH4Regex)) {
    const iconForAccordion = editIconSVG.replace(/__SECAO_NOME__/g, "Identificação do Imóvel").replace('openModalSecao(', 'openModalSecao(').replace("'", "\\'");
    // Actually simpler to just build the string directly to avoid escaping hell
    const newH4 = `<h4$1>Identificação do Imóvel<span class="edit-icon section-edit-icon" style="cursor: pointer; margin-left: 10px; color: #ea580c; font-size: 0.9em; vertical-align: middle;" title="Solicitar Alteração na Seção Inteira" onclick="openModalSecao('Identificação do Imóvel', '\${rip}')"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></h4>`;
    js = js.replace(accordionH4Regex, newH4);
}

fs.writeFileSync('foco-02.js', js, 'utf8');
console.log('Added section modal logic and H4 icon to foco-02.js');

