const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

const target = "// Limpa o interval pois os dados já foram carregados";
const tipoImovelBlock = `
            // 5. TIPO DE IMÓVEL
            const selectTipoImovel = document.getElementById('tipo_imovel');
            const mockTipoImovel = getFieldFromLowestRip('tipo_imovel');
            
            if (selectTipoImovel) {
                setHint(selectTipoImovel, mockTipoImovel);
            }

            // Limpa o interval pois os dados já foram carregados`;

if (!code.includes('// 5. TIPO DE IMÓVEL')) {
    code = code.replace(target, tipoImovelBlock);
}

fs.writeFileSync('foco-02.js', code);
console.log('Tipo Imovel patched.');
