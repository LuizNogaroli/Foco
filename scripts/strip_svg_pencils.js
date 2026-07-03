const fs = require('fs');

let html = fs.readFileSync('foco-02.html', 'utf8');

// Replace all span tags that have class "edit-icon"
// It's a bit tricky because the span contains an svg, which contains paths.
// So we match <span class="edit-icon" ...> ... </span> using a non-greedy regex that looks for the closing span.
// Because SVG does not have nested spans, this is safe.

let originalLength = html.length;

html = html.replace(/<span class="edit-icon[^>]*>[\s\S]*?<\/svg><\/span>/g, '');

// Also just in case there's any left that didn't have svg inside
html = html.replace(/<span class="edit-icon[^>]*>[\s\S]*?<\/span>/g, '');

fs.writeFileSync('foco-02.html', html, 'utf8');

console.log('Removed SVG pencils. Original length:', originalLength, 'New length:', html.length);
