const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

const codeToAdd = `
// Garante que a seção do RIP abra se os checkboxes vierem preenchidos pelo banco
document.addEventListener('DOMContentLoaded', () => {
    // Tenta rodar logo após 500ms para dar tempo do sync.js preencher os dados
    setTimeout(() => {
        if (typeof window.verificarConceituacao === 'function') {
            window.verificarConceituacao();
        }
    }, 500);
    setTimeout(() => {
        if (typeof window.verificarConceituacao === 'function') {
            window.verificarConceituacao();
        }
    }, 1500);
});
`;

if (!js.includes('Garante que a seção do RIP abra')) {
    js += '\n' + codeToAdd;
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('foco-02.js updated with auto-load for verificarConceituacao.');
} else {
    console.log('foco-02.js already has the auto-load logic.');
}
