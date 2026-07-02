const fs = require('fs');

let f2 = fs.readFileSync('foco-02.js', 'utf8');

const newLogic = `
            // ==========================================
            // AUTO-PREENCHIMENTO COM HINT DA ABA 1
            // ==========================================
            const setHint = (input, val) => {
                if (!input) return;
                input.value = val || '';
                input.readOnly = true;
                input.style.backgroundColor = val ? '#e9ecef' : '#fff3cd';
                input.style.borderColor = val ? '#ced4da' : '#ffe69c';
                
                // Apply hint icon
                if (!val) {
                    if (!input.nextElementSibling || input.nextElementSibling.className !== 'hint-icon') {
                        const hint = document.createElement('span');
                        hint.className = 'hint-icon';
                        hint.title = 'Dado ausente na base oficial. Se tiver o dado e desejar atualizá-lo, use o campo de Observações.';
                        hint.innerHTML = 'ℹ️';
                        hint.style.position = 'absolute';
                        hint.style.right = '10px';
                        hint.style.top = '34px';
                        hint.style.cursor = 'help';
                        input.parentNode.style.position = 'relative';
                        input.parentNode.appendChild(hint);
                    }
                }
            };

            // Identify lowest RIP to fetch its properties
            let lowestRip = rips.length > 0 ? rips.slice().sort((a,b) => Number(a)-Number(b))[0] : null;
            
            // Helper to get a field from the lowest RIP safely
            const getFieldFromLowestRip = (fieldName) => {
                if (!lowestRip) return '';
                if (data._ripsPesquisados && data._ripsPesquisados[lowestRip] && data._ripsPesquisados[lowestRip][fieldName]) {
                    return data._ripsPesquisados[lowestRip][fieldName];
                }
                for (let k of Object.keys(data)) {
                    if (k.match(/^imoveis\\[\\d+\\]\\[rip\\]$/) && data[k] === lowestRip) {
                        const idx = k.match(/^imoveis\\[(\\d+)\\]\\[rip\\]$/)[1];
                        return data[\`imoveis[\${idx}][\${fieldName}]\`] || '';
                    }
                }
                return '';
            };

            // 1. MATRÍCULA E CARTÓRIO
            const inputCartorio = document.getElementById('cartorio');
            const inputMatricula = document.getElementById('num_matricula');
            const radioSim = document.querySelector('input[name="tem_matricula"][value="Sim"]');
            const blockMat = document.getElementById('bloco-matricula');
            
            const mockMatricula = getFieldFromLowestRip('numero_matricula') || getFieldFromLowestRip('matricula');
            const mockCartorio = getFieldFromLowestRip('cartorio');
            
            if (radioSim && blockMat) {
                if (mockMatricula || mockCartorio) {
                    radioSim.checked = true;
                    if (typeof toggleMatricula === 'function') toggleMatricula();
                    blockMat.style.display = 'flex';
                }
                setHint(inputCartorio, mockCartorio);
                setHint(inputMatricula, mockMatricula);
            }

            // 2. AVALIAÇÃO DO IMÓVEL
            const inputValor = document.getElementById('valor_avaliacao');
            const inputDataAv = document.getElementById('data_avaliacao');
            const inputInst = document.getElementById('instrumento_avaliacao');

            const mockValor = getFieldFromLowestRip('valor_avaliado') || getFieldFromLowestRip('valor_imovel');
            const mockDataAv = getFieldFromLowestRip('data_avaliacao');
            const mockInst = getFieldFromLowestRip('instrumento_avaliacao');

            setHint(inputValor, mockValor);
            setHint(inputDataAv, mockDataAv);
            setHint(inputInst, mockInst);

            // Limpa o interval pois os dados já foram carregados
            clearInterval(consolidadoInterval);
`;

// Replace `// Limpa o interval...` block with our new logic
f2 = f2.replace(/\/\/ Limpa o interval pois os dados já foram carregados[\s\S]*?clearInterval\(consolidadoInterval\);/, newLogic);

fs.writeFileSync('foco-02.js', f2);
console.log('Restored matricula and added avaliacao!');
