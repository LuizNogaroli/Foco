// foco-02.js
// Compatível com o layout original do foco-02.html

window.toggleRiscos = function() {
    const radios = document.querySelectorAll('input[name="riscos[]"]');
    const hasChecked = Array.from(radios).some(r => r.checked);
    const blocoObs = document.getElementById('bloco-obs-riscos');
    if (blocoObs) {
        blocoObs.style.display = hasChecked ? 'flex' : 'none';
    }
};

window.toggleRestricoes = function() {
    const radios = document.querySelectorAll('input[name="restricoes[]"]');
    const hasChecked = Array.from(radios).some(r => r.checked);
    const blocoObs = document.getElementById('bloco-obs-restricoes');
    if (blocoObs) {
        blocoObs.style.display = hasChecked ? 'flex' : 'none';
    }
};
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form02');
    
    // O container "imoveis-container" não existe na Aba 2, existe apenas o form
    // Então não damos return imediato. 

    // Função de inicialização chamada para cada bloco criado
    function initImóvelBlock(block) {
        const index = block.dataset.index;

        // ============================== Máscara CEP ééééééééééééééééééééééé
        const inputCEP = block.querySelector(`#campo21_${index}`);
        if (inputCEP) {
            inputCEP.addEventListener('input', function (e) {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
                e.target.value = v;
            });
        }

        // ============================== Máscaras moeda e áreas éééééééééééééééééééé
        // Utiliza as classes do motor formulario.js para maquete
        const campoMoeda = block.querySelector(`#campo213_${index}`);
        if (campoMoeda) {
            campoMoeda.classList.add('mask-moeda');
        }
        
        // Inicializa máscaras do motor para o novo bloco
        if (typeof autoInitMasks === 'function') {
            autoInitMasks();
        }
    }

    // Sobrescrevemos a função criarBlocoImóvel original se ela existir
    if (typeof window.criarBlocoImóvel === 'function') {
        const originalCriarBlocoImóvel = window.criarBlocoImóvel;
        window.criarBlocoImóvel = function(rip, dados) {
            originalCriarBlocoImóvel(rip, dados);
            const container = document.getElementById('imoveis-container');
            if (container) {
                const blocks = container.querySelectorAll('.imovel-block');
                const lastBlock = blocks[blocks.length - 1];
                if (lastBlock) {
                    initImóvelBlock(lastBlock);
                }
            }
        };
    }

    // ============================== Envio / Validação ééééééééééééééééééééééé
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (form.checkValidity()) {
            const rootWindow = window.parent?.parent || window.parent || window;
            // O motor sync.js cuidará do salvamento na tabela intermediária (foco_drafts)
            alert('☑ Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...');
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-03.html"]');
            if (btnTabNext) {
                setTimeout(() => btnTabNext.click(), 100);
            }
        } else {
            form.reportValidity();
        }
    });

    // ============================== Sincronizar Dados Consolidados da Aba 1 ==============================
    let consolidadoInterval = setInterval(() => {
        if (window.parent && window.parent.formDataState && Object.keys(window.parent.formDataState).length > 0) {
            const data = window.parent.formDataState;
            
            // Dicionário de formatação de Conceituação
            const mapConceituacao = {
                'terreno_marinha': 'Terreno de marinha e acrescido',
                'terreno_nacional_interior': 'Terreno Nacional Interior',
                'imovel_dominio_uniao': 'Imóvel de Domínio da União',
                'gleba_assentamento': 'Gleba destinada a assentamento',
                'ilha_oceanica': 'Ilha oceânica ou costeira',
                'ilha_fluvial': 'Ilha fluvial ou lacustre',
                'espelho_dagua': 'Espelho d’água',
                'cavidades_naturais': 'Cavidades naturais subterrâneas',
                'manguezal': 'Manguezal',
                'praia_mar': 'Praia marítima',
                'praia_rio': 'Praia fluvial ou lacustre'
            };

            // Conceituação
            let conceituacoes = data['conceituacao[]'];
            if (!conceituacoes) {
                document.getElementById('lblConceituacao').textContent = 'Não informada';
            } else {
                if (Array.isArray(conceituacoes)) {
                    document.getElementById('lblConceituacao').textContent = conceituacoes.map(c => mapConceituacao[c] || c).join(', ');
                } else {
                    document.getElementById('lblConceituacao').textContent = mapConceituacao[conceituacoes] || conceituacoes;
                }
            }

            // Nova lógica: Lê diretamente de rip, lista_rips ou _ripsPesquisados
            let rips = [];
            if ('lista_rips' in data && data.lista_rips && data.lista_rips.trim() !== '') {
                rips = data.lista_rips.split(',').map(r => r.trim()).filter(r => r);
            } else if (data._ripsPesquisados) {
                rips = Object.keys(data._ripsPesquisados);
            } else {
                Object.keys(data).forEach(key => {
                    if (key === 'rip' || key.match(/^imoveis\[\d+\]\[rip\]$/)) {
                        const ripVal = data[key];
                        if (ripVal && !rips.includes(ripVal)) rips.push(ripVal);
                    }
                });
            }

            if (rips.length > 0) {
                document.getElementById('lblPossuiRip').textContent = 'Sim';
                document.getElementById('lblRipNumber').textContent = `(RIP: ${rips.join(', ')})`;
                
                // Auto-preencher CEP da Geolocalização (com RIP)
                const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo) {
                    // O CEP pode vir de vários campos ou já estar preenchido pelo sync.js
                    let cepVal = data['cep'] || data['imovel[0][cep]'] || data.cep_imovel || inputCepGeo.value;
                    if (cepVal && !inputCepGeo.readOnly) { // Só aplica se não estiver travado (evita loops)
                        inputCepGeo.value = cepVal;
                        inputCepGeo.readOnly = true;
                        inputCepGeo.style.backgroundColor = '#e9ecef';
                        inputCepGeo.style.cursor = 'not-allowed';
                        // Dispara evento UMA VEZ
                        inputCepGeo.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                }
            } else {
                document.getElementById('lblPossuiRip').textContent = 'Não (Dispensado)';
                document.getElementById('lblRipNumber').textContent = '';

                // Auto-preencher CEP da Geolocalização (Sem RIP)
                const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo && !inputCepGeo.value) {
                    if (data['imovel_sem_rip[0][cep]']) {
                        inputCepGeo.value = data['imovel_sem_rip[0][cep]']; inputCepGeo.readOnly = true; inputCepGeo.style.backgroundColor = '#e9ecef'; inputCepGeo.style.cursor = 'not-allowed';
                        inputCepGeo.dispatchEvent(new Event('input', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('change', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('blur', { bubbles: true }));
                    } else if (data.cep_imovel) {
                        inputCepGeo.value = data.cep_imovel;
                        inputCepGeo.dispatchEvent(new Event('input', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('change', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                }
            }

            // Limpa o interval pois os dados já foram carregados
            
            
            // ========================= MOCK DATA AUTO-FILL =========================
            // Isso garante que a Matrícula e outros campos que a senhora viu continuem preenchendo sozinhos
            
            // Matrícula
            const checksMatricula = document.querySelectorAll('input[name="tem_matricula"]');
            if (checksMatricula.length > 0) {
                checksMatricula[0].checked = true; // Sim
                const inputCartorio = document.getElementById('cartorio');
                const inputMatricula = document.getElementById('num_matricula');
                if (inputCartorio) {
                    if (!inputCartorio.value) inputCartorio.value = '1º Ofício de Registro de Imóveis';
                    inputCartorio.readOnly = true;
                    inputCartorio.style.backgroundColor = '#e9ecef';
                    inputCartorio.style.cursor = 'not-allowed';
                }
                if (inputMatricula) {
                    if (!inputMatricula.value) inputMatricula.value = '1231';
                    inputMatricula.readOnly = true;
                    inputMatricula.style.backgroundColor = '#e9ecef';
                    inputMatricula.style.cursor = 'not-allowed';
                }
            }

            // Município
            const ufSelect = document.getElementById('uf');
            if (ufSelect && !ufSelect.value) {
                ufSelect.value = 'DF';
                ufSelect.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(() => {
                    const munSelect = document.getElementById('municipio');
                    if (munSelect) {
                        munSelect.value = 'Brasília';
                        munSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }, 300);
            }

            // Restrições e Riscos
            const checksRestricoes = document.querySelectorAll('input[name="restricoes_verificadas"]');
            if (checksRestricoes.length > 0) {
                checksRestricoes.forEach(c => {
                    if (c.value === 'Ambiental' || c.value === 'Patrimônio Histórico') {
                        c.checked = true;
                    }
                });
            }

            clearInterval(consolidadoInterval);

        }
    }, 500);
});

    // ============================== Documentos Dinâmicos ééééééééééééééééééééééé
    if (typeof window.inicializarListaDocumentosDinamica === 'function') {
        window.inicializarListaDocumentosDinamica('aba2_avaliação', 'btnAdicionarDocumentoAvaliacao', 'documentos-list-avaliação');
    }

    // ============================== Limpar éééééééééééééééééééééééééééééé
    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja limpar todos os campos?')) {
                window.location.reload();
            }
        });
    }

// ========================= FIELD LOCKER =========================
// Garante que campos preenchidos por rotinas automáticas fiquem travados, mesmo ao recarregar a aba
document.addEventListener('change', (e) => {
    const id = e.target.id;
    if (id === 'latitude' || id === 'longitude' || id === 'cartorio' || id === 'num_matricula') {
        if (e.target.value && e.target.value !== 'ASas' && e.target.value !== 'A') {
            e.target.readOnly = true;
            e.target.style.backgroundColor = '#e9ecef';
            e.target.style.cursor = 'not-allowed';
        }
    }
});
// ================================================================

