const fs = require('fs');

// 1. Wrap global sections in foco-02.html
let html = fs.readFileSync('foco-02.html', 'utf8');

// The start is before "<!-- Avaliação -->"
const startMarker = '<!-- Avaliação -->';
// The end is before "</form>"
const endMarker = '</form>';

if (!html.includes('id="global-sections-container"')) {
    html = html.replace(startMarker, '<div id="global-sections-container" style="display: none;">\n      ' + startMarker);
    html = html.replace(endMarker, '</div>\n    ' + endMarker);
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Wrapped global sections in HTML.');
} else {
    console.log('Global sections already wrapped in HTML.');
}

// 2. Show container in foco-02.js when pesquisarRip is called
let js = fs.readFileSync('foco-02.js', 'utf8');
if (!js.includes("document.getElementById('global-sections-container').style.display = 'block';")) {
    // we want to put it inside window.pesquisarRip
    // wait, I just wrote pesquisarRip at the bottom!
    // I can replace "if (typeof window.atualizarRipsOcultos === 'function') {" 
    // with "document.getElementById('global-sections-container').style.display = 'block';\n    if (typeof window.atualizarRipsOcultos === 'function') {"
    js = js.replace(
        "if (typeof window.atualizarRipsOcultos === 'function') {",
        "const container = document.getElementById('global-sections-container');\n    if(container) container.style.display = 'block';\n\n    if (typeof window.atualizarRipsOcultos === 'function') {"
    );
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Updated pesquisarRip to show global sections.');
} else {
    console.log('pesquisarRip already shows global sections.');
}

