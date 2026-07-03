const fs = require('fs');

let js = fs.readFileSync('manifestacao-scripts.js', 'utf8');

// The original `allInputs` only checked radios and checkboxes.
// Let's expand it to `select` as well for validation.
const newCheckState = `
    const checkState = () => {
        let ok = false;
        
        // Verifica se há inputs do tipo radio ou checkbox checados
        allInputs.forEach(i => { if(i.checked) ok = true; });
        
        // Verifica selects
        const selects = document.querySelectorAll('select');
        selects.forEach(s => { if(s.value !== '') ok = true; });
        
        if(submitButton) submitButton.disabled = !ok;
    };

    // Adiciona listener nos selects também
    document.querySelectorAll('select').forEach(s => s.addEventListener('change', checkState));
`;

if (js.includes('const checkState = () => {') && !js.includes('const selects = document.querySelectorAll')) {
    js = js.replace(/const checkState = \(\) => \{[\s\S]*?if\(submitButton\) submitButton\.disabled = !ok;\n    \};/m, newCheckState);
    fs.writeFileSync('manifestacao-scripts.js', js, 'utf8');
    console.log('Fixed manifestacao-scripts.js');
} else {
    console.log('Regex not matched or already fixed');
}
