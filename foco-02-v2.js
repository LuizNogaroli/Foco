if (typeof window.inicializarListaDocumentosDinamica === 'function') {
        window.inicializarListaDocumentosDinamica('aba2_avaliacao', 'btnAdicionarDocumentoAvaliacao', 'documentos-list-avaliacao');
    }

    // ============================== Limpar ==============================
    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja limpar todos os campos?')) {
                window.location.reload();
            }
        });
    }

    // ==========================================
    // AUTO-RESTORE RIPs (Inteligência para RIPs importados)
    // ==========================================
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('solicitacaoModal')) {
        const modalHtml = `
        <div id="solicitacaoModal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
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
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
});

window.openSolicitacaoModal = function(rip, campoKey, encCampoNome, encValorAtual, tipo = 'text', opcoesExtras = '') {
    document.getElementById('modal-rip').value = rip || document.getElementById('hidden_lista_rips')?.value.split(',')[0] || '';
    document.getElementById('modal-campo-key').value = campoKey;
    document.getElementById('modal-campo-nome').value = decodeURIComponent(encCampoNome).replace(/<[^>]+>/g, '');
    
    const valorAtual = decodeURIComponent(encValorAtual);
    document.getElementById('modal-valor-atual').value = valorAtual;
    document.getElementById('modal-campo-tipo').value = tipo;
    
    const container = document.getElementById('modal-input-container');
    container.innerHTML = '';
    
    if (tipo === 'text') {
        container.innerHTML = `<input type="text" id="modal-novo-valor" required placeholder="Digite a correção desejada" style="width: 100%; border: 2px solid #0056b3; padding: 10px; border-radius: 4px;" value="${valorAtual}">`;
    } else if (tipo === 'textarea') {
        container.innerHTML = `<textarea id="modal-novo-valor" required rows="3" style="width: 100%; border: 2px solid #0056b3; padding: 10px; border-radius: 4px;">${valorAtual}</textarea>`;
    } else if (tipo === 'options') {
        const optionsArr = decodeURIComponent(opcoesExtras).split('|');
        const atuaisArr = valorAtual.split(',').map(s => s.trim());
        let html = '<div style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto; padding: 10px; border: 2px solid #0056b3; border-radius: 4px; background: #f8fafc;">';
        optionsArr.forEach(opt => {
            const checked = atuaisArr.includes(opt) ? 'checked' : '';
            html += `<label style="cursor:pointer; display:flex; gap:8px; align-items:center;"><input type="checkbox" name="modal_opcoes_selecionadas" value="${opt}" ${checked} style="width: 18px; height: 18px; cursor: pointer;"> ${opt}</label>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }
    
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
    let inputVisual = document.querySelector(`input[name="imoveis[${document.querySelector('.imovel-block[data-rip="'+rip+'"]')?.getAttribute('data-index') || 0}][${campoKey}]"]`);
    if (!inputVisual) {
        inputVisual = document.getElementById(campoKey);
    }
    if(inputVisual) {
        inputVisual.style.borderColor = "#28a745";
        inputVisual.style.borderWidth = "2px";
        inputVisual.title = "Alteração/Inclusão solicitada para este campo.";
    }
};

window.atualizarRipsOcultos = function() {
    const hidden = document.getElementById('hidden_lista_rips');
    if (hidden && window.ripsPesquisados) {
        hidden.value = Object.keys(window.ripsPesquisados).join(',');
    }
};

window.removerRIP = function(rip) {
    if (!rip) return;

    const tag = document.querySelector('.rip-tag[data-rip="' + rip + '"]');
    if (tag) tag.remove();

    const bloco = document.querySelector('.imovel-block[data-rip="' + rip + '"]');
    if (bloco) bloco.remove();

    if (window.ripsPesquisados && window.ripsPesquisados[rip]) {
        delete window.ripsPesquisados[rip];
    }

    if (typeof window.atualizarRipsOcultos === 'function') {
        window.atualizarRipsOcultos();
    }

    const lista = document.getElementById('listaRIPsAssociados');
    if (lista && lista.querySelectorAll('.rip-tag').length === 0) {
        lista.style.display = 'none';
    }

    if (window.parent && typeof window.parent.updateField === 'function') {
        window.parent.updateField('_ripsPesquisados', window.ripsPesquisados || {});
        window.parent.updateField('rips', Object.keys(window.ripsPesquisados || {}));
    }
};

window.adicionarTagRIP = function(rip, dados) {
    // Desativado por ser repetitivo com os cabeçalhos dos blocos do accordion de imóveis
    return;
};

window.toggleInconsistenciasRip = function(element, rip) {
    const parent = element.closest(`#group-pergunta-inconsistencias-${rip}`);
    if (parent) {
        parent.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (cb !== element) cb.checked = false;
        });
    }
    const obsBlock = document.getElementById(`bloco-inconsistencias-obs-${rip}`);
    if (obsBlock) {
        obsBlock.style.display = (element.checked && element.value === 'Sim') ? 'flex' : 'none';
    }

    const anyChecked = parent ? Array.from(parent.querySelectorAll('input[type="checkbox"]')).some(cb => cb.checked) : false;
    const badge = document.getElementById(`status-rip-${rip}`);
    if (badge) {
        if (anyChecked) {
            badge.textContent = "Concluído";
            badge.setAttribute('data-status', 'Concluído');
            badge.style.cssText = "font-size: 0.8rem; padding: 4px 8px; border-radius: 4px; font-weight: bold; background-color: #dcfce7; color: #1e3a5f; border: 1px solid #1e3a5f;";
        } else {
            badge.textContent = "Pendente";
            badge.setAttribute('data-status', 'Pendente');
            badge.style.cssText = "font-size: 0.8rem; padding: 4px 8px; border-radius: 4px; font-weight: bold; background-color: #fffacd; color: #1e3a5f; border: 1px solid #1e3a5f;";
        }
    }
};

window.criarBlocoImovel = function(rip, dados) {
        dados = dados || {};
        const container = document.getElementById('accordion-indicacoes');
        if (!container) {
            console.error('[foco-02.js] Container accordion-indicacoes não encontrado!');
            return;
        }

        if (document.querySelector(`.imovel-block[data-rip="${rip}"]`)) return;

    const index = document.querySelectorAll('.imovel-block').length;
    const div = document.createElement('div');
    div.className = 'imovel-block card mb-4';
    div.setAttribute('data-index', index);
    div.setAttribute('data-rip', rip);
    div.style.border = '1px solid #cbd5e1';
    div.style.borderRadius = '8px';
    div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    
    function buildField(label, name, value) {
        let valStr = (value !== null && value !== undefined) ? value : '';
        let iconHtml = '';
        
        let placeholderAttr = '';
        if (name === 'cep') placeholderAttr = 'placeholder="00000-000" maxlength="9" oninput="this.value = this.value.replace(/[^0-9]/g, \'\').replace(/^(\\d{5})(\\d)/, \'$1-$2\')"';
        else if (name === 'area_total' || name === 'area_uniao' || name.startsWith('area_')) placeholderAttr = 'placeholder="Ex: 1250.50"';
        else if (name === 'cartorio') placeholderAttr = 'placeholder="Ex: 1º CRI SP"';
        
        let readonlyAttr = 'readonly';
        let emptyClass = '';
        let styleInline = 'width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;';
        
        if (String(valStr).trim() === '') {
            readonlyAttr = '';
            emptyClass = 'custom-empty-select';
            styleInline = 'width: 100%; padding: 8px; border-radius: 4px;';
        }
        
        const config = typeof CAMPOS_COM_OPCOES !== 'undefined' ? CAMPOS_COM_OPCOES[name] : null;
        if (config && String(valStr).trim() === '') {
            const opcoes = Array.isArray(config) ? config : config.opcoes;
            const condicional = Array.isArray(config) ? null : config.condicional;
            let selectOptionsHtml = `<option value="">-- Selecione --</option>`;
            opcoes.forEach(opt => {
                const selected = (opt.toLowerCase() === String(valStr).toLowerCase()) ? 'selected' : '';
                selectOptionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
            });
            
            let disabledAttr = readonlyAttr === 'readonly' ? 'disabled' : '';
            
            let blocoCondicionalHtml = '';
            if (condicional) {
                blocoCondicionalHtml = `
                    <div id="${condicional.campo_id}" class="bloco-condicional" data-controlled-by="${name}" data-show-when="${condicional.valor}" style="display:none; margin-top:10px;">
                        <label style="display:block; margin-bottom:5px; font-weight:600; color:#1e293b;">
                            ${condicional.label}
                        </label>
                        <textarea
                            name="${condicional.field_key}"
                            data-field-key="${condicional.field_key}"
                            rows="3"
                            placeholder="Descreva aqui..."
                            style="width:100%; padding:8px; border:1px solid #94a3b8; border-radius:4px; background:#ffffff; color:#1e293b; resize:vertical;"
                        ></textarea>
                    </div>
                `;
            }

            return `
                <div class="form-group editavel" style="margin-bottom: 15px;">
                    <label style="display:block; margin-bottom: 5px; font-weight: 600;">${label} ${iconHtml}</label>
                    <select name="imoveis[${index}][${name}]" data-field-key="${name}" class="auto-loaded-field ${emptyClass}" style="${styleInline}" ${disabledAttr}>
                        ${selectOptionsHtml}
                    </select>
                    ${blocoCondicionalHtml}
                </div>
            `;
        }
        
        return `
            <div class="form-group editavel" style="margin-bottom: 15px;">
                <label style="display:block; margin-bottom: 5px; font-weight: 600;">${label} ${iconHtml}</label>
                <input type="text" name="imoveis[${index}][${name}]" data-field-key="${name}" value="${valStr}" ${placeholderAttr} ${readonlyAttr} class="auto-loaded-field ${emptyClass}" style="${styleInline}">
            </div>
        `;
    }

    const hasStatus = (dados.ha_inconsistencias === 'Sim' || dados.ha_inconsistencias === 'Não');
    const statusText = hasStatus ? 'Concluído' : 'Pendente';
    const statusStyle = hasStatus 
        ? 'background-color: #dcfce7; color: #1e3a5f; border: 1px solid #1e3a5f;'
        : 'background-color: #fffacd; color: #1e3a5f; border: 1px solid #1e3a5f;';

    div.innerHTML = `
        <div class="accordion-header type-rip" style="padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; font-weight: bold; display: flex; align-items: center; gap: 12px;">
                RIP ${rip}
            </h4>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span class="rip-status-badge" id="status-rip-${rip}" data-status="${statusText}" style="font-size: 0.8rem; padding: 4px 8px; border-radius: 4px; font-weight: bold; ${statusStyle}">${statusText}</span>
                <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold;">▼</span>
            </div>
        </div>
        <div class="accordion-content" style="display: none; padding: 16px;">
            <input type="hidden" name="imoveis[${index}][rip]" value="${rip}">
            
            <!-- Localização -->
            <h5 style="margin: 0 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 6px; font-weight: bold; font-size: 1.05em; text-align: left;">Localização</h5>
            ${buildField('CEP', 'cep', dados.cep)}
            ${buildField('UF', 'uf', dados.uf)}
            ${buildField('Município', 'municipio', dados.municipio)}
            ${buildField('Endereço', 'endereco', dados.endereco || dados.logradouro)}
            
            <!-- Tipologia -->
            <h5 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 6px; font-weight: bold; font-size: 1.05em; text-align: left;">Tipologia</h5>
            ${buildField('Conceituação do Imóvel', 'conceituacao', dados.conceituacao || dados.descricao)}
            ${buildField('Condição de Urbanização', 'condicao_urbanizacao', dados.condicao_urbanizacao)}
            ${buildField('Natureza do Imóvel', 'natureza', dados.natureza || dados.natureza_terreno)}
            ${buildField('Tipo de Imóvel', 'tipo_imovel', dados.tipoImovel || dados.tipo_imovel)}
            
            <!-- Características -->
            <h5 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 6px; font-weight: bold; font-size: 1.05em; text-align: left;">Características</h5>
            ${buildField('Área total (m²)', 'area_total', dados.area_total)}
            ${buildField('Área da União (m²)', 'area_uniao', dados.area_uniao)}
            ${buildField('Área construída total (m²)', 'area_construida_total', dados.area_construida_total)}
            ${buildField('Área construída disponível (m²)', 'area_construida_disponivel', dados.area_construida_disponivel)}
            ${buildField('Área de terreno disponível (m²)', 'area_terreno_disponivel', dados.area_terreno_disponivel)}
            ${buildField('Há benfeitorias?', 'benfeitorias', dados.benfeitorias)}
            
            <!-- Condições da incorporação -->
            <h5 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 6px; font-weight: bold; font-size: 1.05em; text-align: left;">Dados da incorporação</h5>
            ${buildField('Situação da Incorporação', 'situacao_incorporacao', dados.situacao_incorporacao || dados.situacao)}
            ${buildField('LPM/1831 ou LMEO homologadas?', 'lpm_homologada', dados.lpm_homologada)}
            ${buildField('Processo de incorporação:', 'processo_incorporacao', dados.processo_incorporacao)}
            <div class="bloco-condicional" data-controlled-by="processo_incorporacao" data-show-when="Sim" style="display:none; padding-left:16px; border-left:3px solid #94a3b8; margin-top:4px;">
                ${buildField('Número do Processo', 'numero_processo', dados.numero_processo)}
                ${buildField('Cartório', 'cartorio', dados.cartorio)}
                ${buildField('Matrícula', 'matricula', dados.matricula)}
            </div>

            <!-- Condições da Avaliação -->
            <div id="secao-avaliacao-${rip}">
                <h5 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 6px; font-weight: bold; font-size: 1.05em; text-align: left;">Dados da Avaliação</h5>
                ${buildField('Valor da Avaliação (R$)', 'valor_avaliacao', dados.valor_avaliacao)}
                ${buildField('Data da Avaliação', 'data_avaliacao', dados.data_avaliacao)}
                ${buildField('Instrumento de Avaliação', 'instrumento_avaliacao', dados.instrumento_avaliacao)}
                
                <div class="form-group editavel">
                    <div class="dynamic-list-wrapper" style="margin-top: 10px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <button type="button" class="btn-add" id="btnAdicionarDocumentoAvaliacao_${rip}" style="align-self: flex-start;" onclick="if(typeof window.adicionarDocumentoDinamico === 'function') window.adicionarDocumentoDinamico('documentos-list-avaliacao_${rip}')">＋ Anexar link/documento</button>
                        <div id="documentos-list-avaliacao_${rip}"></div>
                    </div>
                </div>
            </div>

            <!-- ========== CERTIDÃO DE MATRÍCULA ========== -->
            <div id="secao-certidao-${rip}" class="form-group editavel" style="margin-top: 24px;">
                <label for="val_anexo_matricula_${rip}" style="font-weight: bold; display: block; margin-bottom: 5px; font-size: 0.95em; color: #1e1b4b;">Certidão atualizada da matrícula (não superior a 12 meses):</label>
                <input type="hidden" name="imoveis[${index}][anexo_matricula]" id="val_anexo_matricula_${rip}" value="${dados.anexo_matricula || ''}">
                <input type="hidden" name="imoveis[${index}][filename_anexo_matricula]" id="val_filename_anexo_matricula_${rip}" value="${dados.filename_anexo_matricula || ''}">
                <input type="file" id="file_anexo_matricula_${rip}" style="display:none;" onchange="window.handleFileUpload('anexo_matricula_${rip}')" accept=".pdf,.doc,.docx,.jpg,.png">
                <div id="actions_anexo_matricula_${rip}" style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
                    <span id="filename_anexo_matricula_${rip}" style="display:none; font-size: 0.85em; color: #475569; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
                    <button type="button" class="btn-upload" onclick="window.triggerUpload('anexo_matricula_${rip}')" style="background-color: #2e7d32; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">📂 Carregar arquivo</button>
                    <button type="button" class="btn-view" style="display:none; background-color: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;" onclick="window.visualizarDoc('anexo_matricula_${rip}')" title="Visualizar">👁️ Visualizar</button>
                </div>
            </div>

            <!-- ========== INCONSISTÊNCIAS CADASTRAIS (RIP: ${rip}) ========== -->
            <div id="secao-inconsistencias-${rip}" class="form-group editavel" style="margin-top: 24px; padding: 16px; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: left;">
                <label style="font-weight: 700; color: #991b1b; font-size: 1.05em; display: block; margin-bottom: 12px;">Há inconsistências cadastrais a serem informadas?</label>
                <div id="group-pergunta-inconsistencias-${rip}" class="checkbox-group" style="display:flex; flex-direction:row; gap:32px; flex-wrap:wrap; margin-bottom:10px; align-items:center;">
                    <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0; font-weight: 600;">
                        <input type="checkbox" name="imoveis[${index}][ha_inconsistencias]" class="cb-ha-inconsistencias" value="Sim" onclick="window.toggleInconsistenciasRip(this, '${rip}')" ${dados.ha_inconsistencias === 'Sim' ? 'checked' : ''} /> Sim
                    </label>
                    <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0; font-weight: 600;">
                        <input type="checkbox" name="imoveis[${index}][ha_inconsistencias]" class="cb-ha-inconsistencias" value="Não" onclick="window.toggleInconsistenciasRip(this, '${rip}')" ${dados.ha_inconsistencias === 'Não' ? 'checked' : ''} /> Não
                    </label>
                </div>

                <div id="bloco-inconsistencias-obs-${rip}" style="display:${dados.ha_inconsistencias === 'Sim' ? 'flex' : 'none'}; flex-direction: column; gap: 6px; margin-top: 12px;">
                    <label for="obs-inconsistencias-${rip}" style="font-weight: 600; color: #1e293b;">Descreva as inconsistências identificadas:</label>
                    <textarea id="obs-inconsistencias-${rip}" name="imoveis[${index}][obs_inconsistencias]" placeholder="Descreva aqui as divergências encontradas entre o cadastro do SPU e a situação real..." style="width: 100%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; background-color: #fff; color: #334155; resize: vertical; min-height: 80px; font-family: inherit; font-size: 14px;">${dados.obs_inconsistencias || ''}</textarea>
                </div>
            </div>

        </div>
    `;

    container.appendChild(div);

    // Inicializa a UI do anexo de matrícula se já houver dados
    if (typeof window.updateDocUI === 'function') {
        setTimeout(() => window.updateDocUI(`anexo_matricula_${rip}`), 100);
    }

    // Inicializa a lista dinâmica de anexos da seção de avaliação para este RIP
    if (typeof window.inicializarListaDocumentosDinamica === 'function') {
        const btnIdDocsAvaliacao = `btnAdicionarDocumentoAvaliacao_${rip}`;
        const listIdDocsAvaliacao = `documentos-list-avaliacao_${rip}`;
        const btnDocs = document.getElementById(btnIdDocsAvaliacao);
        if (btnDocs && btnDocs.dataset.docsInit !== '1') {
            window.inicializarListaDocumentosDinamica(`aba2_avaliacao_${rip}`, btnIdDocsAvaliacao, listIdDocsAvaliacao);
            btnDocs.dataset.docsInit = '1';
        }
    }

        // ---- Tira o snapshot dos valores originais assim que o bloco é criado ----
    setTimeout(() => {
        const inputs = div.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const key = input.id || input.name;
            if (key && input.type !== 'button' && input.type !== 'submit') {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    window.originalRipData[key] = input.checked ? (input.value || 'on') : '';
                } else {
                    window.originalRipData[key] = input.value || '';
                }
            }
        });
    }, 300);
};


window.openCadastroMinimo = function() {
    document.getElementById('modalCadastroMinimo').style.display = 'flex';
};

window.closeCadastroMinimo = function() {
    document.getElementById('modalCadastroMinimo').style.display = 'none';
};

let arquivoBase64 = null;
let arquivoNome = null;

window.handleArquivoMinimo = function(input) {
    const file = input.files[0];
    if (file) {
        arquivoNome = file.name;
        const statusDiv = document.getElementById('arquivo_minimo_status');
        statusDiv.innerHTML = 'Carregando arquivo...';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            arquivoBase64 = e.target.result;
            statusDiv.innerHTML = '✅ Arquivo anexado: <strong>' + arquivoNome + '</strong> <button type="button" onclick="removerArquivoMinimo()" style="background:none; border:none; color:red; cursor:pointer; margin-left:10px;">[Remover]</button>';
        };
        reader.onerror = function() {
            alert("Erro ao ler o arquivo.");
            statusDiv.innerHTML = '';
        }
        reader.readAsDataURL(file);
    }
};

window.removerArquivoMinimo = function() {
    arquivoBase64 = null;
    arquivoNome = null;
    document.getElementById('arquivo_minimo').value = '';
    document.getElementById('arquivo_minimo_status').innerHTML = '';
};

window.salvarCadastroMinimo = function() {
    const cep = document.getElementById('cep_sem_rip').value;
    const area = document.getElementById('area_sem_rip').value;
    
    if (!cep || !area) {
        alert("Por favor, preencha pelo menos o CEP e a Área a ser destinada.");
        return;
    }

    // Get checked checkboxes in modal
    const checks = document.querySelectorAll('input[name="modal_conceituacao[]"]:checked');
    const tiposDispensados = Array.from(checks).map(c => c.value);

    const dadosCadastro = {
        tipos_dispensados: tiposDispensados,
        cep: cep,
        logradouro: document.getElementById('logradouro_sem_rip').value,
        municipio: document.getElementById('municipio_sem_rip').value,
        uf: document.getElementById('uf_sem_rip').value,
        numero: document.getElementById('numero_sem_rip').value,
        complemento: document.getElementById('complemento_sem_rip').value,
        area: area,
        observacoes: document.getElementById('obs_geral_01').value,
        arquivo_nome: arquivoNome,
        arquivo_base64: arquivoBase64
    };

    if (!window.parent.formDataState) {
        window.parent.formDataState = {};
    }
    
    window.parent.formDataState.cadastro_minimo = dadosCadastro;
    
    document.getElementById('cadastro-minimo-status').style.display = 'block';
    
    closeCadastroMinimo();
    alert("Cadastro Mínimo salvo com sucesso! Os dados e anexos foram gravados na memória e irão compor o relatório.");
};


window.buscarCep = async function(cep) {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;
    try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
            document.getElementById('logradouro_sem_rip').value = data.logradouro || '';
            document.getElementById('municipio_sem_rip').value = data.localidade || '';
            document.getElementById('uf_sem_rip').value = data.uf || '';
        }
    } catch (e) {
        console.error('Erro ao buscar CEP', e);
    }
};


// ==================== Lógica Datalake para Campos Globais ====================
window.preencherCamposGlobais = function(dados) {
    if (!dados) return;
    
    // Helper para preencher e acionar visibilidade
    function fill(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    }

    function checkBoxes(name, values) {
        if (!values) return;
        let arr = Array.isArray(values) ? values : String(values).split(',').map(s => s.trim());
        document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
            cb.checked = arr.includes(cb.value);
        });
    }

    // 1. Situação Ocupacional (Radios e condicionais)
    if (dados.situacao_ocupacional) {
        const rad = document.querySelector(`input[name="situacao_ocupacional"][value="${dados.situacao_ocupacional}"]`);
        if (rad) {
            rad.checked = true;
            rad.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    fill('campo-tempo-desocupacao', dados.tempo_desocupacao);
    fill('obs-desocupado', dados.obs_desocupado);
    fill('campo-data-conhecimento-ocupacao', dados.data_conhecimento_ocupacao || dados.data_ocupacao || dados.data_ocupacao_irregular);
    fill('obs-ocupado', dados.obs_ocupado);
    
    if (dados.tipo_uso_atual || dados.uso_imobiliario_atual) {
        fill('campo32', dados.tipo_uso_atual || dados.uso_imobiliario_atual);
        document.getElementById('campo32')?.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Incidência ambiental checkboxes
    checkBoxes('ha_incidencia[]', dados.ha_incidencia);
    checkBoxes('incidencia_ambiental[]', dados.incidencia_ambiental);
    fill('obs_incidencia_ambiental', dados.obs_incidencia_ambiental || dados.observacoes_incidencia);

    // 3. Riscos checkboxes
    checkBoxes('ha_riscos[]', dados.ha_riscos);
    checkBoxes('riscos[]', dados.riscos_verificados || dados.riscos);
    fill('obs_riscos', dados.obs_riscos);
    
    // 4. Restrições checkboxes
    checkBoxes('ha_restricoes[]', dados.ha_restricoes);
    checkBoxes('restricoes[]', dados.restricoes_verificadas || dados.restricoes);
    fill('obs_restricoes', dados.obs_restricoes);

    // 5. Geolocalização
    fill('cep', dados.geo_cep || dados.cep);
    fill('latitude', dados.latitude);
    fill('longitude', dados.longitude);



    fill('valor_avaliacao', dados.valor_avaliado || dados.valor_avaliacao);
    fill('data_avaliacao', dados.data_avaliacao);
    fill('instrumento_avaliacao', dados.instrumento_avaliacao);

    // Custos de manutenção
    const custos = dados.custos_manutencao || 'Não';
    fill('custos_manutencao', custos);
    const blocoCustos = document.querySelector('[data-controlled-by="custos_manutencao"]');
    if (blocoCustos) {
        blocoCustos.style.display = (custos === 'Sim') ? 'flex' : 'none';
    }
    fill('estimativa_custos', dados.estimativa_custos);
};

window.verificarVisibilidadeIncidencia = function() {
    const checked = document.querySelectorAll('input[name="incidencia_ambiental[]"]:checked').length > 0;
    const bloco = document.getElementById('bloco-obs-incidencia');
    if (bloco) {
        bloco.style.display = checked ? 'flex' : 'none';
    }
};

window.openGlobalModal = function(key, label, value, type, opts) {
    // Pegar o rip inserido ou vazio
    const ripInput = document.getElementById('hidden_lista_rips');
    let rip = '';
    if (ripInput && ripInput.value) {
        rip = ripInput.value.split(',')[0];
    }
    
    // Reutilizar o modal principal
    window.openSolicitacaoModal(rip, key, encodeURIComponent(label), encodeURIComponent(value || ''), type, encodeURIComponent(opts || ''));
};


window.verificarConceituacao = function() {
    const checks = document.querySelectorAll('input[name="conceituacao[]"]:checked');
    const secaoPesquisa = document.getElementById('secaoPesquisaRip');
    if (secaoPesquisa) {
        if (checks.length > 0) {
            secaoPesquisa.style.display = 'block';
        } else {
            secaoPesquisa.style.display = 'none';
        }
    }
};


window.pesquisarRip = function() {
    const input = document.getElementById('rip_pesquisa');
    if (!input) return;
    const rip = input.value.trim();
    
    if (rip.length < 7 || rip.length > 11) {
        alert('Por favor, informe um RIP válido (7 a 11 dígitos).');
        return;
    }
    
    // Simular busca no datalake ou recuperar da base carregada em window.parent.tabelaCadastro
    let dados = null;
    if (window.parent && window.parent.tabelaCadastro) {
        dados = window.parent.tabelaCadastro.find(item => item.rip === rip);
    }
    
    // Se não encontrou, usa um mock para testes
    if (!dados) {
        dados = {
            natureza_terreno: "Terreno Nacional Interior",
            tipo_imovel: "terreno",
            cep: "70040-010",
            uf: "DF",
            municipio: "Brasília",
            logradouro: "Esplanada dos Ministérios, Bloco C",
            area_total: "1500",
            valor_avaliado: "2500000.00",
            data_avaliacao: "2023-05-10",
            instrumento_avaliacao: "Laudo Técnico",
            ocupacao: "Ocupado regularmente",
            condicao_urbanizacao: "urbanizado",
            riscos_verificados: ["Risco de invasão/esbulho"],
            restricoes_verificadas: ["Terra indígena"]
        };
    }
    
    if (!window.ripsPesquisados) window.ripsPesquisados = {};
    window.ripsPesquisados[rip] = dados;
    
    if (typeof window.adicionarTagRIP === 'function') {
        window.adicionarTagRIP(rip, dados);
    }
    
    if (typeof window.criarBlocoImovel === 'function') {
        window.criarBlocoImovel(rip, dados);
    }
    
    if (typeof window.preencherCamposGlobais === 'function') {
        window.preencherCamposGlobais(dados);
    }
    
    input.value = '';
    
    const container = document.getElementById('global-sections-container');
    if(container) container.style.display = 'block';

    if (typeof window.atualizarRipsOcultos === 'function') {
        window.atualizarRipsOcultos();
    }
};


// ==================== Modal de Seção ====================
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('modalSecao')) {
        const html = `
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
        </div>`;
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



const CAMPOS_COM_OPCOES = {
    'conceituacao': [
        'Terreno de marinha e acrescido',
        'Terreno Nacional Interior',
        'Imóvel de Domínio da União',
        'Gleba destinada a assentamento',
        'Ilha oceânica ou costeira',
        'Ilha fluvial ou lacustre'
    ],
    'condicao_urbanizacao': [
        'Urbanizado',
        'Urbanização parcial/precária',
        'Não urbanizado',
        'Sem informação'
    ],
    'tipo_imovel': [
        'Casa',
        'Conjunto habitacional',
        'Galpão',
        'Garagem',
        'Prédio',
        'Sala/Conjunto',
        'Terreno',
        'Não se aplica'
    ],
    'natureza': [
        'Urbano',
        'Rural'
    ],
    'lpm_homologada': [
        'Sim',
        'Não',
        'Não se aplica'
    ],
    'situacao_incorporacao': [
        'Em processo de incorporação',
        'Incorporado',
        'Outros'
    ],
    'processo_incorporacao': [
        'Sim',
        'Não'
    ],
    'benfeitorias': {
        opcoes: ['Sim', 'Não'],
        condicional: {
            valor: 'Sim',
            campo_id: 'bloco-benfeitorias-descricao',
            label: 'Descreva as benfeitorias:',
            field_key: 'benfeitorias_descricao'
        }
    },
    'situacao_ocupacional': [
        'Desocupado',
        'Ocupado regularmente',
        'Ocupado irregularmente',
        'Não há informação'
    ],
    'custos_manutencao': [
        'Sim',
        'Não'
    ]
};

function transformarCamposComOpcoes(secao) {
    Object.keys(CAMPOS_COM_OPCOES).forEach(fieldKey => {
        const input = secao.querySelector(`[data-field-key="${fieldKey}"]`);
        if (!input || input.tagName === 'SELECT') return;

        const valorAtual = input.value;
        const nomeOriginal = window.originalRipData[fieldKey] || valorAtual;

        // Suporta tanto formato simples (array) quanto com condicional (objeto)
        const config      = CAMPOS_COM_OPCOES[fieldKey];
        const opcoes      = Array.isArray(config) ? config : config.opcoes;
        const condicional = Array.isArray(config) ? null  : config.condicional;

        // Cria o <select> substituto
        const select = document.createElement('select');
        select.name = input.name;
        select.setAttribute('data-field-key', fieldKey);
        select.style.backgroundColor = '#ffffff';
        select.style.color           = '#1e293b';
        select.style.border          = '1px solid #94a3b8';
        select.style.cursor          = 'pointer';
        select.style.padding         = '8px';
        select.style.borderRadius    = '4px';
        select.style.width           = '100%';

        // Opção neutra inicial
        const emptyOpt = document.createElement('option');
        emptyOpt.value = '';
        emptyOpt.textContent = '-- Selecione --';
        select.appendChild(emptyOpt);

        // Popula as opções
        opcoes.forEach(opcao => {
            const opt = document.createElement('option');
            opt.value = opcao;
            opt.textContent = opcao;
            if (opcao.toLowerCase() === valorAtual.toLowerCase()) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });

        // Snapshot original
        window.originalRipData[fieldKey] = nomeOriginal;

        // Substitui o input pelo select no DOM
        input.parentNode.replaceChild(select, input);

        // Escuta mudanças para o motor de diff
        select.addEventListener('change', verificarMudancaInline);

        // ---- Lógica condicional (objeto) ----
        if (condicional) {
            // Cria o bloco oculto com textarea
            const blocoCondicional = document.createElement('div');
            blocoCondicional.id            = condicional.campo_id;
            blocoCondicional.style.display = 'none';
            blocoCondicional.style.marginTop = '10px';
            blocoCondicional.innerHTML = `
                <label style="display:block; margin-bottom:5px; font-weight:600; color:#1e293b;">
                    ${condicional.label}
                </label>
                <textarea
                    name="${condicional.field_key}"
                    data-field-key="${condicional.field_key}"
                    rows="3"
                    placeholder="Descreva aqui..."
                    style="width:100%; padding:8px; border:1px solid #94a3b8; border-radius:4px;
                           background:#ffffff; color:#1e293b; resize:vertical;">
                </textarea>
            `;
            select.parentNode.insertBefore(blocoCondicional, select.nextSibling);

            // Avalia imediatamente (caso valor já seja "Sim")
            blocoCondicional.style.display =
                valorAtual.toLowerCase() === condicional.valor.toLowerCase() ? 'block' : 'none';

            // Re-avalia a cada mudança no select
            select.addEventListener('change', () => {
                blocoCondicional.style.display =
                    select.value === condicional.valor ? 'block' : 'none';
            });
        }

        // ---- Lógica condicional genérica baseada em data-controlled-by ----
        const blocosControlados = secao.querySelectorAll(`[data-controlled-by="${fieldKey}"]`);
        if (blocosControlados.length > 0) {
            const avaliarControle = (val) => {
                blocosControlados.forEach(bloco => {
                    const cond = bloco.getAttribute('data-show-when');
                    if (val === cond) {
                        bloco.style.display = 'block';
                        // Desbloqueia os inputs internos do bloco revelado
                        const inputsInternos = bloco.querySelectorAll('input, select, textarea');
                        inputsInternos.forEach(ii => {
                            ii.style.cursor = 'text';
                            ii.addEventListener('input', verificarMudancaInline);
                            ii.addEventListener('change', verificarMudancaInline);
                        });
                    } else {
                        bloco.style.display = 'none';
                    }
                });
            };

            // Avalia imediatamente
            avaliarControle(valorAtual);

            // Re-avalia a cada mudança no select
            select.addEventListener('change', () => {
                avaliarControle(select.value);
            });
        }
    });
}
// ==================== Fim Motor de Regras ====================




window.originalRipData = {};
let modoEdicaoAtivo = false;

// ==================== Fim Modo de Edição ====================

// ==================== Salvar e Avançar ====================
// Removido: handler duplicado. A navegação é feita pelo sync.js após o save completo.


// Garante que a seção do RIP abra se os checkboxes vierem preenchidos pelo banco
document.addEventListener('DOMContentLoaded', () => {
    // Tenta rodar logo após 500ms para dar tempo do sync.js preencher os dados
    setTimeout(() => {
        if (typeof window.verificarConceituacao === 'function') {
            window.verificarConceituacao();
        }
    }, 500);
    setTimeout(() => {
        if (typeof window.verificarConceituacao === 'function') {
            window.verificarConceituacao();
        }
    }, 1500);
});


// Força a limpeza dos checkboxes de conceituação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const checks = document.querySelectorAll('input[name="conceituacao[]"]');
        checks.forEach(c => c.checked = false);
        
        // Esconde a seção de pesquisa do RIP já que limpamos as marcações
        const secaoPesquisa = document.getElementById('secaoPesquisaRip');
        if (secaoPesquisa) {
            secaoPesquisa.style.display = 'none';
        }
    }, 800); // 800ms para rodar DEPOIS do sync.js, garantindo que vai zerar mesmo se o sync tentar preencher
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="incidencia_ambiental[]"]').forEach(cb => {
        cb.addEventListener('change', window.verificarVisibilidadeIncidencia);
    });
});

// ============================================================================================
// carregarCamposRIP(rip)
// Busca dados do RIP na tabela_spu (Supabase) e preenche os campos do bloco dinâmico.
// Campos com dados vindos do banco ficam TRANCADOS (readonly/disabled).
// Campos sem dados ficam ABERTOS para edição.
// Regras condicionais (regras_preenchimento.md) são aplicadas após o preenchimento.
// ============================================================================================
window.carregarCamposRIP = async function(rip) {
    console.log(`🔄 [carregarCamposRIP] Iniciando para RIP: ${rip}`);

    // Garante que fetchSPU esteja disponível (carregado via scripts/fetch_spu.js)
    if (typeof window.fetchSPU !== 'function') {
        console.warn('[carregarCamposRIP] window.fetchSPU não disponível. Abortando.');
        return;
    }

    // Busca dados do RIP na tabela_spu
    let dadosSPU = {};
    try {
        dadosSPU = await window.fetchSPU(rip);
        console.log(`✅ [carregarCamposRIP] Dados recebidos para RIP ${rip}:`, dadosSPU);
    } catch (e) {
        console.error(`❌ [carregarCamposRIP] Erro ao buscar dados do RIP ${rip}:`, e);
        return;
    }

    if (!dadosSPU || Object.keys(dadosSPU).length === 0) {
        console.log(`ℹ️ [carregarCamposRIP] Nenhum dado encontrado na tabela_spu para RIP ${rip}. Todos os campos ficarão abertos.`);
        return;
    }

    // Mapeamento: chave do dados_json no Supabase → data-field-key no DOM
    const MAPA_CAMPOS = {
        'conceituacao':               'conceituacao',
        'condicao_urbanizacao':       'condicao_urbanizacao',
        'natureza_terreno':           'natureza',
        'tipo_imovel':                'tipo_imovel',
        'cep':                        'cep',
        'uf':                         'uf',
        'municipio':                  'municipio',
        'logradouro':                 'endereco',
        'area_total':                 'area_total',
        'area_uniao':                 'area_uniao',
        'benfeitorias':               'benfeitorias',
        'area_construida_total':      'area_construida_total',
        'area_construida_disponivel': 'area_construida_disponivel',
        'area_terreno_disponivel':    'area_terreno_disponivel',
        'situacao_incorporacao':      'situacao_incorporacao',
        'valor_avaliado':             'valor_avaliacao',
        'data_avaliacao':             'data_avaliacao',
        'instrumento_avaliacao':      'instrumento_avaliacao',
        'lpm_homologada':             'lpm_homologada',
        'processo_incorporacao':      'processo_incorporacao',
        'numero_processo':            'numero_processo',
        'cartorio':                   'cartorio',
        'matricula':                  'matricula'
    };

    // Localiza o bloco do imóvel no DOM
    const bloco = document.querySelector(`.imovel-block[data-rip="${rip}"]`);
    if (!bloco) {
        console.warn(`[carregarCamposRIP] Bloco DOM para RIP ${rip} não encontrado.`);
        return;
    }

    let camposPreenchidos = 0;
    let camposAbertos = 0;

    // Itera sobre o mapeamento e preenche/tranca cada campo
    for (const [chaveSPU, chaveDOM] of Object.entries(MAPA_CAMPOS)) {
        const valor = dadosSPU[chaveSPU];
        const valorStr = (valor !== null && valor !== undefined) ? String(valor) : '';

        // Busca o elemento no bloco pelo data-field-key
        const campo = bloco.querySelector(`[data-field-key="${chaveDOM}"]`);
        if (!campo) continue;

        if (valorStr.trim() !== '') {
            // ===== CAMPO COM DADOS: preencher e TRANCAR =====
            camposPreenchidos++;

            if (campo.tagName === 'SELECT') {
                // Garante que a opção exista no select
                let optionExists = false;
                for (const opt of campo.options) {
                    if (opt.value === valorStr) {
                        optionExists = true;
                        break;
                    }
                }
                if (!optionExists) {
                    const newOpt = document.createElement('option');
                    newOpt.value = valorStr;
                    newOpt.text = valorStr;
                    campo.appendChild(newOpt);
                }
                campo.value = valorStr;
                campo.disabled = true;
                campo.classList.remove('custom-empty-select');
            } else {
                // INPUT text
                campo.value = valorStr;
                campo.readOnly = true;
                campo.disabled = false;
            }

            // Estilo visual de campo trancado (vindo do datalake)
            campo.style.backgroundColor = '#f1f5f9';
            campo.style.border = '1px solid #cbd5e1';
            campo.style.color = '#334155';
            campo.style.cursor = 'not-allowed';
            campo.classList.add('auto-loaded-field');
            campo.classList.remove('empty-spu-field');
            campo.classList.remove('custom-empty-select');

            // Dispara change para acionar lógicas condicionais
            campo.dispatchEvent(new Event('change', { bubbles: true }));

        } else {
            // ===== CAMPO SEM DADOS: trancar e exibir placeholder condicional =====
            camposPreenchidos++;

            if (campo.tagName === 'SELECT') {
                let opt = campo.querySelector('option[value=""]');
                if (!opt) {
                    opt = document.createElement('option');
                    opt.value = "";
                    campo.insertBefore(opt, campo.firstChild);
                }
                opt.textContent = "Não há este dado no cadastro do imóvel";
                opt.disabled = true;
                opt.selected = true;
                campo.value = "";
                campo.disabled = true;
                campo.classList.remove('custom-empty-select');
            } else {
                campo.placeholder = "Não há este dado no cadastro do imóvel";
                campo.value = "";
                campo.readOnly = true;
                campo.disabled = false;
            }

            // Estilo visual de campo trancado (fundo cinza)
            campo.style.backgroundColor = '#f1f5f9';
            campo.style.border = '1px solid #cbd5e1';
            campo.style.color = '#334155';
            campo.style.cursor = 'not-allowed';
            campo.classList.add('auto-loaded-field');
            campo.classList.add('empty-spu-field');
            campo.classList.remove('custom-empty-select');

            // Dispara change para acionar lógicas condicionais
            campo.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // ===== REGRAS CONDICIONAIS (regras_preenchimento.md) =====

    // CEP da geolocalização: prioriza geo_cep e usa cep como fallback
    const campoGeoCep = bloco.querySelector(`#cep_${rip}`);
    if (campoGeoCep) {
        const geoCep = (dadosSPU.geo_cep !== null && dadosSPU.geo_cep !== undefined) ? String(dadosSPU.geo_cep).trim() : '';
        const cepFallback = (dadosSPU.cep !== null && dadosSPU.cep !== undefined) ? String(dadosSPU.cep).trim() : '';
        const valorCepGeo = geoCep || cepFallback;
        if (valorCepGeo) {
            campoGeoCep.value = valorCepGeo;
        }
    }

    // 1. Situação da Incorporação = "Outros" → abre campo de observação
    const sitIncorp = bloco.querySelector('[data-field-key="situacao_incorporacao"]');
    if (sitIncorp) {
        sitIncorp.addEventListener('change', function() {
            const obsBloco = bloco.querySelector('[data-controlled-by="situacao_incorporacao"]');
            if (obsBloco) {
                obsBloco.style.display = (this.value === 'Outros') ? 'block' : 'none';
            }
        });
        // Aplica estado inicial
        const obsBloco = bloco.querySelector('[data-controlled-by="situacao_incorporacao"]');
        if (obsBloco) {
            obsBloco.style.display = (sitIncorp.value === 'Outros') ? 'block' : 'none';
        }
    }

    // 2. Processo de Incorporação = "Sim" → abre bloco de número/cartório/matrícula
    const procIncorp = bloco.querySelector('[data-field-key="processo_incorporacao"]');
    if (procIncorp) {
        procIncorp.addEventListener('change', function() {
            const subBloco = bloco.querySelector('[data-controlled-by="processo_incorporacao"]');
            if (subBloco) {
                subBloco.style.display = (this.value === 'Sim') ? 'block' : 'none';
            }
        });
        // Aplica estado inicial
        const subBloco = bloco.querySelector('[data-controlled-by="processo_incorporacao"]');
        if (subBloco) {
            subBloco.style.display = (procIncorp.value === 'Sim') ? 'block' : 'none';
        }
    }

    // 3. Benfeitorias = "Sim" → abre descrição de benfeitorias
    const benfeit = bloco.querySelector('[data-field-key="benfeitorias"]');
    if (benfeit) {
        benfeit.addEventListener('change', function() {
            const descBloco = bloco.querySelector(`#bloco-benfeitorias-descricao, [data-controlled-by="benfeitorias"]`);
            if (descBloco) {
                descBloco.style.display = (this.value === 'Sim') ? 'block' : 'none';
            }
        });
    }

    // Atualiza também o _ripsPesquisados no formDataState do parent
    try {
        if (window.parent && window.parent.formDataState) {
            if (!window.parent.formDataState._ripsPesquisados) {
                window.parent.formDataState._ripsPesquisados = {};
            }
            // Merge os dados do SPU nos dados do RIP
            const existing = window.parent.formDataState._ripsPesquisados[rip] || {};
            window.parent.formDataState._ripsPesquisados[rip] = {
                ...existing,
                ...dadosSPU,
                rip: rip,
                // Garante mapeamentos de alias
                natureza: dadosSPU.natureza_terreno || existing.natureza || '',
                endereco: dadosSPU.logradouro || existing.endereco || '',
                natureza_terreno: dadosSPU.natureza_terreno || existing.natureza_terreno || ''
            };
        }
    } catch (e) {
        console.warn('[carregarCamposRIP] Não foi possível atualizar formDataState:', e);
    }

    console.log(`✅ [carregarCamposRIP] RIP ${rip} concluído: ${camposPreenchidos} campos trancados, ${camposAbertos} campos abertos para edição.`);
};

// Accordion Toggle function
window.toggleAccordion = function(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');
    if (content) {
        const isCollapsed = content.style.display === 'none';
        
        if (isCollapsed) {
            content.style.display = 'block';
            content.animate([
                { opacity: 0, transform: 'translateY(-10px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 250, easing: 'ease-out' });
        } else {
            const animation = content.animate([
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(-5px)' }
            ], { duration: 200, easing: 'ease-in' });
            
            animation.onfinish = () => {
                content.style.display = 'none';
            };
        }
        
        if (icon) {
            icon.style.display = "inline-block";
            icon.style.transition = "transform 0.3s ease";
            icon.style.transform = isCollapsed ? 'rotate(-180deg)' : 'rotate(0deg)';
        }
        header.classList.toggle('active', isCollapsed);
    }
};

// Renderizar bloco de solicitação de criação de RIP (no topo)
window.criarBlocoSolicitacaoCriacao = function(texto) {
    if (!texto) return;
    const container = document.getElementById('container-solicitacao-criacao-rip');
    if (!container) return;

    container.style.display = "block";
    container.innerHTML = `
        <div class="card mb-4" style="border: 1px solid #fbcfe8; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); background-color: #fdf2f8;">
            <div class="accordion-header type-solicitacao" style="padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #fbcfe8; background-color: #fce7f3; color: #9d174d;">
                <h4 style="margin: 0; font-weight: bold; font-size: 1.1em;">🔔 Solicitação de Criação de RIP</h4>
            </div>
            <div style="padding: 16px;">
                <div class="form-group" style="text-align: left; margin: 0;">
                    <label style="display:block; margin-bottom: 5px; font-weight: 600; color: #9d174d;">Justificativa enviada ao setor de cadastro:</label>
                    <textarea readonly style="width: 100%; border: 1px solid #fbcfe8; padding: 8px; border-radius: 4px; background-color: #fff; color: #334155; resize: vertical; font-family: inherit; font-size: 14px;" rows="4">${texto}</textarea>
                </div>
            </div>
        </div>
    `;
};

// Renderizar bloco de Cadastro Mínimo
window.criarBlocoCadastroMinimo = function(dados, idx) {
    dados = dados || {};
    const container = document.getElementById('accordion-indicacoes');
    if (!container) return;

    // Remove text fallback list if still present
    const loadingText = container.querySelector('div') || container.querySelector('i');
    if (loadingText && loadingText.textContent.includes('Carregando')) {
        container.innerHTML = '';
    }

    // Evita duplicados
    const key = `cadastro-${dados.cep}-${dados.area}`;
    if (document.querySelector(`.cadastro-block[data-key="${key}"]`)) return;

    const div = document.createElement('div');
    div.className = 'cadastro-block card mb-4';
    div.setAttribute('data-key', key);
    div.style.border = '1px solid #cbd5e1';
    div.style.borderRadius = '8px';
    div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

    function buildReadOnlyField(label, value) {
        return `
            <div class="form-group" style="margin-bottom: 15px; text-align: left;">
                <label style="display:block; margin-bottom: 5px; font-weight: 600; color: #475569;">${label}</label>
                <input type="text" value="${value || ''}" readonly style="width: 100%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; background-color: #f8fafc; color: #334155;">
            </div>
        `;
    }

    div.innerHTML = `
        <div class="accordion-header type-cadastro" style="padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; font-weight: bold;">Cadastro Mínimo Selecionado: CEP ${dados.cep || 'N/D'}</h4>
            <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold;">▼</span>
        </div>
        <div class="accordion-content" style="display: none; padding: 16px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                ${buildReadOnlyField('CEP', dados.cep)}
                ${buildReadOnlyField('UF', dados.uf)}
                ${buildReadOnlyField('Município', dados.municipio)}
                ${buildReadOnlyField('Logradouro', dados.logradouro || dados.endereco)}
                ${buildReadOnlyField('Número', dados.numero)}
                ${buildReadOnlyField('Área a ser destinada (m²)', dados.area)}
            </div>
            ${dados.observacoes ? `
            <div class="form-group" style="margin-top: 15px; text-align: left;">
                <label style="display:block; margin-bottom: 5px; font-weight: 600; color: #475569;">Observações</label>
                <textarea readonly style="width: 100%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; background-color: #f8fafc; color: #334155; resize: vertical;" rows="3">${dados.observacoes}</textarea>
            </div>
            ` : ''}
        </div>
    `;

    container.appendChild(div);
};

// Carregar dados iniciais de indicação (Cadastro Mínimo e Solicitação de Criação), se existirem
setTimeout(async () => {
    const processId = localStorage.getItem('CURRENT_PROCESS_ID');
    if (processId && window.parent && typeof window.parent.carregarIndicacoes === 'function') {
        const registro = await window.parent.carregarIndicacoes(processId);
        if (registro && registro.dados_json) {
            // 1. Solicitação de Criação de RIP (Carrega por cima)
            const solicitacao = registro.dados_json.solicitacao_criacao_rip || "";
            if (solicitacao && typeof window.criarBlocoSolicitacaoCriacao === 'function') {
                window.criarBlocoSolicitacaoCriacao(solicitacao);
            }

            // 2. Cadastro Mínimo (Carrega por último)
            const cadastros = registro.dados_json.cadastros_minimos || [];
            cadastros.forEach((cad, idx) => {
                if (typeof window.criarBlocoCadastroMinimo === 'function') {
                    window.criarBlocoCadastroMinimo(cad, idx);
                }
            });
        }
    }
}, 1000);

// ==================== Lógica de Triagem de Pergunta com Multicheckbox (Global) ====================
window.initPerguntaComMulticheck = function(config) {
    var grupoPergunta = document.querySelector(config.perguntaSelector);
    var grupoItens = document.querySelector(config.itensSelector);
    var blocoObs = document.querySelector(config.obsSelector);
    if (!grupoPergunta || !grupoItens) return;

    var checksPergunta = grupoPergunta.querySelectorAll('input[type="checkbox"]');
    var checksItens = grupoItens.querySelectorAll('input[type="checkbox"]');

    function valorPerguntaSelecionado() {
        for (var i = 0; i < checksPergunta.length; i++) {
            if (checksPergunta[i].checked) return checksPergunta[i].value;
        }
        return '';
    }

    function atualizar(changedPergunta) {
        if (changedPergunta) {
            checksPergunta.forEach(function(cb) {
                if (cb !== changedPergunta) cb.checked = false;
            });
        }

        var valorPergunta = valorPerguntaSelecionado();
        var mostrarItens = valorPergunta === 'Sim';

        if (!valorPergunta) {
            var algumItemMarcado = false;
            checksItens.forEach(function(cb) {
                if (cb.checked) algumItemMarcado = true;
            });
            if (algumItemMarcado) {
                checksPergunta.forEach(function(cb) {
                    cb.checked = (cb.value === 'Sim');
                });
                mostrarItens = true;
            }
        }

        grupoItens.style.display = mostrarItens ? 'block' : 'none';

        var algumMarcado = false;
        checksItens.forEach(function(cb) {
            if (cb.checked) algumMarcado = true;
        });
        if (blocoObs) {
            blocoObs.style.display = (mostrarItens && algumMarcado) ? 'flex' : 'none';
        }
    }

    checksPergunta.forEach(function(cb) {
        cb.addEventListener('change', function() { atualizar(cb); });
    });
    checksItens.forEach(function(cb) {
        cb.addEventListener('change', function() { atualizar(null); });
    });

    setTimeout(function() { atualizar(null); }, 0);
};

// ==================== Lógica de Inicialização das Seções Globais (Aba 2) ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Situação Ocupacional: show/hide condicional
    const situacaoRadios = document.querySelectorAll('input[name="situacao_ocupacional"]');
    function atualizarOcupacaoGlobal() {
        const blocoDesocupado = document.getElementById('bloco-desocupado');
        const blocoOcupado = document.getElementById('bloco-ocupado');
        const blocoUsoAtual = document.getElementById('bloco-uso-atual');
        const checked = document.querySelector('input[name="situacao_ocupacional"]:checked');
        const val = checked ? checked.value : '';
        if (blocoDesocupado) blocoDesocupado.style.display = (val === 'Desocupado') ? 'flex' : 'none';
        if (blocoOcupado) blocoOcupado.style.display = (val === 'Ocupado regularmente' || val === 'Ocupado irregularmente') ? 'flex' : 'none';
        if (blocoUsoAtual) blocoUsoAtual.style.display = (val === 'Ocupado regularmente' || val === 'Ocupado irregularmente') ? 'flex' : 'none';
    }
    situacaoRadios.forEach(radio => radio.addEventListener('change', atualizarOcupacaoGlobal));
    setTimeout(atualizarOcupacaoGlobal, 100);

    // 2. Incidência/Riscos/Restrições: triagem questions (Sim/Não/Não há informação)
    setTimeout(() => {
        if (typeof window.initPerguntaComMulticheck === 'function') {
            window.initPerguntaComMulticheck({
                perguntaSelector: '#group-pergunta-incidencia',
                itensSelector: '#bloco-incidencia-itens',
                obsSelector: '#bloco-obs-incidencia'
            });
            window.initPerguntaComMulticheck({
                perguntaSelector: '#group-pergunta-riscos',
                itensSelector: '#bloco-riscos-itens',
                obsSelector: '#bloco-obs-riscos'
            });
            window.initPerguntaComMulticheck({
                perguntaSelector: '#group-pergunta-restricoes',
                itensSelector: '#bloco-restricoes-itens',
                obsSelector: '#bloco-obs-restricoes'
            });
        }
    }, 200);

    // 4. Busca geográfica por CEP global e abertura do modal
    const btnOpenGeo = document.getElementById('btn-open-geo-modal');
    if (btnOpenGeo) {
        btnOpenGeo.addEventListener('click', () => {
            if (typeof window.abrirGeoModal === 'function') window.abrirGeoModal();
        });
    }
    const btnBuscarCepGlobal = document.getElementById('btnBuscarCepGlobal');
    if (btnBuscarCepGlobal) {
        btnBuscarCepGlobal.addEventListener('click', () => {
            if (typeof window.abrirGeoModal === 'function') window.abrirGeoModal();
            else {
                // Fallback direct modal opening
                const geoModal = document.getElementById('geoModal');
                if (geoModal) geoModal.style.display = 'flex';
                if (typeof window.inicializarMapa === 'function') window.inicializarMapa();
            }
        });
    }


});

// Abertura do Modal de Geolocalização (Global)
window.abrirGeoModal = function() {
    const geoModal = document.getElementById('geoModal');
    if (geoModal) {
        geoModal.style.display = 'flex';
    }
    if (typeof window.inicializarMapa === 'function') {
        window.inicializarMapa();
    }
    
    const latInput = document.getElementById('latitude')?.value || '';
    const lonInput = document.getElementById('longitude')?.value || '';
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    
    if (!isNaN(lat) && !isNaN(lon)) {
        if (window.drawnItems) {
            window.drawnItems.clearLayers();
            const marker = L.marker([lat, lon]);
            window.drawnItems.addLayer(marker);
            setTimeout(() => { 
                if (window.map) window.map.setView([lat, lon], 16); 
            }, 400);
        }
    } else {
        const cepStr = document.getElementById('cep')?.value || '';
        if (cepStr && (!window.drawnItems || window.drawnItems.getLayers().length === 0)) {
            const modalSearchInput = document.getElementById('modal-search-input');
            if (modalSearchInput) {
                modalSearchInput.value = cepStr;
                if (typeof window.buscarNoModal === 'function') {
                    window.buscarNoModal();
                }
            }
        }
    }
};

// =========================================================================
// LÓGICA DE SALVAMENTO E MANIFESTAÇÃO (ABA 2)
// =========================================================================

const formReq2 = document.getElementById("form02") || document.querySelector("form");
if (formReq2) {
  formReq2.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o sync.js de interceptar submissões acidentais
  });
}
let ultimoRelatorioSalvoAba2 = {};

async function executarSalvamentoAba2() {
  // Validar se todos os diagnósticos de RIPs foram concluídos
  const badges = document.querySelectorAll('.rip-status-badge');
  let allCompleted = true;
  let pendingRips = [];
  badges.forEach(badge => {
    const statusText = badge.getAttribute('data-status') || badge.textContent.trim();
    if (statusText !== 'Concluído') {
      allCompleted = false;
      const ripId = badge.id.replace('status-rip-', '');
      pendingRips.push(ripId);
    }
  });

  if (!allCompleted) {
    alert(`Atenção: Os seguintes RIPs estão com o diagnóstico pendente: ${pendingRips.join(', ')}. Por favor, responda se há inconsistências cadastrais em cada um deles antes de salvar.`);
    return false;
  }

  if (formReq2 && !formReq2.checkValidity()) {
    formReq2.reportValidity();
    const invalidField = formReq2.querySelector(":invalid");
    if (invalidField) {
      invalidField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    alert("Atenção: Existem campos obrigatórios não preenchidos (ex: Situação Ocupacional). Por favor, preencha-os antes de salvar.");
    return false;
  }

  const processId = localStorage.getItem("CURRENT_PROCESS_ID");
  if (window.parent) {
    try {
      // Força a atualização do formDataState global do sync.js
      if (typeof window.parent.forceSaveDraft === "function") {
        await window.parent.forceSaveDraft();
      }

      // Coletar dados para o Relatório da Aba 2
      const formDataState = window.parent.formDataState || {};

      ultimoRelatorioSalvoAba2 = {
        tem_matricula: formDataState["imoveis[0][processo_incorporacao]"] || formDataState["tem_matricula"] || "",
        num_matricula: formDataState["imoveis[0][matricula]"] || formDataState["matricula"] || formDataState["num_matricula"] || "",
        cartorio_matricula: formDataState["imoveis[0][cartorio]"] || formDataState["cartorio"] || formDataState["cartorio_matricula"] || "",

        situacao_ocupacional: formDataState["situacao_ocupacional"] || "",
        uso_principal: formDataState["uso_principal"] || "",

        condicao_urbanizacao: formDataState["imoveis[0][condicao_urbanizacao]"] || formDataState["condicao_urbanizacao"] || "",

        incidencia_ambiental:
          formDataState["incidencia_ambiental[]"] ||
          formDataState["incidencia_ambiental"] ||
          [],
        obs_incidencia_ambiental:
          formDataState["obs_incidencia_ambiental"] || "",

        ha_riscos:
          formDataState["ha_riscos[]"] || formDataState["ha_riscos"] || "",
        riscos: formDataState["riscos[]"] || formDataState["riscos"] || [],
        obs_riscos: formDataState["obs_riscos"] || "",

        ha_restricoes:
          formDataState["ha_restricoes[]"] ||
          formDataState["ha_restricoes"] ||
          "",
        restricoes:
          formDataState["restricoes[]"] || formDataState["restricoes"] || [],
        obs_restricoes: formDataState["obs_restricoes"] || "",

        observacoes_aba2: formDataState["observacoes_aba2"] || "",
      };

      const urlRel = `${window.parent.SUPABASE_URL}/rest/v1/tabela_relatorios?on_conflict=process_id,aba`;
      const payloadRel = {
        process_id: processId,
        aba: "aba2",
        dados_relatorio: ultimoRelatorioSalvoAba2,
        updated_at: new Date().toISOString(),
      };

      await fetch(urlRel, {
        method: "POST",
        headers: {
          apikey: window.parent.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${window.parent.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(payloadRel),
      });

      // --- VERSIONAMENTO: gravar snapshot na tabela_versoes_formulario ---
      try {
        const urlVersoes = `${window.parent.SUPABASE_URL}/rest/v1/tabela_versoes_formulario`;
        const urlUltimaVersao = `${urlVersoes}?processo_id=eq.${encodeURIComponent(processId)}&aba=eq.aba2&order=versao.desc&limit=1`;
        const resUltima = await fetch(urlUltimaVersao, {
          headers: { apikey: window.parent.SUPABASE_ANON_KEY, Authorization: `Bearer ${window.parent.SUPABASE_ANON_KEY}` }
        });
        const arrUltima = await resUltima.json();
        const proximaVersao = (arrUltima.length > 0 ? arrUltima[0].versao : 0) + 1;

        await fetch(urlVersoes, {
          method: "POST",
          headers: {
            apikey: window.parent.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${window.parent.SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            processo_id: processId,
            aba: "aba2",
            versao: proximaVersao,
            dados_json: ultimoRelatorioSalvoAba2,
            criado_por: localStorage.getItem("CURRENT_USER_PROFILE") || "SISTEMA"
          })
        });
        console.log(`✅ [foco-02] Versão ${proximaVersao} gravada em tabela_versoes_formulario`);
      } catch (errVersao) {
        console.warn("⚠️ [foco-02] Erro ao gravar versão (não bloqueia):", errVersao);
      }

      return true;
    } catch (err) {
      console.error("❌ [foco-02] Erro durante o salvamento:", err);
      return false;
    }
  }
  return false;
}

const btnSalvarRelatorio = document.getElementById("btnSalvarRelatorio");
const btnManifestacao = document.getElementById("btnManifestacao");
const btnEnviarCaracterizacao = document.getElementById("btnEnviarCaracterizacao");

if (btnSalvarRelatorio) {
  btnSalvarRelatorio.addEventListener("click", async () => {
    const orig = btnSalvarRelatorio.innerHTML;
    btnSalvarRelatorio.innerHTML = "Salvando...";
    const sucesso = await executarSalvamentoAba2();
    btnSalvarRelatorio.innerHTML = orig;

    if (sucesso) {
      alert("Dados da Aba 2 salvos com sucesso!");
      if (btnManifestacao) {
        btnManifestacao.style.display = "block";
      }
    }
  });
}

if (btnManifestacao) {
  btnManifestacao.addEventListener("click", async () => {
    const orig = btnManifestacao.innerHTML;
    btnManifestacao.innerHTML = "Preparando...";
    const sucesso = await executarSalvamentoAba2();
    btnManifestacao.innerHTML = orig;

    if (!sucesso) return;

    const modalAprovacao = document.getElementById("modalAprovacaoAba2");
    const chkAprovar = document.getElementById("chkAprovarAba2");
    const btnConfirmarAprov = document.getElementById("btnConfirmarAprovacao");
    const btnCancelarAprov = document.getElementById("btnCancelarAprovacao");
    const btnFecharAprov = document.getElementById("btnFecharModalAprovacao");
    const loadingRelatorio = document.getElementById("loadingRelatorio");
    const conteudoRel = document.getElementById("conteudoRelatorioAprovacao");

    if (modalAprovacao) {
      loadingRelatorio.style.display = "block";
      conteudoRel.style.display = "none";
      chkAprovar.checked = false;
      btnConfirmarAprov.disabled = true;

      modalAprovacao.style.display = "flex";

      const onCheckChange = (ev) => {
        btnConfirmarAprov.disabled = !ev.target.checked;
      };
      chkAprovar.removeEventListener("change", onCheckChange);
      chkAprovar.addEventListener("change", onCheckChange);

      const fecharModal = () => {
        modalAprovacao.style.display = "none";
      };
      if (btnCancelarAprov) btnCancelarAprov.onclick = fecharModal;
      if (btnFecharAprov) btnFecharAprov.onclick = fecharModal;

      // Carrega e renderiza os dados dinamicamente (Sem iframe)
      try {
        const processId = localStorage.getItem("CURRENT_PROCESS_ID");
        const SUPA_URL = window.parent?.SUPABASE_URL;
        const SUPA_KEY = window.parent?.SUPABASE_ANON_KEY;

        if (!SUPA_URL || !SUPA_KEY) {
          throw new Error("Credenciais do Supabase não encontradas.");
        }

        const url = `${SUPA_URL}/rest/v1/tabela_relatorios?select=*&process_id=eq.${encodeURIComponent(processId)}&aba=eq.aba2&limit=1`;
        const res = await fetch(url, {
          headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Status ${res.status}: ${res.statusText} - ${errorText}`);
        }

        const data = await res.json();
        if (data && data.length > 0) {
          ultimoRelatorioSalvoAba2 = data[0].dados_relatorio;
          const rel = ultimoRelatorioSalvoAba2;

          let incidenciasHtml = (rel.incidencia_ambiental && rel.incidencia_ambiental.length > 0) ? (Array.isArray(rel.incidencia_ambiental) ? rel.incidencia_ambiental.join(', ') : rel.incidencia_ambiental) : '-';
          let riscosHtml = (rel.ha_riscos === 'Sim' && rel.riscos && rel.riscos.length > 0) ? (Array.isArray(rel.riscos) ? rel.riscos.join(', ') : rel.riscos) : rel.ha_riscos || '-';
          let restricoesHtml = (rel.ha_restricoes === 'Sim' && rel.restricoes && rel.restricoes.length > 0) ? (Array.isArray(rel.restricoes) ? rel.restricoes.join(', ') : rel.restricoes) : rel.ha_restricoes || '-';

          let historicoDevolucaoHtml = '';
          if (rel.motivo_devolucao || rel.resposta_devolucao) {
              historicoDevolucaoHtml = `
                  <div style="margin-top: 25px; padding: 20px; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px;">
                      <h4 style="margin:0 0 15px 0; color: #d97706; border-bottom: 1px solid #fcd34d; padding-bottom: 8px;">
                          🔄 Histórico de Devolução e Retificação
                      </h4>
                      <div style="margin-bottom: 15px; border-left: 4px solid #ef4444; padding-left: 12px;">
                          <p style="margin: 0 0 5px 0; color: #b91c1c; font-size: 13px; font-weight: bold;">Motivo da Devolução (Questionamento):</p>
                          <p style="margin: 0; font-size: 14px; color: #450a0a; white-space: pre-wrap;">${rel.motivo_devolucao || 'Não registrado'}</p>
                      </div>
                      <div style="border-left: 4px solid #10b981; padding-left: 12px;">
                          <p style="margin: 0 0 5px 0; color: #047857; font-size: 13px; font-weight: bold;">Resposta da Equipe (Correção realizada):</p>
                          <p style="margin: 0; font-size: 14px; color: #064e3b; white-space: pre-wrap;">${rel.resposta_devolucao || 'Não registrado'}</p>
                      </div>
                  </div>
              `;
          }

          let conclusaoHtml = '';
          if (rel.aprovacao && rel.aprovacao.status) {
              const aprovDate = new Date(rel.aprovacao.data).toLocaleString('pt-BR');
              const perfilAss = rel.aprovacao.perfil || 'Perfil Atual';
              const obsAss = rel.aprovacao.observacoes ? rel.aprovacao.observacoes : 'Sem observações adicionais.';
              conclusaoHtml = `
                  <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #ccc; color: #333;">
                      <h4 style="margin:0 0 10px 0; color: #1e3a5f;">Conclusão e Manifestação</h4>
                      <div style="background: #e8f5e9; padding: 15px; border-radius: 4px; border-left: 4px solid #166534; margin-bottom: 15px;">
                          <p style="margin: 0 0 10px 0; font-size: 13px; color: #166534;">
                              <strong>Declaração:</strong> Declaro que as informações consignadas neste formulário foram inseridas com base nos dados disponíveis nos sistemas oficiais, nos documentos constantes do processo e nas verificações realizadas no âmbito desta unidade, estando compatíveis com os elementos analisados.
                          </p>
                          <div style="font-size: 14px; color: #166534;">
                              <strong>✅ Aprovado e Assinado Digitalmente</strong>
                              <br>Data: ${aprovDate}
                              <br>Perfil Responsável: <strong>${perfilAss}</strong>
                          </div>
                      </div>
                      <div style="background: #f8fafc; padding: 15px; border-radius: 4px; border: 1px solid #cbd5e1;">
                          <h5 style="margin:0 0 8px 0; color: #334155; font-size: 14px;">Observações da Manifestação:</h5>
                          <p style="margin: 0; font-size: 13px; color: #475569; white-space: pre-wrap;">${obsAss}</p>
                      </div>
                  </div>
              `;
          }

          const dateObj = new Date(data[0].updated_at);
          const dataRelatorioStr = dateObj.toLocaleString('pt-BR');

          const html = `
              <div class="report-section">
                  <div class="report-section-title">Situação Patrimonial e Matrícula</div>
                  <div class="report-grid">
                      <div class="report-item">
                          <span class="report-label">Imóvel possui matrícula?</span>
                          <span class="report-value">${rel.tem_matricula || '-'}</span>
                      </div>
                      <div class="report-item">
                          <span class="report-label">Nº da Matrícula / Transcrição</span>
                          <span class="report-value">${rel.num_matricula || '-'}</span>
                      </div>
                      <div class="report-item">
                          <span class="report-label">Cartório / Ofício de Imóveis</span>
                          <span class="report-value">${rel.cartorio_matricula || '-'}</span>
                      </div>
                  </div>
              </div>
              <div class="report-section">
                  <div class="report-section-title">Ocupação e Uso</div>
                  <div class="report-grid">
                      <div class="report-item">
                          <span class="report-label">Situação Ocupacional</span>
                          <span class="report-value">${rel.situacao_ocupacional || '-'}</span>
                      </div>
                      <div class="report-item">
                          <span class="report-label">Uso Principal Atual</span>
                          <span class="report-value">${rel.uso_principal || '-'}</span>
                      </div>
                  </div>
              </div>
              <div class="report-section">
                  <div class="report-section-title">Aspectos Físicos e Ambientais</div>
                  <div class="report-grid">
                      <div class="report-item" style="grid-column: span 2;">
                          <span class="report-label">Condição de Urbanização / Obras</span>
                          <span class="report-value">${rel.condicao_urbanizacao || '-'}</span>
                      </div>
                      <div class="report-item" style="grid-column: span 2;">
                          <span class="report-label">Incidências Ambientais Verificadas</span>
                          <span class="report-value">${incidenciasHtml}</span>
                      </div>
                      <div class="report-item" style="grid-column: span 2;">
                          <span class="report-label">Observações Ambientais</span>
                          <span class="report-value">${rel.obs_incidencia_ambiental || '-'}</span>
                      </div>
                  </div>
              </div>
              <div class="report-section">
                  <div class="report-section-title">Riscos e Restrições</div>
                  <div class="report-grid">
                      <div class="report-item" style="grid-column: span 2;">
                          <span class="report-label">Riscos Verificados</span>
                          <span class="report-value">${riscosHtml}</span>
                      </div>
                      <div class="report-item" style="grid-column: span 2;">
                          <span class="report-label">Observações sobre Riscos</span>
                          <span class="report-value">${rel.obs_riscos || '-'}</span>
                      </div>
                      <div class="report-item" style="grid-column: span 2;">
                          <span class="report-label">Restrições / Condições Específicas</span>
                          <span class="report-value">${restricoesHtml}</span>
                      </div>
                      <div class="report-item" style="grid-column: span 2;">
                          <span class="report-label">Observações sobre Restrições</span>
                          <span class="report-value">${rel.obs_restricoes || '-'}</span>
                      </div>
                  </div>
              </div>
              <div style="margin-top: 40px; padding: 15px; border: 1px solid #ddd; border-left: 6px solid #1a7a4a; background: #fdfdfd; width: 100%; box-sizing: border-box; font-size: 0.85rem; color: #444; font-family: sans-serif;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                      <div style="line-height: 1.5;">
                          Responsável: <span style="color:#1a4e8a; font-weight:bold;">Sistema (Geração Automática)</span><br>
                          Status do Documento: <span style="color:#1a7a4a; font-weight:bold;">CONSOLIDADO E CONFERIDO</span>
                      </div>
                      <div style="text-align: right; line-height: 1.5;">
                          <strong>Data/Hora Relatório:</strong> <span>${dataRelatorioStr}</span><br>
                          <strong>Processo Base:</strong> <span style="font-family: monospace; color: #666;">${processId}</span>
                      </div>
                  </div>
                  ${historicoDevolucaoHtml}
                  ${conclusaoHtml}
              </div>
          `;

          conteudoRel.innerHTML = html;
          loadingRelatorio.style.display = "none";
          conteudoRel.style.display = "block";
        } else {
          loadingRelatorio.innerText = "Nenhum relatório salvo encontrado para a Aba 2. Salve a Aba 2 para gerar.";
        }
      } catch (err) {
        console.error(err);
        loadingRelatorio.innerText = "Erro ao carregar o relatório: " + err.message;
      }

      btnConfirmarAprov.onclick = async () => {
        const origBtn = btnConfirmarAprov.innerHTML;
        btnConfirmarAprov.innerHTML = "Salvando...";

        try {
          const processId = localStorage.getItem("CURRENT_PROCESS_ID");
          const urlRelPatch = `${window.parent.SUPABASE_URL}/rest/v1/tabela_relatorios?process_id=eq.${encodeURIComponent(processId)}&aba=eq.aba2`;

          const observacoes = document.getElementById("txtObservacoesAba2")
            ? document.getElementById("txtObservacoesAba2").value
            : "";
          const perfilLogado =
            localStorage.getItem("CURRENT_USER_PROFILE") ||
            "Equipe SPU/UF (Caracterização)";

          ultimoRelatorioSalvoAba2.aprovacao = {
            status: true,
            data: new Date().toISOString(),
            perfil: perfilLogado,
            observacoes: observacoes,
          };

          await fetch(urlRelPatch, {
            method: "PATCH",
            headers: {
              apikey: window.parent.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${window.parent.SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dados_relatorio: ultimoRelatorioSalvoAba2,
              updated_at: new Date().toISOString(),
            }),
          });

          // Sucesso na manifestação! Mostra o botão para enviar para Aba 3
          if (btnEnviarCaracterizacao) {
            btnEnviarCaracterizacao.style.display = "block";
          }
          fecharModal();
        } catch (e) {
          console.error("❌ [foco-02] Erro ao salvar aprovação:", e);
        }
        btnConfirmarAprov.innerHTML = origBtn;
      };
    }
  });
}

if (btnEnviarCaracterizacao) {
  btnEnviarCaracterizacao.addEventListener("click", async () => {
    // Salvar Snapshot Histórico no Supabase antes de trocar de aba
    if (window.parent && typeof window.parent.salvarSnapshotHistorico === 'function') {
        await window.parent.salvarSnapshotHistorico('Aba 2 (Caracterização)');
    }

    // Atualiza status do fluxo ao enviar
    const processId = localStorage.getItem('CURRENT_PROCESS_ID');
    if (processId && window.parent && typeof window.parent.updateStatusFluxo === 'function') {
        await window.parent.updateStatusFluxo(processId, 4); // ID 4: Análise Viabilidade (Destinação)
    }

    // Navega para a Aba 3 explicitamente
    const rootWindow = window.parent?.parent || window.parent || window;
    const btnTabNext = rootWindow.document?.querySelector(
      'button[data-url="foco-03.html"]',
    );
    if (btnTabNext) {
      btnTabNext.click();
    }
  });
}

