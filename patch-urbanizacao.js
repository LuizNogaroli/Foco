const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// 1. Enhance setHint to support SELECT elements better
const oldSetHint = `const setHint = (input, val) => {
                if (!input) return;
                input.value = val || '';
                input.readOnly = true;
                input.style.backgroundColor = val ? '#e9ecef' : '#fff3cd';
                input.style.borderColor = val ? '#ced4da' : '#ffe69c';`;

const newSetHint = `const setHint = (input, val) => {
                if (!input) return;
                
                // Tratar caso de SELECT
                if (input.tagName === 'SELECT') {
                    input.disabled = true;
                    // Se val vier da origem, tenta setar o valor correto procurando pelas options (case insensitive)
                    if (val) {
                        for (let i = 0; i < input.options.length; i++) {
                            if (input.options[i].text.toLowerCase() === val.toLowerCase() || input.options[i].value.toLowerCase() === val.toLowerCase()) {
                                input.selectedIndex = i;
                                break;
                            }
                        }
                    } else {
                        input.value = ''; // Mantém no placeholder
                    }
                } else {
                    input.value = val || '';
                    input.readOnly = true;
                }
                
                input.style.backgroundColor = val ? '#e9ecef' : '#fff3cd';
                input.style.borderColor = val ? '#ced4da' : '#ffe69c';`;

code = code.replace(oldSetHint, newSetHint);

// 2. Add Urbanização block before "Limpa o interval"
const target = "// Limpa o interval pois os dados já foram carregados";
const urbanizacaoBlock = `
            // 4. URBANIZAÇÃO
            const selectUrbanizacao = document.getElementById('condicao_urbanizacao');
            const mockUrbanizacao = getFieldFromLowestRip('condicao_urbanizacao');
            
            if (selectUrbanizacao) {
                setHint(selectUrbanizacao, mockUrbanizacao);
            }

            // Limpa o interval pois os dados já foram carregados`;

if (!code.includes('// 4. URBANIZAÇÃO')) {
    code = code.replace(target, urbanizacaoBlock);
}

fs.writeFileSync('foco-02.js', code);
console.log('Urbanizacao patched.');
