// foco-05.js
// Exclusivo da Seção 5: Análise da Destinação Proposta (foco-05.html)
// Depende de: formulario.js

document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('form05')) return;

    const form05 = document.getElementById('form05');

    // ══════════════════════════════════════════════════════════════════════════
    // 1. VALIDAÇÃO EM TEMPO REAL DE TEXTAREAS OBRIGATÓRIAS
    // ══════════════════════════════════════════════════════════════════════════

    const requiredTextareas = form05.querySelectorAll('textarea[required]');
    requiredTextareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const isValid = this.value.trim().length > 0;
            this.classList.toggle('field-valid', isValid);
            this.classList.toggle('field-error', !isValid);
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 2. CHECKBOXES EXCLUSIVOS — 5.6 Vinculação estratégica
    //    "Nenhuma vinculação identificada" é exclusivo com as demais opções
    // ══════════════════════════════════════════════════════════════════════════

    const campo56Nenhuma = document.getElementById('campo56-nenhuma');
    const campo56Outras  = document.querySelectorAll(
        'input[name="campo56[]"]:not(#campo56-nenhuma)'
    );

    if (campo56Nenhuma) {
        campo56Nenhuma.addEventListener('change', function () {
            if (this.checked) campo56Outras.forEach(function (cb) { cb.checked = false; });
        });
        campo56Outras.forEach(function (cb) {
            cb.addEventListener('change', function () {
                if (this.checked) campo56Nenhuma.checked = false;
            });
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. CHECKBOXES EXCLUSIVOS — 5.7 Políticas vinculadas
    //    "Nenhuma política vinculada" é exclusivo com as demais opções
    // ══════════════════════════════════════════════════════════════════════════

    const campo57Nenhuma = document.getElementById('campo57-nenhuma');
    const campo57Outras  = document.querySelectorAll(
        'input[name="campo57[]"]:not(#campo57-nenhuma)'
    );

    if (campo57Nenhuma) {
        campo57Nenhuma.addEventListener('change', function () {
            if (this.checked) campo57Outras.forEach(function (cb) { cb.checked = false; });
        });
        campo57Outras.forEach(function (cb) {
            cb.addEventListener('change', function () {
                if (this.checked) campo57Nenhuma.checked = false;
            });
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 4. HELPER — mostra/oculta erro com classe .visivel
    // ══════════════════════════════════════════════════════════════════════════

    function setErro(erroId, invalido) {
        const el = document.getElementById(erroId);
        if (el) el.classList.toggle('visivel', invalido);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 5. VALIDAÇÃO NO SUBMIT
    // ══════════════════════════════════════════════════════════════════════════

    const selectsF05 = [
        { id: 'campo51',  erro: 'err51'  },
        { id: 'campo52',  erro: 'err52'  },
        { id: 'campo53',  erro: 'err53'  },
        { id: 'campo55',  erro: 'err55'  },
        { id: 'campo58',  erro: 'err58'  },
        { id: 'campo510', erro: 'err510' },
        { id: 'campo511', erro: 'err511' },
    ];

    const radiosF05 = [
        { name: 'campo54', erro: 'err54' },
    ];

    const checkboxesF05 = [
        { name: 'campo56[]', erro: 'err56' },
        { name: 'campo57[]', erro: 'err57' },
    ];

    form05.addEventListener('submit', function (e) {
        e.preventDefault();
        let valido = true;

        selectsF05.forEach(function (cfg) {
            const el = document.getElementById(cfg.id);
            if (!el) return;
            const ok = el.value !== '';
            setErro(cfg.erro, !ok);
            if (!ok) valido = false;
        });

        radiosF05.forEach(function (cfg) {
            const marcado = document.querySelector('input[name="' + cfg.name + '"]:checked');
            setErro(cfg.erro, !marcado);
            if (!marcado) valido = false;
        });

        checkboxesF05.forEach(function (cfg) {
            const marcados = document.querySelectorAll('input[name="' + cfg.name + '"]:checked');
            const ok = marcados.length > 0;
            setErro(cfg.erro, !ok);
            if (!ok) valido = false;
        });

        if (!valido) {
            const primeiroErro = form05.querySelector('.error-msg.visivel');
            if (primeiroErro) primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const dados = new FormData(form05);
        console.log('Seção 5 válida. Dados:', Object.fromEntries(dados.entries()));
        alert('✅ Seção 5 enviada com sucesso!');
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 6. BOTÃO LIMPAR
    // ══════════════════════════════════════════════════════════════════════════

    const btnLimpar = document.getElementById('btnLimpar');

    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (!confirm('Deseja limpar todos os campos?')) return;

            form05.reset();

            form05.querySelectorAll('.error-msg').forEach(function (el) {
                el.classList.remove('visivel');
            });
        });
    }

}); // fim DOMContentLoaded
