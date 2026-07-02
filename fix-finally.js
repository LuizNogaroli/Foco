const fs = require('fs');
let text = fs.readFileSync('foco-02.js', 'utf8');

// 1. Fix CEP logic to remove `!inputCepGeo.value` constraint
const targetCep1 = "if (inputCepGeo && !inputCepGeo.value) {";
const replacementCep1 = "if (inputCepGeo) {";
text = text.replace(targetCep1, replacementCep1);

// 2. Fix Matrícula logic to remove `&& !checksMatricula[0].checked` constraint
const targetMatricula = "if (checksMatricula.length > 0 && !checksMatricula[0].checked && !checksMatricula[1].checked) {";
const replacementMatricula = "if (checksMatricula.length > 0) {";
text = text.replace(targetMatricula, replacementMatricula);

// 3. To avoid overwriting what sync.js put in Cartorio/Matricula, we only set value if it's empty
text = text.replace("inputCartorio.value = '1º Ofício de Registro de Imóveis';", "if (!inputCartorio.value) inputCartorio.value = '1º Ofício de Registro de Imóveis';");
text = text.replace("inputMatricula.value = '1231';", "if (!inputMatricula.value) inputMatricula.value = '1231';");

fs.writeFileSync('foco-02.js', text, 'utf8');
console.log('Patched foco-02.js correctly.');
