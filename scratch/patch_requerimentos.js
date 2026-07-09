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

const pdfMapping = {
    "Requerimento inicial": "PDF_1_Nononononononono.pdf",
    "Contrato social / Estatuto": "PDF_2_Nononononononono.pdf",
    "Identificação do representante": "PDF_3_Nononononononono.pdf",
    "Procuração": "PDF_4_Nononononononono.pdf",
    "Comprovante de situação cadastral": "PDF_5_Nononononononono.pdf"
};

// Default documents lists if missing
const defaultDocs = {
    "PR2026001": [
        { "nome": "Requerimento inicial" }
    ],
    "DF2026002": [
        { "nome": "Requerimento inicial" }
    ],
    "RJ2026003": [
        { "nome": "Requerimento inicial" },
        { "nome": "Contrato social / Estatuto" },
        { "nome": "Identificação do representante" },
        { "nome": "Procuração" }
    ]
};

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
        console.log(`Fetched ${data.length} records to patch.`);

        for (const row of data) {
            const reqNum = row.numero_requerimento;
            const dados = row.dados_json || {};
            let updated = false;

            if (!dados.documentos_anexados || !Array.isArray(dados.documentos_anexados)) {
                // If it is undefined or empty, load from defaults
                const defaultList = defaultDocs[reqNum] || [{ "nome": "Requerimento inicial" }];
                dados.documentos_anexados = defaultList;
                updated = true;
                console.log(`Initialized documentos_anexados for Req ${reqNum}.`);
            }

            dados.documentos_anexados = dados.documentos_anexados.map(doc => {
                const docName = doc.nome;
                const pdfPath = pdfMapping[docName] || "PDF_1_Nononononononono.pdf";
                if (doc.url !== pdfPath) {
                    doc.url = pdfPath;
                    updated = true;
                }
                return doc;
            });

            if (updated) {
                const patchUrl = `${SUPABASE_URL}/rest/v1/tabela_requerimentos?numero_requerimento=eq.${reqNum}`;
                const patchRes = await fetch(patchUrl, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ dados_json: dados })
                });

                if (patchRes.ok) {
                    console.log(`✅ Req ${reqNum} updated successfully.`);
                } else {
                    console.error(`❌ Failed to update Req ${reqNum}:`, await patchRes.text());
                }
            } else {
                console.log(`ℹ️ Req ${reqNum} already up-to-date.`);
            }
        }
    } catch(e) {
        console.error("Error occurred:", e);
    }
}
run();
