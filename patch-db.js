const fs = require('fs');

let db = fs.readFileSync('db.js', 'utf8');

const SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

const loadDraftRegex = /async function loadDraftFromDB\(\) \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\}\n\}/;
const newLoadDraft = `async function loadDraftFromDB() {
    if (!PROCESS_ID) return;

    try {
        const headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        };

        // 1. Tenta buscar da foco_drafts
        const draftUrl = SUPABASE_URL + '/rest/v1/foco_drafts?select=form_data&process_id=eq.' + PROCESS_ID;
        let res = await fetch(draftUrl, { headers });
        let data = await res.json();

        if (data && data.length > 0) {
            window.formDataState = data[0].form_data;
            console.log('Rascunho carregado da foco_drafts:', window.formDataState);
        } else {
            // 2. Não achou rascunho. Busca da portal_servicos
            console.log('Nenhum rascunho encontrado. Buscando da portal_servicos...');
            const portalUrl = SUPABASE_URL + '/rest/v1/portal_servicos?select=form_data&process_id=eq.' + PROCESS_ID;
            let resPortal = await fetch(portalUrl, { headers });
            let dataPortal = await resPortal.json();

            if (dataPortal && dataPortal.length > 0) {
                window.formDataState = dataPortal[0].form_data;
                console.log('Dados importados do Portal! Iniciando novo rascunho.');
                // Salva imediatamente no foco_drafts
                await window.saveDraftToDB();
            } else {
                console.error('Processo não encontrado em lugar nenhum!');
                return;
            }
        }

        // Dispara o evento para os iframes
        const iframe = document.getElementById('frame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'DATABASE_LOADED', data: window.formDataState }, '*');
        }

    } catch (err) {
        console.error('Erro inesperado ao carregar rascunho:', err);
    }
}`;

db = db.replace(loadDraftRegex, newLoadDraft);

const saveDraftRegex = /async function executeSaveDraft\(\) \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\}\n\}/;
const newSaveDraft = `async function executeSaveDraft() {
    window.isSaving = true;
    try {
        // Envia evento para colher os dados atuais do iframe
        const iframe = document.getElementById('frame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'REQUEST_SAVE' }, '*');
        }

        // Dá um tempinho para o iframe responder com os dados atualizados
        await new Promise(r => setTimeout(r, 200));

        // Mescla form_data_state com campos globais adicionais se necessário
        let payload = { ...window.formDataState };
        payload.updated_at = new Date().toISOString();

        const headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        };

        const postData = {
            process_id: PROCESS_ID,
            form_data: payload
        };

        const url = SUPABASE_URL + '/rest/v1/foco_drafts';
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(postData)
        });

        if (!res.ok) {
            console.error('Falha ao salvar rascunho', await res.text());
        } else {
            console.log('Rascunho salvo com sucesso no foco_drafts!');
            const savedMsg = document.getElementById('savedMessage');
            if (savedMsg) {
                savedMsg.style.display = 'block';
                savedMsg.style.opacity = '1';
                setTimeout(() => { savedMsg.style.opacity = '0'; }, 2000);
            }
        }
    } catch (err) {
        console.error('Erro de rede ao salvar rascunho:', err);
    } finally {
        window.isSaving = false;
    }
}`;

db = db.replace(saveDraftRegex, newSaveDraft);

// Remover a inicialização do Supabase Client nativo
db = db.replace(/if \(SUPABASE_URL \!==[\s\S]*?\/\/ Listeners/m, '// Listeners');

fs.writeFileSync('db.js', db);

// Remove supabase script from processo.html
let procHtml = fs.readFileSync('processo.html', 'utf8');
procHtml = procHtml.replace('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', '');
fs.writeFileSync('processo.html', procHtml);
