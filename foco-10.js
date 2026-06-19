/**
 * foco-10.js
 * Motor técnico para a Etapa 10 (CDE)
 * Gerencia assinaturas, declarações e o acordeão de premissas
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form10');
    if (!form) return;

    // --- 1. CONFIGURAÇÃO DO ACORDEÃO DE PREMISSAS ---
    const headerPremissas = document.getElementById('header-premissas');
    const corpoPremissas = document.getElementById('corpo-premissas');
    const setaPremissas = document.getElementById('seta-premissas');

    if (headerPremissas) {
        // Inicia fechado por padrão
        corpoPremissas.classList.remove('aberto');
        setaPremissas.classList.remove('aberto');

        headerPremissas.addEventListener('click', () => {
            const aberto = corpoPremissas.classList.toggle('aberto');
            setaPremissas.classList.toggle('aberto', aberto);
        });
    }

    // --- 2. CONFIGURAÇÃO DOS MEMBROS DINÂMICOS ---
    const membros = [
        { id: 'membro1', label: 'Membro 1', cargo: 'Membro do CDE' },
        { id: 'membro2', label: 'Membro 2', cargo: 'Membro do CDE' },
        { id: 'membro3', label: 'Membro 3', cargo: 'Membro do CDE' },
        { id: 'membro4', label: 'Membro 4', cargo: 'Membro do CDE' },
    ];

    const container = document.getElementById('membros-container');
    if (container) {
        membros.forEach((m, idx) => {
            const inicial = (idx + 1).toString();
            const wrapper = document.createElement('div');
            wrapper.className = 'assinatura-wrapper';
            wrapper.id = `wrapper-${m.id}`;
            wrapper.innerHTML = `
              <div class="assinatura-header" id="header-${m.id}" role="button" tabindex="0">
                <div class="info-membro">
                  <div class="avatar">${inicial}</div>
                  <div class="nome-cargo"><strong>${m.label}</strong><span>${m.cargo}</span></div>
                </div>
                <div class="status-badge">
                  <span class="badge-status badge-pendente" id="badge-pendente-${m.id}">⏳ Pendente</span>
                  <span class="badge-status badge-assinado" id="badge-ok-${m.id}">✔ Assinado</span>
                </div>
                <span class="seta-icon" id="seta-${m.id}">▼</span>
              </div>
              <div class="assinatura-corpo" id="corpo-${m.id}">
                <div class="declaracao-box">
                  <h4>Declaração do ${m.label}</h4>
                  <div class="declaracao-opcoes">
                    <label class="decl-opcao"><input type="checkbox" /> Analisei o processo e confirmo a deliberação registrada no formulário.</label>
                    <label class="decl-opcao"><input type="checkbox" /> Os fundamentos apresentados atendem, a meu juízo, às exigências aplicáveis.</label>
                    <label class="decl-opcao"><input type="checkbox" /> Atesto que as premissas foram observadas.</label>
                    <label class="decl-opcao"><input type="checkbox" /> Não tenho conhecimento de fato novo relevante não informado no formulário.</label>
                  </div>
                </div>
                <div class="assinatura-acoes">
                  <div class="campo-grupo-ass"><label>Nome completo</label><input type="text" placeholder="Nome do ${m.label}" id="nome-${m.id}" /></div>
                  <div class="campo-grupo-ass" style="max-width:180px;"><label>Matrícula / SIAPE</label><input type="text" id="matricula-${m.id}" /></div>
                  <button type="button" class="btn-assinar" id="btn-assinar-${m.id}">✔ Assinar</button>
                  <button type="button" class="btn-desfazer" id="btn-desfazer-${m.id}">✕ Desfazer</button>
                </div>
                <div class="resultado-assinatura" id="resultado-${m.id}"><strong>✅ Manifestação registrada com sucesso.</strong></div>
              </div>
            `;
            container.appendChild(wrapper);
        });
    }

    // --- 3. LÓGICA DE ASSINATURA (UNIFICADA) ---
    function setupAssinatura(id) {
        const header = document.getElementById('header-' + id);
        const corpo = document.getElementById('corpo-' + id);
        const seta = document.getElementById('seta-' + id);
        const btnAss = document.getElementById('btn-assinar-' + id);
        const btnDes = document.getElementById('btn-desfazer-' + id);
        const badgePend = document.getElementById('badge-pendente-' + id);
        const badgeOk = document.getElementById('badge-ok-' + id);
        const res = document.getElementById('resultado-' + id);
        const inputs = corpo.querySelectorAll('input');

        if (!header) return;

        header.addEventListener('click', () => {
            const aberto = corpo.classList.toggle('aberto');
            seta.classList.toggle('aberto', aberto);
        });

        btnAss.addEventListener('click', () => {
            const nomeInp = document.getElementById('nome-' + id);
            if (!nomeInp.value.trim()) return alert('Informe o nome completo antes de assinar.');

            badgePend.classList.add('oculto');
            badgeOk.classList.add('visivel');
            btnAss.style.display = 'none';
            btnDes.style.display = 'inline-flex';
            res.style.display = 'flex';
            corpo.classList.add('decl-conteudo-bloqueado');
        });

        btnDes.addEventListener('click', () => {
            badgePend.classList.remove('oculto');
            badgeOk.classList.remove('visivel');
            btnAss.style.display = 'inline-flex';
            btnDes.style.display = 'none';
            res.style.display = 'none';
            corpo.classList.remove('decl-conteudo-bloqueado');
            inputs.forEach(i => i.disabled = false);
        });
    }

    setupAssinatura('presidente');
    membros.forEach(m => setupAssinatura(m.id));

    // --- 4. CONDICIONANTES E REGIME ---
    document.querySelectorAll('input[name="deliberacao"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('bloco-condicionantes').style.display = radio.value === 'aprovar_cond' ? 'block' : 'none';
        });
    });

    document.getElementById('btn-add-cond')?.addEventListener('click', () => {
        const lista = document.getElementById('lista-condicionantes');
        const num = lista.querySelectorAll('.condicionante-item').length + 1;
        const div = document.createElement('div');
        div.className = 'condicionante-item';
        div.innerHTML = `<span>Cond. ${num}</span><input type="text" placeholder="Descreva a condicionante..." />`;
        lista.appendChild(div);
    });

    document.querySelectorAll('input[name="regime_dest"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('campo-regime-alternativo').style.display = radio.value === 'alterar' ? 'block' : 'none';
        });
    });

    // --- 5. MODAL E FINALIZAÇÃO ---
    const modal = document.getElementById('modalEnvio');
    const btnFinalizar = document.getElementById('btnFinalizarCDE');
    
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            const assinado = document.getElementById('badge-ok-presidente').classList.contains('visivel');
            if(!assinado) return alert('⚠️ A assinatura do Presidente é obrigatória.');
            modal.style.display = 'flex';
        });
    }

    document.getElementById('btnFecharModal')?.addEventListener('click', () => modal.style.display = 'none');
    document.getElementById('btnLimpar')?.addEventListener('click', () => confirm('Deseja limpar?') && location.reload());
});
