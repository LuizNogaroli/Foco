const fs = require('fs');
let text = fs.readFileSync('foco-02.js', 'utf8');

const additionalLogic = `
            // ========================= MOCK DATA AUTO-FILL =========================
            // Isso garante que a Matrícula e outros campos que a senhora viu continuem preenchendo sozinhos
            
            // Matrícula
            const checksMatricula = document.querySelectorAll('input[name="tem_matricula"]');
            if (checksMatricula.length > 0 && !checksMatricula[0].checked && !checksMatricula[1].checked) {
                checksMatricula[0].checked = true; // Sim
                const inputCartorio = document.getElementById('cartorio');
                const inputMatricula = document.getElementById('num_matricula');
                if (inputCartorio) {
                    inputCartorio.value = '1º Ofício de Registro de Imóveis';
                    inputCartorio.readOnly = true;
                    inputCartorio.style.backgroundColor = '#e9ecef';
                    inputCartorio.style.cursor = 'not-allowed';
                }
                if (inputMatricula) {
                    inputMatricula.value = '1231';
                    inputMatricula.readOnly = true;
                    inputMatricula.style.backgroundColor = '#e9ecef';
                    inputMatricula.style.cursor = 'not-allowed';
                }
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
                checksRestricoes.forEach(c => {
                    if (c.value === 'Ambiental' || c.value === 'Patrimônio Histórico') {
                        c.checked = true;
                    }
                });
            }
`;

// Replace the previous MOCK DATA AUTO-FILL completely
if (text.includes('// ========================= MOCK DATA AUTO-FILL =========================')) {
    const start = text.indexOf('// ========================= MOCK DATA AUTO-FILL =========================');
    const end = text.indexOf('clearInterval(consolidadoInterval);');
    text = text.substring(0, start) + additionalLogic + '\n            ' + text.substring(end);
}

// Also update CEP logic to make it readonly
if (text.includes("inputCepGeo.value = data['imovel[0][cep]'];")) {
    text = text.replace("inputCepGeo.value = data['imovel[0][cep]'];", "inputCepGeo.value = data['imovel[0][cep]']; inputCepGeo.readOnly = true; inputCepGeo.style.backgroundColor = '#e9ecef'; inputCepGeo.style.cursor = 'not-allowed';");
}
if (text.includes("inputCepGeo.value = data['imovel_sem_rip[0][cep]'];")) {
    text = text.replace("inputCepGeo.value = data['imovel_sem_rip[0][cep]'];", "inputCepGeo.value = data['imovel_sem_rip[0][cep]']; inputCepGeo.readOnly = true; inputCepGeo.style.backgroundColor = '#e9ecef'; inputCepGeo.style.cursor = 'not-allowed';");
}

fs.writeFileSync('foco-02.js', text, 'utf8');
console.log('Patched foco-02.js styling');
