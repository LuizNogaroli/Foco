const fs = require('fs');
let db = fs.readFileSync('db.js', 'utf8');

if (!db.includes('window.portalDeServicos')) {
    const splitLogic = `
// =========================================================================
// SEPARAÇÃO ARQUITETURAL: PORTAL DE SERVIÇOS & DATALAKE SPUNET
// =========================================================================
window.portalDeServicos = [];
window.datalakeSpunet = window.datalakeSpunet || {};

if (window.mockProcesses) {
    window.mockProcesses.forEach(proc => {
        // Deep copy
        let p = JSON.parse(JSON.stringify(proc));
        
        // Extrai os RIPs para o Datalake
        if (p.data && p.data._ripsPesquisados) {
            Object.assign(window.datalakeSpunet, p.data._ripsPesquisados);
            delete p.data._ripsPesquisados; // Remove do Portal
        }
        
        window.portalDeServicos.push(p);
    });
}
`;
    fs.writeFileSync('db.js', db + '\n' + splitLogic);
}

// Update index.html to use portalDeServicos
let idx = fs.readFileSync('index.html', 'utf8');
idx = idx.replace(/mockProcesses/g, 'portalDeServicos');
fs.writeFileSync('index.html', idx);

// In foco-01.js we had a hardcoded datalakeSpunet and portalDeServicos, let's just make it use the window ones.
let foco01 = fs.readFileSync('foco-01.js', 'utf8');
foco01 = foco01.replace(/window\.portalDeServicos = \{[\s\S]*?\}\;/g, '');
foco01 = foco01.replace(/window\.datalakeSpunet = window\.mockRips \|\| \{[\s\S]*?\}\;/g, 'window.datalakeSpunet = (window.parent && window.parent.datalakeSpunet) ? window.parent.datalakeSpunet : (window.datalakeSpunet || {});');
fs.writeFileSync('foco-01.js', foco01);
