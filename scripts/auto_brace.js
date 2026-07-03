const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

// I will just count the `{` and `}` and if I find missing ones, I will append them to the end!
let open = 0;
let close = 0;
for (const char of code) {
    if (char === '{') open++;
    if (char === '}') close++;
}

if (open > close) {
    const missing = open - close;
    console.log('Missing ' + missing + ' closing braces. Appending...');
    for(let i=0; i<missing; i++) {
        code += '\n}';
    }
    fs.writeFileSync('foco-02.js', code, 'utf8');
} else if (close > open) {
    console.log('Too many closing braces!');
} else {
    console.log('Braces are balanced!');
}
