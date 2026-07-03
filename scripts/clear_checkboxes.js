const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

const clearCheckboxesLogic = `
// Força a limpeza dos checkboxes de conceituação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const checks = document.querySelectorAll('input[name="conceituacao[]"]');
        checks.forEach(c => c.checked = false);
        
        // Esconde a seção de pesquisa do RIP já que limpamos as marcações
        const secaoPesquisa = document.getElementById('secaoPesquisaRip');
        if (secaoPesquisa) {
            secaoPesquisa.style.display = 'none';
        }
    }, 800); // 800ms para rodar DEPOIS do sync.js, garantindo que vai zerar mesmo se o sync tentar preencher
});
`;

if (!js.includes('Força a limpeza dos checkboxes')) {
    js += '\n' + clearCheckboxesLogic;
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('foco-02.js updated to clear checkboxes on load.');
} else {
    console.log('Already clearing checkboxes.');
}
