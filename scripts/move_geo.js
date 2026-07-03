const fs = require('fs');

let html = fs.readFileSync('foco-02.html', 'utf8');

// 1. Extract Geolocalização block
const geoStartStr = "<!-- Geolocalização -->";
const avaliacaoStr = "<!-- Avaliação -->";

const geoStartIndex = html.indexOf(geoStartStr);
const avaliacaoIndex = html.indexOf(avaliacaoStr);

if (geoStartIndex !== -1 && avaliacaoIndex !== -1) {
    const geoBlock = html.substring(geoStartIndex, avaliacaoIndex);
    
    // 2. Remove from original location
    html = html.substring(0, geoStartIndex) + html.substring(avaliacaoIndex);
    
    // 3. Insert before Botões
    const botoesStr = "<!-- Botões -->";
    const botoesIndex = html.indexOf(botoesStr);
    
    if (botoesIndex !== -1) {
        html = html.substring(0, botoesIndex) + geoBlock + "\n      " + html.substring(botoesIndex);
        fs.writeFileSync('foco-02.html', html, 'utf8');
        console.log('Successfully moved Geolocalização block.');
    } else {
        console.log('Could not find Botões block.');
    }
} else {
    console.log('Could not find Geolocalização or Avaliação blocks.');
}
