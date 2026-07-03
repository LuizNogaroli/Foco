const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

const badCode = `            if (window.parent && typeof window.parent.nextTab === 'function') {
                window.parent.nextTab();
            } else {
                alert("Salvo com sucesso! (Avançando para Aba 3)");
            }`;

const goodCode = `            const rootWindow = window.parent?.parent || window.parent || window;
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-03.html"]');
            
            if (btnTabNext) {
                alert("Salvo com sucesso! (Avançando para Aba 3)");
                setTimeout(() => btnTabNext.click(), 200);
            } else {
                alert("Salvo com sucesso! (Não foi possível encontrar o botão da Aba 3)");
            }`;

if (js.includes(badCode)) {
    js = js.replace(badCode, goodCode);
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Fixed tab advancement.');
} else {
    console.log('Bad code not found.');
}
