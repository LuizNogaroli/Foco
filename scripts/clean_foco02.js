const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// Find the first occurrence of "// ================================================================\n// LÓGICA DE CONCEITUAÇÃO E RIP"
// or anything matching L.*GICA DE CONCEITUA
const match = code.match(/\/\/\s*={10,}\s*\n\/\/\s*L.*GICA DE CONCEITUA[\s\S]*/);
if (match) {
    code = code.substring(0, match.index);
}

// Ensure clean end
code = code.trim() + '\n';

// Now take funcsToAdd from reconstruct_foco02.js
const reconstruct = fs.readFileSync('scripts/reconstruct_foco02.js', 'utf8');
const matchFuncs = reconstruct.match(/const funcsToAdd = `([\s\S]*?)`;/);
if (matchFuncs) {
    const funcsToAdd = matchFuncs[1];
    fs.writeFileSync('foco-02.js', code + '\n' + funcsToAdd, 'utf8');
    console.log('Successfully cleaned and appended functions.');
} else {
    console.log('Failed to extract funcsToAdd');
}
