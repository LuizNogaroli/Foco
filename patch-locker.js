const fs = require('fs');
let js = fs.readFileSync('foco-02.js', 'utf8');

const newCode = `
// ========================= FIELD LOCKER =========================
// Garante que campos preenchidos por rotinas automáticas fiquem travados, mesmo ao recarregar a aba
document.addEventListener('change', (e) => {
    const id = e.target.id;
    if (id === 'latitude' || id === 'longitude' || id === 'cartorio' || id === 'num_matricula') {
        if (e.target.value && e.target.value !== 'ASas' && e.target.value !== 'A') {
            e.target.readOnly = true;
            e.target.style.backgroundColor = '#e9ecef';
            e.target.style.cursor = 'not-allowed';
        }
    }
});
// ================================================================

`;

if (!js.includes('FIELD LOCKER')) {
    js = js + '\n' + newCode;
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Locker added to foco-02.js');
} else {
    console.log('Locker already exists');
}
