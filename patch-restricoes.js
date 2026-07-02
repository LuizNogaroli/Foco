const fs = require('fs');

// ==========================================
// 1. PATCH HTML
// ==========================================
let html = fs.readFileSync('foco-02.html', 'utf8');

const htmlTarget = /<div class="form-group editavel">\s*<label>Restrições verificadas:<\/label>\s*<div class="checkbox-group">[\s\S]*?<\/div>\s*<\/div>/;

const htmlReplacement = `<div class="form-group editavel">
          <label>Restrições verificadas:</label>
          <div class="checkbox-group">
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Nenhuma restrição identificada" onchange="toggleRestricoes()" /> Nenhuma restrição identificada</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Faixa de fronteira" onchange="toggleRestricoes()" /> Faixa de fronteira</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Faixa de segurança" onchange="toggleRestricoes()" /> Faixa de segurança</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Faixa de domínio Ferrovia/Rodovia" onchange="toggleRestricoes()" /> Faixa de domínio Ferrovia/Rodovia</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Faixa de 100 metros ao longo da costa marítima" onchange="toggleRestricoes()" /> Faixa de 100 metros ao longo da costa marítima</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Circunferência de 1.320 metros em torno de instalações militares" onchange="toggleRestricoes()" /> Circunferência de 1.320 metros em torno de instalações militares</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Terra indígena" onchange="toggleRestricoes()" /> Terra indígena</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Território quilombola ou área de comunidade tradicional" onchange="toggleRestricoes()" /> Território quilombola ou área de comunidade tradicional</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Zona/Área de Interesse Social — ZEIS" onchange="toggleRestricoes()" /> Zona/Área de Interesse Social — ZEIS</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Área de segurança" onchange="toggleRestricoes()" /> Área de segurança</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Área Non Aedificandi" onchange="toggleRestricoes()" /> Área Non Aedificandi</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Restrição de uso/ocupação incidente sobre o imóvel" onchange="toggleRestricoes()" /> Restrição de uso/ocupação incidente sobre o imóvel</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Tombado como patrimônio histórico, artístico e/ou cultural" onchange="toggleRestricoes()" /> Tombado como patrimônio histórico, artístico e/ou cultural</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Poligonal de Porto Organizado" onchange="toggleRestricoes()" /> Poligonal de Porto Organizado</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Área operacional da RFFSA" onchange="toggleRestricoes()" /> Área operacional da RFFSA</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Ilha oceânica ou costeira sem sede de município" onchange="toggleRestricoes()" /> Ilha oceânica ou costeira sem sede de município</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Ilha fluvial ou lacustre" onchange="toggleRestricoes()" /> Ilha fluvial ou lacustre</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Localizada em loteamento" onchange="toggleRestricoes()" /> Localizada em loteamento</label>
              <label class="checkbox-option"><input type="checkbox" name="restricoes[]" value="Outra restrição identificada" onchange="toggleRestricoes()" /> Outra restrição identificada</label>
          </div>
          <div id="bloco-obs-restricoes" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="obs_restricoes">Observações sobre as restrições:</label>
              <textarea id="obs_restricoes" name="obs_restricoes" placeholder="Descreva informações complementares sobre as restrições verificadas..."></textarea>
          </div>
      </div>`;

html = html.replace(htmlTarget, htmlReplacement);
fs.writeFileSync('foco-02.html', html);


// ==========================================
// 2. PATCH JS
// ==========================================
let js = fs.readFileSync('foco-02.js', 'utf8');

if (!js.includes('window.toggleRestricoes')) {
    const toggleFunc = `
window.toggleRestricoes = function() {
    const radios = document.querySelectorAll('input[name="restricoes[]"]');
    const hasChecked = Array.from(radios).some(r => r.checked);
    const blocoObs = document.getElementById('bloco-obs-restricoes');
    if (blocoObs) {
        blocoObs.style.display = hasChecked ? 'flex' : 'none';
    }
};
document.addEventListener('DOMContentLoaded', function () {`;
    js = js.replace("document.addEventListener('DOMContentLoaded', function () {", toggleFunc);
}

const target = "// Limpa o interval pois os dados já foram carregados";
const restricoesLogic = `
            // 7. RESTRIÇÕES
            const mockRestricoes = getArrayFieldFromLowestRip('restricoes');
            const mockObsRestricoes = getFieldFromLowestRip('obs_restricoes') || getFieldFromLowestRip('observacoes_restricoes');
            
            const checksRestricoes = document.querySelectorAll('input[name="restricoes[]"]');
            const inputObsRestricoes = document.getElementById('obs_restricoes');
            
            if (checksRestricoes.length > 0) {
                if (mockRestricoes === null) {
                    const formGrp = checksRestricoes[0].closest('.form-group');
                    const labelRestr = formGrp ? formGrp.querySelector('label') : null;
                    if (labelRestr) {
                        labelRestr.style.backgroundColor = '#fff3cd';
                        labelRestr.style.padding = '4px 8px';
                        labelRestr.style.borderRadius = '4px';
                        labelRestr.style.display = 'inline-block';
                        if (!labelRestr.querySelector('.hint-icon')) {
                            labelRestr.innerHTML += ' <span class="hint-icon" title="Dado ausente na base oficial. Se tiver o dado e desejar atualizá-lo, use o campo de Observações." style="cursor:help;">ℹ️</span>';
                        }
                    }
                    
                    checksRestricoes.forEach(c => c.disabled = true);
                    setHint(inputObsRestricoes, ''); 
                } else {
                    checksRestricoes.forEach(c => {
                        c.disabled = true;
                        if (mockRestricoes.map(x => x.toLowerCase()).includes(c.value.toLowerCase())) {
                            c.checked = true;
                        }
                    });

                    if (window.toggleRestricoes) window.toggleRestricoes();

                    const blocoObs = document.getElementById('bloco-obs-restricoes');
                    if (blocoObs && blocoObs.style.display !== 'none') {
                        setHint(inputObsRestricoes, mockObsRestricoes);
                    }
                }
            }

            // Limpa o interval pois os dados já foram carregados`;

if (!js.includes('// 7. RESTRIÇÕES')) {
    js = js.replace(target, restricoesLogic);
}

fs.writeFileSync('foco-02.js', js);
console.log('Restricoes patched successfully.');
