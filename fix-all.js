const fs = require('fs');

// 1. FIX FOCO-01.JS
let foco01 = fs.readFileSync('foco-01.js', 'utf8');
foco01 = foco01.replace(/if \(btnTabNext\) btnTabNext\.click\(\);\s+?\} else \{\s+?form01\.reportValidity\(\);/g, "if (btnTabNext) btnTabNext.click();\n            }\n        } else {\n            form01.reportValidity();");

fs.writeFileSync('foco-01.js', foco01);

// 2. FIX DB.JS to add mock fields to all _ripsPesquisados
let dbJs = fs.readFileSync('db.js', 'utf8');

const regex = /(_ripsPesquisados:\s*\{[\s\S]*?\n\s*\})/g;
dbJs = dbJs.replace(regex, (match) => {
    // For each rip definition inside _ripsPesquisados, add the fields
    return match.replace(/("[0-9]+":\s*\{\s*rip:\s*"[0-9]+",\s*descricao:\s*"[^"]+",\s*municipio:\s*"[^"]+",\s*origem:\s*"[^"]+"\s*\})/g, (ripMatch) => {
        // We will insert the other fields before the closing brace
        return ripMatch.replace(/\s*\}$/, `,
            conceituacao: 'Gleba simulada',
            natureza: 'Urbano',
            tipoImovel: 'Terreno',
            cep: '00000-000',
            uf: 'NA',
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
        }`);
    });
});

fs.writeFileSync('db.js', dbJs);
console.log('Fixed syntax and updated db.js mock data');
