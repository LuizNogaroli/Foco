const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

const target = /const inputCepGeo = document\.getElementById\('cep'\);\s+if \(inputCepGeo && !inputCepGeo\.value && data\['imoveis\[0\]\[cep\]'\]\) \{\s+inputCepGeo\.value = data\['imoveis\[0\]\[cep\]'\];\s+inputCepGeo\.dispatchEvent\(new Event\('change', \{ bubbles: true \}\)\);\s+\}/;

const replacement = `const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo && !inputCepGeo.value && rips.length > 0) {
                    // 1. Sort the rips numerically to find the lowest
                    const sortedRips = rips.slice().sort((a, b) => Number(a) - Number(b));
                    const lowestRip = sortedRips[0];
                    
                    // 2. Find the CEP for the lowest RIP
                    let lowestCep = '';
                    if (data._ripsPesquisados && data._ripsPesquisados[lowestRip] && data._ripsPesquisados[lowestRip].cep) {
                        lowestCep = data._ripsPesquisados[lowestRip].cep;
                    } else {
                        // Scan imoveis[x][rip] to find the index that matches lowestRip
                        for (let k of Object.keys(data)) {
                            if (k.match(/^imoveis\\[\\d+\\]\\[rip\\]$/) && data[k] === lowestRip) {
                                const idx = k.match(/^imoveis\\[(\\d+)\\]\\[rip\\]$/)[1];
                                lowestCep = data[\`imoveis[\${idx}][cep]\`] || '';
                                break;
                            }
                        }
                    }

                    if (lowestCep) {
                        console.log("🚩 Auto-preenchendo CEP Geolocalização (com RIP mais baixo: " + lowestRip + ") com:", lowestCep);
                        inputCepGeo.value = lowestCep;
                        inputCepGeo.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }`;

if (target.test(code)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('foco-02.js', code);
    console.log('CEP logic patched successfully.');
} else {
    console.log('Target not found.');
}
