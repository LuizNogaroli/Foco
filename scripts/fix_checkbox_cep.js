const fs = require('fs');

// 1. Fix JavaScript (buscarCep)
let js = fs.readFileSync('foco-02.js', 'utf8');
if (!js.includes('window.buscarCep')) {
    const cepLogic = `
window.buscarCep = async function(cep) {
    const cleanCep = cep.replace(/\\D/g, '');
    if (cleanCep.length !== 8) return;
    try {
        const res = await fetch(\`https://viacep.com.br/ws/\${cleanCep}/json/\`);
        const data = await res.json();
        if (!data.erro) {
            document.getElementById('logradouro_sem_rip').value = data.logradouro || '';
            document.getElementById('municipio_sem_rip').value = data.localidade || '';
            document.getElementById('uf_sem_rip').value = data.uf || '';
        }
    } catch (e) {
        console.error('Erro ao buscar CEP', e);
    }
};
`;
    js = js.trim() + '\n\n' + cepLogic;
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Added buscarCep logic.');
}

// 2. Ultra Brute-Force Checkbox Fix
let html = fs.readFileSync('foco-02.html', 'utf8');

const bruteStyle = "width: 18px !important; height: 18px !important; cursor: pointer !important; appearance: auto !important; display: inline-block !important; pointer-events: auto !important; opacity: 1 !important; visibility: visible !important; z-index: 99999 !important; position: relative !important;";

html = html.replace(/<input type="checkbox" name="modal_conceituacao\[\]" value="([^"]+)" style="[^"]+">/g, 
    '<input type="checkbox" name="modal_conceituacao[]" value="$1" style="' + bruteStyle + '">');

// Also make the label pointer-events auto just in case
html = html.replace(/<label style="display: flex;/g, '<label style="pointer-events: auto !important; display: flex;');

fs.writeFileSync('foco-02.html', html, 'utf8');
console.log('Brute-forced checkboxes.');
