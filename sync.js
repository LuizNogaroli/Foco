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
                // Ignora inputs sem nome ou botões
                if (!input.name || input.type === 'submit' || input.type === 'button') return;

                const value = state[input.name];
                if (value !== undefined) {
                    if (input.type === 'checkbox') {
                        if (input.name.endsWith('[]')) {
                            // Se for array, verifica se o valor está no array
                            input.checked = Array.isArray(value) && value.includes(input.value);
                        } else {
                            input.checked = (value === 'true' || value === true || value === input.value);
                        }
                    } else if (input.type === 'radio') {
                        input.checked = (value === input.value);
                    } else {
                        input.value = value;
                    }

                    // Dispara o evento change para rodar lógicas internas da tela (ex: mostrar/ocultar blocos condicionais)
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            // 3. Caso de Somente Leitura (Readonly)
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
            // Recupera os RIPs que foram pesquisados e salvos
            const savedRips = state['_ripsPesquisados'];
            if (savedRips && typeof window.criarBlocoImovel === 'function' && typeof window.adicionarTagRIP === 'function') {
                const container = document.getElementById('imoveis-container');
                const listaTags = document.getElementById('listaRIPsAssociados');
                if (container) container.innerHTML = '';
                if (listaTags) {
                    listaTags.innerHTML = '';
                    listaTags.style.display = 'none';
                }

                // Restaura os objetos globais na página do iframe
                if (typeof window.ripsPesquisados !== 'undefined') {
                    // Limpa e atualiza com os dados salvos
                    for (let key in window.ripsPesquisados) delete window.ripsPesquisados[key];
                    Object.assign(window.ripsPesquisados, savedRips);
                }

                // Cria cada bloco novamente
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
                    // Limpa camadas existentes para evitar duplicações
                    window.drawnItems.clearLayers();
                    
                    // Adiciona os itens ao grupo de desenho
                    L.geoJSON(geojson, {
                        onEachFeature: function(feature, layer) {
                            window.drawnItems.addLayer(layer);
                        }
                    });
                    
                    // Atualiza a interface do mapa (listagem de geometrias, etc.)
                    if (typeof window.atualizarInterface === 'function') {
                        window.atualizarInterface();
                    }

                    // Ajusta o zoom do mapa para enquadrar os elementos desenhados
                    const bounds = window.drawnItems.getBounds();
                    if (bounds.isValid()) {
                        window.map.fitBounds(bounds);
                    }
                } catch (e) {
                    console.error("Erro ao restaurar geometrias no mapa:", e);
                }
            }
        }

        // Preenche com o estado atual imediatamente disponível
        populateForm(window.parent.formDataState);

        // Escuta evento de atualização do banco (caso os dados cheguem depois do carregamento da página)
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'DATABASE_LOADED') {
                populateForm(event.data.data);
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
                    // Para grupos de checkbox com mesmo nome (ex: incidencia_ambiental)
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

            // Caso especial de foco-02.html: salvar também o estado de ripsPesquisados
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
                    // Salva o estado atualizado de ripsPesquisados no parent
                    window.parent.updateField('_ripsPesquisados', window.ripsPesquisados);
                };
            }
        }
    });
})();
