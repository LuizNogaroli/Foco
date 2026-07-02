const fs = require('fs');
let text = fs.readFileSync('foco-02.js', 'utf8');

const additionalLogic = `
            // ========================= MOCK DATA AUTO-FILL =========================
            // Isso garante que a Matrícula e outros campos que a senhora viu continuem preenchendo sozinhos
            
            // Matrícula
            const checksMatricula = document.querySelectorAll('input[name="tem_matricula"]');
            if (checksMatricula.length > 0 && !checksMatricula[0].checked && !checksMatricula[1].checked) {
                // Auto preenche só se estiver vazio
                checksMatricula[0].checked = true; // Sim
                const inputCartorio = document.getElementById('cartorio_matricula');
                const inputMatricula = document.getElementById('numero_matricula');
                if (inputCartorio) inputCartorio.value = '1º Ofício de Registro de Imóveis';
                if (inputMatricula) inputMatricula.value = '1231';
            }

            // Município
            const ufSelect = document.getElementById('uf');
            if (ufSelect && !ufSelect.value) {
                ufSelect.value = 'DF';
                ufSelect.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(() => {
                    const munSelect = document.getElementById('municipio');
                    if (munSelect) {
                        munSelect.value = 'Brasília';
                        munSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }, 300);
            }

            // Restrições e Riscos
            const checksRestricoes = document.querySelectorAll('input[name="restricoes_verificadas"]');
            if (checksRestricoes.length > 0) {
                // Marca algumas restrições de exemplo
                checksRestricoes.forEach(c => {
                    if (c.value === 'Ambiental' || c.value === 'Patrimônio Histórico') {
                        c.checked = true;
                    }
                });
            }
`;

const targetStr = 'clearInterval(consolidadoInterval);';
if (text.includes(targetStr) && !text.includes('MOCK DATA AUTO-FILL')) {
    text = text.replace(targetStr, additionalLogic + '\n            ' + targetStr);
    fs.writeFileSync('foco-02.js', text, 'utf8');
    console.log('Restored mock auto-fill!');
} else {
    console.log('Could not patch mock logic.');
}
