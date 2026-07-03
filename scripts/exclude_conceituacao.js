const fs = require('fs');

let js = fs.readFileSync('sync.js', 'utf8');

const bypassLogic = `
                // IGNORAR CHECKBOX DE CONCEITUAÇÃO
                if (input.name === 'conceituacao[]') {
                    return;
                }
`;

if (!js.includes('IGNORAR CHECKBOX DE CONCEITUAÇÃO')) {
    js = js.replace(/const value = state\[input\.name\];/, bypassLogic + '\n                const value = state[input.name];');
    fs.writeFileSync('sync.js', js, 'utf8');
    console.log('sync.js updated to bypass conceituacao[]');
} else {
    console.log('sync.js already bypassing conceituacao[]');
}
