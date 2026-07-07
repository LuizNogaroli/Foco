const fs = require('fs');
const jsCode = fs.readFileSync('sync.js', 'utf8');

const dummyNode = { style: {}, value: '', dispatchEvent: () => {}, addEventListener: () => {}, insertAdjacentHTML: () => {}, appendChild: () => {}, querySelectorAll: () => ([]), removeAttribute: () => {}, setAttribute: () => {}, classList: { add: () => {}, remove: () => {} } };

global.window = {
    location: { pathname: 'foco-02.html' },
    originalRipData: {},
    addEventListener: (evt, fn) => { if(evt === 'DOMContentLoaded') fn(); },
    setTimeout: (fn) => fn(),
    criarBlocoImovel: () => {},
    adicionarTagRIP: () => {},
    ripsPesquisados: {}
};
global.document = {
    addEventListener: (evt, fn) => { if(evt === 'DOMContentLoaded') fn(); },
    getElementById: () => dummyNode,
    querySelectorAll: () => ([]),
    createElement: () => dummyNode,
    querySelector: () => null,
    body: { insertAdjacentHTML: () => {}, appendChild: () => {} },
    head: { appendChild: () => {} }
};
global.sessionStorage = { getItem: () => null };
global.localStorage = { getItem: () => JSON.stringify({ '_ripsPesquisados': { '2026001': { cep: 'test' } } }) };

try {
    eval(jsCode);
    console.log("sync.js loaded successfully");
} catch (e) {
    console.error("Runtime error in sync.js:", e);
}
