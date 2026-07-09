// foco-01.js
// Exclusivo da Seção 1: Dados do Requerimento (foco-01.html)
// Depende de: formulario.js (mascaraCPFCNPJ, mascaraSEI)

window.ripsPesquisados = window.ripsPesquisados || {};
window.imovelCount = window.imovelCount || 0;

function inicializarFoco01() {
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
            const url = this.getAttribute('data-url');
            if (url && url !== '#') {
                window.open(url, '_blank');
            } else if (modalSim) {
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
                // Limpa também as seções condicionais
                if (typeof verificarConceituacao === 'function') verificarConceituacao();
                document.getElementById('imoveis-container').innerHTML = '';
                document.getElementById('listaRIPsAssociados').innerHTML = '';
                document.getElementById('listaRIPsAssociados').style.display = 'none';
                window.ripsPesquisados = {};
                window.imovelCount = 0;
            }
        });
    }

    // =========================================================================
    // 5. RENDERIZAÇÃO DINÂMICA DE DOCUMENTOS
    // =========================================================================
    // Fallback/Polling para evitar race conditions e atualizar título
    let docsRendered = false;
    const checkStateInterval = setInterval(() => {
        if (window.parent && window.parent.formDataState) {
            const data = window.parent.formDataState;
            const labelTitulo = document.getElementById('label-titulo-requerimento');
            if (labelTitulo) {
                labelTitulo.textContent = 'Requerimento';
            }
            const tituloPagina = document.getElementById('titulo-pagina-requerimento');
            if (tituloPagina && data.procedimento) {
                tituloPagina.textContent = data.procedimento;
            }
            if (data.documentos_anexados) {
                clearInterval(checkStateInterval);
                if (!docsRendered) {
                    renderDocumentos(data.documentos_anexados);
                    docsRendered = true;
                }
            }
        }
    }, 200);

    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'DATABASE_LOADED') {
            const data = event.data.data;
            const labelTitulo = document.getElementById('label-titulo-requerimento');
            if (labelTitulo) {
                labelTitulo.textContent = 'Requerimento';
            }
            const tituloPagina = document.getElementById('titulo-pagina-requerimento');
            if (tituloPagina && data.procedimento) {
                tituloPagina.textContent = data.procedimento;
            }
            if (data && data.documentos_anexados && Array.isArray(data.documentos_anexados)) {
                clearInterval(checkStateInterval);
                if (!docsRendered) {
                    renderDocumentos(data.documentos_anexados);
                    docsRendered = true;
                }
            }
        }
    });

    function renderDocumentos(docs) {
        const tbody = document.getElementById('documentos-anexados-body');
        if (!tbody) return;
        
        if (docs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; padding: 15px; color: #64748b;">Nenhum documento anexado encontrado.</td></tr>`;
            return;
        }
        
        let html = '';
        docs.forEach(doc => {
            let icon = '📄';
            if (doc.nome && doc.nome.toLowerCase().includes('contrato')) icon = '🏢';
            else if (doc.nome && doc.nome.toLowerCase().includes('identificação')) icon = '🪪';
            else if (doc.nome && doc.nome.toLowerCase().includes('procuração')) icon = '📝';
            else if (doc.nome && doc.nome.toLowerCase().includes('comprovante')) icon = '🔎';
            
            html += `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 8px;">
                        <div class="doc-nome" style="display: flex; align-items: center; gap: 8px;">
                            <span class="doc-icon">${icon}</span>
                            <div><strong>${doc.nome || 'Documento Anexado'}</strong></div>
                        </div>
                    </td>
                    <td class="coluna-acao" style="text-align: right; padding: 10px 8px;">
                        <button type="button" class="btn-link-doc btn-simular-doc" data-url="${doc.url || '#'}" style="background-color: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; display: inline-block;" title="Visualizar">👁️ Visualizar</button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
        // Re-anexar listeners do modal nos novos botões
        const btnsAbrir = tbody.querySelectorAll('.btn-simular-doc');
        const modalSim = document.getElementById('modalSimulacao');
        btnsAbrir.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                if (url && url !== '#') {
                    window.open(url, '_blank');
                } else if (modalSim) {
                    modalSim.style.display = 'flex';
                }
            });
        });
    }

    // =========================================================================
    // 4. TOGGLE DOS BOTÕES DA CONCEITUAÇÃO DO IMÓVEL
    // =========================================================================

    // Toggle para botões Inserir RIP / Inserir Cadastro Mínimo com base no Select
    const containerDropdown = document.getElementById('container_conceituacao_dropdown');
    const selectConceituacao = document.getElementById('conceituacao_imovel');
    const btnEnviar = document.getElementById('btnEnviar');
    const btnInserirRip = document.getElementById('btnInserirRip');
    const btnInserirCadastroMinimo = document.getElementById('btnInserirCadastroMinimo');

    // Estado da solicitação de criação de RIP
    window.solicitacaoCriacaoRip = "";

    function atualizarLayoutConceituacao() {
        if (!selectConceituacao) return;
        const val = selectConceituacao.value;
        const exigeRip = ["Terreno/acrescido de marinha", "Terreno/acrescido marginal", "Nacional interior"];
        const exigeCadastro = ["Espelho d'água", "Cavidades naturais subterrâneas", "Manguezal", "Praias"];

        const blocoInfo = document.getElementById('bloco-info-exige-rip');
        const spanConceituacao = document.getElementById('info-conceituacao-selecionada');
        const btnCadastro = document.getElementById('btnInserirCadastroMinimo');

        let selecionado = "";
        if (val && exigeRip.includes(val)) {
            selecionado = "Sim";
            if (blocoInfo) blocoInfo.style.display = "block";
            if (spanConceituacao) spanConceituacao.textContent = val;
            if (btnCadastro) btnCadastro.style.display = "none";
        } else if (val && exigeCadastro.includes(val)) {
            selecionado = "Não";
            if (blocoInfo) blocoInfo.style.display = "none";
            if (btnCadastro) btnCadastro.style.display = "block";
        } else {
            if (blocoInfo) blocoInfo.style.display = "none";
            if (btnCadastro) btnCadastro.style.display = "none";
        }

        // Gerenciar estado ativo/inativo do botão Enviar com base em RIP (ou solicitação de criação) ou Cadastro Mínimo realizado
        if (btnEnviar) {
            let habilitado = false;
            if (selecionado === "Sim" && ((window.ripsPendentes && window.ripsPendentes.length > 0) || window.solicitacaoCriacaoRip)) {
                habilitado = true;
            } else if (selecionado === "Não" && window.cadastrosPendentes && window.cadastrosPendentes.length > 0) {
                habilitado = true;
            }

            if (habilitado) {
                btnEnviar.disabled = false;
                btnEnviar.style.opacity = "1";
                btnEnviar.style.pointerEvents = "auto";
                btnEnviar.style.cursor = "pointer";
            } else {
                btnEnviar.disabled = true;
                btnEnviar.style.opacity = "0.4";
                btnEnviar.style.pointerEvents = "none";
                btnEnviar.style.cursor = "not-allowed";
            }
        }
    }

    // LÓGICA DO MODAL SOLICITAR CRIAÇÃO DE RIP
    console.log("🔍 [foco-01] Iniciando binding do modal de solicitação...");
    const modalSolicitacao = document.getElementById('modalSolicitarCriacaoRip');
    const btnSolicitar = document.getElementById('btnSolicitarCriacaoRip');
    const btnFecharSolicitacao = document.getElementById('btnFecharModalSolicitacaoRip');
    const btnCancelarSolicitacao = document.getElementById('btnCancelarSolicitacaoRip');
    const btnSalvarSolicitacao = document.getElementById('btnSalvarSolicitacaoRip');
    const inputSolicitacao = document.getElementById('inputSolicitacaoCriacao');

    console.log("🔍 [foco-01] Elementos consultados:", {
        modalSolicitacao: !!modalSolicitacao,
        btnSolicitar: !!btnSolicitar,
        btnFecharSolicitacao: !!btnFecharSolicitacao,
        btnCancelarSolicitacao: !!btnCancelarSolicitacao,
        btnSalvarSolicitacao: !!btnSalvarSolicitacao,
        inputSolicitacao: !!inputSolicitacao
    });

    function renderSolicitacaoCriacaoRip() {
        const existing = document.getElementById('card-solicitacao-rip');
        if (existing) existing.remove();
        
        if (!window.solicitacaoCriacaoRip) return;

        const div = document.createElement('div');
        div.id = 'card-solicitacao-rip';
        div.style.cssText = "background-color: #fdf2f8; border: 1px solid #fbcfe8; padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: flex-start; font-size: 14px; font-weight: 500; color: #9d174d; margin-top: 8px; flex-direction: column; gap: 6px; text-align: left;";
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>🔔 Solicitação de Criação de RIP</span>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="cursor: pointer; color: #0284c7; font-weight: bold; font-size: 12px;" id="btnEditarSolicitacaoRip" title="Editar">Editar</span>
                    <span style="cursor: pointer; color: #ef4444; font-weight: bold; font-size: 18px;" id="btnExcluirSolicitacaoRip" title="Remover">&times;</span>
                </div>
            </div>
            <div style="font-size: 13px; color: #475569; background: #fff; padding: 6px 10px; border-radius: 4px; border: 1px solid #f3f4f6; width: 100%; box-sizing: border-box; word-break: break-all;">
                ${window.solicitacaoCriacaoRip}
            </div>
        `;
        const listRips = document.getElementById('listaRipsInseridos');
        if (listRips) listRips.appendChild(div);

        div.querySelector('#btnEditarSolicitacaoRip').addEventListener('click', () => {
            if (inputSolicitacao) inputSolicitacao.value = window.solicitacaoCriacaoRip;
            if (modalSolicitacao) modalSolicitacao.style.display = 'flex';
        });

        div.querySelector('#btnExcluirSolicitacaoRip').addEventListener('click', () => {
            window.solicitacaoCriacaoRip = "";
            div.remove();
            atualizarLayoutConceituacao();
        });
    }

    if (btnSolicitar && modalSolicitacao) {
        btnSolicitar.addEventListener('click', () => {
            console.log("🔍 [foco-01] Clique detectado em btnSolicitar! Abrindo modal...");
            modalSolicitacao.style.display = 'flex';
            if (inputSolicitacao) inputSolicitacao.value = window.solicitacaoCriacaoRip || '';
        });
    }

    const fecharModalSolicitacao = () => { if (modalSolicitacao) modalSolicitacao.style.display = 'none'; };
    if (btnFecharSolicitacao) btnFecharSolicitacao.addEventListener('click', fecharModalSolicitacao);
    if (btnCancelarSolicitacao) btnCancelarSolicitacao.addEventListener('click', fecharModalSolicitacao);

    if (btnSalvarSolicitacao) {
        btnSalvarSolicitacao.addEventListener('click', () => {
            if (!inputSolicitacao) return;
            const txt = inputSolicitacao.value.trim();
            if (!txt) {
                alert("Por favor, descreva sua solicitação ao setor de cadastro.");
                return;
            }
            window.solicitacaoCriacaoRip = txt;
            renderSolicitacaoCriacaoRip();
            fecharModalSolicitacao();
            atualizarLayoutConceituacao();
        });
    }

    window.removerRipItem = function(rip) {
        window.ripsPendentes = window.ripsPendentes.filter(r => r !== rip);
        atualizarLayoutConceituacao();
        if (window.parent && typeof window.parent.updateField === 'function') {
            window.parent.updateField('rips', window.ripsPendentes);
        }
    };

    window.removerCadastroItem = function(cep, area) {
        window.cadastrosPendentes = window.cadastrosPendentes.filter(c => c.cep !== cep || c.area !== area);
        atualizarLayoutConceituacao();
    };

    if (selectConceituacao) {
        selectConceituacao.addEventListener('change', () => {
            atualizarLayoutConceituacao();
        });
    }

    // Inicializa o layout para deixar o botão desabilitado caso nada esteja marcado inicialmente
    atualizarLayoutConceituacao();

    // =========================================================================
    // 5. LÓGICA DOS MODAIS (RIP E CADASTRO MÍNIMO)
    // =========================================================================

    // Elementos do Modal Inserir RIP
    const modalRip = document.getElementById('modalInserirRip');
    const btnFecharModalRip = document.getElementById('btnFecharModalRip');
    const btnCancelarRip = document.getElementById('btnCancelarRip');
    const btnSalvarRip = document.getElementById('btnSalvarRip');
    const btnMaisRip = document.getElementById('btnMaisRip');
    const inputNumeroRip = document.getElementById('inputNumeroRip');
    const listaRipsInseridos = document.getElementById('listaRipsInseridos');
    
    // Arrays para manter os dados pendentes de salvamento
    window.ripsPendentes = [];
    window.cadastrosPendentes = [];

    if (btnInserirRip && modalRip) {
        btnInserirRip.addEventListener('click', () => {
            modalRip.style.display = 'flex';
            inputNumeroRip.value = '';
        });
    }

    const fecharModalRip = () => { if (modalRip) modalRip.style.display = 'none'; };
    if (btnFecharModalRip) btnFecharModalRip.addEventListener('click', fecharModalRip);
    if (btnCancelarRip) btnCancelarRip.addEventListener('click', fecharModalRip);
    if (inputNumeroRip) inputNumeroRip.addEventListener('input', limparErroRip);
    
    function adicionarRipNaLista(rip) {
        if (!listaRipsInseridos) return;
        const div = document.createElement('div');
        div.style.cssText = "background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 12px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 500; color: #166534;";
        div.innerHTML = `
            <span>✅ RIP Cadastrado: <strong>${rip}</strong></span>
            <span style="cursor: pointer; color: #ef4444;" onclick="this.parentElement.remove(); window.removerRipItem('${rip}');" title="Remover">&times;</span>
        `;
        listaRipsInseridos.appendChild(div);
        if (!window.ripsPendentes.includes(rip)) window.ripsPendentes.push(rip);
        atualizarLayoutConceituacao();
    }

    // Função para validar RIP na tabela_spu
    async function validarRipNoBanco(rip) {
        try {
            const SUPA_URL = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
            const SUPA_KEY = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);
            if (!SUPA_URL || !SUPA_KEY) return true; // fallback: aceita se não conseguir conectar
            const url = `${SUPA_URL}/rest/v1/tabela_spu?select=numero_rip&numero_rip=eq.${rip}&limit=1`;
            const res = await fetch(url, { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } });
            if (!res.ok) return true;
            const data = await res.json();
            return data.length > 0;
        } catch (e) {
            console.error('[foco-01] Erro ao validar RIP:', e);
            return true;
        }
    }

    function mostrarErroRip(msg) {
        const el = document.getElementById('errRipNaoEncontrado');
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    }
    function limparErroRip() {
        const el = document.getElementById('errRipNaoEncontrado');
        if (el) el.style.display = 'none';
    }

    if (btnSalvarRip) {
        btnSalvarRip.addEventListener('click', async () => {
            limparErroRip();
            const rip = inputNumeroRip.value.trim();
            if (rip === '') return;
            const existe = await validarRipNoBanco(rip);
            if (!existe) {
                mostrarErroRip('RIP não encontrado na tabela_spu!');
                inputNumeroRip.style.borderColor = '#dc2626';
                return;
            }
            inputNumeroRip.style.borderColor = '';
            adicionarRipNaLista(rip);
            fecharModalRip();
            if (window.parent && typeof window.parent.updateField === 'function') {
                window.parent.updateField('rips', window.ripsPendentes);
            }
        });
    }
    if (btnMaisRip) {
        btnMaisRip.addEventListener('click', async () => {
            limparErroRip();
            const rip = inputNumeroRip.value.trim();
            if (rip === '') return;
            const existe = await validarRipNoBanco(rip);
            if (!existe) {
                mostrarErroRip('RIP não encontrado na tabela_spu!');
                inputNumeroRip.style.borderColor = '#dc2626';
                return;
            }
            inputNumeroRip.style.borderColor = '';
            adicionarRipNaLista(rip);
            inputNumeroRip.value = '';
            inputNumeroRip.focus();
            if (window.parent && typeof window.parent.updateField === 'function') {
                window.parent.updateField('rips', window.ripsPendentes);
            }
        });
    }

    // Elementos do Modal Cadastro Mínimo
    const modalCadastro = document.getElementById('modalCadastroMinimo');
    const btnFecharModalCadastroMinimo = document.getElementById('btnFecharModalCadastroMinimo');
    const btnCancelarCadastro = document.getElementById('btnCancelarCadastro');
    const btnSalvarCadastro = document.getElementById('btnSalvarCadastro');
    const listaCadastrosInseridos = document.getElementById('listaCadastrosInseridos');
    
    // Campos
    const modalCep = document.getElementById('modalCep');
    const modalLogradouro = document.getElementById('modalLogradouro');
    const modalMunicipio = document.getElementById('modalMunicipio');
    const modalUf = document.getElementById('modalUf');
    const modalNumero = document.getElementById('modalNumero');
    const modalArea = document.getElementById('modalArea');

    if (btnInserirCadastroMinimo && modalCadastro) {
        btnInserirCadastroMinimo.addEventListener('click', () => {
            modalCadastro.style.display = 'flex';
        });
    }

    const fecharModalCadastro = () => { if (modalCadastro) modalCadastro.style.display = 'none'; };
    if (btnFecharModalCadastroMinimo) btnFecharModalCadastroMinimo.addEventListener('click', fecharModalCadastro);
    if (btnCancelarCadastro) btnCancelarCadastro.addEventListener('click', fecharModalCadastro);

    function adicionarCadastroNaLista(dados) {
        if (!listaCadastrosInseridos) return;
        const div = document.createElement('div');
        div.style.cssText = "background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 12px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 500; color: #166534;";
        
        div.innerHTML = `
            <span>✅ Cadastro realizado <span style="font-size: 12px; color: #15803d; font-weight: normal; margin-left: 5px;">(CEP: ${dados.cep})</span></span>
            <span style="cursor: pointer; color: #ef4444;" onclick="this.parentElement.remove(); window.removerCadastroItem('${dados.cep}', '${dados.area}');" title="Remover">&times;</span>
        `;
        listaCadastrosInseridos.appendChild(div);
        
        const exists = window.cadastrosPendentes.some(c => c.cep === dados.cep && c.area === dados.area);
        if (!exists) window.cadastrosPendentes.push(dados);
        atualizarLayoutConceituacao();
    }

    if (btnSalvarCadastro) {
        btnSalvarCadastro.addEventListener('click', () => {
            const cep = modalCep ? modalCep.value.trim() : '';
            const area = modalArea ? modalArea.value.trim() : '';
            if (cep && area) {
                const dados = {
                    cep: cep,
                    logradouro: modalLogradouro ? modalLogradouro.value.trim() : '',
                    municipio: modalMunicipio ? modalMunicipio.value.trim() : '',
                    uf: modalUf ? modalUf.value.trim() : '',
                    numero: modalNumero ? modalNumero.value.trim() : '',
                    area: area,
                    observacoes: document.getElementById('modalObservacoes') ? document.getElementById('modalObservacoes').value.trim() : ''
                };
                
                adicionarCadastroNaLista(dados);
                fecharModalCadastro();
                // Limpa form basico
                if (modalCep) modalCep.value = '';
                if (modalArea) modalArea.value = '';
                if (modalLogradouro) modalLogradouro.value = '';
                if (modalMunicipio) modalMunicipio.value = '';
                if (modalUf) modalUf.value = '';
                if (modalNumero) modalNumero.value = '';
            } else {
                alert('Preencha pelo menos o CEP e a Área a ser destinada.');
            }
        });
    }

    // Carregar dados iniciais, se existirem
    setTimeout(async () => {
        const processId = localStorage.getItem('CURRENT_PROCESS_ID');
        if (processId && window.parent && typeof window.parent.carregarIndicacoes === 'function') {
            const registro = await window.parent.carregarIndicacoes(processId);
            if (registro && registro.dados_json) {
                const rips = registro.dados_json.rips || [];
                const cadastros = registro.dados_json.cadastros_minimos || [];
                window.solicitacaoCriacaoRip = registro.dados_json.solicitacao_criacao_rip || "";
                rips.forEach(rip => adicionarRipNaLista(rip));
                cadastros.forEach(cad => adicionarCadastroNaLista(cad));
                if (window.solicitacaoCriacaoRip) {
                    renderSolicitacaoCriacaoRip();
                }

                // Restaura a conceituação do imóvel
                const selectCon = document.getElementById('conceituacao_imovel');
                if (selectCon) {
                    let val = registro.dados_json.conceituacao_imovel || '';
                    if (!val) {
                        // Fallback/Backward compatibility com dados legados
                        const legacyRips = registro.dados_json.conceituacao_rip || [];
                        const legacyDisp = registro.dados_json.conceituacao_dispensado || [];
                        if (legacyRips.length > 0) {
                            val = legacyRips[0].replace(" (Exige RIP)", "").replace(" / ", "/");
                        } else if (legacyDisp.length > 0) {
                            val = legacyDisp[0].replace("Praia marítima", "Praias").replace("Praia fluvial ou lacustre", "Praias");
                        }
                    }

                    if (val) {
                        selectCon.value = val;
                        atualizarLayoutConceituacao();
                    } else {
                        atualizarLayoutConceituacao();
                    }
                } else {
                    atualizarLayoutConceituacao();
                }
            } else {
                atualizarLayoutConceituacao();
            }
        } else {
            atualizarLayoutConceituacao();
        }
    }, 1000); // Aguarda o db.js estar pronto e a tela carregar

    // Interceptar "Salvar e Avançar" — listener ÚNICO (unificado)
    const formReq = document.getElementById('form01');
    if (formReq) {
        formReq.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!formReq.checkValidity()) {
                formReq.reportValidity();
                return;
            }
            const btnEnviar = document.getElementById('btnEnviar');
            const originalText = btnEnviar ? btnEnviar.innerHTML : '';
            if (btnEnviar) btnEnviar.innerHTML = 'Salvando dados...';
            
            const processId = localStorage.getItem('CURRENT_PROCESS_ID');
            
            if (window.parent) {
                const selectCon = document.getElementById('conceituacao_imovel');
                const val = selectCon ? selectCon.value : '';
                
                const exigeRip = ["Terreno/acrescido de marinha", "Terreno/acrescido marginal", "Nacional interior"];
                const exigeCadastro = ["Espelho d'água", "Cavidades naturais subterrâneas", "Manguezal", "Praias"];
                const possuiRipVal = exigeRip.includes(val) ? 'Sim' : (exigeCadastro.includes(val) ? 'Não' : '');
                
                const cbRipsAtivos = exigeRip.includes(val) ? [val] : [];
                const cbDispensadosAtivos = exigeCadastro.includes(val) ? [val] : [];
                
                try {
                    // 1. Salva na Tabela Indicação
                    const dadosIndicacao = {
                        rips: window.ripsPendentes,
                        cadastros_minimos: window.cadastrosPendentes,
                        possui_rip: possuiRipVal,
                        conceituacao_imovel: val,
                        conceituacao_rip: cbRipsAtivos,
                        conceituacao_dispensado: cbDispensadosAtivos,
                        solicitacao_criacao_rip: window.solicitacaoCriacaoRip || ""
                    };
                    
                    const url = `${window.parent.SUPABASE_URL}/rest/v1/tabela_indicacao?on_conflict=numero_requerimento`;
                    const respIndicacao = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'apikey': window.parent.SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${window.parent.SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'resolution=merge-duplicates'
                        },
                        body: JSON.stringify({ numero_requerimento: processId, dados_json: dadosIndicacao })
                    });
                    console.log('📝 [foco-01] tabela_indicacao status:', respIndicacao.status);
                    
                    // 2. Sincroniza dados com o formDataState do parent
                    if (typeof window.parent.updateField === 'function') {
                        window.parent.updateField('rips', window.ripsPendentes);
                        window.parent.updateField('solicitacao_criacao_rip', window.solicitacaoCriacaoRip || "");
                        window.parent.updateField('cadastros_minimos', window.cadastrosPendentes || []);
                        console.log('📝 [foco-01] formDataState sincronizado.');
                    }
                    
                    // 3. Persiste formDataState na tabela_foco
                    if (typeof window.parent.forceSaveDraft === 'function') {
                        await window.parent.forceSaveDraft();
                        console.log('📝 [foco-01] forceSaveDraft concluído');
                    }
                    
                    // 4. Avança checkpoint do fluxo
                    if (typeof window.parent.updateStatusFluxo === 'function') {
                        await window.parent.updateStatusFluxo(processId, 'Caracterização');
                    }
                } catch(err) {
                    console.error("❌ [foco-01] Erro durante o envio da Aba 1:", err);
                }
            }
            
            if (btnEnviar) btnEnviar.innerHTML = originalText;
            
            // Navega para Aba 2 SOMENTE após todos os saves concluírem
            const rootWindow = window.parent?.parent || window.parent || window;
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-02.html"]');
            console.log('📝 [foco-01] btnTabNext encontrado:', !!btnTabNext);
            if (btnTabNext) {
                btnTabNext.click();
            }
        });
    }

    // Máscara e Busca de CEP
    if (modalCep) {
        modalCep.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value.substring(0, 9);
        });

        modalCep.addEventListener('blur', function() {
            const cepDigitado = this.value.replace(/\D/g, '');
            if (cepDigitado.length === 8) {
                modalLogradouro.value = 'Buscando...';
                modalMunicipio.value = 'Buscando...';
                modalUf.value = '...';

                fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`)
                    .then(r => r.json())
                    .then(data => {
                        if (!data.erro) {
                            modalLogradouro.value = data.logradouro || '';
                            modalMunicipio.value = data.localidade || '';
                            modalUf.value = data.uf || '';
                        } else {
                            modalLogradouro.value = '';
                            modalMunicipio.value = '';
                            modalUf.value = '';
                        }
                    })
                    .catch(() => {
                        modalLogradouro.value = '';
                        modalMunicipio.value = '';
                        modalUf.value = '';
                    });
            }
        });
    }

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFoco01);
} else {
    inicializarFoco01();
}
