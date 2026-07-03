const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

const replacement = `
    div.innerHTML = \`
        <div class="accordion-header" style="background-color: #f1f5f9; padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; color: #0f172a;">Imóvel Selecionado: RIP \${rip}</h4>
            <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold; color: #64748b;">▲</span>
        </div>
        <div class="accordion-content" style="display: block; padding: 16px;">
            <input type="hidden" name="imoveis[\${index}][rip]" value="\${rip}">
            
            <h4 style="margin: 0 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Identificação do Imóvel</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('Conceituação do Imóvel', 'conceituacao', dados.conceituacao || dados.descricao)}
                \${buildField('Natureza do Imóvel', 'natureza', dados.natureza || dados.natureza_terreno)}
                \${buildField('Tipo de Imóvel', 'tipo_imovel', dados.tipoImovel || dados.tipo_imovel)}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('CEP', 'cep', dados.cep)}
                \${buildField('UF', 'uf', dados.uf)}
                \${buildField('Município', 'municipio', dados.municipio)}
            </div>
            
            <div style="margin-bottom: 15px;">
                \${buildField('Endereço', 'endereco', dados.endereco || dados.logradouro)}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('Área total (m²)', 'area_total', dados.area_total)}
                \${buildField('Área da União (m²)', 'area_uniao', dados.area_uniao)}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('Há benfeitorias?', 'benfeitorias', dados.benfeitorias)}
                \${buildField('Área construída total (m²)', 'area_construida_total', dados.area_construida_total)}
                \${buildField('Área construída disponível (m²)', 'area_construida_disponivel', dados.area_construida_disponivel)}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('Área de terreno disponível (m²)', 'area_terreno_disponivel', dados.area_terreno_disponivel)}
                \${buildField('Situação da Incorporação', 'situacao_incorporacao', dados.situacao_incorporacao || dados.situacao)}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('Valor avaliado (R$)', 'valor_avaliado', dados.valor_avaliado || dados.valor_imovel)}
                \${buildField('Data da avaliação', 'data_avaliacao', dados.data_avaliacao)}
                \${buildField('Instrumento de avaliação', 'instrumento_avaliacao', dados.instrumento_avaliacao)}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('LPM/1831 ou LMEO homologadas?', 'lpm_homologada', dados.lpm_homologada)}
                \${buildField('Processo de incorporação?', 'processo_incorporacao', dados.processo_incorporacao)}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                \${buildField('Número do Processo', 'numero_processo', dados.numero_processo)}
                \${buildField('Matrícula', 'matricula', dados.matricula)}
            </div>
        </div>
    \`;

    container.appendChild(div);
};
`;

const regex = /div\.innerHTML = `[\s\S]*?container\.appendChild\(div\);\n\};/;
if (regex.test(code)) {
    code = code.replace(regex, replacement.trim());
    fs.writeFileSync('foco-02.js', code);
    console.log('Restored the original fields successfully.');
} else {
    console.log('Regex did not match.');
}
