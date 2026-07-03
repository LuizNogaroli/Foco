const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

// 1. Remove blue pencils
// In `buildField` function:
const badIconHtml = "let iconHtml = `<span class=\"edit-icon\" style=\"cursor: pointer; margin-left: 8px; color: #0056b3;\" title=\"Solicitar Alteraǜo/Inclusǜo\" onclick=\"openSolicitacaoModal('${rip}', '${name}', '${encLabel}', '${encVal}')\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle; margin-top: -3px;\"><path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path></svg></span>`;";
if (js.includes(badIconHtml)) {
    js = js.replace(badIconHtml, 'let iconHtml = ``;');
} else {
    // try regex for iconHtml
    js = js.replace(/let iconHtml = `<span class="edit-icon"[\s\S]*?<\/span>`;/, 'let iconHtml = ``;');
}

// 2. Remove orange pencils in dynamically generated "Identificação do Imóvel"
js = js.replace(/<span class="edit-icon section-edit-icon"[^>]*onclick="openModalSecao[^>]*>[\s\S]*?<\/span><\/h4>/g, '</h4>');

// 3. Fix the "já trazendo um checkbox preenchido" -> that's supposed to happen, we just need auto-load.
// Wait, why did the user complain about it? "ainda está trazendo um checkbox já preenchido"
// Probably because they expected it to be cleared, but if they opened a saved draft, it SHOULD be prefilled!
// But wait! Is the `secaoPesquisaRip` opening automatically? The user said "mas quando clico no checkbox abre o rip". That implies it DID NOT open automatically.
// Why did my `setTimeout` not work?
// Let's modify the loadRipsEConceituacao function in `foco-02.js` directly so we don't rely on `DOMContentLoaded` which might fire before the iframe receives data.

const autoLoadSearchBlock = `
        if (typeof window.verificarConceituacao === 'function') {
            window.verificarConceituacao();
        }
`;
if (js.includes('isRipObrigatorio = false;')) {
    js = js.replace(/isRipObrigatorio = false;\s*}/g, 'isRipObrigatorio = false;\n            }\n            setTimeout(window.verificarConceituacao, 100);');
}

fs.writeFileSync('foco-02.js', js, 'utf8');
console.log('foco-02.js updated to remove dynamic pencils and trigger auto-open.');
