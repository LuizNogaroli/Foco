const fs = require('fs');

// 1. UPDATE HTML
let html = fs.readFileSync('foco-02.html', 'utf8');

const htmlBlock = `
            <!-- BLOCO DINÂMICO DE JUSTIFICATIVA -->
            <div id="blocoJustificativa" style="display: none; background: #fffacd; border: 2px solid #f59e0b; padding: 20px; margin-bottom: 25px; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="color: #b45309; margin-top: 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                    <span>⚠️</span> Justificativa de Correção/Preenchimento
                </h3>
                <p style="font-size: 13px; color: #78350f; margin-bottom: 15px;">
                    O sistema detectou que você inseriu ou alterou dados do Datalake. É obrigatório fornecer uma justificativa para o Setor de Cadastro.
                </p>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="justificativa_alteracao" style="color: #92400e; font-weight: bold;">Justificativa <span style="color:red;">*</span></label>
                    <textarea id="justificativa_alteracao" rows="3" placeholder="Explique o motivo da inserção ou alteração dos dados..." style="width: 100%; padding: 10px; border: 1px solid #fcd34d; border-radius: 4px;"></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="fundamentacao_legal" style="color: #92400e; font-weight: bold;">Fundamentação Legal (Opcional)</label>
                    <input type="text" id="fundamentacao_legal" placeholder="Ex: Portaria nº 123/2026" style="width: 100%; padding: 10px; border: 1px solid #fcd34d; border-radius: 4px;" />
                </div>
            </div>
            <!-- FIM DO BLOCO -->
`;

// Insert the block right before the final buttons div
if (!html.includes('id="blocoJustificativa"')) {
    html = html.replace('<div class="buttons">', htmlBlock + '\n            <div class="buttons">');
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('foco-02.html updated with justification block.');
} else {
    console.log('foco-02.html already has the justification block.');
}

// 2. UPDATE JS
let js = fs.readFileSync('foco-02.js', 'utf8');

// Function to update visibility of the justification block
const jsVisibilityLogic = `    // Atualiza visibilidade do bloco de justificativa
    const algumCampoAlterado = document.querySelectorAll('.campo-alterado').length > 0;
    const blocoJust = document.getElementById('blocoJustificativa');
    if (blocoJust) {
        blocoJust.style.display = algumCampoAlterado ? 'block' : 'none';
    }`;

if (js.includes('if (hintEl) {')) {
    js = js.replace(/if \(hintEl\) \{\s*hintEl\.remove\(\);\s*\}/, `if (hintEl) {\n            hintEl.remove();\n        }\n    }\n\n${jsVisibilityLogic}`);
}

// Function to enforce validation on submit and add payload
const submitValidationCode = `            if (divergencias.length > 0) {
                const just = document.getElementById('justificativa_alteracao')?.value.trim();
                if (!just) {
                    alert('⚠️ Você inseriu ou alterou dados do RIP. É obrigatório preencher a "Justificativa de Correção/Preenchimento" no final da página antes de salvar.');
                    return; // Bloqueia o avanço
                }
            }`;

const submitPayloadUpdateCode = `                    type: 'DIVERGENCIAS_CADASTRO',
                    aba: 'foco-02',
                    data: divergencias,
                    justificativa: document.getElementById('justificativa_alteracao')?.value.trim() || '',
                    fundamentacao: document.getElementById('fundamentacao_legal')?.value.trim() || ''`;

if (!js.includes('⚠️ Você inseriu ou alterou dados')) {
    js = js.replace('// Aqui enviaria \'divergencias\' via postMessage', submitValidationCode + '\n            \n            // Aqui enviaria \'divergencias\' via postMessage');
}

if (!js.includes('justificativa: document.getElementById')) {
    js = js.replace(/type: 'DIVERGENCIAS_CADASTRO',\s*aba: 'foco-02',\s*data: divergencias/, submitPayloadUpdateCode);
}

fs.writeFileSync('foco-02.js', js, 'utf8');
console.log('foco-02.js updated with validation and payload logic.');
