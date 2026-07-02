// foco-03.js
// Exclusivo da Seção 3: Ocupação e Restrições (foco-03.html)
// Depende de: formulario.js (mascaraMoeda)

document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('form03')) return;

    const form03 = document.getElementById('form03');

    // ══════════════════════════════════════════════════════════════════════════
    // 1. MÁSCARA MONETÁRIA — 3.7 (estimativa de custos)
    // ══════════════════════════════════════════════════════════════════════════

    const campo37 = document.getElementById('campo37');
    if (campo37) mascaraMoeda(campo37);

    // ══════════════════════════════════════════════════════════════════════════
    // 2. CAMPO CONDICIONAL — 3.7 (estimativa de custos — visível se custos = Sim)
    // ══════════════════════════════════════════════════════════════════════════

    const bloco37 = document.getElementById('bloco37');

    function toggleCustos() {
        const sel   = document.querySelector('input[name="custos_manutencao"]:checked');
        const isSim = sel && sel.value === 'Sim';

        if (bloco37) {
            if (isSim) bloco37.classList.remove('visivel-nao');  // ← CORRIGIDO
            else       bloco37.classList.add('visivel-nao');     // ← CORRIGIDO

            if (campo37) {
                campo37.disabled = !isSim;
                if (!isSim) campo37.value = '';
            }
        }
    }

    document.querySelectorAll('input[name="custos_manutencao"]').forEach(function (r) {
        r.addEventListener('change', toggleCustos);
    });
    toggleCustos(); // estado inicial

    // ══════════════════════════════════════════════════════════════════════════
    // 3. CHECKBOXES EXCLUSIVOS — 3.10 Ações judiciais
    //    "Não existe" e "Sem informação" são mutuamente exclusivos com as demais
    // ══════════════════════════════════════════════════════════════════════════

    const acaoNenhuma  = document.getElementById('acao-nenhuma');
    const acaoSemInfo  = document.getElementById('acao-sem-info');
    const acoesNormais = document.querySelectorAll(
        'input[name="acoes[]"]:not(#acao-nenhuma):not(#acao-sem-info)'
    );

    function exclusivoAcoes(marcado) {
        if (marcado === acaoNenhuma || marcado === acaoSemInfo) {
            acoesNormais.forEach(function (c) { c.checked = false; });
            if (marcado === acaoNenhuma && acaoSemInfo) acaoSemInfo.checked = false;
            if (marcado === acaoSemInfo && acaoNenhuma) acaoNenhuma.checked = false;
        } else {
            if (acaoNenhuma) acaoNenhuma.checked = false;
            if (acaoSemInfo) acaoSemInfo.checked = false;
        }
    }

    if (acaoNenhuma) {
        acaoNenhuma.addEventListener('change', function () {
            if (this.checked) exclusivoAcoes(this);
        });
    }
    if (acaoSemInfo) {
        acaoSemInfo.addEventListener('change', function () {
            if (this.checked) exclusivoAcoes(this);
        });
    }
    acoesNormais.forEach(function (cb) {
        cb.addEventListener('change', function () {
            if (this.checked) exclusivoAcoes(this);
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 4. VALIDAÇÃO NO SUBMIT
    // ══════════════════════════════════════════════════════════════════════════

    const camposF03 = [
        { id: 'campo31', erro: 'err31', check: v => v !== '' },
        { id: 'campo35', erro: 'err35', check: v => v !== '' },
    ];

    const gruposF03 = [
        { name: 'custos_manutencao',    erro: 'err36'  },
        { name: 'risco_invasao',        erro: 'err38'  },
        { name: 'risco_coletividade',   erro: 'err39'  },
        { name: 'tombado',              erro: 'err311' },
        { name: 'conflitos_fundiarios', erro: 'err312' },
        { name: 'gestao_praias',        erro: 'err313' },
    ];

    function setErro(erroId, invalido) {
        const el = document.getElementById(erroId);
        if (el) el.classList.toggle('visivel', invalido);
    }

    form03.addEventListener('submit', function (e) {
        e.preventDefault();
        let valido = true;

        camposF03.forEach(function (cfg) {
            const el = document.getElementById(cfg.id);
            if (!el || el.disabled) return;
            const ok = cfg.check(el.value);
            setErro(cfg.erro, !ok);
            if (!ok) valido = false;
        });

        gruposF03.forEach(function (grp) {
            const marcado = document.querySelector('input[name="' + grp.name + '"]:checked');
            const ok = !!marcado;
            setErro(grp.erro, !ok);
            if (!ok) valido = false;
        });

        // Checkbox 3.10 — ao menos um marcado
        const acoesMarcadas = document.querySelectorAll('input[name="acoes[]"]:checked');
        const ok310 = acoesMarcadas.length > 0;
        setErro('err310', !ok310);
        if (!ok310) valido = false;

        if (!valido) {
            const primeiroErro = form03.querySelector('.error-msg.visivel');
            if (primeiroErro) primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const dados = new FormData(form03);
        console.log('Seção 3 válida. Dados:', Object.fromEntries(dados.entries()));
        alert('✅ Seção 3 enviada com sucesso!');
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 5. BOTÃO LIMPAR
    // ══════════════════════════════════════════════════════════════════════════

    const btnLimpar = document.getElementById('btnLimpar');

    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (!confirm('Deseja limpar todos os campos?')) return;

            form03.reset();

            toggleCustos(); // recolhe bloco condicional 3.7

            form03.querySelectorAll('.error-msg').forEach(function (el) {
                el.classList.remove('visivel');
            });
        });
    }

}); // fim DOMContentLoaded
