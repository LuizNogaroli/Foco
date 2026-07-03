const fs = require('fs');
let js = fs.readFileSync('foco-02.js', 'utf8');

const regex = /window\.adicionarTagRIP = function\(rip, dados\) \{[\s\S]*?container\.appendChild\(div\);\n\};/;

const replacement = `window.adicionarTagRIP = function(rip, dados) {
    const lista = document.getElementById('listaRIPsAssociados');
    if (lista) lista.style.display = 'flex';
    
    if (document.querySelector('.rip-tag[data-rip="' + rip + '"]')) return;

    const div = document.createElement('div');
    div.className = 'rip-tag';
    div.setAttribute('data-rip', rip);
    div.style.padding = '10px 14px';
    div.style.border = '1px solid #c8e6c9';
    div.style.backgroundColor = '#e8f5e9';
    div.style.borderRadius = '6px';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    
    div.innerHTML = \`
        <span><strong style="color: #2e7d32; font-size: 1.1em;">RIP: \${rip}</strong> - \${dados ? (dados.natureza || dados.natureza_terreno || 'Terreno Importado') : 'Terreno Importado'}</span>
        <button type="button" onclick="this.parentElement.remove(); window.atualizarRipsOcultos(); document.querySelector('.imovel-block[data-rip=\\'\${rip}\\']')?.remove();" style="background: none; border: none; color: #d32f2f; font-weight: bold; cursor: pointer; font-size: 1.1em;" title="Remover RIP">&times;</button>
    \`;
    if (lista) lista.appendChild(div);
};

window.criarBlocoImovel = function(rip, dados) {
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
        let iconHtml = \`<span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração/Inclusão" onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${encLabel}', '\${encVal}')">✏️</span>\`;
        return \`
            <div class="form-group editavel" style="margin: 0;">
                <label>\${label} \${iconHtml}</label>
                <input type="text" name="imoveis[\${index}][\${name}]" value="\${valStr}" readonly class="auto-loaded-field">
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
};`;

if (js.match(regex)) {
    js = js.replace(regex, replacement);
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Fixed syntax error in js');
} else {
    console.log('Regex did not match!');
}
