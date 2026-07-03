const fs = require('fs');
const lines = fs.readFileSync('foco-02.js', 'utf8').split('\n');
let nesting = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === '{') nesting++;
        if (char === '}') nesting--;
    }
    if (nesting < 0) {
        console.log(`Negative nesting at line ${i+1}: ${line}`);
    }
}
console.log('Final nesting:', nesting);
