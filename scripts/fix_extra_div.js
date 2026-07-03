const fs = require('fs');
let html = fs.readFileSync('foco-02.html', 'utf8');

const regex = /<!-- ========== FIM MODAL CADASTRO MÍNIMO ========== -->\s*<\/div>\s*<!-- Geolocalização -->/;
const replacement = `<!-- ========== FIM MODAL CADASTRO MÍNIMO ========== -->

        <!-- Geolocalização -->`;

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Fixed extra div in HTML');
} else {
    console.log('Regex did not match');
}
