const fs = require('fs');
const text = fs.readFileSync('foco-02.html', 'utf8');
const lines = text.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="cep"') || lines[i].includes('buscarEndereco')) {
        console.log(i + ': ' + lines[i]);
    }
}
