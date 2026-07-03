// ============================== Documentos Dinâmicos ==============================
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
        <button type="button" onclick="this.parentElement.remove(); window.atualizarRipsOcultos(); document.querySelector('.imovel-block[data-rip='${rip}']')?.remove();" style="background: none; border: none; color: #d32f2f; font-weight: bold; cursor: pointer; font-size: 1.1em;" title="Remover RIP">&times;</button>
    `;
    if (lista) lista.appendChild(div);
};

window.criarBlocoImovel = function(rip, dados) {
    dados = dados || {};
    const container = document.getElementById('imoveis-container');
    if (!container) return;

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
        let valStr = value || '';
        let iconHtml = ``;
        let placeholderAttr = '';
        if (name === 'numero_processo') placeholderAttr = 'placeholder="1234.56790/2026-00"';
        else if (name === 'matricula') placeholderAttr = 'placeholder="123.456 - 1ª CRI SP"';
        else if (name === 'cartorio') placeholderAttr = 'placeholder="Ex: 1º CRI SP"';
        return `
            <div class="form-group editavel" style="margin-bottom: 15px;">
                <label style="display:block; margin-bottom: 5px; font-weight: 600;">${label} ${iconHtml}</label>
                <input type="text" name="imoveis[${index}][${name}]" data-field-key="${name}" value="${valStr}" ${placeholderAttr} readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
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
              <button type="button" id="icone-edicao-id-${rip}" onclick="habilitarEdicaoSecao('secao-identificacao-${rip}', 'icone-edicao-id-${rip}')" title="Habilitar edição desta seção" style="background-color: #22c55e; border: 1px solid #16a34a; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 12px; font-weight: bold; color: #ffffff; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#16a34a'" onmouseout="this.style.backgroundColor='#22c55e'">Abre Edição</button>
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
            ${buildField('Valor avaliado (R$)', 'valor_avaliado', dados.valor_avaliado || dados.valor_imovel)}
            ${buildField('Data da avaliação', 'data_avaliacao', dados.data_avaliacao)}
            ${buildField('Instrumento de avaliação', 'instrumento_avaliacao', dados.instrumento_avaliacao)}
            ${buildField('LPM/1831 ou LMEO homologadas?', 'lpm_homologada', dados.lpm_homologada)}
            ${buildField('Processo de incorp.?', 'processo_incorporacao', dados.processo_incorporacao)}
            <div class="bloco-condicional" data-controlled-by="processo_incorporacao" data-show-when="Sim" style="display:none; padding-left:16px; border-left:3px solid #94a3b8; margin-top:4px;">
                ${buildField('Número do Processo', 'numero_processo', dados.numero_processo)}
                ${buildField('Cartório', 'cartorio', dados.cartorio)}
                ${buildField('Matrícula', 'matricula', dados.matricula)}
            </div>
            
            <!-- Bloco Justificativa da Identificação -->
            <div id="blocoJustificativa_secao-identificacao-${rip}" class="bloco-justificativa-secao" style="display: none; margin-top: 15px; padding: 15px; border: 1px solid #fdba74; border-radius: 6px; background: #fff7ed;">
                <h4 style="margin-top: 0; color: #c2410c; font-size: 1.05em; border-bottom: 1px solid #fed7aa; padding-bottom: 6px;">Justificativa para Identificação do Imóvel</h4>
                <div style="margin-bottom: 10px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 3px; font-size: 0.9em; color: #9a3412;">Justificativa (Obrigatório) *</label>
                    <textarea name="justificativa_secao-identificacao-${rip}" id="justificativa_secao-identificacao-${rip}" rows="3" placeholder="Por que você está corrigindo os dados de identificação do imóvel?" style="width: 100%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; font-size: 0.9em; background: #ffffff; color: #1e293b; resize: vertical;"></textarea>
                </div>
                <div>
                    <label style="font-weight: bold; display: block; margin-bottom: 3px; font-size: 0.9em; color: #9a3412;">Fundamentação Legal (Opcional)</label>
                    <textarea name="fundamentacao_secao-identificacao-${rip}" id="fundamentacao_secao-identificacao-${rip}" rows="2" placeholder="Ex: Decreto 9.760/46, art. ..." style="width: 100%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; font-size: 0.9em; background: #ffffff; color: #1e293b; resize: vertical;"></textarea>
                </div>
            </div>
            </div><!-- /secao-identificacao -->
        </div>
    `;

    container.appendChild(div);

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
    
    const ocup = dados.situacao_ocupacional || dados.ocupacao || '';
    fill('situacao_ocupacional', ocup);
    
    // Atualiza visibilidade dos blocos de ocupação
    const valOcup = ocup.toLowerCase();
    const blocoDesocupado = document.getElementById('bloco-desocupado');
    const blocoRegular = document.getElementById('bloco-ocupado-regular');
    const blocoIrregular = document.getElementById('bloco-ocupado-irregular');
    const blocoObsOcup = document.getElementById('bloco-observacoes-ocupacao');

    if (blocoDesocupado) blocoDesocupado.style.display = (valOcup === 'desocupado') ? 'flex' : 'none';
    if (blocoRegular) blocoRegular.style.display = (valOcup === 'ocupado regularmente') ? 'flex' : 'none';
    if (blocoIrregular) blocoIrregular.style.display = (valOcup === 'ocupado irregularmente') ? 'flex' : 'none';
    if (blocoObsOcup) {
        blocoObsOcup.style.display = (valOcup === 'desocupado' || valOcup === 'ocupado regularmente' || valOcup === 'ocupado irregularmente') ? 'flex' : 'none';
    }
    
    fill('tempo_desocupacao', dados.tempo_desocupacao);
    fill('data_ocupacao', dados.data_ocupacao);
    fill('data_ocupacao_irregular', dados.data_ocupacao_irregular || dados.data_ocupacao);
    fill('obs_ocupado', dados.obs_ocupado);
    
    fill('condicao_urbanizacao', dados.condicao_urbanizacao);
    fill('tipo_imovel_global', dados.tipo_imovel);
    
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
                            ii.removeAttribute('readonly');
                            ii.removeAttribute('disabled');
                            ii.style.backgroundColor = '#ffffff';
                            ii.style.color = '#1e293b';
                            ii.style.border = '1px solid #94a3b8';
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

// ==================== Habilitar Edição por Seção ====================
window.habilitarEdicaoSecao = function(secaoId, btnId) {
    modoEdicaoAtivo = true;
    const secao = document.getElementById(secaoId);
    if (!secao) return;

    const btn = document.getElementById(btnId);
    let isEditing = false;
    
    if (btn) {
        if (btn.dataset.editando === 'true') {
            isEditing = true;
        }
        
        if (isEditing) {
            // FECHAR EDICAO
            btn.dataset.editando = 'false';
            btn.textContent = 'Abre Edição'; // Lápis
            btn.style.backgroundColor = '#22c55e'; btn.style.color = '#ffffff'; btn.style.borderColor = '#16a34a'; btn.onmouseout = function(){this.style.backgroundColor='#22c55e'}; btn.onmouseover = function(){this.style.backgroundColor='#16a34a'};
            btn.title = 'Habilitar edição desta seção';
        } else {
            // ABRIR EDICAO
            btn.dataset.editando = 'true';
            btn.textContent = 'Fecha Edição'; // Check
            btn.style.backgroundColor = '#ef4444'; btn.style.color = '#ffffff'; btn.style.borderColor = '#dc2626'; btn.onmouseout = function(){this.style.backgroundColor='#ef4444'}; btn.onmouseover = function(){this.style.backgroundColor='#dc2626'};
            btn.title = 'Concluir edição desta seção';
        }
    }

    const inputs = secao.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'button' || input.type === 'submit' || input.type === 'hidden') return;

        if (isEditing) {
            // VOLTAR PARA MODO LEITURA
            if (input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'radio') {
                input.setAttribute('disabled', 'true');
            } else {
                input.setAttribute('readonly', 'true');
            }
            input.classList.add('auto-loaded-field');
            
            input.style.backgroundColor = '#f8f9fa';
            input.style.color = '#495057';
            input.style.border = '1px solid #ccc';
            input.style.cursor = 'default';
        } else {
            // HABILITAR EDICAO
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.classList.remove('auto-loaded-field');

            input.style.cssText = input.style.cssText
                .replace(/background-color\s*:\s*[^;]+;?/gi, '')
                .replace(/background\s*:\s*[^;]+;?/gi, '')
                .replace(/color\s*:\s*[^;]+;?/gi, '');

            input.style.backgroundColor = '#ffffff';
            input.style.color = '#1e293b';
            input.style.border = '1px solid #94a3b8';
            input.style.cursor = 'text';

            input.addEventListener('input', verificarMudancaInline);
            input.addEventListener('change', verificarMudancaInline);
        }
    });

    if (!isEditing) {
        transformarCamposComOpcoes(secao);
    }
};

// ==================== Fim Habilitar Edição por Seção ====================


window.originalRipData = {};
let modoEdicaoAtivo = false;


function atualizarVisibilidadeJustificativaSecao(secaoElement) {
    if (!secaoElement) return;
    const temCamposAlterados = secaoElement.querySelectorAll('.campo-alterado').length > 0;
    const blocoJust = secaoElement.querySelector('.bloco-justificativa-secao');
    if (blocoJust) {
        blocoJust.style.display = temCamposAlterados ? 'block' : 'none';
        if (!temCamposAlterados) {
            blocoJust.querySelectorAll('textarea').forEach(t => t.value = '');
        }
    }
}

function verificarMudancaInline(e) {
    const el = e.target;
    const key = el.id || el.name;
    if (!key) return;
    
    // Qual era o valor original?
    const valorOriginal = window.originalRipData[key] || '';
    
    let valorAtual = '';
    if (el.type === 'checkbox' || el.type === 'radio') {
        valorAtual = el.checked ? (el.value || 'on') : '';
    } else {
        valorAtual = el.value || '';
    }
    
    const alterado = (String(valorAtual).trim() !== String(valorOriginal).trim());
    
    let hintEl = el.parentNode.querySelector('.valor-original-hint');
    
    if (alterado) {
        el.classList.add('campo-alterado');
        if (!hintEl) {
            hintEl = document.createElement('span');
            hintEl.className = 'valor-original-hint';
            el.parentNode.insertBefore(hintEl, el.nextSibling);
        }
        hintEl.textContent = valorOriginal ? `Original: ${valorOriginal}` : 'Original: (vazio)';
    } else {
        el.classList.remove('campo-alterado');
        if (hintEl) {
            hintEl.remove();
        }
    }

    // Atualiza visibilidade do bloco de justificativa da seção pai
    const secaoPai = el.closest('[id^="secao-"]');
    if (secaoPai) {
        atualizarVisibilidadeJustificativaSecao(secaoPai);
    }
}

// Intercepta a pesquisa para salvar o estado original
const pesquisarRipOriginal = window.pesquisarRip;
window.pesquisarRip = function() {
    const inputRip = document.getElementById('rip-search-input');
    const rip = inputRip ? inputRip.value.trim() : '';
    const ripData = window.ripsPesquisados ? window.ripsPesquisados[rip] : null;
    
    if (ripData) {
        // Mostra o botão de habilitar edição
        const containerBtn = document.getElementById('container-btn-edicao');
        if(containerBtn) containerBtn.style.display = 'block';
    }
    
    // Executa a busca normal
    if (typeof pesquisarRipOriginal === 'function') {
        pesquisarRipOriginal();
    }
    
    // Captura o estado dos campos LOGO APÓS o preenchimento pelo motor do FOCO
    setTimeout(() => {
        const inputs = document.querySelectorAll('#accordionIdentificacao input, #accordionIdentificacao select, #global-sections-container input, #global-sections-container select');
        inputs.forEach(input => {
            const key = input.id || input.name;
            if (key) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    window.originalRipData[key] = input.checked ? (input.value || 'on') : '';
                } else {
                    window.originalRipData[key] = input.value || '';
                }
            }
        });
    }, 500);
};

// ==================== Fim Modo de Edição ====================

// ==================== Salvar e Avançar ====================
document.addEventListener('DOMContentLoaded', function() {
    const form02 = document.getElementById('form02');
    if (form02) {
        form02.addEventListener('submit', function(e) {
            e.preventDefault();
            // Coleta divergências (diff)
            const divergencias = [];
            if (modoEdicaoAtivo) {
                const inputs = document.querySelectorAll('#accordionIdentificacao input, #accordionIdentificacao select, #global-sections-container input, #global-sections-container select');
                inputs.forEach(input => {
                    const key = input.id || input.name;
                    if (key && input.type !== 'button' && input.type !== 'submit') {
                        const original = String(window.originalRipData[key] || '').trim();
                        let atual = '';
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            atual = input.checked ? (input.value || 'on') : '';
                        } else {
                            atual = String(input.value || '').trim();
                        }
                        
                        if (original !== atual) {
                            divergencias.push({
                                campo: key,
                                valor_original: original === '' ? null : original,
                                valor_sugerido: atual,
                                status: original === '' ? 'preenchido' : 'alterado'
                            });
                        }
                    }
                });
            }
            
                        // Valida se as justificativas das seções alteradas estão preenchidas
            let justificativasValidas = true;
            const secoes = document.querySelectorAll('[id^="secao-"]');
            const justificativasSecao = {};

            secoes.forEach(sec => {
                const alterados = sec.querySelectorAll('.campo-alterado');
                if (alterados.length > 0) {
                    const blocoJust = sec.querySelector('.bloco-justificativa-secao');
                    if (blocoJust) {
                        const justTextarea = blocoJust.querySelector('textarea[name^="justificativa_"]');
                        const justText = justTextarea ? justTextarea.value.trim() : '';
                        const fundText = blocoJust.querySelector('textarea[name^="fundamentacao_"]')?.value.trim() || '';
                        
                        if (!justText) {
                            justificativasValidas = false;
                        }
                        
                        // Vincula o ID legível da seção no objeto de retorno
                        justificativasSecao[sec.id] = {
                            justificativa: justText,
                            fundamentacao: fundText
                        };
                    }
                }
            });

            if (divergencias.length > 0 && !justificativasValidas) {
                alert('⚠️ Você realizou alterações em dados do cadastro. É obrigatório preencher a "Justificativa" de cada seção alterada antes de salvar.');
                return; // Bloqueia o avanço
            }
            
            // Aqui enviaria 'divergencias' via postMessage para o sync.js salvar no foco_drafts
            console.log("Divergências detectadas:", divergencias);
            if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({
                    type: 'DIVERGENCIAS_CADASTRO',
                    aba: 'foco-02',
                    data: divergencias,
                    justificativas: justificativasSecao
                }, '*');
            }
            
            // Simula salvamento
            console.log("Formulário Foco-02 salvo.");
            
            // Avança para a aba 3
            const rootWindow = window.parent?.parent || window.parent || window;
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-03.html"]');
            
            if (btnTabNext) {
                alert("Salvo com sucesso! (Avançando para Aba 3)");
                setTimeout(() => btnTabNext.click(), 200);
            } else {
                alert("Salvo com sucesso! (Não foi possível encontrar o botão da Aba 3)");
            }
        });
    }
});


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

// Listener para monitorar a seleção de incidências ambientais
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="incidencia_ambiental[]"]').forEach(cb => {
        cb.addEventListener('change', window.verificarVisibilidadeIncidencia);
    });
});
