const fs = require('fs');

let js = fs.readFileSync('manifestacao-scripts.js', 'utf8');

const oldCode = `    const checkState = () => {
        let ok = false;
        allInputs.forEach(i => { if(i.checked) ok = true; });
        if(submitButton) submitButton.disabled = !ok;
    };

    allInputs.forEach(i => i.addEventListener('change', checkState));`;

const oldCodeCRLF = `    const checkState = () => {\r
        let ok = false;\r
        allInputs.forEach(i => { if(i.checked) ok = true; });\r
        if(submitButton) submitButton.disabled = !ok;\r
    };\r
\r
    allInputs.forEach(i => i.addEventListener('change', checkState));`;

const newCode = `    const checkState = () => {
        let ok = false;
        allInputs.forEach(i => { if(i.checked) ok = true; });
        
        // Verifica selects tambem
        const selects = document.querySelectorAll('select');
        selects.forEach(s => { if(s.value !== '') ok = true; });
        
        if(submitButton) submitButton.disabled = !ok;
    };

    allInputs.forEach(i => i.addEventListener('change', checkState));
    document.querySelectorAll('select').forEach(s => s.addEventListener('change', checkState));`;

if (js.includes(oldCodeCRLF)) {
    js = js.replace(oldCodeCRLF, newCode);
    fs.writeFileSync('manifestacao-scripts.js', js, 'utf8');
    console.log('Fixed manifestacao-scripts.js (CRLF)');
} else if (js.includes(oldCode)) {
    js = js.replace(oldCode, newCode);
    fs.writeFileSync('manifestacao-scripts.js', js, 'utf8');
    console.log('Fixed manifestacao-scripts.js (LF)');
} else {
    console.log('Could not find code to replace.');
}
