const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

// I will look for the trailing garbage and remove it.
// The garbage is `                            onclick="openSolicitacaoModal...`
// I will just delete everything after `    });` and before `document.addEventListener('DOMContentLoaded', function() {`
// Actually, let's just use regex to clean it.
code = code.replace(/    \}\);\r?\n\r?\n\s*onclick="openSolicitacaoModal.*?\r?\n/s, '    });\n');
code = code.replace(/    \}\);\n\n\s*onclick="openSolicitacaoModal.*?\n/s, '    });\n');
code = code.replace(/    \}\);\r?\n\s*onclick="openSolicitacaoModal.*?\r?\n/s, '    });\n');

// Also, the `onclick` inside `criarBlocoImóvel` should be correct.
// In the current file, it might not have the correct onclick because `unified_patch.js` ran and might have broken it.
// Let's just run `node -c foco-02.js` to see what else is broken.

fs.writeFileSync('foco-02.js', code, 'utf8');
