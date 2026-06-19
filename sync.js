// sync.js
// Script injetado nos iframes para sincronizar campos de formulário com o estado central (db.js)

(function() {
    "use strict";

    // Aguarda o DOM estar pronto
    document.addEventListener('DOMContentLoaded', () => {
        // Verifica se o parent tem as funções e estado do banco de dados
        if (!window.parent || !window.parent.formDataState) {
            console.log("ℹ️ db.js não encontrado no parent window. Sincronização inativa.");
            return;
        }

        // Injeta estilos CSS necessários para o carregamento e campos automatizados
        const style = document.createElement('style');
        style.textContent = `
            .auto-loaded-field,
            .auto-loaded-field:disabled {
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

        // Estado inicial do banco e controle de carregamento
        let dbState = window.parent.formDataState || null;
        let isSimulatedLoadFinished = false;

        // Helper para identificar se um campo é de carregamento automático
        function isAutoLoadedInput(input) {
            if (!input.name || input.type === 'submit' || input.type === 'button' || input.type === 'hidden' || input.type === 'file') {
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
        const allInputs = document.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            if (isAutoLoadedInput(input)) {
                input.classList.add('field-loading');
                input.disabled = true;
                
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

        // Função para preencher os campos do formulário atual com o estado central
        function populateForm(state) {
            if (!state) return;

            // 1. Caso especial: foco-02.html (Imóveis dinâmicos)
            if (window.location.pathname.includes('foco-02.html')) {
                restoreFoco02DynamicBlocks(state);
            }

            // 2. Preenche todos os inputs normais do formulário
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.name || input.type === 'submit' || input.type === 'button') return;

                const value = state[input.name];
                if (value !== undefined) {
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

                    // Atualiza o badge para "Sincronizado"
                    const label = findLabelForInput(input);
                    if (label) {
                        let badge = label.querySelector('.badge-auto-load');
                        if (!badge) {
                            badge = document.createElement('span');
                            badge.id = 'badge-' + (input.id || input.name).replace(/[\[\]]/g, '-');
                            label.appendChild(badge);
                        }
                        badge.className = 'badge-auto-load loaded';
                        badge.innerHTML = '✓ Integrado SPUnet';
                    }
                }
            });

            // 3. Caso de Somente Leitura Global (Readonly)
            try {
                const parentParams = new URLSearchParams(window.parent.location.search);
                const isReadonly = parentParams.get('readonly') === 'true';
                if (isReadonly) {
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

            // 4. Caso especial: foco-03.html (Leaflet GeoJSON)
            if (window.location.pathname.includes('foco-03.html')) {
                restoreFoco03MapLayers(state);
            }
        }

        // Restaura blocos dinâmicos do foco-02.html
        function restoreFoco02DynamicBlocks(state) {
            const savedRips = state['_ripsPesquisados'];
            if (savedRips && typeof window.criarBlocoImovel === 'function' && typeof window.adicionarTagRIP === 'function') {
                const container = document.getElementById('imoveis-container');
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
                    window.adicionarTagRIP(rip, dados);
                    window.criarBlocoImovel(rip, dados);
                }
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
        setTimeout(() => {
            isSimulatedLoadFinished = true;
            populateForm(dbState);

            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 400);
        }, 1200);

        // Escuta evento de atualização do banco (caso os dados cheguem depois do carregamento da página)
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'DATABASE_LOADED') {
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

        // Salva o valor de um elemento no estado central
        function saveField(element) {
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

            if (window.location.pathname.includes('foco-02.html') && typeof window.ripsPesquisados !== 'undefined') {
                window.parent.updateField('_ripsPesquisados', window.ripsPesquisados);
            }
        }

        // Sobrescreve a função original de remoção de RIP no foco-02.html para atualizar o banco
        if (window.location.pathname.includes('foco-02.html')) {
            const originalRemoverRIP = window.removerRIP;
            if (typeof originalRemoverRIP === 'function') {
                window.removerRIP = function(rip) {
                    originalRemoverRIP(rip);
                    window.parent.updateField('_ripsPesquisados', window.ripsPesquisados);
                };
            }
        }
    });
})();
