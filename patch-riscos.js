const fs = require('fs');

// ==========================================
// 1. PATCH HTML
// ==========================================
let html = fs.readFileSync('foco-02.html', 'utf8');

const htmlTarget = /<div class="form-group editavel">\s*<label>Riscos verificados:<\/label>\s*<div class="checkbox-group">[\s\S]*?<\/div>\s*<\/div>/;

const htmlReplacement = `<div class="form-group editavel">
          <label>Riscos verificados:</label>
          <div class="checkbox-group">
              <label class="checkbox-option"><input type="checkbox" name="riscos[]" value="Nenhum risco identificado" onchange="toggleRiscos()" /> Nenhum risco identificado</label>
              <label class="checkbox-option"><input type="checkbox" name="riscos[]" value="Risco de invasão/esbulho" onchange="toggleRiscos()" /> Risco de invasão/esbulho</label>
              <label class="checkbox-option"><input type="checkbox" name="riscos[]" value="Risco à segurança/saúde pública" onchange="toggleRiscos()" /> Risco à segurança/saúde pública</label>
              <label class="checkbox-option"><input type="checkbox" name="riscos[]" value="Risco estrutural ou de desabamento" onchange="toggleRiscos()" /> Risco estrutural ou de desabamento</label>
              <label class="checkbox-option"><input type="checkbox" name="riscos[]" value="Risco de depredação, vandalismo ou deterioração" onchange="toggleRiscos()" /> Risco de depredação, vandalismo ou deterioração</label>
              <label class="checkbox-option"><input type="checkbox" name="riscos[]" value="Outro risco identificado" onchange="toggleRiscos()" /> Outro risco identificado</label>
          </div>
          <div id="bloco-obs-riscos" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="obs_riscos">Observações sobre riscos:</label>
              <textarea id="obs_riscos" name="obs_riscos" placeholder="Descreva informações complementares sobre os riscos verificados..."></textarea>
          </div>
      </div>`;

html = html.replace(htmlTarget, htmlReplacement);
fs.writeFileSync('foco-02.html', html);


// ==========================================
// 2. PATCH JS
// ==========================================
let js = fs.readFileSync('foco-02.js', 'utf8');

// Add window.toggleRiscos at the top if not exists
if (!js.includes('window.toggleRiscos')) {
    const toggleFunc = `
window.toggleRiscos = function() {
    const radios = document.querySelectorAll('input[name="riscos[]"]');
    const hasChecked = Array.from(radios).some(r => r.checked);
    const blocoObs = document.getElementById('bloco-obs-riscos');
    if (blocoObs) {
        blocoObs.style.display = hasChecked ? 'flex' : 'none';
    }
};
document.addEventListener('DOMContentLoaded', function () {`;
    js = js.replace("document.addEventListener('DOMContentLoaded', function () {", toggleFunc);
}

// Add Logic before Limpa o interval
const target = "// Limpa o interval pois os dados já foram carregados";
const riscosLogic = `
            // 6. RISCOS
            const getArrayFieldFromLowestRip = (fieldName) => {
                if (!lowestRip) return null;
                // Direct base
                if (data._ripsPesquisados && data._ripsPesquisados[lowestRip] && data._ripsPesquisados[lowestRip][fieldName] !== undefined) {
                    let v = data._ripsPesquisados[lowestRip][fieldName];
                    if (Array.isArray(v)) return v;
                    if (typeof v === 'string') return v.split(',').map(x => x.trim());
                    return [];
                }
                // Array fields from form submission often look like imoveis[1][riscos[]] or imoveis[1][riscos]
                let foundValues = [];
                let hasData = false;
                for (let k of Object.keys(data)) {
                    if (k.match(/^imoveis\\[\\d+\\]\\[rip\\]$/) && data[k] === lowestRip) {
                        const idx = k.match(/^imoveis\\[(\\d+)\\]\\[rip\\]$/)[1];
                        
                        // It could be multiple keys: imoveis[idx][riscos[]] (array of values if parsed) 
                        // or multiple entries, but FormDataState usually handles arrays.
                        let v = data[\`imoveis[\${idx}][\${fieldName}[]]\`] || data[\`imoveis[\${idx}][\${fieldName}]\`];
                        if (v !== undefined) {
                            hasData = true;
                            if (Array.isArray(v)) {
                                foundValues = v;
                            } else if (typeof v === 'string') {
                                foundValues = v.split(',').map(x => x.trim());
                            }
                        }
                        break;
                    }
                }
                return hasData ? foundValues : null;
            };

            const mockRiscos = getArrayFieldFromLowestRip('riscos');
            const mockObsRiscos = getFieldFromLowestRip('obs_riscos') || getFieldFromLowestRip('observacoes_riscos');
            
            const checksRiscos = document.querySelectorAll('input[name="riscos[]"]');
            const inputObsRiscos = document.getElementById('obs_riscos');
            
            if (checksRiscos.length > 0) {
                // Se mockRiscos for null, não veio da origem
                if (mockRiscos === null) {
                    const formGrp = checksRiscos[0].closest('.form-group');
                    const labelRisco = formGrp ? formGrp.querySelector('label') : null;
                    if (labelRisco) {
                        labelRisco.style.backgroundColor = '#fff3cd';
                        labelRisco.style.padding = '4px 8px';
                        labelRisco.style.borderRadius = '4px';
                        labelRisco.style.display = 'inline-block';
                        if (!labelRisco.querySelector('.hint-icon')) {
                            labelRisco.innerHTML += ' <span class="hint-icon" title="Dado ausente na base oficial. Se tiver o dado e desejar atualizá-lo, use o campo de Observações." style="cursor:help;">ℹ️</span>';
                        }
                    }
                    
                    // Force disable them to ensure consistency
                    checksRiscos.forEach(c => c.disabled = true);
                    setHint(inputObsRiscos, ''); // Yellow block
                } else {
                    // Tem dados na origem
                    checksRiscos.forEach(c => {
                        c.disabled = true;
                        if (mockRiscos.map(x => x.toLowerCase()).includes(c.value.toLowerCase())) {
                            c.checked = true;
                        }
                    });

                    if (window.toggleRiscos) window.toggleRiscos();

                    // Apply hint logic on observation
                    const blocoObs = document.getElementById('bloco-obs-riscos');
                    if (blocoObs && blocoObs.style.display !== 'none') {
                        setHint(inputObsRiscos, mockObsRiscos);
                    }
                }
            }

            // Limpa o interval pois os dados já foram carregados`;

if (!js.includes('// 6. RISCOS')) {
    js = js.replace(target, riscosLogic);
}

// Improve setHint slightly for TEXTAREA if needed (same as inputs)
fs.writeFileSync('foco-02.js', js);
console.log('Riscos patched successfully.');
