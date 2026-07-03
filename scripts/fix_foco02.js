const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// Replace the broken block
const brokenRegex = /\/\/ com base nos checkboxes restaurados pelo motor de sync\.[\s\S]*?\/\/ ============================== Documentos Dinâmicos/m;

const replacement = `// com base nos checkboxes restaurados pelo motor de sync.
        if (typeof window.verificarConceituacao === 'function') {
            window.verificarConceituacao();
        }
    }

    // Tenta rodar logo apés 400ms se o banco foi répido, ou aguarda o Trigger Oficial
    setTimeout(() => {
        if (window.parent && window.parent.formDataState && Object.keys(window.parent.formDataState).length > 0) {
            loadRipsEConceituacao(window.parent.formDataState);
        }
    }, 400);

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'DATABASE_LOADED') {
            loadRipsEConceituacao(event.data.data);
        }
    });

// ============================== Documentos Dinâmicos`;

code = code.replace(brokenRegex, replacement);

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Fixed foco-02.js');
