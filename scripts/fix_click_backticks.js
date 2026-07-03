const fs = require('fs');
let code = fs.readFileSync('foco-02.js', 'utf8');

const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

const replacementEmpty = `onclick="openSolicitacaoModal('\${rip}', '\${name}', \`\${label}\`, '')">${editIconSVG}</span>`;
const replacementFilled = `onclick="openSolicitacaoModal('\${rip}', '\${name}', \`\${label}\`, \`\${value}\`)">${editIconSVG}</span>`;

// Replace the buggy strings carefully
// There are exactly two matches of `onclick="openSolicitacaoModal...` in foco-02.js right now.
// The first one is in the Empty block (which has '') at the end.
// The second one is in the Filled block (which has '\${value...') at the end.

const parts = code.split('onclick="openSolicitacaoModal(');

if (parts.length === 3) {
    // 0 is before the first onclick
    // 1 is between first and second onclick
    // 2 is after second onclick
    
    // find the end of the span in part 1
    const end1 = parts[1].indexOf('</svg></span>') + '</svg></span>'.length;
    const end2 = parts[2].indexOf('</svg></span>') + '</svg></span>'.length;
    
    code = parts[0] + replacementEmpty + parts[1].substring(end1) + replacementFilled + parts[2].substring(end2);
    
    fs.writeFileSync('foco-02.js', code, 'utf8');
    console.log('Fixed onclick properly!');
} else {
    console.log('Could not parse parts properly. Length = ' + parts.length);
}
