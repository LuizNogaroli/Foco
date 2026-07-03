const fs = require('fs');
let js = fs.readFileSync('foco-02.js', 'utf8');

const codeToAdd = `
window.pesquisarRip = function() {
    const input = document.getElementById('rip_pesquisa');
    if (!input) return;
    const rip = input.value.trim();
    
    if (rip.length < 7 || rip.length > 11) {
        alert('Por favor, informe um RIP válido (7 a 11 dígitos).');
        return;
    }
    
    // Simular busca no datalake ou recuperar da base carregada em window.parent.tabelaCadastro
    let dados = null;
    if (window.parent && window.parent.tabelaCadastro) {
        dados = window.parent.tabelaCadastro.find(item => item.rip === rip);
    }
    
    // Se não encontrou, usa um mock para testes
    if (!dados) {
        dados = {
            natureza_terreno: "Terreno Nacional Interior",
            tipo_imovel: "terreno",
            cep: "70040-010",
            uf: "DF",
            municipio: "Brasília",
            logradouro: "Esplanada dos Ministérios, Bloco C",
            area_total: "1500",
            valor_avaliado: "2500000.00",
            data_avaliacao: "2023-05-10",
            instrumento_avaliacao: "Laudo Técnico",
            ocupacao: "Ocupado regularmente",
            condicao_urbanizacao: "urbanizado",
            riscos_verificados: ["Risco de invasão/esbulho"],
            restricoes_verificadas: ["Terra indígena"]
        };
    }
    
    if (!window.ripsPesquisados) window.ripsPesquisados = {};
    window.ripsPesquisados[rip] = dados;
    
    if (typeof window.adicionarTagRIP === 'function') {
        window.adicionarTagRIP(rip, dados);
    }
    
    if (typeof window.criarBlocoImovel === 'function') {
        window.criarBlocoImovel(rip, dados);
    }
    
    if (typeof window.preencherCamposGlobais === 'function') {
        window.preencherCamposGlobais(dados);
    }
    
    input.value = '';
    
    if (typeof window.atualizarRipsOcultos === 'function') {
        window.atualizarRipsOcultos();
    }
};
`;

if (!js.includes('window.pesquisarRip')) {
    js += '\n' + codeToAdd;
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Added pesquisarRip back to foco-02.js');
} else {
    console.log('pesquisarRip already exists in foco-02.js');
}
