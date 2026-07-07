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
    const payload = {
        rips: ["2026001"],
        cadastros_minimos: [],
        conceituacao_rip: [],
        conceituacao_dispensado: []
    };
    
    const postData = {
        numero_requerimento: processId,
        dados_json: payload
    };

    const url = `${SUPABASE_URL}/rest/v1/tabela_indicacao?on_conflict=numero_requerimento`;
    console.log("Inserting into tabela_indicacao:", url);
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(postData)
        });
        
        if (res.ok) {
            console.log("Data successfully inserted into tabela_indicacao!");
        } else {
            console.error("Failed to insert:", await res.text());
        }
    } catch(e) {
        console.error("Exception:", e);
    }
}
run();
