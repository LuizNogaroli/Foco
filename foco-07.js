/**
 * foco-07.js
 * Lógica restaurada e aprimorada da Etapa 7
 * Gerencia Seções A, B e C com caminhos condicionais e Modal
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form07');
    if (!form) return;

    // --- 1. CONFIGURAÇÃO PADRÃO DE SEÇÕES DE ASSINATURA ---
    function setupAssinatura(suffix) {
        const wrapper = document.getElementById(`acordeao-${suffix}`);
        const header = document.getElementById(`acordeao-header-${suffix}`);
        const btnAssinar = document.getElementById(`btn-assinar-${suffix}`);
        const btnLimpar = document.getElementById(`btn-limpar-${suffix}`);
        const badgeOk = document.getElementById(`badge-${suffix}-ok`);
        const badgePend = document.getElementById(`pendente-${suffix}`);
        const status = document.getElementById(`status-${suffix}`);
        const overlay = document.getElementById(`overlay-${suffix}`);
        const resumo = document.getElementById(`resumo-${suffix}`);
        const flag = document.getElementById(`flag-${suffix}`);
        const conteudo = document.getElementById(`conteudo-${suffix}`);

        // Toggle Acórdão
        header.addEventListener('click', () => {
            const isOpening = !wrapper.classList.contains('aberto');
            
            if (isOpening) {
                // Fecha todas as outras sanfonas antes de abrir esta
                document.querySelectorAll('.acordeao-wrapper').forEach(w => {
                    w.classList.remove('aberto');
                });
                wrapper.classList.add('aberto');
            } else {
                wrapper.classList.remove('aberto');
            }
        });

        // Habilita assinatura ao interagir com conteúdo
        conteudo.addEventListener('change', () => {
            if(flag.value === "0") btnAssinar.disabled = false;
        });

        // Assinar
        btnAssinar.addEventListener('click', () => {
            flag.value = "1";
            badgeOk.classList.add('visivel');
            if(badgePend) badgePend.classList.add('oculto');
            status.classList.add('visivel');
            if(overlay) overlay.classList.add('visivel');
            if(resumo) resumo.textContent = "Manifestação registrada com sucesso.";
            btnAssinar.style.display = 'none';
            btnLimpar.style.display = 'inline-block';
            
            // Bloqueio
            conteudo.classList.add('decl-conteudo-bloqueado');
            conteudo.querySelectorAll('input, textarea, select').forEach(i => i.disabled = true);
        });

        // Limpar Assinatura
        btnLimpar.addEventListener('click', () => {
            flag.value = "0";
            badgeOk.classList.remove('visivel');
            if(badgePend) badgePend.classList.remove('oculto');
            status.classList.remove('visivel');
            if(overlay) overlay.classList.remove('visivel');
            btnAssinar.style.display = 'inline-block';
            btnLimpar.style.display = 'none';
            
            conteudo.classList.remove('decl-conteudo-bloqueado');
            conteudo.querySelectorAll('input, textarea, select').forEach(i => i.disabled = false);
            btnAssinar.disabled = true;
        });
    }

    // Inicializa seções A e B
    setupAssinatura('A');
    setupAssinatura('B');
    setupAssinatura('C');

    // --- 2. LÓGICA CONDICIONAL SEÇÃO C (SUPERINTENDÊNCIA) ---
    const cdeRadios = document.querySelectorAll('input[name="cde_manifestacao"]');
    const blocoSim = document.getElementById('bloco-C-cde-sim');
    const blocoNao = document.getElementById('bloco-C-cde-nao');

    cdeRadios.forEach(r => {
        r.addEventListener('change', () => {
            blocoSim.style.display = r.value === 'sim' ? 'block' : 'none';
            blocoNao.style.display = r.value === 'nao' ? 'block' : 'none';
        });
    });

    // Lógica para "Não concordo com o regime proposto"
    const regimeRadios = document.querySelectorAll('input[name="C_regime"]');
    const blocoOutroRegime = document.getElementById('bloco-outro-regime');
    const selectOutroRegime = document.getElementById('outro_regime_destinacao');

    regimeRadios.forEach(r => {
        r.addEventListener('change', () => {
            if (r.value === 'discordo') {
                blocoOutroRegime.style.display = 'block';
                if (selectOutroRegime) selectOutroRegime.required = true;
            } else {
                blocoOutroRegime.style.display = 'none';
                if (selectOutroRegime) {
                    selectOutroRegime.required = false;
                    selectOutroRegime.value = "";
                }
            }
        });
    });

    // Lógica para "Aprovo com condicionantes"
    const delibRadios = document.querySelectorAll('input[name="C_deliberacao"]');
    const blocoCondicionantes = document.getElementById('bloco-condicionantes');
    const inputCondicionante = document.getElementById('input-condicionante');
    const btnAddCondicionante = document.getElementById('btn-add-condicionante');
    const listaCondicionantes = document.getElementById('lista-condicionantes');

    delibRadios.forEach(r => {
        r.addEventListener('change', () => {
            blocoCondicionantes.style.display = r.value === 'aprovado_condicionantes' ? 'block' : 'none';
        });
    });

    if (btnAddCondicionante) {
        btnAddCondicionante.addEventListener('click', () => {
            const texto = inputCondicionante.value.trim();
            if (texto === "") return;

            const item = document.createElement('div');
            item.style.cssText = "display:flex; align-items:center; justify-content:space-between; background:#fff; border:1px solid #bae6fd; padding:8px 12px; border-radius:6px; font-size:0.88em; color:#1e293b; box-shadow:0 1px 2px rgba(0,0,0,0.05);";
            
            item.innerHTML = `
                <span>${texto}</span>
                <button type="button" class="btn-remove-cond" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold; font-size:1.1em; padding:0 5px;">&times;</button>
            `;

            listaCondicionantes.appendChild(item);
            inputCondicionante.value = "";

            // Botão de remover
            item.querySelector('.btn-remove-cond').addEventListener('click', () => {
                item.remove();
            });
        });

        // Adicionar ao apertar Enter no input
        inputCondicionante.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnAddCondicionante.click();
            }
        });
    }

    // --- 3. LIMPAR GLOBAL ---
    document.getElementById('btnLimparGlobal')?.addEventListener('click', () => {
        if(confirm('Deseja limpar todo o formulário?')) location.reload();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✅ Rascunho salvo!');
    });
});
