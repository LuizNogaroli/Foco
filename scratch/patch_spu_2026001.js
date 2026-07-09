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
    const url = `${SUPABASE_URL}/rest/v1/tabela_spu?select=*&numero_rip=eq.2026001`;
    try {
        const res = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        const data = await res.json();
        if (data.length === 0) {
            console.error("RIP 2026001 not found");
            return;
        }
        
        const row = data[0];
        const dados = row.dados_json || {};
        dados.docs_custom_files_aba2_1 = "";
        dados.docs_custom_links_aba2_1 = "https://extranet.spunet.gov.br/documentos/2026001_certidao_matricula.pdf";
        dados.documentos_anexados = [
            {
                nome: "Certidão de Matrícula",
                url: "https://extranet.spunet.gov.br/documentos/2026001_certidao_matricula.pdf"
            }
        ];
        
        const patchRes = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dados_json: dados })
        });
        
        if (patchRes.ok) {
            console.log("RIP 2026001 updated in database successfully!");
        } else {
            console.error("Error patching database:", await patchRes.text());
        }
    } catch(e) {
        console.error(e);
    }
}
run();
