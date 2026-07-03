const fs = require('fs');

let html = fs.readFileSync('foco-02.html', 'utf8');

// 1. Remove lápis de edição individuais e de seção
html = html.replace(/<a href="#" class="edit-icon[^>]*onclick="abrirModalEdicao[^>]*>✏️<\/a>\s*/g, '');
html = html.replace(/<a href="#" class="edit-icon edit-section-icon[^>]*onclick="abrirModalSecao[^>]*>✏️<\/a>\s*/g, '');

// 2. Remove código dos modais do final do arquivo
html = html.replace(/<!-- Modal de Edição -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
html = html.replace(/<!-- Modal de Edição da Seção -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');

// 3. Adiciona CSS para edição inline e botão global
const stylesToAdd = `
        .campo-alterado {
            background-color: #fffacd !important;
            border-color: #f59e0b !important;
        }
        .valor-original-hint {
            display: block;
            font-size: 11px;
            color: #64748b;
            margin-top: 3px;
            font-style: italic;
        }
        .btn-habilitar-edicao {
            background-color: #f59e0b;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 15px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.2s;
            width: 100%;
            justify-content: center;
        }
        .btn-habilitar-edicao:hover {
            background-color: #d97706;
        }
`;
if (!html.includes('.campo-alterado')) {
    html = html.replace('</style>', stylesToAdd + '</style>');
}

// 4. Adiciona o botão global de edição
// Onde colocar? No topo da sanfona ou dentro de "Identificação do Imóvel"
const buttonHtml = `
            <div id="container-btn-edicao" style="display: none; margin-top: 15px;">
                <button type="button" class="btn-habilitar-edicao" id="btnHabilitarEdicao" onclick="habilitarModoEdicao()">
                    🔓 Habilitar Correção de Dados do Cadastro
                </button>
                <div id="avisoModoEdicao" style="display: none; background: #fffacd; border-left: 4px solid #f59e0b; padding: 10px; font-size: 13px; color: #b45309; margin-bottom: 15px; border-radius: 4px;">
                    <strong>Modo de Correção Ativo:</strong> Altere os campos abaixo. As diferenças serão salvas automaticamente no rascunho (requerimento) sem afetar o Datalake imediatamente.
                </div>
            </div>
`;
if (!html.includes('id="btnHabilitarEdicao"')) {
    // Insere o botão logo após a barra de pesquisa
    html = html.replace('<div class="accordion" id="accordionIdentificacao">', buttonHtml + '\n            <div class="accordion" id="accordionIdentificacao">');
}

fs.writeFileSync('foco-02.html', html, 'utf8');
console.log('foco-02.html refatorado com sucesso.');
