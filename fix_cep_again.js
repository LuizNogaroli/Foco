const fs = require('fs');
let js = fs.readFileSync('foco-02.js', 'utf8');

const targetCep = `                const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo) {
                    if (data['imovel[0][cep]']) {
                        inputCepGeo.value = data['imovel[0][cep]']; inputCepGeo.readOnly = true; inputCepGeo.style.backgroundColor = '#e9ecef'; inputCepGeo.style.cursor = 'not-allowed';
                        // Dispara evento para formatar e buscar no mapa se necessário
                        inputCepGeo.dispatchEvent(new Event('input', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('change', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('blur', { bubbles: true }));
                    } else if (data.cep_imovel) {
                        inputCepGeo.value = data.cep_imovel;
                        inputCepGeo.dispatchEvent(new Event('input', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('change', { bubbles: true }));
                        inputCepGeo.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                }`;

const replacementCep = `                const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo) {
                    // O CEP pode vir de vários campos ou já estar preenchido pelo sync.js
                    let cepVal = data['cep'] || data['imovel[0][cep]'] || data.cep_imovel || inputCepGeo.value;
                    if (cepVal && !inputCepGeo.readOnly) { // Só aplica se não estiver travado (evita loops)
                        inputCepGeo.value = cepVal;
                        inputCepGeo.readOnly = true;
                        inputCepGeo.style.backgroundColor = '#e9ecef';
                        inputCepGeo.style.cursor = 'not-allowed';
                        // Dispara evento UMA VEZ
                        inputCepGeo.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                }`;

if (js.includes("if (data['imovel[0][cep]'])")) {
    js = js.replace(targetCep, replacementCep);
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log("Patched CEP.");
} else {
    console.log("Could not find CEP block.");
}
