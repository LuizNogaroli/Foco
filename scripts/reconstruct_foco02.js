const fs = require('fs');

let f2 = fs.readFileSync('foco-02.js', 'utf8');

const funcsToAdd = `
// ================================================================
// LÓGICA DE CONCEITUAÇÃO E RIP (Migrada da Aba 1)
// ================================================================

window.verificarConceituacao = function() {
    const checks = document.querySelectorAll('input[name="conceituacao[]"]:checked');
    let exigeRIP = false;
    let dispensaRIP = false;

    checks.forEach(c => {
        const val = c.value;
        if (['terreno_marinha', 'terreno_nacional_interior', 'imovel_dominio_uniao', 'gleba_assentamento', 'ilha_oceanica', 'ilha_fluvial'].includes(val)) {
            exigeRIP = true;
        }
        if (['espelho_dagua', 'cavidades_naturais', 'manguezal', 'praia_mar', 'praia_rio'].includes(val)) {
            dispensaRIP = true;
        }
    });

    const secaoRip = document.getElementById('secaoPesquisaRip');
    const secaoMinimo = document.getElementById('secaoCadastroMinimo');

    if (exigeRIP) {
        if(secaoRip) secaoRip.style.display = 'block';
    } else {
        if(secaoRip) secaoRip.style.display = 'none';
    }

    if (dispensaRIP) {
        if(secaoMinimo) secaoMinimo.style.display = 'block';
    } else {
        if(secaoMinimo) secaoMinimo.style.display = 'none';
    }
};

window.pesquisarRip = async function() {
    window.ripsPesquisados = window.ripsPesquisados || {};
    const input = document.getElementById('rip_pesquisa');
    if(!input) return;
    const rip = input.value.trim();
    
    if (!rip || rip.length < 7) {
        alert('Por favor, informe um RIP válido (mínimo 7 dígitos).');
        return;
    }
    
    if (window.ripsPesquisados && window.ripsPesquisados[rip]) {
        alert('Este RIP já foi adicionado ao requerimento.');
        input.value = '';
        return;
    }

    try {
        const btn = input.nextElementSibling || document.querySelector('button[onclick="pesquisarRip()"]');
        if (btn) {
            btn.textContent = 'Buscando...';
            btn.disabled = true;
        }

        const url = window.parent.SUPABASE_URL + '/rest/v1/datalake_spunet?select=*&rip=eq.' + rip;
        const res = await fetch(url, {
            headers: {
                'apikey': window.parent.SUPABASE_ANON_KEY,
                'Authorization': 'Bearer ' + window.parent.SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (btn) {
            btn.textContent = '🔍 Buscar e Adicionar';
            btn.disabled = false;
        }

        const data = await res.json();
        
        if (data && data.length > 0) {
            const dados = data[0].dados_imovel;
            window.ripsPesquisados[rip] = dados;
            window.adicionarTagRIP(rip, dados);
            window.criarBlocoImovel(rip, dados);
            window.atualizarRipsOcultos();
            input.value = '';
        } else {
            alert('RIP ' + rip + ' não encontrado na base de dados (Datalake SPUnet).');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao buscar RIP.');
        const btn = input.nextElementSibling || document.querySelector('button[onclick="pesquisarRip()"]');
        if (btn) {
            btn.textContent = '🔍 Buscar e Adicionar';
            btn.disabled = false;
        }
    }
};

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

    const editIconSVG = \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>\`;

    function buildField(label, name, value) {
        let valStr = value || '';
        let encLabel = encodeURIComponent(label);
        let encVal = encodeURIComponent(valStr);
        let iconHtml = \`<span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração/Inclusão" onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${encLabel}', '\${encVal}')">\${editIconSVG}</span>\`;
        
        return \`
            <div class="form-group editavel" style="margin: 0; position: relative;">
                <label>\${label}:\${iconHtml}</label>
                <input type="text" name="imoveis[\${index}][\${name}]" value="\${valStr}" readonly class="auto-loaded-field" style="padding-right: 30px;">
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
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('Natureza do Terreno', 'natureza_terreno', dados.natureza || dados.natureza_terreno)}
                \${buildField('Situação', 'situacao', dados.situacao)}
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px; margin-bottom: 15px;">
                \${buildField('Logradouro', 'logradouro', dados.logradouro)}
                \${buildField('Município / UF', 'municipio_uf', (dados.municipio || '') + (dados.municipio && dados.uf ? ' / ' : '') + (dados.uf || ''))}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                \${buildField('Área do Terreno (m²)', 'area_terreno', dados.area_terreno)}
                \${buildField('Área da Unidade (m²)', 'area_unidade', dados.area_unidade)}
            </div>
        </div>
    \`;

    container.appendChild(div);
};
`;

// Remove old implementations if any (to avoid duplicates)
f2 = f2.replace(/window\.verificarConceituacao = function[\s\S]*?(?=window\.pesquisarRip)/, '');
f2 = f2.replace(/window\.pesquisarRip = async function[\s\S]*?(?=window\.atualizarRipsOcultos)/, '');
f2 = f2.replace(/window\.atualizarRipsOcultos = function[\s\S]*?(?=window\.adicionarTagRIP)/, '');
f2 = f2.replace(/window\.adicionarTagRIP = function[\s\S]*?(?=window\.removerRIP)/, '');
f2 = f2.replace(/window\.removerRIP = function[\s\S]*?(?=window\.toggleAccordion)/, '');
f2 = f2.replace(/window\.toggleAccordion = function[\s\S]*?(?=window\.criarBlocoImovel)/, '');
f2 = f2.replace(/window\.criarBlocoImovel = function[\s\S]*?(?=\/\/ =|$)/, '');

fs.writeFileSync('foco-02.js', f2 + '\n' + funcsToAdd, 'utf8');
console.log('foco-02.js fully reconstructed with pristine functions and perfect edit icons!');
