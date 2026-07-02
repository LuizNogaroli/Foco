const fs = require('fs');

let html = fs.readFileSync('foco-01.html', 'utf8');

// Replace the old HTML block
const regexHtml = /<!-- ========== ÁREAS DISPENSADAS DE RIP \(OPCIONAL\) ========== -->[\s\S]*?<!-- ========== FIM RIPs ASSOCIADOS ========== -->/;
const newHtml = `<!-- ========== CONCEITUAÇÃO DO IMÓVEL ========== -->
            <div class="form-group editavel" style="margin-top: 30px; border-top: 1px dashed #e2e8f0; padding-top: 20px;">
                <label style="font-size: 1.1em; color: #1e3a5f; font-weight: bold;">Conceituação do imóvel</label>
                <div class="checkbox-group" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="terreno_marinha" onchange="verificarConceituacao()"> Terreno de marinha e acrescido (Exige RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="terreno_nacional_interior" onchange="verificarConceituacao()"> Terreno Nacional Interior (Exige RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="imovel_dominio_uniao" onchange="verificarConceituacao()"> Imóvel de Domínio da União (Exige RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="gleba_assentamento" onchange="verificarConceituacao()"> Gleba destinada a assentamento (Exige RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="ilha_oceanica" onchange="verificarConceituacao()"> Ilha oceânica ou costeira (Exige RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="ilha_fluvial" onchange="verificarConceituacao()"> Ilha fluvial ou lacustre (Exige RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="espelho_dagua" onchange="verificarConceituacao()"> Espelho d’água (Dispensado de RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="cavidades_naturais" onchange="verificarConceituacao()"> Cavidades naturais subterrâneas (Dispensado de RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="manguezal" onchange="verificarConceituacao()"> Manguezal (Dispensado de RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="praia_mar" onchange="verificarConceituacao()"> Praia marítima (Dispensado de RIP)</label>
                    <label class="checkbox-option"><input type="checkbox" name="conceituacao[]" value="praia_rio" onchange="verificarConceituacao()"> Praia fluvial ou lacustre (Dispensado de RIP)</label>
                </div>
            </div>

            <!-- ========== PESQUISA DE RIP ========== -->
            <div id="secaoPesquisaRip" style="display: none; margin-top: 30px; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc;">
                <h4 style="margin: 0 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Pesquisa no Datalake SPUnet</h4>
                <div class="form-group" style="display: flex; gap: 10px; align-items: flex-end;">
                    <div style="flex: 1;">
                        <label for="rip_pesquisa">Consultar RIP:</label>
                        <input type="text" id="rip_pesquisa" placeholder="Digite o RIP com 7 a 11 dígitos" maxlength="11" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                    <button type="button" class="btn-action" onclick="pesquisarRip()" style="padding: 12px 24px; border-radius: 6px; background-color: #2563eb; color: white; border: none; cursor: pointer; height: 44px; margin-bottom: 5px;">🔍 Buscar e Adicionar</button>
                </div>

                <div class="form-group" style="text-align: center; margin-top: 20px;">
                    <div id="listaRIPsAssociados" style="display: none; flex-direction: column; gap: 6px; margin: 0 auto; max-width: 500px;"></div>
                </div>

                <input type="hidden" id="hidden_lista_rips" name="lista_rips" value="">

                <div id="imoveis-container"></div>
            </div>
            <!-- ========== FIM PESQUISA DE RIP ========== -->`;

html = html.replace(regexHtml, newHtml);

// Fix field pre-loads so they come empty
html = html.replace(/value="DF04598\/2026"/, 'value=""');
html = html.replace(/value="15\/05\/2026"/, 'value=""');
html = html.replace(/value="10480.012345\/2024-00"/, 'value=""');
html = html.replace(/value="12.345.678\/0001-90"/, 'value=""');
html = html.replace(/value="Empresa Exemplo S\/A"/, 'value=""');
html = html.replace(/value="\(11\) 98765-4321"/, 'value=""');

fs.writeFileSync('foco-01.html', html);


// JS Patch
let js = fs.readFileSync('foco-01.js', 'utf8');

const regexJs = /window\.verificarConceituacao = function\(\) \{[\s\S]*?\/\/ A pesquisa manual de RIPs foi removida por regra de negócio\.[\s\S]*?\/\/ Os RIPs são carregados automaticamente via integração\./;
const newJs = `window.verificarConceituacao = function() {
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

    if (dispensaRIP && !exigeRIP) {
        secaoMinimo.style.display = 'block';
    } else {
        secaoMinimo.style.display = 'none';
    }
};

window.pesquisarRip = function() {
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

    // Consulta ao mock do Datalake
    const dados = window.datalakeSpunet[rip];
    
    if (dados) {
        window.ripsPesquisados[rip] = dados;
        window.adicionarTagRIP(rip, dados);
        window.criarBlocoImovel(rip, dados);
        window.atualizarRipsOcultos();
        input.value = '';
    } else {
        alert('RIP ' + rip + ' não encontrado na base de dados (Datalake SPUnet).');
    }
};

// ================================================================
// DADOS MOCKADOS: PORTAL DE SERVIÇOS & DATALAKE SPUNET
// ================================================================

window.portalDeServicos = {
    requerimento: 'DF04598/2026',
    data: '15/05/2026',
    processo: '10480.012345/2024-00',
    cpfCnpj: '12.345.678/0001-90',
    nome: 'Empresa Exemplo S/A',
    telefone: '(11) 98765-4321',
    estrangeira: 'Não',
    prioridade: 'Não se aplica'
};

window.datalakeSpunet = window.mockRips || {
    '00000001': {
        rip: '00000001',
        conceituacao: 'Terreno de marinha',
        natureza: 'Terreno',
        tipoImovel: 'Prédio',
        cep: '70000-000',
        uf: 'DF',
        municipio: 'Brasília',
        endereco: 'Esplanada dos Ministérios, Bloco X',
        area_total: 1500,
        area_uniao: 1500,
        benfeitorias: 'Sim',
        area_construida_total: 1000,
        area_terreno_disponivel: 500,
        area_construida_disponivel: 1000,
        valor_avaliado: 5000000,
        data_avaliacao: '10/01/2024',
        instrumento_avaliacao: 'Laudo',
        situacao_incorporacao: 'Incorporado',
        lpm_homologada: 'Sim',
        processo_incorporacao: '12345',
        numero_processo: '12345',
        cartorio: '1º Ofício de Registro de Imóveis',
        numero_matricula: '12345',
        // Outras abas (aproveitado)
        terreno_nacional: true,
        uso_atual: 'Comercial',
        restricoes: ['Tombado como patrimônio histórico, artístico e/ou cultural'],
        riscos: ['Nenhum risco identificado'],
        obs_riscos: 'Sem observações'
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Auto-preencher apenas a primeira parte usando Portal de Serviços
    const fill = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    fill('campo11', window.portalDeServicos.requerimento);
    fill('campo12', window.portalDeServicos.data);
    fill('campo13', window.portalDeServicos.processo);
    fill('campo14', window.portalDeServicos.cpfCnpj);
    fill('campo15', window.portalDeServicos.nome);
    fill('campo19', window.portalDeServicos.telefone);
    fill('campo17', window.portalDeServicos.estrangeira);
    fill('prioridade_legal', window.portalDeServicos.prioridade);
});
`;

js = js.replace(regexJs, newJs);
fs.writeFileSync('foco-01.js', js);
