const fs = require('fs');
const code = fs.readFileSync('foco-02.js', 'utf8');

let clean = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .replace(/'(?:\\'|[^'])*'/g, "''")
    .replace(/"(?:\\"|[^"])*"/g, '""')
    .replace(/`(?:\\`|[^`])*`/g, '``');

const stack = [];
const lines = clean.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{' || char === '(' || char === '[') {
            stack.push({ char, line: i + 1, col: j });
        } else if (char === '}' || char === ')' || char === ']') {
            if (stack.length === 0) {
                console.log(`Unmatched closing '${char}' at line ${i + 1}`);
                process.exit(1);
            }
            const last = stack.pop();
            const expected = last.char === '{' ? '}' : last.char === '(' ? ')' : ']';
            if (char !== expected) {
                console.log(`Mismatched closing '${char}' at line ${i + 1}. Expected '${expected}' to match '${last.char}' from line ${last.line}`);
                process.exit(1);
            }
        }
    }
}

if (stack.length > 0) {
    console.log(`Unclosed symbols:`);
    stack.forEach(s => console.log(`'${s.char}' from line ${s.line}`));
} else {
    console.log('All matched!');
}
