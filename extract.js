const fs = require('fs');
const text = fs.readFileSync('foco-01.html', 'utf8');
const lines = text.split('\n');
for (let line of lines) {
    if (line.includes('name="conceituacao[]"')) {
        console.log(line.trim());
    }
}
