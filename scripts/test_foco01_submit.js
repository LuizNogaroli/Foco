const fs = require('fs');
const dbCode = fs.readFileSync('db.js', 'utf8');

const urlMatch = dbCode.match(/const SUPABASE_URL = "(.*?)"/);
const keyMatch = dbCode.match(/const SUPABASE_ANON_KEY = "(.*?)"/);

if (!urlMatch || !keyMatch) {
    console.error("Credentials not found");
    process.exit(1);
}

const SUPABASE_URL = urlMatch[1];
const SUPABASE_ANON_KEY = keyMatch[1];

async function run() {
    const processId = '2026001';
    const dadosIndicacao = {
        rips: ["2026001"],
        cadastros_minimos: [],
        conceituacao_rip: [],
        conceituacao_dispensado: []
    };
    
    const url = `${SUPABASE_URL}/rest/v1/tabela_indicacao?on_conflict=numero_requerimento`;
    console.log("URL:", url);
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({ numero_requerimento: processId, dados_json: dadosIndicacao })
        });
        
        console.log("Status:", res.status);
        console.log("Response text:", await res.text());
    } catch(e) {
        console.error("Exception:", e);
    }
}
run();
