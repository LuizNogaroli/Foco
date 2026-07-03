const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// I will fix the lines exactly
const lines = code.split('\\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('onclick="openSolicitacaoModal') && lines[i].includes('`${label}`')) {
        if (lines[i].includes('`${value}`')) {
            // Filled field
            lines[i] = `                            onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${label.replace(/'/g, "\\\\'")}', '\${(value||'').toString().replace(/'/g, "\\\\'")}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span>`;
        } else {
            // Empty field
            lines[i] = `                            onclick="openSolicitacaoModal('\${rip}', '\${name}', '\${label.replace(/'/g, "\\\\'")}', '')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span>`;
        }
    }
}

fs.writeFileSync('foco-02.js', lines.join('\\n'), 'utf8');
console.log('Fixed quotes properly!');
