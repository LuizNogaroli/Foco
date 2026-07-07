const fs = require('fs');
const jsCode = fs.readFileSync('foco-02.js', 'utf8');

const dummyNode = { style: {}, addEventListener: () => {}, insertAdjacentHTML: () => {}, appendChild: () => {}, querySelectorAll: () => ([]), removeAttribute: () => {}, setAttribute: () => {}, classList: { add: () => {}, remove: () => {} } };

global.window = {
    location: { pathname: 'foco-02.html' },
    originalRipData: {},
    addEventListener: () => {},
    setTimeout: (fn) => fn(),
};
global.document = {
    addEventListener: () => {},
    getElementById: () => dummyNode,
    querySelectorAll: () => ([]),
    createElement: () => dummyNode,
    querySelector: () => null,
    body: { insertAdjacentHTML: () => {} }
};
global.sessionStorage = { getItem: () => null };

try {
    eval(jsCode);
    console.log("foco-02.js loaded successfully");
    
    if (typeof window.criarBlocoImovel === 'function') {
        window.criarBlocoImovel('2026001', { conceituacao: 'test' });
        console.log("criarBlocoImovel executed without throwing!");
    } else {
        console.log("criarBlocoImovel is not defined!");
    }
} catch (e) {
    console.error("Runtime error:", e);
}
