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
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'DATABASE_LOADED') {
            const data = event.data.data;
            if (data && data.documentos_anexados && Array.isArray(data.documentos_anexados)) {
                renderDocumentos(data.documentos_anexados);
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
                        <button type="button" class="btn-link-doc btn-simular-doc" style="background-color: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; display: inline-block;" title="Visualizar">👁️ Visualizar</button>
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
                if (modalSim) {
                    modalSim.style.display = 'flex';
                }
            });
        });
    }

    // =========================================================================
    // 4. TOGGLE DOS BOTÕES DA CONCEITUAÇÃO DO IMÓVEL
    // =========================================================================

    // Toggle para "Inserir RIP"
    const cbRips = document.querySelectorAll('.cb-rip');
    const btnInserirRip = document.getElementById('btnInserirRip');
    if (cbRips.length > 0 && btnInserirRip) {
        cbRips.forEach(cb => {
            cb.addEventListener('change', function() {
                const anyChecked = Array.from(cbRips).some(c => c.checked);
                btnInserirRip.style.display = anyChecked ? 'block' : 'none';
            });
        });
    }

    // Toggle para "Inserir Cadastro Mínimo"
    const cbDispensados = document.querySelectorAll('.cb-dispensado');
    const btnInserirCadastroMinimo = document.getElementById('btnInserirCadastroMinimo');
    if (cbDispensados.length > 0 && btnInserirCadastroMinimo) {
        cbDispensados.forEach(cb => {
            cb.addEventListener('change', function() {
                const anyChecked = Array.from(cbDispensados).some(c => c.checked);
                btnInserirCadastroMinimo.style.display = anyChecked ? 'block' : 'none';
            });
        });
    }

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
            <span style="cursor: pointer; color: #ef4444;" onclick="this.parentElement.remove(); window.ripsPendentes = window.ripsPendentes.filter(r => r !== '${rip}');" title="Remover">&times;</span>
        `;
        listaRipsInseridos.appendChild(div);
        if (!window.ripsPendentes.includes(rip)) window.ripsPendentes.push(rip);
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
        
        // Converte o objeto de volta para string escapada para remover depois
        const jsonStr = JSON.stringify(dados).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        
        div.innerHTML = `
            <span>✅ Cadastro realizado <span style="font-size: 12px; color: #15803d; font-weight: normal; margin-left: 5px;">(CEP: ${dados.cep})</span></span>
            <span style="cursor: pointer; color: #ef4444;" onclick="this.parentElement.remove(); window.cadastrosPendentes = window.cadastrosPendentes.filter(c => c.cep !== '${dados.cep}' || c.area !== '${dados.area}');" title="Remover">&times;</span>
        `;
        listaCadastrosInseridos.appendChild(div);
        
        const exists = window.cadastrosPendentes.some(c => c.cep === dados.cep && c.area === dados.area);
        if (!exists) window.cadastrosPendentes.push(dados);
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
                rips.forEach(rip => adicionarRipNaLista(rip));
                cadastros.forEach(cad => adicionarCadastroNaLista(cad));
            }
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
                const cbRipsAtivos = Array.from(document.querySelectorAll('.cb-rip:checked')).map(cb => cb.value);
                const cbDispensadosAtivos = Array.from(document.querySelectorAll('.cb-dispensado:checked')).map(cb => cb.value);
                
                try {
                    // 1. Salva na Tabela Indicação
                    const dadosIndicacao = {
                        rips: window.ripsPendentes,
                        cadastros_minimos: window.cadastrosPendentes,
                        conceituacao_rip: cbRipsAtivos,
                        conceituacao_dispensado: cbDispensadosAtivos
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
                    
                    // 2. Sincroniza RIPs com o formDataState do parent
                    if (typeof window.parent.updateField === 'function') {
                        window.parent.updateField('rips', window.ripsPendentes);
                        console.log('📝 [foco-01] formDataState.rips atualizado:', window.parent.formDataState?.rips);
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

});
