const fs = require('fs');
let html = fs.readFileSync('foco-02.html', 'utf8');
const lines = html.split('\n');
for(let line of lines) {
    if(line.includes('id="cep"')) {
        console.log(line.trim());
    }
}
