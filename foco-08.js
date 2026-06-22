/**
 * foco-08.js
 * Otimização técnica mantendo layout e conteúdo originais
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form08');
    if (!form) return;

    // --- 1. GESTÃO DE ASSINATURAS (PADRÃO UNIFICADO) ---
    function setupAssinatura(suffix) {
        const els = {
            wrapper: document.getElementById(`acordeao-${suffix}`),
            header: document.getElementById(`acordeao-header-${suffix}`),
            btnAssinar: document.getElementById(`btn-assinar-${suffix}`),
            btnLimpar: document.getElementById(`btn-limpar-${suffix}`),
            badgeOk: document.getElementById(`badge-${suffix}-ok`),
            badgePend: document.getElementById(`pendente-${suffix}`),
            status: document.getElementById(`status-${suffix}`),
            flag: document.getElementById(`flag-${suffix}`),
            conteudo: document.getElementById(`conteudo-${suffix}`)
        };

        if(!els.header) return;

        els.header.addEventListener('click', () => els.wrapper.classList.toggle('aberto'));

        els.conteudo.addEventListener('change', () => {
            if(els.flag.value === "0") els.btnAssinar.disabled = false;
        });

        els.btnAssinar.addEventListener('click', () => {
            els.flag.value = "1";
            els.badgeOk.classList.add('visivel');
            if(els.badgePend) els.badgePend.classList.add('oculto');
            if(els.status) els.status.classList.add('visivel');
            els.btnAssinar.style.display = 'none';
            els.btnLimpar.style.display = 'inline-block';
            els.conteudo.classList.add('decl-conteudo-bloqueado');
            els.conteudo.querySelectorAll('input, textarea').forEach(i => i.disabled = true);

            // --- REGRA DE NEGÓCIO: Mudança de Status (Devolução) ---
            const rootWindow = window.parent?.parent || window.parent || window;
            if (rootWindow.updateField) {
                const checkedRadio = els.conteudo.querySelector('input[type="radio"]:checked');
                if (checkedRadio) {
                    const v = checkedRadio.value.toLowerCase();
                    const requiresReturn = v.includes('complementacao') || v.includes('insuficiente') || v.includes('retornar') || v.includes('diligencia') || v.includes('nao_apta') || v.includes('devolver') || v.includes('restituir') || v === 'restituo';
                    if (requiresReturn) {
                        rootWindow.updateField('status', 'Devolvido para complementação');
                    }
                }
            }
        });

        els.btnLimpar.addEventListener('click', () => {
            els.flag.value = "0";
            els.badgeOk.classList.remove('visivel');
            if(els.badgePend) els.badgePend.classList.remove('oculto');
            if(els.status) els.status.classList.remove('visivel');
            els.btnAssinar.style.display = 'inline-block';
            els.btnLimpar.style.display = 'none';
            els.conteudo.classList.remove('decl-conteudo-bloqueado');
            els.conteudo.querySelectorAll('input, textarea').forEach(i => i.disabled = false);
            els.btnAssinar.disabled = true;
        });
    }

    ['A', 'B', 'C'].forEach(setupAssinatura);

    // --- 2. LÓGICA CONDICIONAL SEÇÃO A (ANALISTA) ---
    
    // Impactos Relevantes
    const impactosRadios = document.querySelectorAll('input[name="A_impactos_relevantes"]');
    const blocoImpactos = document.getElementById('bloco-A-impactos-detalhes');
    
    impactosRadios.forEach(r => {
        r.addEventListener('change', () => {
            if(blocoImpactos) blocoImpactos.style.display = r.value === 'sim' ? 'block' : 'none';
        });
    });

    // Ajuste de Regime
    const regimeRadios = document.querySelectorAll('input[name="A_regime_compativel"]');
    const blocoRegime = document.getElementById('bloco-A-ajuste-regime');
    const selectRegime = document.getElementById('A_regime_sugerido');
    const areaJustificativa = document.getElementById('A_justificativa_regime');

    regimeRadios.forEach(r => {
        r.addEventListener('change', () => {
            if(r.value === 'nao') {
                if(blocoRegime) blocoRegime.style.display = 'block';
                if(selectRegime) selectRegime.required = true;
                if(areaJustificativa) areaJustificativa.required = true;
            } else {
                if(blocoRegime) blocoRegime.style.display = 'none';
                if(selectRegime) {
                    selectRegime.required = false;
                    selectRegime.value = "";
                }
                if(areaJustificativa) {
                    areaJustificativa.required = false;
                    areaJustificativa.value = "";
                }
            }
        });
    });

    // --- 3. MODAL E ENVIO ---
    const modal = document.getElementById('modalEnvio');
    const btnFechar = document.getElementById('btnFecharModal');

    document.getElementById('btnEnviarCDE')?.addEventListener('click', () => {
        if(document.getElementById('flag-C').value !== "1") {
            alert('⚠️ A manifestação da Diretoria (Seção C) é obrigatória antes do envio.');
            return;
        }
        if(modal) modal.style.display = 'flex';
    });

    if(btnFechar) btnFechar.addEventListener('click', () => modal.style.display = 'none');

    document.getElementById('btnLimparGlobal')?.addEventListener('click', () => {
        if(confirm('Deseja limpar todo o formulário?')) location.reload();
    });
});
