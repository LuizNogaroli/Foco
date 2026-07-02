const fs = require('fs');
const path = require('path');

const replacements = [
    { broken: /Aba validada e salva na tabela intermedir.ia com sucesso! Avan.ando para a pr.xima etapa\.\.\./g, correct: 'Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...' },
    { broken: /Aba validada e salva na tabela intermedi.ria com sucesso! Avan.ando para a pr.xima etapa\.\.\./g, correct: 'Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...' },
    { broken: /Aba validada e salva na tabela definitiva com sucesso! Avan.ando para a pr.xima etapa\.\.\./g, correct: 'Aba validada e salva na tabela definitiva com sucesso! Avançando para a próxima etapa...' },
    { broken: /Im.vel/g, correct: 'Imóvel' },
    { broken: /Identifica..o/g, correct: 'Identificação' },
    { broken: /Conceitua..o/g, correct: 'Conceituação' },
    { broken: /\.rea/g, correct: 'Área' },
    { broken: /Uni.o/g, correct: 'União' },
    { broken: /H. benfeitorias/g, correct: 'Há benfeitorias' },
    { broken: /constru.da/g, correct: 'construída' },
    { broken: /destina..o/g, correct: 'destinação' },
    { broken: /avalia..o/g, correct: 'avaliação' },
    { broken: /Situa..o/g, correct: 'Situação' },
    { broken: /Incorpora..o/g, correct: 'Incorporação' },
    { broken: /N.mero/g, correct: 'Número' },
    { broken: /Cart.rio/g, correct: 'Cartório' },
    { broken: /Matr.cula/g, correct: 'Matrícula' },
    { broken: /Munic.pio/g, correct: 'Município' },
    { broken: /Endere.o/g, correct: 'Endereço' },
    { broken: /Avan.ando/g, correct: 'Avançando' },
    { broken: /intermedi.ria/g, correct: 'intermediária' },
    { broken: /pr.xima/g, correct: 'próxima' },
    { broken: /Informa..es/g, correct: 'Informações' },
    { broken: /Descri..o/g, correct: 'Descrição' }
];

function fixEncoding(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // If it has replacement character \uFFFD, we know it's broken
    if (content.includes('\uFFFD')) {
        for (let r of replacements) {
            content = content.replace(r.broken, r.correct);
        }
        
        // Final catch-all for remaining \uFFFD characters?
        // Let's replace remaining ones manually using known patterns if any are left
        content = content.replace(/\uFFFDrea/g, 'Área');
        content = content.replace(/Im\uFFFDvel/g, 'Imóvel');
        
        // Save
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
    }
}

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.js'));
for (const file of files) {
    fixEncoding(file);
}
