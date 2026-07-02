const fs = require('fs');

// Patch index.html
let idx = fs.readFileSync('index.html', 'utf8');
idx = idx.replace('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', '');

const fetchOld = /if \(!window\.supabaseClient\) throw new Error\('Supabase Client not found'\);[\s\S]*?if \(error\) throw error;/;
const fetchNew = `
                const url = 'https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/portal_servicos?select=*&order=id.desc';
                const options = {
                    method: 'GET',
                    headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU'
                    }
                };
                const response = await fetch(url, options);
                if (!response.ok) throw new Error('Falha ao buscar no Supabase');
                const data = await response.json();
`;

idx = idx.replace(fetchOld, fetchNew);
fs.writeFileSync('index.html', idx);


// Patch foco-01.js
let foco01 = fs.readFileSync('foco-01.js', 'utf8');
const searchOld = /const \{ data, error \} = await window\.parent\.supabaseClient\.from\('datalake_spunet'\)\.select\('dados_imovel'\)\.eq\('rip', rip\)\.single\(\);[\s\S]*?if \(error \|\| !data \|\| !data\.dados_imovel\) \{/;
const searchNew = `
    const url = 'https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/datalake_spunet?select=dados_imovel&rip=eq.' + rip;
    const options = {
        method: 'GET',
        headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU'
        }
    };
    const response = await fetch(url, options);
    const dataArray = await response.json();
    const data = dataArray && dataArray.length > 0 ? dataArray[0] : null;
    
    if (!response.ok || !data || !data.dados_imovel) {
`;
foco01 = foco01.replace(searchOld, searchNew);
fs.writeFileSync('foco-01.js', foco01);
