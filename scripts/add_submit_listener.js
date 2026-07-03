const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

const submitCode = `
// ==================== Salvar e Avançar ====================
document.addEventListener('DOMContentLoaded', function() {
    const form02 = document.getElementById('form02');
    if (form02) {
        form02.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simula salvamento
            console.log("Formulário Foco-02 salvo.");
            
            // Avança para a aba 3
            if (window.parent && typeof window.parent.nextTab === 'function') {
                window.parent.nextTab();
            } else {
                alert("Salvo com sucesso! (Avançando para Aba 3)");
            }
        });
    }
});
`;

if (!js.includes("form02.addEventListener('submit'")) {
    js += '\n' + submitCode;
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Added submit listener to foco-02.js');
} else {
    console.log('Submit listener already exists in foco-02.js');
}
