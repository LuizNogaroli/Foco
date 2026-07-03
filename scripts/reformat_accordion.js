const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

// The new icon SVG
const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

const regex = /window\.criarBlocoImovel = function\(rip, dados\) \{[\s\S]*?container\.appendChild\(div\);\n\};/;

const replacement = `window.criarBlocoImovel = function(rip, dados) {
    dados = dados || {};
    const container = document.getElementById('imoveis-container');
    if (!container) return;

    if (document.querySelector(\`.imovel-block[data-rip="\${rip}"]\`)) return;

    const index = document.querySelectorAll('.imovel-block').length;
    const div = document.createElement('div');
    div.className = 'imovel-block card mb-4';
    div.setAttribute('data-index', index);
    div.setAttribute('data-rip', rip);
    div.style.border = '1px solid #cbd5e1';
    div.style.borderRadius = '8px';
    div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    
    function buildField(label, name, value) {
        let valStr = value || '';
        let encLabel = encodeURIComponent(label);
        let encVal = encodeURIComponent(valStr);
        let iconHtml = \`<span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração/Inclusão" onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${encLabel}', '\${encVal}')">${editIconSVG}</span>\`;
        return \`
            <div class="form-group editavel" style="margin-bottom: 15px;">
                <label style="display:block; margin-bottom: 5px; font-weight: 600;">\${label} \${iconHtml}</label>
                <input type="text" name="imoveis[\${index}][\${name}]" value="\${valStr}" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
            </div>
        \`;
    }

    div.innerHTML = \`
        <div class="accordion-header" style="background-color: #f1f5f9; padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; color: #0f172a;">Imóvel Selecionado: RIP \${rip}</h4>
            <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold; color: #64748b;">▲</span>
        </div>
        <div class="accordion-content" style="display: block; padding: 16px;">
            <input type="hidden" name="imoveis[\${index}][rip]" value="\${rip}">
            
            <h4 style="margin: 0 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Identificação do Imóvel</h4>
            
            \${buildField('Conceituação do Imóvel', 'conceituacao', dados.conceituacao || dados.descricao)}
            \${buildField('Natureza do Imóvel', 'natureza', dados.natureza || dados.natureza_terreno)}
            \${buildField('Tipo de Imóvel', 'tipo_imovel', dados.tipoImovel || dados.tipo_imovel)}
            \${buildField('CEP', 'cep', dados.cep)}
            \${buildField('UF', 'uf', dados.uf)}
            \${buildField('Município', 'municipio', dados.municipio)}
            \${buildField('Endereço', 'endereco', dados.endereco || dados.logradouro)}
            \${buildField('Área total (m²)', 'area_total', dados.area_total)}
            \${buildField('Área da União (m²)', 'area_uniao', dados.area_uniao)}
            \${buildField('Há benfeitorias?', 'benfeitorias', dados.benfeitorias)}
            \${buildField('Área construída total (m²)', 'area_construida_total', dados.area_construida_total)}
            \${buildField('Área construída disponível (m²)', 'area_construida_disponivel', dados.area_construida_disponivel)}
            \${buildField('Área de terreno disponível (m²)', 'area_terreno_disponivel', dados.area_terreno_disponivel)}
            \${buildField('Situação da Incorporação', 'situacao_incorporacao', dados.situacao_incorporacao || dados.situacao)}
            \${buildField('Valor avaliado (R$)', 'valor_avaliado', dados.valor_avaliado || dados.valor_imovel)}
            \${buildField('Data da avaliação', 'data_avaliacao', dados.data_avaliacao)}
            \${buildField('Instrumento de avaliação', 'instrumento_avaliacao', dados.instrumento_avaliacao)}
            \${buildField('LPM/1831 ou LMEO homologadas?', 'lpm_homologada', dados.lpm_homologada)}
            \${buildField('Processo de incorporação?', 'processo_incorporacao', dados.processo_incorporacao)}
            \${buildField('Número do Processo', 'numero_processo', dados.numero_processo)}
            \${buildField('Matrícula', 'matricula', dados.matricula)}
        </div>
    \`;

    container.appendChild(div);
};`;

if (js.match(regex)) {
    js = js.replace(regex, replacement);
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Reformatted accordion layout and restored edit icon SVG.');
} else {
    console.log('Regex did not match!');
}
