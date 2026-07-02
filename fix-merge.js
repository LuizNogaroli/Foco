const fs = require('fs');
let code = fs.readFileSync('foco-01.js', 'utf8');

const regex = /(const dbRip = dbState\._ripsPesquisados \? dbState\._ripsPesquisados\[rip\] : null;[\s\S]*?)(const dadosMock = dbRip \|\| window\.ripsPesquisados\[rip\] \|\| window\.mockRips\?\s*\.\[rip\] \|\| \{[\s\S]*?\};)/;

code = code.replace(regex, (match, p1, p2) => {
    return p1 + `
                const baseMock = {
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
                const mockExistente = window.ripsPesquisados[rip] || (window.mockRips ? window.mockRips[rip] : {}) || {};
                const dbFinal = dbRip || {};
                const dadosMock = Object.assign({}, baseMock, mockExistente, dbFinal);
`;
});

fs.writeFileSync('foco-01.js', code);
console.log('Fixed missing fields by merging.');
