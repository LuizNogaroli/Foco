const fs = require('fs');
const path = require('path');

const map = {
    'Identifica\uFFFD\uFFFDo': 'Identificação',
    'Identifica\uFFFDo': 'Identificação',
    'Im\uFFFDvel': 'Imóvel',
    '\uFFFDrea': 'Área',
    'Uni\uFFFDo': 'União',
    'H\uFFFD benfeitorias': 'Há benfeitorias',
    'constru\uFFFDda': 'construída',
    'destina\uFFFD\uFFFDo': 'destinação',
    'destina\uFFFDo': 'destinação',
    'avalia\uFFFD\uFFFDo': 'avaliação',
    'avalia\uFFFDo': 'avaliação',
    'Situa\uFFFD\uFFFDo': 'Situação',
    'Situa\uFFFDo': 'Situação',
    'Incorpora\uFFFD\uFFFDo': 'Incorporação',
    'Incorpora\uFFFDo': 'Incorporação',
    'N\uFFFDmero': 'Número',
    'Cart\uFFFDrio': 'Cartório',
    'Matr\uFFFDcula': 'Matrícula',
    'Munic\uFFFDpio': 'Município',
    'Endere\uFFFDo': 'Endereço',
    'Se\uFFFD\uFFFDo': 'Seção',
    'Se\uFFFDo': 'Seção',
    'Intermedia\uFFFD\uFFFDo': 'Intermediação',
    'Intermedia\uFFFDo': 'Intermediação',
    'M\uFFFDnimo': 'Mínimo',
    'L\uFFFDgica': 'Lógica',
    'din\uFFFDmicos': 'dinâmicos',
    'formul\uFFFDrio': 'formulário',
    'op\uFFFD\uFFFDo': 'opção',
    'op\uFFFDo': 'opção',
    'bot\uFFFDes': 'botões',
    'Avan\uFFFDando': 'Avançando',
    'sincroniza\uFFFD\uFFFDo': 'sincronização',
    'sincroniza\uFFFDo': 'sincronização',
    'edi\uFFFD\uFFFDo': 'edição',
    'edi\uFFFDo': 'edição',
    'pr\uFFFDxima': 'próxima',
    'intermedi\uFFFDria': 'intermediária',
    'Conceitua\uFFFD\uFFFDo': 'Conceituação',
    'Conceitua\uFFFDo': 'Conceituação',
    'Informa\uFFFD\uFFFDes': 'Informações',
    'Informa\uFFFDes': 'Informações',
    'Descri\uFFFD\uFFFDo': 'Descrição',
    'Descri\uFFFDo': 'Descrição',
    'restri\uFFFD\uFFFDes': 'restrições',
    'restri\uFFFDes': 'restrições',
    'restri\uFFFD\uFFFDo': 'restrição',
    'restri\uFFFDo': 'restrição',
    'incid\uFFFDncia': 'incidência',
    'Pend\uFFFDncias': 'Pendências',
    'vincula\uFFFD\uFFFDo': 'vinculação',
    'vincula\uFFFDo': 'vinculação',
    'mitig\uFFFDvel': 'mitigável',
    'inconsist\uFFFDncias': 'inconsistências',
    'orienta\uFFFD\uFFFDes': 'orientações',
    'orienta\uFFFDes': 'orientações',
    'complementa\uFFFD\uFFFDo': 'complementação',
    'complementa\uFFFDo': 'complementação',
    'pass\uFFFDvel': 'passível',
    'Usu\uFFFDrio': 'Usuário',
    'din\uFFFDmica': 'dinâmica',
    'N\uFFFDo': 'Não',
    'n\uFFFDo': 'não',
    '\uFFFDY\uFFFD?\uFFFD': '📄',
    '\uFFFDY\uFFFD\uFFFD': '📄',
    '\uFFFDY\'?\uFFFD?': '👁️',
    '\uFFFDY?\uFFFD': '👁️',
    '\uFFFDYs\uFFFD': '🔄',
    'Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa': 'Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa',
    'Aba validada e salva na tabela definitiva com sucesso! Avançando para a próxima etapa': 'Aba validada e salva na tabela definitiva com sucesso! Avançando para a próxima etapa'
};

function fixEncoding(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const [broken, correct] of Object.entries(map)) {
        // Use split/join to replace all occurrences
        content = content.split(broken).join(correct);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file.startsWith('.')) continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            fixEncoding(fullPath);
        }
    }
}

processDir('.');