const fs = require('fs');
const path = require('path');

const dict = {
    '1\uFFFD CRI': '1º CRI',
    'Com\uFFFDrcio': 'Comércio',
    'Regulariza\uFFFD\uFFFDo': 'Regularização',
    'Regulariza\uFFFDo': 'Regularização',
    'regulariza\uFFFD\uFFFDo': 'regularização',
    'regulariza\uFFFDo': 'regularização',
    'Fundi\uFFFDria': 'Fundiária',
    'fundi\uFFFDria': 'fundiária',
    'Destina\uFFFD\uFFFDo': 'Destinação',
    'Destina\uFFFDo': 'Destinação',
    'Esta\uFFFD\uFFFDo': 'Estação',
    'Esta\uFFFDo': 'Estação',
    'Ferrovi\uFFFDria': 'Ferroviária',
    'Pr\uFFFDdio': 'Prédio',
    'Pol\uFFFDticas': 'Políticas',
    'p\uFFFDblicas': 'públicas',
    'P\uFFFDblicos': 'Públicos',
    'estrat\uFFFDgicos': 'estratégicos',
    'comunit\uFFFDrio': 'comunitário',
    'Cess\uFFFD\uFFFDo': 'Cessão',
    'Cess\uFFFDo': 'Cessão',
    'Dire\uFFFD\uFFFDo': 'Direção',
    'Dire\uFFFDo': 'Direção',
    'Servi\uFFFDos': 'Serviços',
    'Galp\uFFFDo': 'Galpão',
    'Transfer\uFFFDncia': 'Transferência',
    'Gest\uFFFD\uFFFDo': 'Gestão',
    'Gest\uFFFDo': 'Gestão',
    'Superintend\uFFFDncia': 'Superintendência',
    'Portu\uFFFDria': 'Portuária',
    'Habita\uFFFD\uFFFDo': 'Habitação',
    'Habita\uFFFDo': 'Habitação',
    'Doa\uFFFD\uFFFDo': 'Doação',
    'Doa\uFFFDo': 'Doação',
    'Sabo\uFFFDo': 'Saboó',
    'Log\uFFFDstica': 'Logística',
    'NITER\uFFFD\uFFFDI': 'NITERÓI',
    'NITER\uFFFDI': 'NITERÓI',
    'Niter\uFFFD\uFFFDi': 'Niterói',
    'Niter\uFFFDi': 'Niterói',
    'Gragoat\uFFFD': 'Gragoatá',
    'Ch\uFFFDcaras': 'Chácaras',
    'Ind\uFFFDstria': 'Indústria',
    'PROPRI\uFFFD': 'PROPRIÁ',
    'BRAS\uFFFDLIA': 'BRASÍLIA',
    'Minist\uFFFDrio': 'Ministério',
    'Inova\uFFFD\uFFFDo': 'Inovação',
    'Inova\uFFFDo': 'Inovação',
    'fict\uFFFDcios': 'fictícios',
    'necess\uFFFDrio': 'necessário',
    'requisi\uFFFD\uFFFDo': 'requisição',
    'requisi\uFFFDo': 'requisição',
    'p\uFFFDgina': 'página',
    'T\uFFFDcnico': 'Técnico',
    'Associa\uFFFD\uFFFDo': 'Associação',
    'Associa\uFFFDo': 'Associação',
    'EST\uFFF7NCIA': 'ESTÂNCIA',
    'EST\uFFFDNCIA': 'ESTÂNCIA'
};

function fixEncoding(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    if (content.includes('\uFFFD')) {
        for (const [broken, correct] of Object.entries(dict)) {
            content = content.split(broken).join(correct);
        }
        
        // Let's also fix standalone ones that might remain by looking at specific words:
        content = content.replace(/an\uFFFDlise/g, 'análise');
        content = content.replace(/An\uFFFDlise/g, 'Análise');
        
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed additional corruptions in:', filePath);
        }
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
