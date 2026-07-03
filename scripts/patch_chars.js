const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

// The search button
code = code.replace(/=\s+Buscar e Adicionar/g, '🔍 Buscar e Adicionar');

// The remove RIP button
code = code.replace(/>=é <\/button>/g, '>✖</button>');

// The accordion icon initialization
code = code.replace(/<span class="accordion-icon" [^>]+>é<\/span>/g, match => {
    return match.replace('>é<', '>▼<');
});

// The accordion toggle icon logic
code = code.replace(/icon\.textContent = 'é';/g, "icon.textContent = '▲';");
code = code.replace(/icon\.textContent = 'é';/g, "icon.textContent = '▼';"); // wait, one was up, one was down. Let's fix this manually

// Let's explicitly replace in toggleAccordion
const toggleStart = code.indexOf('window.toggleAccordion = function');
const toggleEnd = code.indexOf('};', toggleStart);
let toggleStr = code.substring(toggleStart, toggleEnd + 2);
toggleStr = toggleStr.replace("icon.textContent = 'é';", "icon.textContent = '▲';");
toggleStr = toggleStr.replace("icon.textContent = 'é';", "icon.textContent = '▼';");
code = code.substring(0, toggleStart) + toggleStr + code.substring(toggleEnd + 2);

// There might be some other 'é' from 'Área', 'm²' etc. Let's check for specific ones.
// In the renderField HTML
code = code.replace(/style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">é <\/span>/g, 'style="cursor:help; font-size:1.1em; margin-left:6px; color:#ea580c;">⚠️</span>');

// And the labels
code = code.replace(/Área total \(mé\):/g, 'Área total (m²):');
code = code.replace(/Área da União \(mé\):/g, 'Área da União (m²):');
code = code.replace(/Área construída total \(mé\):/g, 'Área construída total (m²):');
code = code.replace(/Área de terreno disponível para destinação \(mé\):/g, 'Área de terreno disponível para destinação (m²):');
code = code.replace(/Área construída disponível para destinação \(mé\):/g, 'Área construída disponível para destinação (m²):');

// Outros acentos perdidos:
code = code.replace(/LPM\/1831 ou LMEO homologadas\?:/g, 'LPM/1831 ou LMEO homologadas?:');
code = code.replace(/Processo de incorporaééo\?:/g, 'Processo de incorporação?:');

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log("Characters patched.");
