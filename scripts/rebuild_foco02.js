const fs = require('fs');

const code = fs.readFileSync('foco-02.js', 'utf8');
const lines = code.split('\n');

// Keep everything before Documentos Dinâmicos (which starts around line 88)
const docDinIndex = lines.findIndex(l => l.includes('// ============================== Documentos Dinâmicos'));
const topPart = lines.slice(0, docDinIndex).join('\n');

const fieldLockerIndex = lines.findIndex(l => l.includes('// ========================= FIELD LOCKER ========================='));
let fieldLockerToEnd = lines.slice(fieldLockerIndex).join('\n');

// Remove any trailing extra } added by auto_brace.js
fieldLockerToEnd = fieldLockerToEnd.replace(/\n\}\n\}\n?$/, '\n');
fieldLockerToEnd = fieldLockerToEnd.replace(/\n\}\n?$/, '\n');

const cleanLoadRipsMatch = code.match(/(function loadRipsEConceituacao\([\s\S]*?window\.addEventListener\('message', \(event\) => \{[\s\S]*?\}\);\r?\n)/);
let cleanLoadRips = cleanLoadRipsMatch ? cleanLoadRipsMatch[1] : '';

cleanLoadRips = `    // ==========================================
    // AUTO-RESTORE RIPs (Inteligência para RIPs importados)
    // ==========================================
    ${cleanLoadRips}`;

const middlePart = `    // ============================== Documentos Dinâmicos ==============================
    if (typeof window.inicializarListaDocumentosDinamica === 'function') {
        window.inicializarListaDocumentosDinamica('aba2_avaliação', 'btnAdicionarDocumentoAvaliacao', 'documentos-list-avaliação');
    }

    // ============================== Limpar ==============================
    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja limpar todos os campos?')) {
                window.location.reload();
            }
        });
    }

`;

const fullCode = topPart + '\n' + middlePart + cleanLoadRips + '});\n\n' + fieldLockerToEnd;

fs.writeFileSync('foco-02-rebuilt.js', fullCode, 'utf8');
console.log('foco-02-rebuilt.js created');
