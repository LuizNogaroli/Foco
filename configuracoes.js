// configuracoes.js

// Dados simulados (Mock)
const UFS = [
    "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", 
    "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

// Gera servidores dinamicamente por UF
let currentMockServers = [];

// Estado da aplicação
let currentUf = null;
let selectedServer = null;

// Estrutura de dados para armazenar as alocações: { "RJ": [ { server: "RJ-Servidor A", profile: "Chefia SPU/UF" } ] }
let assignments = {}; 

document.addEventListener('DOMContentLoaded', async () => {
    // Aguarda o carregamento do cliente supabase do db.js
    let retries = 0;
    while (!window.supabaseClient && retries < 15) {
        await new Promise(r => setTimeout(r, 200));
        retries++;
    }

    // Carrega dados do Supabase
    if (window.loadConfigRoles) {
        assignments = await window.loadConfigRoles();
    }

    // Inicializa lista de UFs
    const ufList = document.getElementById('ufList');
    UFS.forEach(uf => {
        const li = document.createElement('li');
        li.textContent = `SPU / ${uf}`;
        li.dataset.uf = uf;
        li.onclick = () => selectUf(uf, li);
        ufList.appendChild(li);
    });
});

function selectUf(uf, liElement) {
    // Update UI
    document.querySelectorAll('.uf-list li').forEach(el => el.classList.remove('active'));
    liElement.classList.add('active');

    // Update State
    currentUf = uf;
    selectedServer = null; // reseta seleção
    document.getElementById('btnAssign').disabled = true;

    // Show Panels
    document.getElementById('currentUfLabel').textContent = `SPU/${uf}`;
    document.getElementById('tableUfLabel').textContent = `SPU/${uf}`;
    document.getElementById('allocationGrid').style.display = 'grid';
    document.getElementById('assignmentsCard').style.display = 'block';
    const saveSection = document.getElementById('saveSection');
    if(saveSection) saveSection.style.display = 'block';

    // Clear server selection UI
    document.querySelectorAll('.server-list li').forEach(el => el.classList.remove('selected'));
    
    // Ensure array exists for UF
    if (!assignments[uf]) assignments[uf] = [];

    // Gerar lista de servidores com o prefixo da UF
    currentMockServers = Array.from({length: 26}, (_, i) => `${uf}-Servidor ` + String.fromCharCode(65 + i));
    renderServers(currentMockServers);

    renderAssignments();
}

function renderServers(servers) {
    const list = document.getElementById('serverList');
    list.innerHTML = '';
    servers.forEach(server => {
        const li = document.createElement('li');
        li.textContent = server;
        li.onclick = () => selectServer(server, li);
        list.appendChild(li);
    });
}

function filterServers() {
    const q = document.getElementById('searchServer').value.toLowerCase();
    const filtered = currentMockServers.filter(s => s.toLowerCase().includes(q));
    renderServers(filtered);
    
    // Reselect if still in list
    if (selectedServer) {
        const items = document.querySelectorAll('.server-list li');
        items.forEach(item => {
            if (item.textContent === selectedServer) item.classList.add('selected');
        });
    }
}

function selectServer(server, liElement) {
    document.querySelectorAll('.server-list li').forEach(el => el.classList.remove('selected'));
    liElement.classList.add('selected');
    selectedServer = server;
    document.getElementById('btnAssign').disabled = false;
}

function assignProfile() {
    if (!currentUf || !selectedServer) return;

    const profile = document.querySelector('input[name="profile"]:checked').value;
    const canDistribute = document.getElementById('chkDistribute').checked;

    // Verifica se já não está alocado nesse mesmo perfil
    const existing = assignments[currentUf].find(a => a.server === selectedServer && a.profile === profile);
    if (existing) {
        alert(`${selectedServer} já está alocado como ${profile} em SPU/${currentUf}.`);
        return;
    }

    // Adiciona a alocação
    assignments[currentUf].push({ server: selectedServer, profile: profile, canDistribute: canDistribute });
    
    // Reset do checkbox
    document.getElementById('chkDistribute').checked = false;
    
    renderAssignments();
    
    // Feedback visual opcional
    const btn = document.getElementById('btnAssign');
    const originalText = btn.textContent;
    btn.textContent = 'Adicionado à Lista ✔️';
    btn.style.backgroundColor = '#15803d';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
    }, 1500);
}

function removeAssignment(uf, index) {
    assignments[uf].splice(index, 1);
    renderAssignments();
}

async function salvarAlteracoes() {
    const btn = document.getElementById('btnSaveFinal');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Salvando no Banco de Dados...';
    btn.disabled = true;

    if (window.saveConfigRoles) {
        const success = await window.saveConfigRoles(assignments);
        if (success) {
            btn.innerHTML = '✅ Configurações Salvas com Sucesso!';
            btn.style.backgroundColor = '#15803d';
        } else {
            btn.innerHTML = '❌ Erro ao Salvar (Tente Novamente)';
            btn.style.backgroundColor = '#b91c1c';
            alert('Atenção: Ocorreu um erro de conexão com o banco de dados Supabase.');
        }
    } else {
        alert('Supabase não inicializado.');
    }

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '#1e3a5f';
        btn.disabled = false;
    }, 3000);
}

function renderAssignments() {
    const tbody = document.getElementById('assignmentsTableBody');
    tbody.innerHTML = '';

    const list = assignments[currentUf] || [];

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty-state">Nenhum servidor alocado nesta UF.</td></tr>`;
        return;
    }

    // Ordenar por Perfil e depois por Nome
    const sortedList = [...list].sort((a, b) => {
        if (a.profile !== b.profile) return a.profile.localeCompare(b.profile);
        return a.server.localeCompare(b.server);
    });

    sortedList.forEach((item, index) => {
        // Encontrar o index original para exclusão
        const originalIndex = list.findIndex(x => x === item);

        const tr = document.createElement('tr');
        
        // Estilizar o perfil com cor para facilitar leitura
        let profileColor = '#1e3a5f';
        let badgeBg = '#f1f5f9';
        if (item.profile === 'Superintendência') { profileColor = '#b91c1c'; badgeBg = '#fee2e2'; }
        else if (item.profile === 'Chefia SPU/UF') { profileColor = '#c2410c'; badgeBg = '#ffedd5'; }
        else if (item.profile === 'Coordenação SPU/UF') { profileColor = '#0369a1'; badgeBg = '#e0f2fe'; }

        let permissionBadge = '';
        if (item.canDistribute) {
            permissionBadge = `<span class="badge-permission">✓ Distribui Processos</span>`;
        }

        tr.innerHTML = `
            <td><b>${item.server}</b></td>
            <td>
                <span class="badge-profile" style="color: ${profileColor}; background-color: ${badgeBg};">${item.profile}</span>
                ${permissionBadge}
            </td>
            <td style="text-align: center;">
                <button class="btn-remove" title="Remover Alocação" onclick="removeAssignment('${currentUf}', ${originalIndex})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
