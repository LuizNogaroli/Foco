const fs = require('fs');

const f1Path = 'foco-01.js';
const f2Path = 'foco-02.js';

let f1 = fs.readFileSync(f1Path, 'utf8');
let f2 = fs.readFileSync(f2Path, 'utf8');

// Find the boundaries in foco-01.js
const startLoadRips = f1.indexOf('    // ==========================================');
const autoRestoreStr = 'AUTO-RESTORE RIPs';
const actualStart = f1.indexOf(autoRestoreStr) - 50; // just a rough backup if exact fails, but let's do a robust search

// Let's use regex to extract the chunks safely
const loadRipsRegex = /(\s+\/\/ ==========================================\s+\/\/ AUTO-RESTORE RIPs[\s\S]*?)(?=\s+}\);\s+\/\/ ================================================================\s+\/\/ L\u00e9GICA DE CONCEITUA)/;
const match1 = f1.match(loadRipsRegex);

if (!match1) {
    console.log("Could not find loadRips code in foco-01.js");
    process.exit(1);
}

const loadRipsCode = match1[1];

const windowFunctionsRegex = /(\/\/ ================================================================\s+\/\/ L\u00e9GICA DE CONCEITUA[\s\S]*)/;
const match2 = f1.match(windowFunctionsRegex);

if (!match2) {
    console.log("Could not find windowFunctions code in foco-01.js");
    process.exit(1);
}

const windowFunctionsCode = match2[1];

// Remove from foco-01.js
f1 = f1.replace(loadRipsCode, '');
f1 = f1.replace(windowFunctionsCode, '');

// Clean up foco-01.js
f1 = f1.trim() + '\r\n';

// Now for foco-02.js
// We need to remove the consolidadoInterval logic
const consolidadoRegex = /(\s+\/\/ ============================== Sincronizar Dados Consolidados da Aba 1 ==============================[\s\S]*?)(?=\s+\/\/ ============================== Documentos Din\u00e2micos)/;
f2 = f2.replace(consolidadoRegex, '\r\n');

// We need to inject loadRipsCode inside the DOMContentLoaded of foco-02.js
const insertPoint = f2.indexOf('// ========================= FIELD LOCKER =========================');
if (insertPoint !== -1) {
    const beforeEnd = f2.lastIndexOf('});', insertPoint);
    f2 = f2.substring(0, beforeEnd) + '\r\n' + loadRipsCode + '\r\n' + f2.substring(beforeEnd);
    f2 = f2 + '\r\n' + windowFunctionsCode;
} else {
    console.log("Could not find insert point in foco-02.js");
    process.exit(1);
}

fs.writeFileSync(f1Path, f1, 'utf8');
fs.writeFileSync(f2Path, f2, 'utf8');

console.log("Migration script complete.");
