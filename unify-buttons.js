const fs = require('fs');
const jsFiles = ['foco-01.js', 'foco-02.js', 'foco-03.js', 'foco-04.js', 'foco-05.js', 'foco-06.js'];
for (let file of jsFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    let nextTab = 'foco-02.html';
    if(file === 'foco-02.js') nextTab = 'foco-03.html';
    if(file === 'foco-03.js') nextTab = 'foco-04.html';
    if(file === 'foco-04.js') nextTab = 'foco-05.html';
    if(file === 'foco-05.js') nextTab = 'foco-06.html';
    if(file === 'foco-06.js') nextTab = 'painel-gerencial.html'; 

    const submitLogicRegex = /alert\(['"`].*?Aba validada.*?(?:\\n)?.*?['"`]\);\s*\/\/[^\n]*\s*const\s+btnTab\w+\s*=\s*rootWindow.*?;\s*if\s*\(btnTab\w+\)\s*btnTab\w+\.click\(\);/gs;
    
    const newSubmitLogic = `
            if (rootWindow.saveToFinal) {
                rootWindow.saveToFinal().then(res => {
                    if (res) {
                        alert('✅ Aba validada e salva na tabela definitiva com sucesso! Avançando para a próxima etapa...');
                        const btnTabNext = rootWindow.document?.querySelector('button[data-url="${nextTab}"]');
                        if (btnTabNext) btnTabNext.click();
                    }
                });
            } else {
                alert('✅ Aba validada com sucesso! (Avançando em modo local...)');
                const btnTabNext = rootWindow.document?.querySelector('button[data-url="${nextTab}"]');
                if (btnTabNext) btnTabNext.click();
            }`;

    if (submitLogicRegex.test(content)) {
        content = content.replace(submitLogicRegex, newSubmitLogic.trim());
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated JS submit logic: ${file}`);
    } else {
        console.log(`Could not find submit logic in ${file}`);
    }
  }
}
