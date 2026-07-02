const fs = require('fs');

const htmlFiles = ['foco-01.html', 'foco-02.html', 'foco-03.html', 'foco-04.html', 'foco-05.html', 'foco-06.html'];
for (let file of htmlFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Salvar rascunho/g, 'Validar e Avançar ➡');
    content = content.replace(/Salvar Rascunho/g, 'Validar e Avançar ➡');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated HTML: ${file}`);
  }
}

const jsFiles = ['foco-01.js', 'foco-02.js', 'foco-03.js', 'foco-04.js', 'foco-05.js', 'foco-06.js'];
for (let file of jsFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Rascunho salvo com sucesso!/g, 'Aba validada com sucesso!');
    content = content.replace(/O resumo do processo foi atualizado e está disponível para visualização/g, 'Avançando para a próxima etapa...');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated JS: ${file}`);
  }
}
