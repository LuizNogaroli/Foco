// painel-gerencial.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. LÓGICA DE PERMISSÕES (Scaffold)
    // Atualmente permite todos, mas já deixa a lógica estruturada para reunião futura.
    const perfilAtual = 'qualquer'; // Isso viria do token de login ou sessão
    const perfisAutorizados = ['diretoria', 'cde', 'superintendencia', 'secretaria', 'qualquer'];
    
    if (!perfisAutorizados.includes(perfilAtual)) {
        document.body.innerHTML = `
            <div style="padding: 50px; text-align: center; font-family: sans-serif;">
                <h1 style="color: #be123c;">Acesso Negado</h1>
                <p>O seu perfil (${perfilAtual}) não tem permissão para visualizar o Painel Gerencial.</p>
                <button onclick="window.location.href='index.html'" style="padding: 10px 20px; margin-top: 20px;">Voltar ao Painel</button>
            </div>
        `;
        return;
    }

    // Carrega dados iniciais
    await carregarDados();
});

let charts = {}; // Armazena instâncias para destruição ao atualizar

async function carregarDados() {
    try {
        const { data: reqs, error: err1 } = await window.supabaseClient
            .from('tabela_requerimentos')
            .select('*');
            
        const { data: statusFluxo, error: err2 } = await window.supabaseClient
            .from('tabela_status_fluxo')
            .select('*');

        if (err1) throw err1;

        const statusMap = {};
        if (statusFluxo) {
            statusFluxo.forEach(s => statusMap[s.numero_requerimento] = s.dados_json || {});
        }

        const data = reqs.map(r => {
            const fd = r.dados_json || {};
            const st = statusMap[r.numero_requerimento] || {};
            return {
                updated_at: r.updated_at,
                form_data: {
                    status: st.status || st.status_geral || 'Aguardando Análise',
                    status_flow: st.instancia || st.checkpoint || 'SPU/' + (fd.uf || 'ND'),
                    uf: fd.uf || 'ND',
                    tipo_procedimento: fd.regime_requerido || 'Cessão Onerosa',
                    campo12: fd.data_req || ''
                }
            };
        });

        processarMetricas(data);
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        const data = typeof mockProcesses !== 'undefined' ? mockProcesses : [];
        processarMetricas(data);
    }
}

function parseDataBR(dataStr) {
    if (!dataStr) return new Date();
    const parts = dataStr.split('/');
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(dataStr);
}

function processarMetricas(rawData) {
    let totalProcesses = 0;
    let viabilidadesConfirmadas = 0;
    let retidosDirecaoCDE = 0;
    
    let somaTempoGlobal = 0;
    let countTempoGlobal = 0;

    const ufCounts = {};
    const tipoCounts = {};
    
    // SLAs por Checkpoint
    const checkpointSLAs = {
        'SPU/UF': { soma: 0, count: 0 },
        'Direção': { soma: 0, count: 0 },
        'CDE': { soma: 0, count: 0 }
    };

    rawData.forEach(item => {
        const fd = item.form_data || {};
        totalProcesses++;

        let status = fd.status || 'RASCUNHO';
        if (status === 'Admissibilidade confirmada') status = 'Viabilidade confirmada';
        
        let checkpoint = fd.status_flow || 'SPU/UF';
        if (status === 'Viabilidade confirmada') checkpoint = 'Encaminhar à Destinação';

        if (status === 'Viabilidade confirmada') viabilidadesConfirmadas++;
        
        if (checkpoint === 'Direção' || checkpoint === 'CDE') retidosDirecaoCDE++;

        // Distribuição UF
        const uf = fd.uf || 'ND';
        ufCounts[uf] = (ufCounts[uf] || 0) + 1;

        // Distribuição Tipo
        const tipo = fd.tipo_procedimento || 'Cessão de Uso';
        tipoCounts[tipo] = (tipoCounts[tipo] || 0) + 1;

        // Cálculo SLA (Dias)
        const dataReq = parseDataBR(fd.campo12); // Data de requerimento
        let dataFim = new Date(); // Hoje por padrão
        
        // Se já confirmado ou devolvido, usar o created_at do registro ou uma data estática para mock
        if (status === 'Viabilidade confirmada' || status === 'Devolvido para complementação') {
            dataFim = item.updated_at ? new Date(item.updated_at) : new Date(dataReq.getTime() + (Math.random() * 30 + 5) * 86400000); 
        }

        const diffTime = Math.abs(dataFim - dataReq);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        somaTempoGlobal += diffDays;
        countTempoGlobal++;

        // Mapear SLA por Checkpoint (Estimativa baseada no checkpoint atual)
        // Como o DB não tem histórico real, alocamos o SLA total ao checkpoint onde ele mais ficou (o atual).
        if (checkpoint === 'SPU/UF' || checkpoint === 'Direção' || checkpoint === 'CDE') {
            checkpointSLAs[checkpoint].soma += diffDays;
            checkpointSLAs[checkpoint].count++;
        }
    });

    // Atualiza UI KPIs
    document.getElementById('kpi-total').textContent = totalProcesses;
    
    const slaMedio = countTempoGlobal > 0 ? Math.round(somaTempoGlobal / countTempoGlobal) : 0;
    document.getElementById('kpi-sla-global').textContent = slaMedio + ' dias';

    document.getElementById('kpi-confirmadas').textContent = viabilidadesConfirmadas;
    
    const taxaSucesso = totalProcesses > 0 ? Math.round((viabilidadesConfirmadas / totalProcesses) * 100) : 0;
    document.getElementById('kpi-taxa-sucesso').textContent = taxaSucesso + '%';

    document.getElementById('kpi-retidos').textContent = retidosDirecaoCDE;

    // Prepara dados para os Gráficos
    renderizarGraficoUF(ufCounts);
    renderizarGraficoTipo(tipoCounts);
    renderizarGraficoSLA(checkpointSLAs);
}

function renderizarGraficoUF(ufCounts) {
    const ctx = document.getElementById('chartUF').getContext('2d');
    if (charts.uf) charts.uf.destroy();

    const sortedUFs = Object.entries(ufCounts).sort((a, b) => b[1] - a[1]);
    
    charts.uf = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedUFs.map(u => u[0]),
            datasets: [{
                label: 'Processos',
                data: sortedUFs.map(u => u[1]),
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });
}

function renderizarGraficoTipo(tipoCounts) {
    const ctx = document.getElementById('chartTipo').getContext('2d');
    if (charts.tipo) charts.tipo.destroy();

    charts.tipo = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(tipoCounts),
            datasets: [{
                data: Object.values(tipoCounts),
                backgroundColor: ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

function renderizarGraficoSLA(checkpointSLAs) {
    const ctx = document.getElementById('chartCheckpoint').getContext('2d');
    if (charts.sla) charts.sla.destroy();

    const labels = ['SPU/UF', 'Direção', 'CDE'];
    const data = labels.map(l => {
        const d = checkpointSLAs[l];
        return d.count > 0 ? Math.round(d.soma / d.count) : 0;
    });

    charts.sla = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'SLA Médio (Dias)',
                data: data,
                backgroundColor: '#f97316',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}
