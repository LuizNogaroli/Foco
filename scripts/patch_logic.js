const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

const startSig = 'window.verificarConceituacao = function() {';
const endSig = 'window.atualizarRipsOcultos = function() {';

const startIndex = code.indexOf(startSig);
const endIndex = code.indexOf(endSig);

if (startIndex === -1 || endIndex === -1) {
    console.log('Cannot find signatures');
    process.exit(1);
}

const pristineCode = `window.verificarConceituacao = function() {
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
        secaoRip.style.display = 'block';
    } else {
        secaoRip.style.display = 'none';
    }

    if (dispensaRIP) {
        secaoMinimo.style.display = 'block';
    } else {
        secaoMinimo.style.display = 'none';
    }
};

window.pesquisarRip = async function() {
    window.ripsPesquisados = window.ripsPesquisados || {};
    const input = document.getElementById('rip_pesquisa');
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
            window.criarBlocoImóvel(rip, dados);
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

// ================================================================
// FUNÇÕES RECUPERADAS PARA RENDERIZAÇÃO DE RIPs READ-ONLY
// ================================================================

`;

const newCode = code.substring(0, startIndex) + pristineCode + code.substring(endIndex);

fs.writeFileSync('foco-02.js', newCode, 'utf8');
console.log('Patch aplicado com sucesso.');
