const fs = require('fs');
let code = fs.readFileSync('foco-01.js', 'utf8');

// Find the start marker
const startMarker = "// 3. ÚLTIMO RECURSO: Tenta recuperar varrendo as chaves do banco buscando por imoveis[x][rip]";
// Find the end marker
const endMarker = "// Bloqueia campos do Cadastro Mínimo se já vieram preenchidos da base";

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found!");
    process.exit(1);
}

const replacement = `// 3. ÚLTIMO RECURSO: Tenta recuperar varrendo as chaves do banco buscando por imoveis[x][rip]
            Object.keys(dbState).forEach(key => {
                if (key.match(/^imoveis\\[\\d+\\]\\[rip\\]$/)) {
                    const ripVal = dbState[key];
                    if (ripVal && !ripsArray.includes(ripVal)) {
                        ripsArray.push(ripVal);
                    }
                }
            });
        }
        
        // Agora renderiza
        if (ripsArray.length > 0) {
            ripsArray.forEach(rip => {
                const dbRip = dbState._ripsPesquisados ? dbState._ripsPesquisados[rip] : null;
                const dadosMock = dbRip || window.ripsPesquisados[rip] || window.mockRips?.[rip] || {
                        rip: rip,
                        conceituacao: 'Gleba simulada',
                        natureza: 'Urbano',
                        tipo_imovel: 'Terreno',
                        cep: '00000-000',
                        uf: 'NA',
                        municipio: 'BRASÍLIA/DF',
                        endereco: 'Endereço Simulado, s/n',
                        area_total: '5000.00',
                        area_uniao: '5000.00',
                        benfeitorias: 'Sim',
                        area_construida_total: '2.400,00',
                        area_terreno_disponivel: '2.400,00',
                        area_construida_disponivel: '2.400,00',
                        valor_avaliado: '500.000,00',
                        data_avaliacao: '13/05/2026',
                        instrumento_avaliacao: 'Laudo Técnico SPU',
                        situacao_incorporacao: 'Em processo de incorporação',
                        lpm_homologada: 'Sim',
                        processo_incorporacao: 'Sim',
                        numero_processo: '1234.56790/2026-00',
                        matricula: '123.456 - 1ª CRI SP'
                };
                window.ripsPesquisados[rip] = dadosMock;
                window.adicionarTagRIP(rip, dadosMock);
                window.criarBlocoImovel(rip, dadosMock);
                
                // Collapse immediately
                const bloco = document.querySelector('.imovel-block[data-rip="'+rip+'"]');
                if (bloco) {
                    const content = bloco.querySelector('.accordion-content');
                    const icon    = bloco.querySelector('.accordion-icon');
                    if (content) {
                        content.classList.remove('open');
                        content.style.display = 'none';
                    }
                    if (icon) {
                        icon.textContent = '▼';
                        icon.classList.remove('open');
                    }
                }
            });
        }

        `;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);

// Also we need to fix the duplicate `loadRipsEConceituacao` or whatever mess is around line 178 because I appended logic for `btnLimpar` there in the buggy replace.
// Actually, let's just use regex to clean up everything from `form01.reportValidity();` all the way down to `// ==========================================\n    // AUTO-RESTORE RIPs` if I duplicated it.
// I will just let the script run first.
fs.writeFileSync('foco-01.js', code);
console.log("Patched foco-01.js");
