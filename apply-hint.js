const fs = require('fs');
let code = fs.readFileSync('foco-01.js', 'utf8');

// We will replace everything from `window.criarBlocoImovel = function(rip, dados) {` up to `container.appendChild(div); };`
const startFunc = "window.criarBlocoImovel = function(rip, dados) {";
const endFunc = "container.appendChild(div);\n};";

let funcStartIndex = code.indexOf(startFunc);
let funcEndIndex = code.indexOf(endFunc);

if (funcStartIndex !== -1 && funcEndIndex !== -1) {
    const newFunc = `window.criarBlocoImovel = function(rip, dados) {
    const container = document.getElementById('imoveis-container');
    if (!container) return;
    
    if (container.querySelector('.imovel-block[data-rip="' + rip + '"]')) return;

    window.imovelCount = (window.imovelCount || 0) + 1;
    const index = window.imovelCount;

    const div = document.createElement('div');
    div.className = 'imovel-block';
    div.setAttribute('data-rip', rip);
    div.setAttribute('data-index', index);
    div.style.border = '1px solid #cbd5e1';
    div.style.borderRadius = '8px';
    div.style.marginTop = '15px';
    div.style.backgroundColor = '#fff';

    const renderField = (label, name, value) => {
        const isEmpty = !value || String(value).trim() === '';
        const hint = isEmpty ? \`<span title="Dado ausente na base oficial. Se tiver o dado e desejar atualizá-lo, use o campo de Observações." style="cursor:help; font-size:1.1em; margin-left:6px;">ℹ️</span>\` : '';
        return \`
            <div class="form-group inline" style="margin-bottom: 8px;">
                <label>\${label}</label>
                <div style="display:flex; align-items:center; flex:1;">
                    <input type="text" name="imoveis[\${index}][\${name}]" value="\${value || ''}" readonly class="auto-loaded-field" style="width:100%; \${isEmpty ? 'background-color:#fff3cd; border-color:#ffe69c;' : ''}">
                    \${hint}
                </div>
            </div>
        \`;
    };

    div.innerHTML = \`
        <div class="accordion-header" style="background-color: #f1f5f9; padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; color: #0f172a;">Imóvel Selecionado: RIP \${rip}</h4>
            <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold; color: #64748b;">▼</span>
        </div>
        <div class="accordion-content" style="display: none; padding: 16px;">
            <input type="hidden" name="imoveis[\${index}][rip]" value="\${rip}">
            
            <h4 style="margin: 0 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Identificação do Imóvel</h4>
            
            \${renderField('RIP:', 'rip_display', rip)}
            \${renderField('Conceituação do Imóvel:', 'conceituacao', dados.conceituacao || dados.descricao)}
            \${renderField('Natureza do Imóvel:', 'natureza', dados.natureza || dados.natureza_terreno)}
            \${renderField('Tipo de Imóvel:', 'tipo_imovel', dados.tipoImovel || dados.tipo_imovel)}
            \${renderField('CEP:', 'cep', dados.cep)}
            \${renderField('UF:', 'uf', dados.uf)}
            \${renderField('Município:', 'municipio', dados.municipio)}
            \${renderField('Endereço:', 'endereco', dados.endereco || dados.logradouro)}
            \${renderField('Área total (m²):', 'area_total', dados.area_total)}
            \${renderField('Área da União (m²):', 'area_uniao', dados.area_uniao)}
            \${renderField('Há benfeitorias?:', 'benfeitorias', dados.benfeitorias)}
            \${renderField('Área construída total (m²):', 'area_construida_total', dados.area_construida_total)}
            \${renderField('Área de terreno disponível para destinação (m²):', 'area_terreno_disponivel', dados.area_terreno_disponivel)}
            \${renderField('Área construída disponível para destinação (m²):', 'area_construida_disponivel', dados.area_construida_disponivel)}
            \${renderField('Valor avaliado (R$):', 'valor_avaliado', dados.valor_avaliado || dados.valor_imovel)}
            \${renderField('Data da avaliação:', 'data_avaliacao', dados.data_avaliacao)}
            \${renderField('Instrumento de avaliação:', 'instrumento_avaliacao', dados.instrumento_avaliacao)}
            \${renderField('Situação da Incorporação:', 'situacao_incorporacao', dados.situacao_incorporacao || dados.situacao)}
            \${renderField('LPM/1831 ou LMEO homologadas?:', 'lpm_homologada', dados.lpm_homologada)}
            \${renderField('Processo de incorporação?:', 'processo_incorporacao', dados.processo_incorporacao)}
            \${renderField('Número do Processo:', 'numero_processo', dados.numero_processo)}
            \${renderField('Matrícula:', 'matricula', dados.matricula)}
        </div>
    \`;

    `;
    code = code.substring(0, funcStartIndex) + newFunc + code.substring(funcEndIndex);
}

// Also remove the baseMock merge logic we added earlier
const mockBlockRegex = /const baseMock = \{[\s\S]*?dadosMock = Object\.assign\(\{\}, baseMock, mockExistente, dbFinal\);/;
if (mockBlockRegex.test(code)) {
    code = code.replace(mockBlockRegex, `const dbRip = dbState._ripsPesquisados ? dbState._ripsPesquisados[rip] : null;
                const dadosMock = dbRip || window.ripsPesquisados[rip] || window.mockRips?.[rip] || { rip: rip };`);
}

fs.writeFileSync('foco-01.js', code);
console.log('Refactored hint logic applied successfully!');
