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
            if (tituloPagina) {
                tituloPagina.textContent = data.tipo_requerimento || data.procedimento || 'Regularizar Utilização de Imóvel da União';
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
            if (tituloPagina) {
                tituloPagina.textContent = data.tipo_requerimento || data.procedimento || 'Regularizar Utilização de Imóvel da União';
            }
            if (data && data.documentos_anexados && Array.isArray(data.documentos_anexados)) {
                clearInterval(checkStateInterval);
                if (!docsRendered) {
                    renderDocumentos(data.documentos_anexados);
                    docsRendered = true;
                }
            }

            // Tratamento de Devolução
            if (data && data.status_devolucao === 'Aba 1') {
                const banner = document.getElementById('bannerDevolucaoAba1');
                const textoMotivo = document.getElementById('textoMotivoDevolucaoAba1');
                const blocoResposta = document.getElementById('blocoRespostaDevolutivaAba1');
                const inputResposta = document.getElementById('resposta_devolucao');
                
                if (banner && textoMotivo && blocoResposta && inputResposta) {
                    banner.style.display = 'block';
                    textoMotivo.textContent = data.motivo_devolucao || 'Motivo não especificado.';
                    
                    blocoResposta.style.display = 'block';
                    inputResposta.required = true;
                    // Preenche a resposta se já tiver salva no draft
                    if (data.resposta_devolucao) {
                        inputResposta.value = data.resposta_devolucao;
                    }
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
        const blocoCadastro = document.getElementById('bloco-info-exige-cadastro-minimo');
        const containerDropdown = document.getElementById('container_conceituacao_dropdown');

        const isDropdownVisible = containerDropdown && containerDropdown.style.display !== 'none';

        let selecionado = "";
        if (val && exigeRip.includes(val)) {
            selecionado = "Sim";
            if (blocoInfo) blocoInfo.style.display = isDropdownVisible ? "block" : "none";
            if (blocoCadastro) blocoCadastro.style.display = "none";
        } else if (val && exigeCadastro.includes(val)) {
            selecionado = "Não";
            if (blocoInfo) blocoInfo.style.display = "none";
            if (blocoCadastro) blocoCadastro.style.display = isDropdownVisible ? "block" : "none";
        } else {
            if (blocoInfo) blocoInfo.style.display = "none";
            if (blocoCadastro) blocoCadastro.style.display = "none";
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

    // Toggle para o botão Adicionar Imóvel/Área
    const btnAdicionarImovel = document.getElementById('btnAdicionarImovelArea');
    if (btnAdicionarImovel) {
        btnAdicionarImovel.addEventListener('click', () => {
            const containerDropdown = document.getElementById('container_conceituacao_dropdown');
            if (containerDropdown) {
                if (containerDropdown.style.display === 'none') {
                    containerDropdown.style.display = 'block';
                } else {
                    containerDropdown.style.display = 'none';
                }
                atualizarLayoutConceituacao();
            }
        });
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

    function atualizarNumeroRequerimento() {
        const campo11 = document.getElementById('campo11');
        if (!campo11) return;
        
        const processId = localStorage.getItem('CURRENT_PROCESS_ID') || '';
        let uf = '';
        if (window.parent && window.parent.formDataState && window.parent.formDataState.uf) {
            uf = window.parent.formDataState.uf;
        } else if (processId) {
            const match = processId.match(/^[A-Z]{2}/i);
            if (match) {
                uf = match[0].toUpperCase();
            }
        }
        
        if (!uf) uf = 'PR'; // fallback
        
        if (window.ripsPendentes && window.ripsPendentes.length > 0) {
            const novoNumero = uf + window.ripsPendentes[0];
            campo11.value = novoNumero;
            
            // Notifica o sync.js e o parent
            campo11.dispatchEvent(new Event('change', { bubbles: true }));
            if (window.parent && typeof window.parent.updateField === 'function') {
                window.parent.updateField('campo11', novoNumero);
            }
        }
    }

    window.removerRipItem = function(rip) {
        window.ripsPendentes = window.ripsPendentes.filter(r => r !== rip);
        
        atualizarLayoutConceituacao();
        atualizarNumeroRequerimento();
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

        // Oculta o dropdown de conceituação após inserção bem sucedida
        const containerDropdown = document.getElementById('container_conceituacao_dropdown');
        if (containerDropdown) {
            containerDropdown.style.display = 'none';
        }

        atualizarLayoutConceituacao();
        atualizarNumeroRequerimento();
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

        // Oculta o dropdown de conceituação após inserção bem sucedida
        const containerDropdown = document.getElementById('container_conceituacao_dropdown');
        if (containerDropdown) {
            containerDropdown.style.display = 'none';
        }

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

    // Lógica para Salvar e Manifestação
    const formReq = document.getElementById('form01');
    if (formReq) {
        formReq.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o sync.js de interceptar submissões acidentais
        });
    }
    let ultimoRelatorioSalvo = {};

    async function executarSalvamento() {
        if (!formReq.checkValidity()) {
            formReq.reportValidity();
            return false;
        }
        
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
                
                // 2. Sincroniza dados com o formDataState do parent
                if (typeof window.parent.updateField === 'function') {
                    window.parent.updateField('rips', window.ripsPendentes);
                    window.parent.updateField('solicitacao_criacao_rip', window.solicitacaoCriacaoRip || "");
                    window.parent.updateField('cadastros_minimos', window.cadastrosPendentes || []);
                }

                // 2.5 Monta e salva o Relatório (Snapshot) da Aba 1
                try {
                    ultimoRelatorioSalvo = {
                        numero_requerimento: document.getElementById('campo11')?.value || '',
                        data_requerimento: document.getElementById('campo12')?.value || '',
                        processo_sei: document.getElementById('campo13')?.value || '',
                        cpf_cnpj: document.getElementById('campo14')?.value || '',
                        nome_requerente: document.getElementById('campo15')?.value || '',
                        telefone: document.getElementById('campo19')?.value || '',
                        cpf_cnpj_rep: document.getElementById('campo14_rep')?.value || '',
                        nome_rep: document.getElementById('campo15_rep')?.value || '',
                        telefone_rep: document.getElementById('campo19_rep')?.value || '',
                        pessoa_estrangeira: document.getElementById('campo17')?.value || '',
                        prioridade_legal: document.getElementById('prioridade_legal')?.value || '',
                        conceituacao_imovel: val,
                        rips: window.ripsPendentes || [],
                        cadastros_minimos: window.cadastrosPendentes || [],
                        solicitacao_criacao_rip: window.solicitacaoCriacaoRip || ""
                    };

                    const urlRel = `${window.parent.SUPABASE_URL}/rest/v1/tabela_relatorios?on_conflict=process_id,aba`;
                    const payloadRel = {
                        process_id: processId,
                        aba: 'aba1',
                        dados_relatorio: ultimoRelatorioSalvo,
                        updated_at: new Date().toISOString()
                    };

                    await fetch(urlRel, {
                        method: 'POST',
                        headers: {
                            'apikey': window.parent.SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${window.parent.SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'resolution=merge-duplicates'
                        },
                        body: JSON.stringify(payloadRel)
                    });

                    // --- VERSIONAMENTO: gravar snapshot na tabela_versoes_formulario ---
                    try {
                        const urlVersoes = `${window.parent.SUPABASE_URL}/rest/v1/tabela_versoes_formulario`;
                        const urlUltimaVersao = `${urlVersoes}?processo_id=eq.${encodeURIComponent(processId)}&aba=eq.aba1&order=versao.desc&limit=1`;
                        const resUltima = await fetch(urlUltimaVersao, {
                            headers: { apikey: window.parent.SUPABASE_ANON_KEY, Authorization: `Bearer ${window.parent.SUPABASE_ANON_KEY}` }
                        });
                        const arrUltima = await resUltima.json();
                        const proximaVersao = (arrUltima.length > 0 ? arrUltima[0].versao : 0) + 1;

                        await fetch(urlVersoes, {
                            method: 'POST',
                            headers: {
                                apikey: window.parent.SUPABASE_ANON_KEY,
                                Authorization: `Bearer ${window.parent.SUPABASE_ANON_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                processo_id: processId,
                                aba: 'aba1',
                                versao: proximaVersao,
                                dados_json: ultimoRelatorioSalvo,
                                criado_por: localStorage.getItem('CURRENT_USER_PROFILE') || 'SISTEMA'
                            })
                        });
                        console.log(`✅ [foco-01] Versão ${proximaVersao} gravada em tabela_versoes_formulario`);
                    } catch (errVersao) {
                        console.warn('⚠️ [foco-01] Erro ao gravar versão (não bloqueia):', errVersao);
                    }
                } catch(errRel) {
                    console.error('❌ [foco-01] Erro ao salvar relatório:', errRel);
                }
                
                // 3. Persiste formDataState na tabela_foco
                if (typeof window.parent.forceSaveDraft === 'function') {
                    await window.parent.forceSaveDraft();
                }
                
                return true;
            } catch(err) {
                console.error("❌ [foco-01] Erro durante o salvamento:", err);
                return false;
            }
        }
        return false;
    }

    const btnSalvarRelatorio = document.getElementById('btnSalvarRelatorio');
    if (btnSalvarRelatorio) {
        btnSalvarRelatorio.addEventListener('click', async () => {
            const orig = btnSalvarRelatorio.innerHTML;
            btnSalvarRelatorio.innerHTML = 'Salvando...';
            const sucesso = await executarSalvamento();
            btnSalvarRelatorio.innerHTML = orig;
            if (sucesso) {
                alert('Dados salvos com sucesso!');
            }
        });
    }

    // =========================================================================
    // 6. FLUXO SEQUENCIAL DE BOTÕES DO RODAPÉ
    // =========================================================================

    const btnSalvarFormulario = document.getElementById('btnSalvarFormulario');
    const btnRegistrarManifestacao = document.getElementById('btnRegistrarManifestacao');
    const btnEnviarCaracterizacao = document.getElementById('btnEnviarCaracterizacao');

    if (btnSalvarFormulario) {
        btnSalvarFormulario.addEventListener('click', async () => {
            const orig = btnSalvarFormulario.innerHTML;
            btnSalvarFormulario.innerHTML = 'Salvando...';
            const sucesso = await executarSalvamento();
            btnSalvarFormulario.innerHTML = orig;
            
            if (!sucesso) return; // Erro de validação
            
            alert('Formulário salvo com sucesso!');
            // Exibe o próximo botão
            if (btnRegistrarManifestacao) {
                btnRegistrarManifestacao.style.display = 'block';
            }
        });
    }

    if (btnRegistrarManifestacao) {
        btnRegistrarManifestacao.addEventListener('click', async () => {
            const modalAprovacao = document.getElementById('modalAprovacaoAba1');
            const chkAprovar = document.getElementById('chkAprovarAba1');
            const btnConfirmarAprov = document.getElementById('btnConfirmarAprovacao');
            const btnCancelarAprov = document.getElementById('btnCancelarAprovacao');
            const btnFecharAprov = document.getElementById('btnFecharModalAprovacao');
            const loadingRelatorio = document.getElementById('loadingRelatorio');
            const conteudoRel = document.getElementById('conteudoRelatorioAprovacao');

            if (modalAprovacao) {
                loadingRelatorio.style.display = 'block';
                conteudoRel.style.display = 'none';
                chkAprovar.checked = false;
                btnConfirmarAprov.disabled = true;
                
                modalAprovacao.style.display = 'flex';

                // Listener para ativar o botão de confirmação ao aceitar a declaração
                const onCheckChange = (ev) => {
                    btnConfirmarAprov.disabled = !ev.target.checked;
                };
                chkAprovar.removeEventListener('change', onCheckChange);
                chkAprovar.addEventListener('change', onCheckChange);

                const fecharModal = () => { modalAprovacao.style.display = 'none'; };
                if (btnCancelarAprov) btnCancelarAprov.onclick = fecharModal;
                if (btnFecharAprov) btnFecharAprov.onclick = fecharModal;

                // Carrega e renderiza os dados dinamicamente (Sem iframe)
                try {
                    const processId = localStorage.getItem('CURRENT_PROCESS_ID');
                    const SUPA_URL = window.parent?.SUPABASE_URL;
                    const SUPA_KEY = window.parent?.SUPABASE_ANON_KEY;

                    if (!SUPA_URL || !SUPA_KEY) {
                        throw new Error("Credenciais do Supabase não encontradas.");
                    }

                    const url = `${SUPA_URL}/rest/v1/tabela_relatorios?select=*&process_id=eq.${encodeURIComponent(processId)}&aba=eq.aba1&limit=1`;
                    const res = await fetch(url, {
                        headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` }
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(`Status ${res.status}: ${res.statusText} - ${errorText}`);
                    }
                    
                    const data = await res.json();
                    if (data && data.length > 0) {
                        ultimoRelatorioSalvo = data[0].dados_relatorio;
                        const rel = ultimoRelatorioSalvo;

                        let cadastrosHtml = '-';
                        if (rel.cadastros_minimos && rel.cadastros_minimos.length > 0) {
                            cadastrosHtml = rel.cadastros_minimos.map(c => `<div><strong>CEP:</strong> ${c.cep}, <strong>Área:</strong> ${c.area}m²</div>`).join('');
                        }

                        let ripsHtml = (rel.rips && rel.rips.length > 0) ? rel.rips.join(', ') : '-';
                        
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
                                <div class="report-section-title">Informações do Requerente</div>
                                <div class="report-grid">
                                    <div class="report-item">
                                        <span class="report-label">Nome do Requerente</span>
                                        <span class="report-value">${rel.nome_requerente || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">CPF/CNPJ</span>
                                        <span class="report-value">${rel.cpf_cnpj || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">Telefone</span>
                                        <span class="report-value">${rel.telefone || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">Pessoa Estrangeira</span>
                                        <span class="report-value">${rel.pessoa_estrangeira || '-'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="report-section">
                                <div class="report-section-title">Dados do Processo SEI e Requerimento</div>
                                <div class="report-grid">
                                    <div class="report-item">
                                        <span class="report-label">Número do Requerimento</span>
                                        <span class="report-value">${rel.numero_requerimento || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">Data do Requerimento</span>
                                        <span class="report-value">${rel.data_requerimento || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">Número do Processo SEI</span>
                                        <span class="report-value">${rel.processo_sei || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">Prioridade Legal</span>
                                        <span class="report-value">${rel.prioridade_legal || '-'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="report-section">
                                <div class="report-section-title">Dados do Representante Legal</div>
                                <div class="report-grid">
                                    <div class="report-item">
                                        <span class="report-label">Nome</span>
                                        <span class="report-value">${rel.nome_rep || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">CPF/CNPJ</span>
                                        <span class="report-value">${rel.cpf_cnpj_rep || '-'}</span>
                                    </div>
                                    <div class="report-item">
                                        <span class="report-label">Telefone</span>
                                        <span class="report-value">${rel.telefone_rep || '-'}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="report-section">
                                <div class="report-section-title">Indicação do Imóvel</div>
                                <div class="report-grid">
                                    <div class="report-item" style="grid-column: span 2;">
                                        <span class="report-label">Imóvel/Área Relacionados</span>
                                        <span class="report-value">${rel.conceituacao_imovel || '-'}</span>
                                    </div>
                                    <div class="report-item" style="grid-column: span 2;">
                                        <span class="report-label">RIPs Associados</span>
                                        <span class="report-value">${ripsHtml}</span>
                                    </div>
                                    <div class="report-item" style="grid-column: span 2;">
                                        <span class="report-label">Cadastros Mínimos</span>
                                        <div class="report-value">${cadastrosHtml}</div>
                                    </div>
                                    <div class="report-item" style="grid-column: span 2;">
                                        <span class="report-label">Solicitação de Criação de RIP / Observações</span>
                                        <span class="report-value">${rel.solicitacao_criacao_rip || '-'}</span>
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
                        loadingRelatorio.style.display = 'none';
                        conteudoRel.style.display = 'block';
                    } else {
                        loadingRelatorio.innerText = "Nenhum relatório salvo encontrado para este processo. Salve a Aba 1 para gerar.";
                    }
                } catch (err) {
                    console.error(err);
                    loadingRelatorio.innerText = "Erro ao carregar o relatório: " + err.message;
                }

                btnConfirmarAprov.onclick = async () => {
                    const origBtn = btnConfirmarAprov.innerHTML;
                    btnConfirmarAprov.innerHTML = 'Registrando...';
                    
                    try {
                        const processId = localStorage.getItem('CURRENT_PROCESS_ID');
                        const urlRelPatch = `${window.parent.SUPABASE_URL}/rest/v1/tabela_relatorios?process_id=eq.${encodeURIComponent(processId)}&aba=eq.aba1`;
                        
                        const observacoes = document.getElementById('txtObservacoesAba1') ? document.getElementById('txtObservacoesAba1').value : '';
                        const perfilLogado = localStorage.getItem('CURRENT_USER_PROFILE') || 'Equipe SPU/UF (Caracterização)';
                        
                        ultimoRelatorioSalvo.aprovacao = {
                            status: true,
                            data: new Date().toISOString(),
                            perfil: perfilLogado,
                            observacoes: observacoes
                        };

                        await fetch(urlRelPatch, {
                            method: 'PATCH',
                            headers: {
                                'apikey': window.parent.SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${window.parent.SUPABASE_ANON_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ dados_relatorio: ultimoRelatorioSalvo, updated_at: new Date().toISOString() })
                        });
                        
                        alert('Manifestação registrada com sucesso!');
                    } catch (e) {
                        console.error('❌ [foco-01] Erro ao salvar aprovação:', e);
                        alert('Houve um erro ao registrar a manifestação.');
                    }
                    
                    btnConfirmarAprov.innerHTML = origBtn;
                    fecharModal();
                    
                    // Exibe o terceiro botão
                    if (btnEnviarCaracterizacao) {
                        btnEnviarCaracterizacao.style.display = 'block';
                    }
                };
            }
        });
    }

    if (btnEnviarCaracterizacao) {
        btnEnviarCaracterizacao.addEventListener('click', async () => {
            // Salvar Snapshot Histórico no Supabase ANTES de limpar status_devolucao
            // (Assim a foto sai com a flag de que foi uma devolução e contém a resposta)
            if (window.parent && typeof window.parent.salvarSnapshotHistorico === 'function') {
                await window.parent.salvarSnapshotHistorico('Aba 1 (Indicação)');
            }

            // Limpeza do status_devolucao da Aba 1 (Pois o processo vai pra Aba 2)
            if (window.parent && window.parent.formDataState && window.parent.formDataState.status_devolucao === 'Aba 1') {
                delete window.parent.formDataState.status_devolucao;
                if (typeof window.parent.forceSaveDraft === 'function') {
                    await window.parent.forceSaveDraft();
                }
            }

            // Atualiza status do fluxo ao enviar
            const processId = localStorage.getItem('CURRENT_PROCESS_ID');
            if (processId && window.parent && typeof window.parent.updateStatusFluxo === 'function') {
                await window.parent.updateStatusFluxo(processId, 3); // ID 3: Diagnóstico de Imóvel (Caracterização)
            }

            const rootWindow = window.parent?.parent || window.parent || window;
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-02.html"]');
            if (btnTabNext) {
                btnTabNext.click();
            } else {
                console.error("Botão de Aba 2 não encontrado no Parent.");
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
