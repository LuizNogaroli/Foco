const fs = require('fs');

if (fs.existsSync('foco-01.js')) {
    let content = fs.readFileSync('foco-01.js', 'utf8');

    const restoreCode = `
// ================================================================
// FUNÇÕES RECUPERADAS PARA RENDERIZAÇÃO DE RIPs READ-ONLY
// ================================================================

window.atualizarRipsOcultos = function() {
    const hidden = document.getElementById('hidden_lista_rips');
    if (hidden && window.ripsPesquisados) {
        hidden.value = Object.keys(window.ripsPesquisados).join(',');
    }
};

window.adicionarTagRIP = function(rip, dados) {
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
        <button type="button" class="btn-remove-rip" style="background: none; border: none; color: #c62828; cursor: pointer; font-weight: bold; font-size: 1.2em;" onclick="removerRIP('\${rip}')" title="Remover RIP">❌</button>
    \`;
    if (lista) lista.appendChild(div);
};

window.removerRIP = function(rip) {
    if (confirm('Tem certeza que deseja remover este RIP do requerimento? (Esta ação afetará as próximas abas)')) {
        const tag = document.querySelector('.rip-tag[data-rip="' + rip + '"]');
        if (tag) tag.remove();
        
        const bloco = document.querySelector('.imovel-block[data-rip="' + rip + '"]');
        if (bloco) bloco.remove();
        
        if (window.ripsPesquisados && window.ripsPesquisados[rip]) {
            delete window.ripsPesquisados[rip];
        }
        
        atualizarRipsOcultos();
        
        if (window.parent && window.parent.syncToDefinitive) {
            console.log('Notificando Supabase sobre a exclusão do RIP: ', rip);
        }
    }
};

window.toggleAccordion = function(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if(icon) icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        if(icon) icon.textContent = '▼';
    }
};

window.criarBlocoImovel = function(rip, dados) {
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

    div.innerHTML = \`
        <div class="accordion-header" style="background-color: #f1f5f9; padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;" onclick="toggleAccordion(this)">
            <h4 style="margin: 0; color: #0f172a;">Imóvel Selecionado: RIP \${rip}</h4>
            <span class="accordion-icon" style="font-size: 1.2em; font-weight: bold; color: #64748b;">▼</span>
        </div>
        <div class="accordion-content" style="display: none; padding: 16px;">
            <input type="hidden" name="imoveis[\${index}][rip]" value="\${rip}">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group editavel" style="margin: 0;">
                    <label>Natureza do Terreno:</label>
                    <input type="text" name="imoveis[\${index}][natureza_terreno]" value="\${dados.natureza || dados.natureza_terreno || ''}" readonly class="auto-loaded-field">
                </div>
                <div class="form-group editavel" style="margin: 0;">
                    <label>Situação:</label>
                    <input type="text" name="imoveis[\${index}][situacao]" value="\${dados.situacao || ''}" readonly class="auto-loaded-field">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group editavel" style="margin: 0;">
                    <label>Logradouro:</label>
                    <input type="text" name="imoveis[\${index}][logradouro]" value="\${dados.logradouro || ''}" readonly class="auto-loaded-field">
                </div>
                <div class="form-group editavel" style="margin: 0;">
                    <label>Município / UF:</label>
                    <input type="text" name="imoveis[\${index}][municipio_uf]" value="\${(dados.municipio || '') + ' / ' + (dados.uf || '')}" readonly class="auto-loaded-field">
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group editavel" style="margin: 0;">
                    <label>Área do Terreno (m²):</label>
                    <input type="text" name="imoveis[\${index}][area_terreno]" value="\${dados.area_terreno || ''}" readonly class="auto-loaded-field">
                </div>
                <div class="form-group editavel" style="margin: 0;">
                    <label>Área da Unidade (m²):</label>
                    <input type="text" name="imoveis[\${index}][area_unidade]" value="\${dados.area_unidade || ''}" readonly class="auto-loaded-field">
                </div>
            </div>
        </div>
    \`;

    container.appendChild(div);
};
`;

    // Se já tiver criarBlocoImovel, substitui, se não, adiciona
    if (content.includes('window.criarBlocoImovel =')) {
        console.log('Função já existe, nenhuma alteração necessária.');
    } else {
        fs.writeFileSync('foco-01.js', content + restoreCode, 'utf8');
        console.log('foco-01.js: Funções de renderização de RIP recuperadas com sucesso!');
    }
}
