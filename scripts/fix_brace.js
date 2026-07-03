const fs = require('fs');

let code = fs.readFileSync('foco-02.js', 'utf8');

// Remove the stray '});'
code = code.replace(/    \}\);\r?\n(document\.addEventListener\('DOMContentLoaded', function\(\) \{)/, '$1');

// Make sure `onclick` doesn't have syntax errors with `\${label}` being evaluated too early
// Wait, the `onclick` issue was that I injected unescaped `${label}`.
// Let's replace the buggy template literal if it exists.
// Since the file is small, let's just reconstruct the full modal logic at the bottom.

fs.writeFileSync('foco-02.js', code, 'utf8');
console.log('Fixed stray brace.');
