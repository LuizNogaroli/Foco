const fs = require('fs');
let text = fs.readFileSync('foco-02.js', 'utf8');

const submitIndex = text.indexOf('form.addEventListener(\'submit\', function (e) {');
const documentsIndex = text.indexOf('// ============================== Documentos Dinâmicos');

if (submitIndex > -1 && documentsIndex > -1) {
    const start = text.substring(0, submitIndex);
    const end = text.substring(documentsIndex);
    const fixedSubmit = `form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (form.checkValidity()) {
            const rootWindow = window.parent?.parent || window.parent || window;
            // O motor sync.js cuidará do salvamento na tabela intermediária (foco_drafts)
            alert('☑ Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...');
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-03.html"]');
            if (btnTabNext) {
                setTimeout(() => btnTabNext.click(), 100);
            }
        } else {
            form.reportValidity();
        }
    });

    `;
    
    fs.writeFileSync('foco-02.js', start + fixedSubmit + end, 'utf8');
    console.log('Restored submit block perfectly!');
} else {
    console.log('Could not find indices!');
}
