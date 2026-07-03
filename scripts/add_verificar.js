const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

const codeToAdd = `
window.verificarConceituacao = function() {
    const checks = document.querySelectorAll('input[name="conceituacao[]"]:checked');
    const secaoPesquisa = document.getElementById('secaoPesquisaRip');
    if (secaoPesquisa) {
        if (checks.length > 0) {
            secaoPesquisa.style.display = 'block';
        } else {
            secaoPesquisa.style.display = 'none';
        }
    }
};
`;

if (!js.includes('window.verificarConceituacao')) {
    js += '\n' + codeToAdd;
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Added verificarConceituacao to foco-02.js');
} else {
    console.log('Already exists');
}
