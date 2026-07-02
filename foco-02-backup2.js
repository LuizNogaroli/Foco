const fs = require('fs');
let text = fs.readFileSync('foco-02.js', 'utf8');

const search = '    // ============================== Documentos Dinâmicos';
const lastGoodIndex = text.indexOf(search);
const submitSearch = 'form.addEventListener(\'submit\', function (e) {';
const submitIndex = text.indexOf(submitSearch);

if (lastGoodIndex === -1 || submitIndex === -1) {
    console.log('Failed to find indices');
    process.exit(1);
}

// Ensure we find the END of the submit block
let submitEndIndex = text.indexOf('});', submitIndex);
while (submitEndIndex > -1) {
    if (text.substring(submitEndIndex, submitEndIndex + 20).includes('// ====================')) {
        break; // Reached next block? No, just find the right closing tag.
    }
    // We know exactly what the submit block looks like.
    if (text.substring(submitIndex, submitEndIndex + 3).includes('form.reportValidity();')) {
        break;
    }
    submitEndIndex = text.indexOf('});', submitEndIndex + 1);
}
submitEndIndex += 3; // Include '});'

const start = text.substring(0, submitEndIndex);

const correctInterval = `

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
                    if (key === 'rip' || key.match(/^imoveis\\[\\d+\\]\\[rip\\]$/)) {
                        const ripVal = data[key];
                        if (ripVal && !rips.includes(ripVal)) rips.push(ripVal);
                    }
                });
            }

            if (rips.length > 0) {
                document.getElementById('lblPossuiRip').textContent = 'Sim';
                document.getElementById('lblRipNumber').textContent = \`(RIP: \${rips.join(', ')})\`;
                
                // Auto-preencher CEP da Geolocalização (com RIP)
                const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo && !inputCepGeo.value) {
                    if (data['imovel[0][cep]']) {
                        inputCepGeo.value = data['imovel[0][cep]'];
                        // Dispara evento para formatar e buscar no mapa se necessário
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
            } else {
                document.getElementById('lblPossuiRip').textContent = 'Não (Dispensado)';
                document.getElementById('lblRipNumber').textContent = '';

                // Auto-preencher CEP da Geolocalização (Sem RIP)
                const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo && !inputCepGeo.value) {
                    if (data['imovel_sem_rip[0][cep]']) {
                        inputCepGeo.value = data['imovel_sem_rip[0][cep]'];
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
            clearInterval(consolidadoInterval);

        }
    }, 500);
});

`;

let textToSave = start + correctInterval + text.substring(lastGoodIndex);
fs.writeFileSync('foco-02.js', textToSave, 'utf8');
console.log('Restored interval block perfectly!');