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
    const url = `${SUPABASE_URL}/rest/v1/tabela_requerimentos?select=*`;
    try {
        const res = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        const data = await res.json();
        console.log(`Fetched ${data.length} records.`);
        for (const row of data) {
            console.log(`${row.numero_requerimento}: ${JSON.stringify(row.dados_json.documentos_anexados)}`);
        }
    } catch(e) {
        console.error(e);
    }
}
run();
