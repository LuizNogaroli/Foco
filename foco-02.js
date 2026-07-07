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
    const lista = document.getElementById('listaRIPsAssociados');
    if (lista) lista.style.display = 'flex';
    
    if (document.querySelector('.rip-tag[data-rip="' + rip + '"]')) return;

    const div = document.createElement('div');
    div.className = 'rip-tag';
    div.setAttribute('data-rip', rip);
    div.style.padding = '10px 14px';
    div.style.border = '1px solid #c8e6c9';
    div.style.backgroundColor = '#e8f5e9';
    div.style.borderRadius = '6px';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    
    div.innerHTML = `
        <span><strong style="color: #2e7d32; font-size: 1.1em;">RIP: ${rip}</strong> - ${dados ? (dados.natureza || dados.natureza_terreno || 'Terreno Importado') : 'Terreno Importado'}</span>
        <button type="button" onclick="window.removerRIP('${rip}')" style="background: none; border: none; color: #d32f2f; font-weight: bold; cursor: pointer; font-size: 1.1em;" title="Remover RIP">&times;</button>
    `;
    if (lista) lista.appendChild(div);
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

    div.innerHTML = `
        <div class="accordion-header" style="background-color: #f1f5f9; padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; color: #0f172a;">Imóvel Selecionado: RIP ${rip}</h4>
            <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold; color: #64748b;">▲</span>
        </div>
        <div class="accordion-content" style="display: block; padding: 16px;">
            <input type="hidden" name="imoveis[${index}][rip]" value="${rip}">
            
            <div id="secao-identificacao-${rip}">
            <h4 style="margin: 0 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
              Identificação do Imóvel
              
            </h4>
            
            ${buildField('Conceituação do Imóvel', 'conceituacao', dados.conceituacao || dados.descricao)}
            ${buildField('Condição de Urbanização', 'condicao_urbanizacao', dados.condicao_urbanizacao)}
            ${buildField('Natureza do Imóvel', 'natureza', dados.natureza || dados.natureza_terreno)}
            ${buildField('Tipo de Imóvel', 'tipo_imovel', dados.tipoImovel || dados.tipo_imovel)}
            ${buildField('CEP', 'cep', dados.cep)}
            ${buildField('UF', 'uf', dados.uf)}
            ${buildField('Município', 'municipio', dados.municipio)}
            ${buildField('Endereço', 'endereco', dados.endereco || dados.logradouro)}
            ${buildField('Área total (m²)', 'area_total', dados.area_total)}
            ${buildField('Área da União (m²)', 'area_uniao', dados.area_uniao)}
            ${buildField('Há benfeitorias?', 'benfeitorias', dados.benfeitorias)}
            ${buildField('Área construída total (m²)', 'area_construida_total', dados.area_construida_total)}
            ${buildField('Área construída disponível (m²)', 'area_construida_disponivel', dados.area_construida_disponivel)}
            ${buildField('Área de terreno disponível (m²)', 'area_terreno_disponivel', dados.area_terreno_disponivel)}
            ${buildField('Situação da Incorporação', 'situacao_incorporacao', dados.situacao_incorporacao || dados.situacao)}
            ${buildField('LPM/1831 ou LMEO homologadas?', 'lpm_homologada', dados.lpm_homologada)}
            ${buildField('Processo de incorp.?', 'processo_incorporacao', dados.processo_incorporacao)}
            <div class="bloco-condicional" data-controlled-by="processo_incorporacao" data-show-when="Sim" style="display:none; padding-left:16px; border-left:3px solid #94a3b8; margin-top:4px;">
                ${buildField('Número do Processo', 'numero_processo', dados.numero_processo)}
                ${buildField('Cartório', 'cartorio', dados.cartorio)}
                ${buildField('Matrícula', 'matricula', dados.matricula)}
            </div>
            
            <!-- Bloco Justificativa da Identificação -->
            <!-- /secao-identificacao -->
        </div>

            <!-- ========== AVALIAÇÃO DO IMÓVEL ========== -->
            <div id="secao-avaliacao-${rip}">
                <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
                  Avaliação do Imóvel
                </h4>
                ${buildField('Valor da Avaliação (R$)', 'valor_avaliacao', dados.valor_avaliacao)}
                ${buildField('Data da Avaliação', 'data_avaliacao', dados.data_avaliacao)}
                ${buildField('Instrumento de Avaliação', 'instrumento_avaliacao', dados.instrumento_avaliacao)}
                
                <div class="form-group editavel">
                    <div class="dynamic-list-wrapper" style="margin-top: 10px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <button type="button" class="btn-add" id="btnAdicionarDocumentoAvaliacao_${rip}" style="align-self: flex-start;" onclick="if(typeof window.adicionarDocumentoDinamico === 'function') window.adicionarDocumentoDinamico('documentos-list-avaliacao_${rip}')">＋ Anexar Instrumento de Avaliação (Digitalizado)</button>
                        <div id="documentos-list-avaliacao_${rip}"></div>
                    </div>
                </div>
            </div>
<!-- ==================== OCUPAÇÃO ==================== -->
          <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            Ocupação
          </h4>

          <!-- 3.1 Situação ocupacional -->
          <div class="form-group editavel">
            <label>Situação ocupacional:</label>

            <div class="radio-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: center;">
              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][situacao_ocupacional]" value="Desocupado" required />
                Desocupado
              </label>

              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][situacao_ocupacional]" value="Ocupado regularmente" />
                Ocupado regularmente
              </label>

              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][situacao_ocupacional]" value="Ocupado irregularmente" />
                Ocupado irregularmente
              </label>

              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][situacao_ocupacional]" value="Não há informação" />
                Não há informação
              </label>
            </div>

            <!-- Campos exibidos quando Desocupado -->
            <div id="bloco-desocupado_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="campo-tempo-desocupacao_${rip}">Tempo de desocupação:</label>
              <input
                type="text"
                id="campo-tempo-desocupacao_${rip}"
                name="imoveis[${index}][tempo_desocupacao]"
                placeholder="Ex: 05 anos, desde 03/2010 ou desde 2010"
              />

              <label for="obs-desocupado_${rip}">Observações:</label>
              <textarea
                id="obs-desocupado_${rip}"
                name="imoveis[${index}][obs_desocupado]"
                placeholder="Observações sobre a desocupação..."
              ></textarea>
            </div>

            <!-- Campos exibidos quando Ocupado regularmente ou Ocupado irregularmente -->
            <div id="bloco-ocupado_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="campo-data-conhecimento-ocupacao_${rip}">Data de conhecimento da ocupação:</label>
              <input
                type="text"
                id="campo-data-conhecimento-ocupacao_${rip}"
                name="imoveis[${index}][data_conhecimento_ocupacao]"
                placeholder="Ex: 03/2010 ou 2010"
              />

              <label for="obs-ocupado_${rip}">Observações:</label>
              <textarea
                id="obs-ocupado_${rip}"
                name="imoveis[${index}][obs_ocupado]"
                placeholder="Informar dados do ocupante e indicar se a ocupação é parcial ou integral."
              ></textarea>
            </div>
          </div>

          <!-- Campos exibidos apenas quando Ocupado regularmente ou Ocupado irregularmente -->
          <div id="bloco-uso-atual_${rip}" style="display: none; flex-direction: column; gap: 0;">

            <!-- 3.2 Uso imobiliário atual -->
            <div class="form-group editavel">
              <label for="campo32_${rip}">Uso imobiliário atual:</label>
              <select id="campo32_${rip}" name="imoveis[${index}][tipo_uso_atual]">
                <option value="">Selecione...</option>
                <option value="0101">01.01 Uso administrativo e representativo</option>
                <option value="0102">01.02 Uso para agropecuária, aquicultura, produção florestal e pesca</option>
                <option value="0103">01.03 Uso ambiental e dos recursos naturais</option>
                <option value="0104">01.04 Uso cultural, esportivo e de lazer</option>
                <option value="0106">01.06 Uso habitacional</option>
                <option value="0111">01.11 Uso por povos originários e comunidades tradicionais</option>
              </select>
            </div>

            <!-- 3.3 Uso específico atual -->
            <div class="form-group editavel">
              <label for="campo33_${rip}">Uso específico atual:</label>
              <select id="campo33_${rip}" name="imoveis[${index}][tipo_uso_especifico_atual]" disabled>
                <option value="">Selecione primeiro o uso imobiliário atual...</option>
              </select>
            </div>

          </div>

          <!-- ==================== INCIDÊNCIA AMBIENTAL ==================== -->
          <div class="form-group editavel">
            <label>Incidência ambiental:</label>

            <div class="checkbox-group" id="group-incidencia_${rip}" class="checkbox-group">

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][incidencia_ambiental][]"
                  value="Nenhuma incidência identificada"
                />
                Nenhuma incidência identificada
                <span class="hint-semaforo">
                  <span
                    class="hint-icon"
                    data-hint="Não foi identificada incidência ambiental relevante sobre o imóvel."
                    data-hint-tipo="verde"
                  >?</span>
                </span>
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][incidencia_ambiental][]"
                  value="APP"
                />
                APP — Área de Preservação Permanente
                <span class="hint-semaforo">
                  <span
                    class="hint-icon"
                    data-hint="Área protegida por legislação específica com restrições severas."
                    data-hint-tipo="vermelho"
                  >?</span>
                </span>
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][incidencia_ambiental][]"
                  value="Unidade de Conservação"
                />
                Unidade de Conservação Federal, Estadual ou Municipal
                <span class="hint-semaforo">
                  <span
                    class="hint-icon"
                    data-hint="Sujeito a regime próprio de proteção."
                    data-hint-tipo="amarelo"
                  >?</span>
                </span>
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][incidencia_ambiental][]"
                  value="Área de risco"
                />
                Área de risco — geotécnica, inundação, etc.
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][incidencia_ambiental][]"
                  value="Área contaminada"
                />
                Área contaminada — passivo ambiental
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][incidencia_ambiental][]"
                  value="Outra situação ambiental"
                />
                Outra situação ambiental
              </label>

            </div>

            <div id="bloco-obs35_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="obs35_${rip}">Observações sobre incidência ambiental:</label>
              <textarea
                id="obs35_${rip}"
                name="imoveis[${index}][obs_incidencia_ambiental]"
                placeholder="Descreva informações complementares sobre incidência ambiental..."
              ></textarea>
            </div>
          </div>

          <!-- ==================== RISCOS ==================== -->
          <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            Riscos
          </h4>

          <div class="form-group editavel">
            <label>Há riscos identificado?</label>

            <div id="group-pergunta-riscos_${rip}" class="checkbox-group" style="display:flex; flex-direction:row; gap:32px; flex-wrap:wrap; margin-bottom:10px; align-items:center;">
              <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0;"><input type="checkbox" name="imoveis[${index}][ha_riscos][]" value="Sim" /> Sim</label>
              <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0;"><input type="checkbox" name="imoveis[${index}][ha_riscos][]" value="Não" /> Não</label>
              <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0;"><input type="checkbox" name="imoveis[${index}][ha_riscos][]" value="Não há informação suficiente" /> Não há informação suficiente</label>
            </div>

            <div id="bloco-riscos-itens_${rip}" style="display:none;">
              <label style="margin-top:4px;">Riscos verificados:</label>

              <div class="checkbox-group" id="group-riscos_${rip}" class="checkbox-group">

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][riscos][]"
                  value="Risco de invasão/esbulho"
                />
                Risco de invasão/esbulho
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][riscos][]"
                  value="Risco à segurança/saúde pública"
                />
                Risco à segurança/saúde pública
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][riscos][]"
                  value="Risco estrutural ou de desabamento"
                />
                Risco estrutural ou de desabamento
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][riscos][]"
                  value="Risco de depredação, vandalismo ou deterioração"
                />
                Risco de depredação, vandalismo ou deterioração
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][riscos][]"
                  value="Outro risco identificado"
                />
                Outro risco identificado
              </label>

            </div>

            <div id="bloco-obs-riscos_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="obs-riscos_${rip}">Observações sobre riscos:</label>
              <textarea
                id="obs-riscos_${rip}"
                name="imoveis[${index}][obs_riscos]"
                placeholder="Descreva informações complementares sobre os riscos verificados..."
              ></textarea>
            </div>
          </div>
          </div>

          <!-- ==================== RESTRIÇÕES ==================== -->
          <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            Restrições
          </h4>

          <div class="form-group editavel">
            <label>Há restrições e condições limitadoras?</label>

            <div id="group-pergunta-restricoes_${rip}" class="checkbox-group" style="display:flex; flex-direction:row; gap:32px; flex-wrap:wrap; margin-bottom:10px; align-items:center;">
              <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0;"><input type="checkbox" name="imoveis[${index}][ha_restricoes][]" value="Sim" /> Sim</label>
              <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0;"><input type="checkbox" name="imoveis[${index}][ha_restricoes][]" value="Não" /> Não</label>
              <label class="checkbox-option" style="display:inline-flex; align-items:center; gap:6px; margin:0;"><input type="checkbox" name="imoveis[${index}][ha_restricoes][]" value="Não há informação suficiente" /> Não há informação suficiente</label>
              </div>

            <div id="bloco-restricoes-itens_${rip}" style="display:none;">
              <label style="margin-top:4px;">Restrições verificadas:</label>

              <div class="checkbox-group" id="group-restricoes_${rip}" class="checkbox-group">

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Faixa de fronteira" />
                Faixa de fronteira
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Faixa de segurança" />
                Faixa de segurança
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Faixa de domínio Ferrovia/Rodovia" />
                Faixa de domínio Ferrovia/Rodovia
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Faixa de 100 metros ao longo da costa marítima" />
                Faixa de 100 metros ao longo da costa marítima
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Circunferência de 1.320 metros em torno de instalações militares" />
                Circunferência de 1.320 metros em torno de instalações militares
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Terra indígena" />
                Terra indígena
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Território quilombola ou área de comunidade tradicional" />
                Território quilombola ou área de comunidade tradicional
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Zona/Área de Interesse Social (ZEIS)" />
                Zona/Área de Interesse Social — ZEIS
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Área de segurança" />
                Área de segurança
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Área Non Aedificandi" />
                Área Non Aedificandi
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Restrição de uso/ocupação incidente sobre o imóvel" />
                Restrição de uso/ocupação incidente sobre o imóvel
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Tombado como patrimônio histórico, artístico e/ou cultural" />
                Tombado como patrimônio histórico, artístico e/ou cultural
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Poligonal de Porto Organizado" />
                Poligonal de Porto Organizado
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Área operacional da RFFSA" />
                Área operacional da RFFSA
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Ilha oceânica ou costeira sem sede de município" />
                Ilha oceânica ou costeira sem sede de município
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Ilha fluvial ou lacustre" />
                Ilha fluvial ou lacustre
              </label>

              <label class="checkbox-option">
                <input type="checkbox" name="imoveis[${index}][restricoes][]" value="Localizada em loteamento" />
                Localizada em loteamento
              </label>

              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][restricoes][]"
                  value="Outra restrição identificada"
                />
                Outra restrição identificada
              </label>

              </div>
            </div>

            <div id="bloco-obs-restricoes_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 16px;">
              <label for="obs-restricoes_${rip}">Observações sobre as restrições:</label>
              <textarea
                id="obs-restricoes_${rip}"
                name="imoveis[${index}][obs_restricoes]"
                placeholder="Descreva informações complementares sobre as restrições verificadas..."
              ></textarea>
            </div>
          </div>
        </section>
      </div>

      
            <!-- ========== GEOLOCALIZAÇÃO ========== -->
            <div id="secao-geolocalizacao-${rip}">
                <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
                  Geolocalização
                </h4>
                <div class="form-group editavel">
                    <label for="cep_${rip}">Localizar por CEP:</label>
                    <div class="cep-row">
                        <input type="text" id="cep_${rip}" name="imoveis[${index}][geo_cep]" class="mask-cep" placeholder="00000-000" maxlength="9" value="${dados.geo_cep || dados.cep || ''}">
                        <button type="button" class="btn-search">🔍 Buscar</button>
                    </div>
                </div>
                <div class="form-group editavel">
                    <div class="cep-row">
                        <div style="flex: 1;">
                            <label for="latitude_${rip}" style="font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;">Latitude:</label>
                            <input type="text" id="latitude_${rip}" name="imoveis[${index}][latitude]" placeholder="-15.793889" style="width: 100%;" value="${dados.latitude || ''}">
                        </div>
                        <div style="flex: 1;">
                            <label for="longitude_${rip}" style="font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;">Longitude:</label>
                            <input type="text" id="longitude_${rip}" name="imoveis[${index}][longitude]" placeholder="-47.882778" style="width: 100%;" value="${dados.longitude || ''}">
                        </div>
                    </div>
                </div>
            </div>

    `;

    container.appendChild(div);

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

    // Busca geográfica por CEP: usa o CEP já carregado para abrir o modal e executar a busca
    (function() {
        var inputCepGeo = div.querySelector('#cep_' + rip);
        var btnBuscarGeo = div.querySelector('.btn-search');
        if (!inputCepGeo || !btnBuscarGeo) return;

        btnBuscarGeo.addEventListener('click', function() {
            var geoModal = document.getElementById('geoModal');
            if (geoModal) {
                geoModal.style.display = 'flex';
            }
            if (typeof window.inicializarMapa === 'function') {
                window.inicializarMapa();
            }

            var modalSearchInput = document.getElementById('modal-search-input');
            if (modalSearchInput) {
                modalSearchInput.value = inputCepGeo.value || '';
                if (modalSearchInput.value && typeof window.buscarNoModal === 'function') {
                    window.buscarNoModal();
                }
            }
        });
    })();

    // ---- Situação Ocupacional: show/hide condicional ----
    (function() {
        var radioName = 'imoveis[' + index + '][situacao_ocupacional]';
        function atualizarOcupacao() {
            var blocoDesocupado = document.getElementById('bloco-desocupado_' + rip);
            var blocoOcupado = document.getElementById('bloco-ocupado_' + rip);
            var blocoUsoAtual = document.getElementById('bloco-uso-atual_' + rip);
            if (!blocoDesocupado) return;
            var checked = div.querySelector('[name="' + radioName + '"]:checked');
            var val = checked ? checked.value : '';
            blocoDesocupado.style.display = (val === 'Desocupado') ? 'flex' : 'none';
            blocoOcupado.style.display = (val === 'Ocupado regularmente' || val === 'Ocupado irregularmente') ? 'flex' : 'none';
            if (blocoUsoAtual) blocoUsoAtual.style.display = (val === 'Ocupado regularmente' || val === 'Ocupado irregularmente') ? 'flex' : 'none';
        }
        div.querySelectorAll('[name="' + radioName + '"]').forEach(function(radio) {
            radio.addEventListener('change', atualizarOcupacao);
        });
        setTimeout(atualizarOcupacao, 0);
    })();

    // ---- Incidência Ambiental: cada opção (exceto "Nenhuma...") abre seu campo de observação ----
    (function() {
        var group = div.querySelector('#group-incidencia_' + rip);
        if (!group) return;

        var blocoObs = div.querySelector('#bloco-obs35_' + rip);
        var checkboxes = group.querySelectorAll('input[type="checkbox"]');
        var cbNenhuma = group.querySelector('input[value="Nenhuma incidência identificada"]');

        function atualizarIncidenciaAmbiental(changed) {
            var mudouNenhuma = changed && changed.value === 'Nenhuma incidência identificada';

            if (mudouNenhuma && changed.checked) {
                checkboxes.forEach(function(cb) {
                    if (cb !== changed) cb.checked = false;
                });
            }

            if (!mudouNenhuma) {
                var algumaNaoNenhumaMarcada = false;
                checkboxes.forEach(function(cb) {
                    if (cb.value !== 'Nenhuma incidência identificada' && cb.checked) {
                        algumaNaoNenhumaMarcada = true;
                    }
                });
                if (algumaNaoNenhumaMarcada && cbNenhuma) cbNenhuma.checked = false;
            }

            var mostrarContainerObs = false;
            checkboxes.forEach(function(cb) {
                if (cb.checked) mostrarContainerObs = true;
            });

            if (blocoObs) {
                blocoObs.style.display = mostrarContainerObs ? 'flex' : 'none';
            }
        }

        checkboxes.forEach(function(cb) {
            cb.addEventListener('change', function() {
                atualizarIncidenciaAmbiental(cb);
            });
        });

        setTimeout(function() { atualizarIncidenciaAmbiental(null); }, 0);
    })();

    // ---- Riscos/Restrições: pergunta de triagem (Sim/Não/Não há informação) ----
    (function() {
        function initPerguntaComMulticheck(config) {
            var grupoPergunta = div.querySelector(config.perguntaSelector);
            var grupoItens = div.querySelector(config.itensSelector);
            var blocoObs = div.querySelector(config.obsSelector);
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
        }

        initPerguntaComMulticheck({
            perguntaSelector: '#group-pergunta-riscos_' + rip,
            itensSelector: '#bloco-riscos-itens_' + rip,
            obsSelector: '#bloco-obs-riscos_' + rip
        });

        initPerguntaComMulticheck({
            perguntaSelector: '#group-pergunta-restricoes_' + rip,
            itensSelector: '#bloco-restricoes-itens_' + rip,
            obsSelector: '#bloco-obs-restricoes_' + rip
        });
    })();

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

    fill('valor_avaliacao', dados.valor_avaliado || dados.valor_avaliacao);
    fill('data_avaliacao', dados.data_avaliacao);
    fill('instrumento_avaliacao', dados.instrumento_avaliacao);
    
    // Situação ocupacional é tratada dinamicamente por RIP em criarBlocoImovel

    // Riscos e restricoes (array or string)
    let riscos = dados.riscos_verificados || dados.riscos;
    if (Array.isArray(riscos)) riscos = riscos.join(', ');
    fill('riscos_verificados', riscos);
    fill('obs_riscos', dados.obs_riscos);
    
    let restricoes = dados.restricoes_verificadas || dados.restricoes;
    if (Array.isArray(restricoes)) restricoes = restricoes.join(', ');
    fill('restricoes_verificadas', restricoes);
    fill('obs_restricoes', dados.obs_restricoes);

    // Incidência ambiental checkboxes
    let incidencias = dados.incidencia_ambiental;
    if (incidencias) {
        if (!Array.isArray(incidencias)) {
            incidencias = String(incidencias).split(',').map(s => s.trim());
        }
        document.querySelectorAll('input[name="incidencia_ambiental[]"]').forEach(cb => {
            cb.checked = incidencias.includes(cb.value);
        });
    }
    if (typeof window.verificarVisibilidadeIncidencia === 'function') {
        window.verificarVisibilidadeIncidencia();
    }
    fill('obs_incidencia_ambiental', dados.obs_incidencia_ambiental || dados.observacoes_incidencia);

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
        'valor_avaliado':             'valor_avaliado',
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
            campo.classList.remove('custom-empty-select');

            // Adiciona ícone de cadeado no label
            const formGroup = campo.closest('.form-group');
            if (formGroup) {
                const label = formGroup.querySelector('label');
                if (label && !label.querySelector('.lock-icon')) {
                    const lockSpan = document.createElement('span');
                    lockSpan.className = 'lock-icon';
                    lockSpan.title = 'Dado importado do Datalake SPUnet (somente leitura)';
                    lockSpan.style.marginLeft = '6px';
                    lockSpan.style.fontSize = '0.85em';
                    lockSpan.style.color = '#64748b';
                    lockSpan.innerHTML = '🔒';
                    label.appendChild(lockSpan);
                }
            }

            // Dispara change para acionar lógicas condicionais
            campo.dispatchEvent(new Event('change', { bubbles: true }));

        } else {
            // ===== CAMPO SEM DADOS: deixar ABERTO para edição =====
            camposAbertos++;

            if (campo.tagName === 'SELECT') {
                campo.disabled = false;
                campo.classList.add('custom-empty-select');
            } else {
                campo.readOnly = false;
                campo.disabled = false;
            }
            campo.style.backgroundColor = '';
            campo.style.border = '';
            campo.style.color = '';
            campo.style.cursor = '';
            campo.classList.remove('auto-loaded-field');

            // Remove ícone de cadeado quando o campo vier vazio do banco
            const formGroup = campo.closest('.form-group');
            if (formGroup) {
                const label = formGroup.querySelector('label');
                const lock = label ? label.querySelector('.lock-icon') : null;
                if (lock) lock.remove();
            }
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
