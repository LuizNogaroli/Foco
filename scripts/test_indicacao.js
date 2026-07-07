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
    const url = `${SUPABASE_URL}/rest/v1/tabela_indicacao?select=*&numero_requerimento=eq.${processId}`;
    console.log("Fetching from:", url);
    
    try {
        const res = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        console.log("Data in tabela_indicacao:", JSON.stringify(data, null, 2));
    } catch(e) {
        console.error(e);
    }
}
run();
