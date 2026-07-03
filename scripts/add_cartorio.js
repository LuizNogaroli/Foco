const fs = require('fs');
let js = fs.readFileSync('foco-02.js', 'utf8');

const regex = /\$\{buildField\('Matrícula', 'matricula', dados\.matricula\)\}/;

if (js.match(regex)) {
    js = js.replace(regex, "${buildField('Cartório', 'cartorio', dados.cartorio)}\n            ${buildField('Matrícula', 'matricula', dados.matricula)}");
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Added Cartório successfully');
} else {
    console.log('Regex did not match');
}
