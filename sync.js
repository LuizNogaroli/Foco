// sync.js
// Script injetado nos iframes para sincronizar campos de formulário com o estado central (db.js)

(function() {
    "use strict";

    console.log("🚩 [sync.js] Script carregado e executando.");

    // Aguarda o DOM estar pronto
    document.addEventListener('DOMContentLoaded', () => {
        console.log("🚩 [sync.js] DOMContentLoaded disparado.");

        // Estado inicial do banco e controle de carregamento
        let dbState = {};
        if (window.parent && window.parent.formDataState) {
            console.log("🌱 [sync.js] Estado encontrado imediatamente. Keys:", Object.keys(window.parent.formDataState));
            console.log("🌱 [sync.js] formDataState.rips:", window.parent.formDataState['rips']);
            console.log("🌱 [sync.js] formDataState._ripsPesquisados:", window.parent.formDataState['_ripsPesquisados']);
            dbState = window.parent.formDataState;
        } else {
            console.log("🌱 [sync.js] Estado ainda não disponível, aguardando DATABASE_LOADED.");
        }
        let isSimulatedLoadFinished = false;

        // Injeta estilos CSS necessários para o carregamento e campos automatizados
        const style = document.createElement('style');
        style.textContent = `
            .auto-loaded-field,
            .auto-loaded-field:disabled,
            input[readonly],
            textarea[readonly],
            input[disabled],
            select[disabled],
            textarea[disabled] {
                background-color: #f1f5f9 !important;
                border: 1px solid #cbd5e1 !important;
                color: #334155 !important;
                border-radius: 4px !important;
                padding: 4px 8px !important;
                font-weight: 500 !important;
                cursor: not-allowed !important;
                opacity: 1 !important;
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }
            @keyframes sync-pulse {
                0%, 100% { background-color: #f1f5f9; }
                50% { background-color: #cbd5e1; }
            }
            .field-loading {
                background-color: #f1f5f9 !important;
                color: transparent !important;
                animation: sync-pulse 1.2s infinite ease-in-out !important;
                cursor: wait !important;
            }
            .badge-auto-load {
                display: inline-block;
                font-size: 0.7rem;
                font-weight: 700;
                padding: 2px 6px;
                border-radius: 4px;
                margin-left: 8px;
                vertical-align: middle;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                transition: all 0.3s ease;
            }
            .badge-auto-load.loading {
                background-color: #f1f5f9;
                color: #64748b;
                border: 1px dashed #cbd5e1;
            }
            .badge-auto-load.loaded {
                background-color: #dcfce7;
                color: #15803d;
                border: 1px solid #bbf7d0;
            }
            @keyframes sync-spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        console.log("🚩 [sync.js] Estilos CSS injetados.");

        // Cria e injeta o overlay de "Carregando dados..."
        const loader = document.createElement('div');
        loader.id = 'sync-loading-overlay';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: opacity 0.4s ease;
        `;
        loader.innerHTML = `
            <div style="width: 50px; height: 50px; border: 4px solid #f1f5f9; border-top-color: #1e3a5f; border-left-color: #2e7d32; border-radius: 50%; animation: sync-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; margin-bottom: 20px;"></div>
            <div style="font-weight: 800; color: #1e3a5f; font-size: 1.25rem; letter-spacing: -0.025em; display: flex; align-items: center; gap: 8px;">
                Carregando dados...
            </div>
            <div style="font-size: 0.88rem; color: #64748b; margin-top: 8px; font-weight: 500; text-align: center; max-width: 320px; line-height: 1.4;">
                Buscando e conferindo informações nas bases integradas do <strong>SPUnet</strong>
            </div>
        `;
        document.body.appendChild(loader);
        console.log("🚩 [sync.js] Overlay de carregamento inserido.");

        // dbState e isSimulatedLoadFinished já foram declarados no início.

        // Helper para identificar se um campo é de carregamento automático
        function isAutoLoadedInput(input) {
            if (!input.name || input.type === 'submit' || input.type === 'button' || input.type === 'hidden' || input.type === 'file') {
                return false;
            }
            // Não bloquear inputs dentro do modal de Cadastro Mínimo
            if (input.closest('#modalCadastroMinimo')) {
                return false;
            }
            return input.closest('.editavel') === null;
        }

        // Helper para encontrar a label correspondente a um campo
        function findLabelForInput(input) {
            if (input.id) {
                const label = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
                if (label) return label;
            }
            const parentLabel = input.closest('label');
            if (parentLabel) return parentLabel;
            
            const parent = input.parentNode;
            if (parent) {
                const label = parent.querySelector('label');
                if (label) return label;
            }
            return null;
        }

        // Configura o visual de carregamento inicial para todos os campos auto-carregados estáticos
        console.log("🚩 [sync.js] Inicializando visual de carregamento nos campos estáticos...");
        const allInputs = document.querySelectorAll('input, select, textarea');
        let loadingFieldsCount = 0;
        allInputs.forEach(input => {
            if (isAutoLoadedInput(input)) {
                loadingFieldsCount++;
                input.classList.add('field-loading');
                input.disabled = true;
                
                // Exibe "Carregando dados..." dentro do campo
                if (input.tagName === 'INPUT' && (input.type === 'text' || input.type === 'number' || input.type === 'tel' || !input.type)) {
                    input.setAttribute('data-default-value', input.value || '');
                    input.value = "Carregando dados...";
                } else if (input.tagName === 'TEXTAREA') {
                    input.setAttribute('data-default-value', input.value || '');
                    input.value = "Carregando dados...";
                } else if (input.tagName === 'SELECT') {
                    const opt = document.createElement('option');
                    opt.className = 'temp-loading-option';
                    opt.value = '';
                    opt.text = 'Carregando dados...';
                    opt.selected = true;
                    input.insertBefore(opt, input.firstChild);
                }

                // Adiciona o badge "Sincronizando..." no label
                const label = findLabelForInput(input);
                if (label) {
                    const existingBadge = label.querySelector('.badge-auto-load');
                    if (existingBadge) existingBadge.remove();

                    const badge = document.createElement('span');
                    badge.className = 'badge-auto-load loading';
                    badge.id = 'badge-' + (input.id || input.name).replace(/[\[\]]/g, '-');
                    badge.innerHTML = '⏳ Sincronizando...';
                    label.appendChild(badge);
                }
            }
        });
        console.log(`🚩 [sync.js] ${loadingFieldsCount} campos estáticos colocados em estado de carregamento.`);

        // Helper: verifica se a página atual corresponde a um nome (com ou sem .html)
        function isCurrentPage(name) {
            return new RegExp('/' + name + '(\\.html)?$').test(window.location.pathname);
        }

        // Função para preencher os campos do formulário atual com o estado central
        async function populateForm(state) {
            console.log("🚩 [sync.js] populateForm chamado. Estado:", state);
            if (!state) return;

            // 1. Caso especial: foco-02 (Imóveis dinâmicos)
            console.log('📝 [sync.js] pathname:', window.location.pathname, 'isAba2:', isCurrentPage('foco-02'));
            if (isCurrentPage('foco-02')) {
                console.log("🚩 [sync.js] foco-02 detectado. Restaurando blocos dinâmicos.");
                await restoreFoco02DynamicBlocks(state);
            }

            // 2. Preenche todos os inputs normais do formulário
            console.log("🚩 [sync.js] Populando valores nos campos do formulário...");
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.name || input.type === 'submit' || input.type === 'button') return;

                // Limpa o estado temporário de "Carregando dados..."
                if (isAutoLoadedInput(input)) {
                    if (input.value === 'Carregando dados...') {
                        input.value = input.getAttribute('data-default-value') || '';
                    }
                    if (input.tagName === 'SELECT') {
                        const tempOpt = input.querySelector('.temp-loading-option');
                        if (tempOpt) tempOpt.remove();
                    }
                }

                
                // IGNORAR CHECKBOX DE CONCEITUAÇÃO
                if (input.name === 'conceituacao[]' || input.name === 'conceituacao_rip[]' || input.name === 'conceituacao_dispensado[]') {
                    return;
                }

                const value = state[input.name];
                if (value !== undefined) {
                    console.log(`🚩 [sync.js] Populando campo: id="${input.id}", name="${input.name}" com valor:`, value);
                    if (input.type === 'checkbox') {
                        if (input.name.endsWith('[]')) {
                            input.checked = Array.isArray(value) && value.includes(input.value);
                        } else {
                            input.checked = (value === 'true' || value === true || value === input.value);
                        }
                    } else if (input.type === 'radio') {
                        input.checked = (value === input.value);
                    } else {
                        input.value = value;
                    }

                    // Dispara o evento change para rodar lógicas internas da tela
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Configura estilo final pós-carregamento para campos auto-carregados (inclusive dinâmicos)
                if (isAutoLoadedInput(input)) {
                    input.classList.remove('field-loading');
                    input.classList.add('auto-loaded-field');
                    
                    // Bloqueia edição manual
                    if (input.tagName === 'SELECT' || input.type === 'radio' || input.type === 'checkbox') {
                        input.disabled = true;
                    } else {
                        input.readOnly = true;
                        input.disabled = false;
                    }

                    // Remove o badge de sincronização após carregado
                    const label = findLabelForInput(input);
                    if (label) {
                        const badge = label.querySelector('.badge-auto-load');
                        if (badge) {
                            badge.remove();
                        }
                    }
                }
            });

            // Força atualização da visibilidade dos blocos após popular
            if (typeof window.verificarConceituacao === 'function') {
                window.verificarConceituacao();
            }

            // 3. Caso de Somente Leitura Global (Readonly)
            try {
                const parentParams = new URLSearchParams(window.parent.location.search);
                const isReadonly = parentParams.get('readonly') === 'true';
                if (isReadonly) {
                    console.log("🚩 [sync.js] Modo Somente Leitura ativado.");
                    inputs.forEach(input => {
                        input.disabled = true;
                    });
                    
                    const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], .btn-remove-imovel, .btn-remove-rip');
                    buttons.forEach(btn => {
                        if (btn.id !== 'expand-map' && btn.id !== 'btnImprimir') {
                            btn.disabled = true;
                            btn.style.opacity = '0.5';
                            btn.style.cursor = 'not-allowed';
                            btn.onclick = null;
                        }
                    });
                }
            } catch (err) {
                console.error("Erro ao aplicar somente leitura:", err);
            }

            // 4. Caso especial: foco-03.html (Leaflet GeoJSON e CEP de RIP)
            if (window.location.pathname.includes('foco-03.html')) {
                console.log("🚩 [sync.js] foco-03.html detectado. Restaurando poligonais do mapa.");
                restoreFoco03MapLayers(state);
                
                const cepInput = document.getElementById('cep');
                if (cepInput && !cepInput.value) {
                    const savedRips = state['_ripsPesquisados'];
                    if (savedRips) {
                        const firstRipKey = Object.keys(savedRips)[0];
                        if (firstRipKey && savedRips[firstRipKey].cep) {
                            console.log("🚩 [sync.js] Preenchendo CEP da Aba 3 a partir do RIP:", savedRips[firstRipKey].cep);
                            cepInput.value = savedRips[firstRipKey].cep;
                            cepInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
            }

            // 5. Caso especial: foco-06.html (Área e Valor total do imóvel vindos do RIP)
            if (window.location.pathname.includes('foco-06.html')) {
                const areaInput = document.getElementById('area_total_imovel');
                const valorInput = document.getElementById('valor_total_imovel');
                const savedRips = state['_ripsPesquisados'];
                if (savedRips) {
                    const firstRipKey = Object.keys(savedRips)[0];
                    if (firstRipKey) {
                        const ripData = savedRips[firstRipKey];
                        if (areaInput && !areaInput.value && ripData.area_total) {
                            console.log("🚩 [sync.js] Preenchendo Área total da Aba 6 a partir do RIP:", ripData.area_total);
                            areaInput.value = ripData.area_total;
                            areaInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (valorInput && !valorInput.value && ripData.valor_imovel) {
                            console.log("🚩 [sync.js] Preenchendo Valor total da Aba 6 a partir do RIP:", ripData.valor_imovel);
                            valorInput.value = ripData.valor_imovel;
                            valorInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
            }
        }

        async function restoreFoco02DynamicBlocks(state) {
            console.log('📝 [sync.js] restoreFoco02DynamicBlocks state keys:', Object.keys(state || {}));
            console.log('📝 [sync.js] state._ripsPesquisados:', state?.['_ripsPesquisados']);
            console.log('📝 [sync.js] state.rips:', state?.['rips']);
            let savedRips = state['_ripsPesquisados'];

            // Sempre mescla RIPs do array flat 'rips' (salvo pelo foco-01.js via updateField)
            // com os _ripsPesquisados existentes. Resolve o caso de RIPs adicionados na Aba 1
            // que ainda não foram persistidos em _ripsPesquisados.
            const rawRips = state['rips'] || state['ripsPendentes'] || [];
            console.log('📝 [sync.js] rawRips extraído:', rawRips);
            const ripArray = Array.isArray(rawRips) ? rawRips :
                             (typeof rawRips === 'string' ? rawRips.split(',').map(r => r.trim()).filter(Boolean) : []);

            if (ripArray.length > 0) {
                if (!savedRips || Object.keys(savedRips).length === 0) savedRips = {};

                // Se a Aba 1 informou explicitamente a lista de RIPs, ela é a fonte da verdade.
                // Remove RIPs antigos que já não constam mais no array flat.
                Object.keys(savedRips).forEach(key => {
                    if (!ripArray.includes(key)) {
                        delete savedRips[key];
                    }
                });

                ripArray.forEach(rip => {
                    if (rip && !savedRips[rip]) {
                        savedRips[rip] = {
                            rip: rip,
                            natureza: '',
                            descricao: 'Imóvel ' + rip,
                            municipio: state['municipio'] || '',
                            uf: state['uf'] || '',
                            cep: '',
                            endereco: '',
                            area_total: '',
                        };
                    }
                });
            }

            console.log("🚩 [sync.js] RIPs para restaurar na Aba 2:", savedRips);
            if (savedRips && Object.keys(savedRips).length > 0 && typeof window.criarBlocoImovel === 'function' && typeof window.adicionarTagRIP === 'function') {
                const container = document.getElementById('accordion-indicacoes');
                const listaTags = document.getElementById('listaRIPsAssociados');
                if (container) container.innerHTML = '';
                if (listaTags) {
                    listaTags.innerHTML = '';
                    listaTags.style.display = 'none';
                }

                if (typeof window.ripsPesquisados !== 'undefined') {
                    for (let key in window.ripsPesquisados) delete window.ripsPesquisados[key];
                    Object.assign(window.ripsPesquisados, savedRips);
                }

                for (let rip in savedRips) {
                    const dados = savedRips[rip];
                    console.log("🚩 [sync.js] Recriando bloco para RIP:", rip);
                    window.adicionarTagRIP(rip, dados);
                    window.criarBlocoImovel(rip, dados);
                    // Após criar o bloco, busca dados do SPU e preenche/tranca campos
                    if (typeof window.carregarCamposRIP === 'function') {
                        await window.carregarCamposRIP(rip);
                    }
                }
            } else {
                console.log("🚩 [sync.js] Nenhum RIP encontrado para restaurar na Aba 2.");
            }
        }

        // Restaura as poligonais desenhadas no mapa no foco-03.html
        function restoreFoco03MapLayers(state) {
            const geojsonStr = state['geojson'];
            if (geojsonStr && typeof window.map !== 'undefined' && typeof window.drawnItems !== 'undefined') {
                try {
                    const geojson = JSON.parse(geojsonStr);
                    window.drawnItems.clearLayers();
                    
                    L.geoJSON(geojson, {
                        onEachFeature: function(feature, layer) {
                            window.drawnItems.addLayer(layer);
                        }
                    });
                    
                    if (typeof window.atualizarInterface === 'function') {
                        window.atualizarInterface();
                    }

                    const bounds = window.drawnItems.getBounds();
                    if (bounds.isValid()) {
                        window.map.fitBounds(bounds);
                    }
                } catch (e) {
                    console.error("Erro ao restaurar geometrias no mapa:", e);
                }
            }
        }

        // Remove o loader após simular 1.2 segundos de busca de dados
        console.log("🚩 [sync.js] Iniciando temporizador de 1.2 segundos...");
        setTimeout(() => {
            console.log("🚩 [sync.js] Temporizador esgotado. Populando formulário e ocultando overlay.");
            isSimulatedLoadFinished = true;
            
            // Fallback robusto: se o db.js recriou o objeto e perdemos o postMessage por milissegundos
            if (window.parent && window.parent.formDataState && Object.keys(window.parent.formDataState).length > 0) {
                dbState = window.parent.formDataState;
            }
            
            populateForm(dbState);

            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                    console.log("🚩 [sync.js] Overlay removido do DOM.");
                }
            }, 400);
        }, 1200);

        // Escuta evento de atualização do banco (caso os dados cheguem depois do carregamento da página)
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'DATABASE_LOADED') {
                console.log("🚩 [sync.js] Mensagem DATABASE_LOADED recebida.", event.data.data);
                dbState = event.data.data;
                if (isSimulatedLoadFinished) {
                    populateForm(dbState);
                }
            }
        });

        // Escuta qualquer digitação ou alteração de campo e salva imediatamente no banco de dados
        document.addEventListener('input', (e) => {
            const target = e.target;
            if (target.name) {
                saveField(target);
            }
        });

        document.addEventListener('change', (e) => {
            const target = e.target;
            if (target.name) {
                saveField(target);
            }
        });

        // Força salvar TODOS os campos ao submeter o formulário (garante que campos intocados com value padrão sejam salvos)
        document.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("🔥 [sync.js] Form submetido. Forçando salvamento de todos os campos (com filtro para Aba 2).");
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.name && input.type !== 'submit' && input.type !== 'button') {
                    // REGRA DE NEGÓCIO ABA 2: Só salva campos modificados/preenchidos pelo usuário
                    if (isCurrentPage('foco-02')) {
                        if (input.hasAttribute('readonly') || input.disabled) {
                            return;
                        }
                    }
                    saveField(input);
                }
            });

            // ==========================================
            // BLOQUEIO BASEADO NO WORKFLOW (STATUS E PERFIL)
            // ==========================================
            if (window.parent && window.parent.formDataState) {
                const fd = window.parent.formDataState;
                const estadoFluxo = fd.status_flow || '';
                const perfilEsperado = fd.perfil || 'Todos';
                const perfilAtual = localStorage.getItem('CURRENT_USER_PROFILE') || 'ALL';
                
                let abaEditavel = false;
                
                // Mapeia abas para Instâncias
                if (isCurrentPage('foco-01')) {
                    abaEditavel = (estadoFluxo === 'Painel de Requerimentos' || estadoFluxo === 'Admissibilidade');
                } else if (isCurrentPage('foco-02')) {
                    abaEditavel = (estadoFluxo === 'Caracterização');
                } else if (isCurrentPage('foco-03')) {
                    abaEditavel = (estadoFluxo === 'Destinação');
                }
                
                let perfilAutorizado = true;
                if (perfilEsperado && perfilEsperado !== 'Todos' && perfilEsperado !== 'Indefinido') {
                    if (perfilAtual !== 'ALL' && perfilAtual !== perfilEsperado && perfilAtual !== 'Admin') {
                        perfilAutorizado = false;
                    }
                }
                
                if (!abaEditavel || !perfilAutorizado) {
                    // Trava o formulário
                    document.querySelectorAll('input, select, textarea, button').forEach(el => {
                        if (!el.classList.contains('nav-btn') && !el.closest('.navbar')) {
                            el.disabled = true;
                        }
                    });
                    
                    // Exibir banner de aviso se ainda não existir
                    if (!document.getElementById('banner-lock-workflow')) {
                        const banner = document.createElement('div');
                        banner.id = 'banner-lock-workflow';
                        banner.style.backgroundColor = '#fef3c7';
                        banner.style.color = '#92400e';
                        banner.style.padding = '10px';
                        banner.style.textAlign = 'center';
                        banner.style.fontWeight = 'bold';
                        banner.style.marginBottom = '15px';
                        banner.style.borderRadius = '4px';
                        banner.style.border = '1px solid #f59e0b';
                        
                        let msg = `Modo Somente Leitura. `;
                        if (!abaEditavel) {
                            msg += `O processo encontra-se na instância: ${estadoFluxo}. `;
                        } else if (!perfilAutorizado) {
                            msg += `Apenas o perfil '${perfilEsperado}' pode editar. (Seu perfil: ${perfilAtual}).`;
                        }
                        
                        banner.innerHTML = msg;
                        document.body.insertBefore(banner, document.body.firstChild);
                    }
                }
            }
            
            // Regras de transição de status_flow de acordo com a aba
            if (window.parent && window.parent.formDataState) {
                const uf = window.parent.formDataState.uf || '-';
                const basePrefix = uf !== '-' ? 'SPU/' + uf : 'SPU/BR';
                
                if (isCurrentPage('foco-01')) {
                    window.parent.updateField('status_flow', basePrefix + ' - Caracterização');
                } else if (isCurrentPage('foco-02')) {
                    window.parent.updateField('status_flow', basePrefix + ' - Destinação');
                } else if (isCurrentPage('foco-03')) {
                    window.parent.updateField('status_flow', basePrefix + ' - Superintendência');
                }
            }

            // Força o envio pro banco imediatamente após o sweep
            if (window.parent && typeof window.parent.forceSaveDraft === 'function') {
                await window.parent.forceSaveDraft();
            }

            // Aba 3: também salva na tabela foco_final
            if (isCurrentPage('foco-03') && window.parent && typeof window.parent.saveToFinal === 'function') {
                await window.parent.saveToFinal();
            }

            // Aba 3: atualiza status para "Aguardando deliberação SPU/XX"
            if (isCurrentPage('foco-03') && window.parent && typeof window.parent.updateStatusFluxo === 'function') {
                const uf = window.parent.formDataState.uf || 'BR';
                const processId = localStorage.getItem('CURRENT_PROCESS_ID');
                if (processId) {
                    await window.parent.updateStatusFluxo(processId, 5); // ID 5: Validação Chefia
                }
            }

            // Navega para próxima aba SOMENTE após o save completo
            var nextTabMap = { 'foco-01': 'foco-02.html', 'foco-02': 'foco-03.html', 'foco-03': 'deliberacao-spu-uf.html' };
            var currentTab = '';
            if (isCurrentPage('foco-01')) currentTab = 'foco-01';
            else if (isCurrentPage('foco-02')) currentTab = 'foco-02';
            else if (isCurrentPage('foco-03')) currentTab = 'foco-03';
            else if (isCurrentPage('foco-04')) currentTab = 'foco-04';
            else if (isCurrentPage('foco-05')) currentTab = 'foco-05';
            else if (isCurrentPage('foco-06')) currentTab = 'foco-06';
            var nextUrl = nextTabMap[currentTab];
            if (nextUrl) {
                var rootWindow = window.parent?.parent || window.parent || window;
                var btnTabNext = rootWindow.document?.querySelector('button[data-url="' + nextUrl + '"]');
                if (btnTabNext) {
                    btnTabNext.click();
                }
            }
        });

        // Salva o valor de um elemento no estado central
        function saveField(element) {
            console.log(`🚩 [sync.js] Salvando campo: name="${element.name}"`);
            if (element.type === 'checkbox') {
                if (element.name.endsWith('[]')) {
                    const checkedElements = document.querySelectorAll(`input[name="${CSS.escape(element.name)}"]:checked`);
                    const values = Array.from(checkedElements).map(el => el.value);
                    window.parent.updateField(element.name, values);
                } else {
                    window.parent.updateField(element.name, element.checked ? element.value : '');
                }
            } else if (element.type === 'radio') {
                if (element.checked) {
                    window.parent.updateField(element.name, element.value);
                }
            } else {
                window.parent.updateField(element.name, element.value);
            }

            if (isCurrentPage('foco-02') && typeof window.ripsPesquisados !== 'undefined') {
                window.parent.updateField('_ripsPesquisados', window.ripsPesquisados);
            }
        }

        // Sobrescreve a função original de remoção de RIP no foco-02 para atualizar o banco
        if (isCurrentPage('foco-02')) {
            const originalRemoverRIP = window.removerRIP;
            if (typeof originalRemoverRIP === 'function') {
                window.removerRIP = function(rip) {
                    console.log("🚩 [sync.js] removerRIP chamado para RIP:", rip);
                    originalRemoverRIP(rip);
                    window.parent.updateField('_ripsPesquisados', window.ripsPesquisados);
                };
            }
        }

        // Verifica banners de devolução se aplicável
        if (window.parent && typeof window.parent.verificarDevolucaoSupabase === 'function') {
            window.parent.verificarDevolucaoSupabase(document);
        }
    });
})();
