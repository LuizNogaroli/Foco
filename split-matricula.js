const fs = require('fs');

// 1. FOCO-01.JS
let f1 = fs.readFileSync('foco-01.js', 'utf8');

f1 = f1.replace(/numero_processo: '1234.56790\/2026-00',\s*matricula: '123\.456 - 1ª CRI SP'/g, "numero_processo: '1234.56790/2026-00',\n                        numero_matricula: '123.456',\n                        cartorio: '1º CRI SP'");

f1 = f1.replace(/\$\{renderField\('Matrícula:', 'matricula', dados\.matricula\)\}/g, "${renderField('Cartório:', 'cartorio', dados.cartorio)}\n            ${renderField('Número da Matrícula:', 'numero_matricula', dados.numero_matricula || dados.matricula)}");

fs.writeFileSync('foco-01.js', f1);

// 2. FOCO-02.HTML
let html = fs.readFileSync('foco-02.html', 'utf8');
html = html.replace(/<div id="bloco-matricula"[\s\S]*?<\/div>/, `<div id="bloco-matricula" style="display:none; margin-top: 10px; flex-direction: column; gap: 8px;">
              <div style="display: flex; gap: 15px;">
                  <div style="flex: 1; display:flex; flex-direction:column; gap:4px; position:relative;">
                      <label for="cartorio">Cartório:</label>
                      <input type="text" id="cartorio" name="cartorio" placeholder="Ex: 1º CRI SP" />
                  </div>
                  <div style="flex: 1; display:flex; flex-direction:column; gap:4px; position:relative;">
                      <label for="num_matricula">Número da Matrícula:</label>
                      <input type="text" id="num_matricula" name="num_matricula" placeholder="Ex: 123.456" />
                  </div>
              </div>
          </div>`);
fs.writeFileSync('foco-02.html', html);

// 3. FOCO-02.JS logic
let f2 = fs.readFileSync('foco-02.js', 'utf8');

const matriculaLogic = `
                // Auto-preencher CEP da Geolocalização (com RIP)
                const inputCepGeo = document.getElementById('cep');
                if (inputCepGeo && !inputCepGeo.value && data['imoveis[0][cep]']) {
                    inputCepGeo.value = data['imoveis[0][cep]'];
                    inputCepGeo.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // MATRÍCULA E CARTÓRIO
                const inputCartorio = document.getElementById('cartorio');
                const inputMatricula = document.getElementById('num_matricula');
                const radioSim = document.querySelector('input[name="tem_matricula"][value="Sim"]');
                const radioNao = document.querySelector('input[name="tem_matricula"][value="N\\u00e3o"]'); // "Não" is sometimes encoded, match "N"
                const blockMat = document.getElementById('bloco-matricula');
                
                // Get from origin (imoveis[1] is typically the first RIP, or we check if there's any)
                // In consolidated data, the first RIP is usually index 1
                const mockMatricula = data['imoveis[1][numero_matricula]'] || data['imoveis[1][matricula]'] || '';
                const mockCartorio = data['imoveis[1][cartorio]'] || '';
                
                if (radioSim && radioNao && blockMat) {
                    if (mockMatricula || mockCartorio) {
                        radioSim.checked = true;
                        if (typeof toggleMatricula === 'function') toggleMatricula();
                        blockMat.style.display = 'flex';
                    }
                    
                    const setHint = (input, val) => {
                        if (!input) return;
                        input.value = val || '';
                        input.readOnly = true;
                        input.style.backgroundColor = val ? '#e9ecef' : '#fff3cd';
                        input.style.borderColor = val ? '#ced4da' : '#ffe69c';
                        
                        // Apply hint icon
                        if (!val) {
                            if (!input.nextElementSibling || input.nextElementSibling.className !== 'hint-icon') {
                                const hint = document.createElement('span');
                                hint.className = 'hint-icon';
                                hint.title = 'Dado ausente na base oficial. Se tiver o dado e desejar atualizá-lo, use o campo de Observações.';
                                hint.innerHTML = 'ℹ️';
                                hint.style.position = 'absolute';
                                hint.style.right = '10px';
                                hint.style.top = '34px';
                                hint.style.cursor = 'help';
                                input.parentNode.appendChild(hint);
                            }
                        }
                    };

                    setHint(inputCartorio, mockCartorio);
                    setHint(inputMatricula, mockMatricula);
                }
`;

// Inject into foco-02.js after setting CEP
f2 = f2.replace(/\/\/ Auto-preencher CEP da Geolocalização \(com RIP\)[\s\S]*?inputCepGeo\.dispatchEvent\(new Event\('change', \{ bubbles: true \}\)\);\n                \}/, matriculaLogic);

fs.writeFileSync('foco-02.js', f2);

console.log('Done!');
