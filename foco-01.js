// foco-01.js
// Exclusivo da Seção 1: Dados do Requerimento (foco-01.html)
// Depende de: formulario.js (mascaraCPFCNPJ, mascaraSEI)

window.ripsPesquisados = window.ripsPesquisados || {};
window.imovelCount = window.imovelCount || 0;

document.addEventListener('DOMContentLoaded', function () {
    const form01 = document.getElementById('form01');
    if (!form01) return;

    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
    // 1. MODAL DE SIMULAé!éO (Prioridade para interatividade)
    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
    const modalSim = document.getElementById('modalSimulacao');
    const btnFecharSim = document.getElementById('btnFecharSimulacao');
    
    // Seleciona todos os botões que devem abrir o popup
    const btnsAbrir = document.querySelectorAll('.btn-simular-doc');

    btnsAbrir.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (modalSim) {
                modalSim.style.display = 'flex';
            }
        });
    });

    if (btnFecharSim) {
        btnFecharSim.addEventListener('click', function() {
            if (modalSim) modalSim.style.display = 'none';
        });
    }

    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
    // 2. MéSCARAS E INICIALIZAé!éO
    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é

    if (typeof mascaraCPFCNPJ === 'function') mascaraCPFCNPJ(document.getElementById('campo14'));
    if (typeof mascaraSEI === 'function') mascaraSEI(document.getElementById('campo13'));

    // Méscara de telefone celular
    const inputTel = document.getElementById('campo19');
    if (inputTel) {
        inputTel.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').slice(0, 11);
            if (v.length <= 10) {
                v = v.replace(/(\d{2})(\d)/,       '($1) $2');
                v = v.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
            } else {
                v = v.replace(/(\d{2})(\d)/,       '($1) $2');
                v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
            }
            this.value = v;
        });
    }

    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
    // 3. VALIDAééO E SUBMIT
    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

    form01.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form01.checkValidity()) {
            const rootWindow = window.parent?.parent || window.parent || window;
            const seletorPerfil = document.getElementById('perfilSeletor') || rootWindow.document?.getElementById('perfilSeletor');
            
            // Atualização de status e status_flow será feita pelo sync.js no momento do sweep
            alert('= Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...');
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-02.html"]');
            if (btnTabNext) {
                setTimeout(() => btnTabNext.click(), 100);
            }
        } else {
            form01.reportValidity();
        }
    });

    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
    // 4. BOTéO LIMPAR
    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Deseja limpar todos os campos?')) {
                form01.reset();
                document.querySelectorAll('#form01 .error-msg').forEach(e => e.style.display = 'none');
                document.querySelectorAll('#form01 input').forEach(el => el.style.borderColor = '');
                // Limpa também as seéées condicionais
                if (typeof verificarConceituacao === 'function') verificarConceituacao();
                document.getElementById('imoveis-container').innerHTML = '';
                document.getElementById('listaRIPsAssociados').innerHTML = '';
                document.getElementById('listaRIPsAssociados').style.display = 'none';
                window.ripsPesquisados = {};
                window.imovelCount = 0;
            }
        });
    }

    // Validaééo de submit para RIP foi removida, pois RIPs associados séo autométicos.

    // ==========================================
    // AUTO-RESTORE RIPs (Inteligéncia para RIPs importados)
    // ==========================================
    function loadRipsEConceituacao(dbState) {
        if (!dbState) return;
        
        let ripsArray = [];
        
        // Verifica a regra de negécio para saber se RIP é obrigatério
        let isRipObrigatorio = true;
        if (dbState['conceituacao[]']) {
            const concs = Array.isArray(dbState['conceituacao[]']) ? dbState['conceituacao[]'] : [dbState['conceituacao[]']];
            if (concs.length > 0 && concs.every(c => c === 'praia_mar' || c === 'praia_rio' || c === 'manguezal')) {
                isRipObrigatorio = false;
            }
        }
        
        // 1. Tenta recuperar da lista oculta (novo formato)
        if ('lista_rips' in dbState) {
            const lr = dbState.lista_rips;
            if (lr && lr.trim() !== '') {
                ripsArray = lr.split(',').map(r => r.trim()).filter(r => r);
            } else {
                // Se a lista estiver vazia, sé respeita se a regra de negécio permitir (ex: Praia/Mangue).
                // Caso contrério (RIP obrigatério), significa que o banco foi salvo vazio por engano (bug anterior)
                // e devemos ignorar a lista vazia para foréar o fallback para os dados mock/legado.
                if (!isRipObrigatorio) {
                    ripsArray = [];
                } else {
                    // Foréa fallback
                    if (dbState._ripsPesquisados) {
                        ripsArray = Object.keys(dbState._ripsPesquisados);
                    } else {
                        Object.keys(dbState).forEach(key => {
                            if (key.match(/^imoveis\[\d+\]\[rip\]$/)) {
                                const ripVal = dbState[key];
                                if (ripVal && !ripsArray.includes(ripVal)) {
                                    ripsArray.push(ripVal);
                                }
                            }
                        });
                    }
                }
            }
        } else if (dbState._ripsPesquisados) {
            // 2. APENAS SE FOR LEGADO COM DADOS DE MOCK: Usa a chave _ripsPesquisados
            ripsArray = Object.keys(dbState._ripsPesquisados);
        } else {
            // 3. éaLTIMO RECURSO: Tenta recuperar varrendo as chaves do banco buscando por imoveis[x][rip]
            Object.keys(dbState).forEach(key => {
                if (key.match(/^imoveis\[\d+\]\[rip\]$/)) {
                    const ripVal = dbState[key];
                    if (ripVal && !ripsArray.includes(ripVal)) {
                        ripsArray.push(ripVal);
                    }
                }
            });
        }
        
        // Agora renderiza
        if (ripsArray.length > 0) {
            ripsArray.forEach(rip => {
                
                // Reconstréi os dados do imével a partir da tabela intermediária (dbState)
                let dadosMock = { rip: rip };
                let ripIndex = null;
                
                // Acha qual éndice [X] esse RIP usava no form
                Object.keys(dbState).forEach(k => {
                    const match = k.match(/^imoveis\[(\d+)\]\[rip\]$/);
                    if (match && dbState[k] === rip) {
                        ripIndex = match[1];
                    }
                });

                // Se achou o éndice, recupera todos os campos deste RIP
                if (ripIndex !== null) {
                    Object.keys(dbState).forEach(k => {
                        const regex = new RegExp(`^imoveis\\[${ripIndex}\\]\\[(.*?)\\]$`);
                        const match = k.match(regex);
                        if (match) {
                            dadosMock[match[1]] = dbState[k];
                        }
                    });
                } else {
                    // Fallback para quando o bloco foi gerado mas não tem éndice salvo ainda
                    dadosMock = window.ripsPesquisados[rip] || { rip: rip };
                }

                window.ripsPesquisados[rip] = dadosMock;
                window.adicionarTagRIP(rip, dadosMock);
                window.criarBlocoImóvel(rip, dadosMock);
                
                // Collapse immediately
                const bloco = document.querySelector('.imovel-block[data-rip="'+rip+'"]');
                if (bloco) {
                    const content = bloco.querySelector('.accordion-content');
                    const icon    = bloco.querySelector('.accordion-icon');
                    if (content) {
                        content.classList.remove('open');
                        content.style.display = 'none';
                    }
                    if (icon) {
                        icon.textContent = 'é';
                        icon.classList.remove('open');
                    }
                }
            });
        }

        // Bloqueia campos do Cadastro Mínimo se jé vieram preenchidos da base
        const minFields = ['cep_sem_rip', 'logradouro_sem_rip', 'bairro_sem_rip', 'municipio_sem_rip', 'uf_sem_rip', 'numero_sem_rip', 'complemento_sem_rip', 'area_sem_rip', 'obs_geral_01'];
        minFields.forEach(id => {
            if (dbState[id] && dbState[id] !== '') {
                const el = document.getElementById(id);
                if (el) {
                    elÁreadOnly = true;
                    el.classList.add('auto-loaded-field');
                }
            }
        });
        
        if (typeof window.atualizarRipsOcultos === 'function') {
            window.atualizarRipsOcultos();
        }
        
        // Garante que a visibilidade das seéées (RIP e Área sem RIP) seja atualizada
        // com base nos checkboxes restaurados pelo motor de sync.
        if (typeof window.verificarConceituacao === 'function') {
            window.verificarConceituacao();
        }
    }

    // Tenta rodar logo apés 400ms se o banco foi répido, ou aguarda o Trigger Oficial
    setTimeout(() => {
        if (window.parent && window.parent.formDataState && Object.keys(window.parent.formDataState).length > 0) {
            loadRipsEConceituacao(window.parent.formDataState);
        }
    }, 400);

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'DATABASE_LOADED') {
            loadRipsEConceituacao(event.data.data);
        }
    });

});

// ================================================================
// LéGICA DE CONCEITUAééO E RIP
// ================================================================
window.verificarConceituacao = function() {
    const checks = document.querySelectorAll('input[name="conceituacao[]"]:checked');
    let exigeRIP = false;
    let dispensaRIP = false;

    checks.forEach(c => {
        const val = c.value;
        if (['terreno_marinha', 'terreno_nacional_interior', 'imovel_dominio_uniao', 'gleba_assentamento', 'ilha_oceanica', 'ilha_fluvial'].includes(val)) {
            exigeRIP = true;
        }
        if (['espelho_dagua', 'cavidades_naturais', 'manguezal', 'praia_mar', 'praia_rio'].includes(val)) {
            dispensaRIP = true;
        }
    });

    const secaoRip = document.getElementById('secaoPesquisaRip');
    const secaoMinimo = document.getElementById('secaoCadastroMinimo');

    if (exigeRIP) {
        secaoRip.style.display = 'block';
    } else {
        secaoRip.style.display = 'none';
    }

    if (dispensaRIP) {
        secaoMinimo.style.display = 'block';
    } else {
        secaoMinimo.style.display = 'none';
    }
};

window.pesquisarRip = async function() {
    const input = document.getElementById('rip_pesquisa');
    const rip = input.value.trim();
    
    if (!rip || rip.length < 7) {
        alert('Por favor, informe um RIP vélido (ménimo 7 dégitos).');
        return;
    }
    
    if (window.ripsPesquisados && window.ripsPesquisados[rip]) {
        alert('Este RIP jé foi adicionado ao requerimento.');
        input.value = '';
        return;
    }

    try {
        const btn = input.nextElementSibling || document.querySelector('button[onclick="pesquisarRip()"]');
        if (btn) {
            btn.textContent = 'Buscando...';
            btn.disabled = true;
        }

        const url = window.parent.SUPABASE_URL + '/rest/v1/datalake_spunet?select=*&rip=eq.' + rip;
        const res = await fetch(url, {
            headers: {
                'apikey': window.parent.SUPABASE_ANON_KEY,
                'Authorization': 'Bearer ' + window.parent.SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (btn) {
            btn.textContent = '= Buscar e Adicionar';
            btn.disabled = false;
        }

        const data = await res.json();
        
        if (data && data.length > 0) {
            const dados = data[0].dados_imovel;
            window.ripsPesquisados[rip] = dados;
            window.adicionarTagRIP(rip, dados);
            window.criarBlocoImóvel(rip, dados);
            window.atualizarRipsOcultos();
            input.value = '';
        } else {
            alert('RIP ' + rip + ' não encontrado na base de dados (Datalake SPUnet).');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao buscar RIP.');
        const btn = input.nextElementSibling || document.querySelector('button[onclick="pesquisarRip()"]');
        if (btn) {
            btn.textContent = '= Buscar e Adicionar';
            btn.disabled = false;
        }
    }
};

// ================================================================



// ================================================================
// FUNééES RECUPERADAS PARA RENDERIZAééO DE RIPs READ-ONLY
// ================================================================

window.atualizarRipsOcultos = function() {
    const hidden = document.getElementById('hidden_lista_rips');
    const campoRipReq = document.getElementById('campo_rip_req');
    
    if (window.ripsPesquisados) {
        const rips = Object.keys(window.ripsPesquisados);
        if (hidden) {
            hidden.value = rips.join(', ');
        }
        if (campoRipReq) {
            campoRipReq.value = rips.length > 0 ? rips.join(', ') : 'Nenhum RIP associado';
        }
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
        <button type="button" class="btn-remove-rip" style="background: none; border: none; color: #c62828; cursor: pointer; font-weight: bold; font-size: 1.2em;" onclick="removerRIP('${rip}')" title="Remover RIP">=é</button>
    `;
    if (lista) lista.appendChild(div);
};

window.removerRIP = function(rip) {
    if (confirm('Tem certeza que deseja remover este RIP do requerimento? (Esta aééo afetaré as próximas abas)')) {
        const tag = document.querySelector('.rip-tag[data-rip="' + rip + '"]');
        if (tag) tag.remove();
        
        const bloco = document.querySelector('.imovel-block[data-rip="' + rip + '"]');
        if (bloco) bloco.remove();
        
        if (window.ripsPesquisados && window.ripsPesquisados[rip]) {
            delete window.ripsPesquisados[rip];
        }
        
        atualizarRipsOcultos();
        
        if (window.parent && window.parent.syncToDefinitive) {
            console.log('Notificando Supabase sobre a excluséo do RIP: ', rip);
        }
    }
};

window.toggleAccordion = function(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if(icon) icon.textContent = 'é';
    } else {
        content.style.display = 'none';
        if(icon) icon.textContent = 'é';
    }
};

window.criarBlocoImóvel = function(rip, dados) {
    const container = document.getElementById('imoveis-container');
    if (!container) return;
    
    if (container.querySelector('.imovel-block[data-rip="' + rip + '"]')) return;

    window.imovelCount = (window.imovelCount || 0) + 1;
    const index = window.imovelCount;

    const div = document.createElement('div');
    div.className = 'imovel-block';
    div.setAttribute('data-rip', rip);
    div.setAttribute('data-index', index);
    div.style.border = '1px solid #cbd5e1';
    div.style.borderRadius = '8px';
    div.style.marginTop = '15px';
    div.style.backgroundColor = '#fff';

    const renderField = (label, name, value) => {
        // Se não tem valor, ou se a chave foi preenchida manualmente antes (identificada pela flag)
        const isManual = dados && dados['flags_manuais][' + name + ']'] === 'true';
        const isEmpty = (!value || String(value).trim() === '') || isManual;
        
        if (isEmpty) {
            // DADO FALTANTE: Editével pelo usuério + hidden flag
            return `
                <div class="form-group inline" style="margin-bottom: 8px;">
                    <label>${label}</label>
                    <div style="display:flex; align-items:center; flex:1;">
                        <input type="text" name="imoveis[${index}][${name}]" value="${value || ''}" 
                            style="width:100%; background-color:#fff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px;">
                        <input type="hidden" name="imoveis[${index}][flags_manuais][${name}]" value="true">
                        <span title="Se vocé tiver acesso a esse dado, pode preenché-lo" 
                            style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">é</span>
                    </div>
                </div>
            `;
        } else {
            // DADO PRESENTE: Somente leitura (readonly)
            return `
                <div class="form-group inline" style="margin-bottom: 8px;">
                    <label>${label}</label>
                    <div style="display:flex; align-items:center; flex:1;">
                        <input type="text" name="imoveis[${index}][${name}]" value="${value}" 
                            readonly class="auto-loaded-field" style="width:100%;">
                    </div>
                </div>
            `;
        }
    };

    div.innerHTML = `
        <div class="accordion-header" style="background-color: #f1f5f9; padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; color: #0f172a;">Imóvel Selecionado: RIP ${rip}</h4>
            <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold; color: #64748b;">é</span>
        </div>
        <div class="accordion-content" style="display: none; padding: 16px;">
            <input type="hidden" name="imoveis[${index}][rip]" value="${rip}">
            
            <h4 style="margin: 0 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Identificação do Imóvel</h4>
            
            ${renderField('RIP:', 'rip_display', rip)}
            ${renderField('Conceituação do Imóvel:', 'conceituacao', dados.conceituacao || dados.descricao)}
            ${renderField('Natureza do Imóvel:', 'natureza', dados.natureza || dados.natureza_terreno)}
            ${renderField('Tipo de Imóvel:', 'tipo_imovel', dados.tipoImóvel || dados.tipo_imovel)}
            ${renderField('CEP:', 'cep', dados.cep)}
            ${renderField('UF:', 'uf', dados.uf)}
            ${renderField('Município:', 'municipio', dados.municipio)}
            ${renderField('Endereço:', 'endereco', dados.endereco || dados.logradouro)}
            ${renderField('Área total (mé):', 'area_total', dados.area_total)}
            ${renderField('Área da União (mé):', 'area_uniao', dados.area_uniao)}
            ${renderField('Há benfeitorias?:', 'benfeitorias', dados.benfeitorias)}
            ${renderField('Área construída total (mé):', 'area_construída_total', dados.area_construída_total)}
            ${renderField('Área de terreno disponível para destinação (mé):', 'area_terreno_disponivel', dados.area_terreno_disponivel)}
            ${renderField('Área construída disponível para destinação (mé):', 'area_construída_disponivel', dados.area_construída_disponivel)}
            ${renderField('Valor avaliado (R$):', 'valor_avaliado', dados.valor_avaliado || dados.valor_imovel)}
            ${renderField('Data da avaliação:', 'data_avaliação', dados.data_avaliação)}
            ${renderField('Instrumento de avaliação:', 'instrumento_avaliação', dados.instrumento_avaliação)}
            ${renderField('Situação da Incorporação:', 'situacao_incorporacao', dados.situacao_incorporacao || dados.situacao)}
            ${renderField('LPM/1831 ou LMEO homologadas?:', 'lpm_homologada', dados.lpm_homologada)}
            ${renderField('Processo de incorporaééo?:', 'processo_incorporacao', dados.processo_incorporacao)}
            ${renderField('Número do Processo:', 'numero_processo', dados.numero_processo)}
            ${renderField('Cartório:', 'cartorio', dados.cartorio)}
            ${renderField('Número da Matrícula:', 'numero_matricula', dados.numero_matricula || dados.matricula)}
        </div>
    `;

    container.appendChild(div);
};