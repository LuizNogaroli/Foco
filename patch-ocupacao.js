const fs = require('fs');

let f2 = fs.readFileSync('foco-02.js', 'utf8');

const targetStr = "// Limpa o interval pois os dados já foram carregados";

const ocupacaoLogic = `
            // 3. OCUPAÇÃO
            const mockSituacaoOcupacional = getFieldFromLowestRip('situacao_ocupacional');
            const mockTempoDesocupacao = getFieldFromLowestRip('tempo_desocupacao');
            const mockDataOcupacao = getFieldFromLowestRip('data_ocupacao') || getFieldFromLowestRip('data_conhecimento_ocupacao');
            const mockObsOcupado = getFieldFromLowestRip('obs_ocupado') || getFieldFromLowestRip('observacoes_ocupacao');

            const radiosSituacao = document.querySelectorAll('input[name="situacao_ocupacional"]');
            
            if (radiosSituacao.length > 0) {
                // Bloqueia as opções porque a origem é a API
                radiosSituacao.forEach(r => {
                    r.disabled = true;
                    if (mockSituacaoOcupacional && r.value.toLowerCase() === mockSituacaoOcupacional.trim().toLowerCase()) {
                        r.checked = true;
                    }
                });

                if (typeof toggleOcupacao === 'function') {
                    toggleOcupacao(); // Dispara a exibição dos blocos corretos
                } else if (window.toggleOcupacao) {
                    window.toggleOcupacao();
                }

                // Elementos dos sub-blocos
                const inputTempoDesoc = document.getElementById('tempo_desocupacao');
                const inputDataOcup = document.getElementById('data_ocupacao');
                const inputObsOcup = document.getElementById('obs_ocupado');

                const formGrp = radiosSituacao[0].closest('.form-group');
                const labelOcupacao = formGrp ? formGrp.querySelector('label') : null;

                if (!mockSituacaoOcupacional) {
                    // Sem informação de ocupação na base: aplica hint ao grupo
                    if (labelOcupacao) {
                        labelOcupacao.style.backgroundColor = '#fff3cd';
                        labelOcupacao.style.padding = '4px 8px';
                        labelOcupacao.style.borderRadius = '4px';
                        labelOcupacao.style.display = 'inline-block';
                        if (!labelOcupacao.querySelector('.hint-icon')) {
                            labelOcupacao.innerHTML += ' <span class="hint-icon" title="Dado ausente na base oficial. Se tiver o dado e desejar atualizá-lo, use o campo de Observações." style="cursor:help;">ℹ️</span>';
                        }
                    }
                    
                    // Bloqueia e aplica hint aos campos filhos (mesmo que escondidos)
                    setHint(inputTempoDesoc, '');
                    setHint(inputDataOcup, '');
                    setHint(inputObsOcup, '');
                } else {
                    // Tem situação ocupacional. Aplica hint nos sub-campos de acordo com a seleção
                    const blocoDesocupado = document.getElementById('bloco-desocupado');
                    const blocoOcupado = document.getElementById('bloco-ocupado');

                    // Note: setHint expects empty value to trigger yellow hint
                    if (blocoDesocupado && blocoDesocupado.style.display !== 'none') {
                        setHint(inputTempoDesoc, mockTempoDesocupacao);
                    }
                    if (blocoOcupado && blocoOcupado.style.display !== 'none') {
                        setHint(inputDataOcup, mockDataOcupacao);
                        setHint(inputObsOcup, mockObsOcupado);
                    }
                }
            }

            // Limpa o interval pois os dados já foram carregados`;

if (f2.includes('// 3. OCUPAÇÃO')) {
    console.log('Already patched.');
} else {
    f2 = f2.replace(targetStr, ocupacaoLogic);
    fs.writeFileSync('foco-02.js', f2);
    console.log('Ocupacao patched.');
}
