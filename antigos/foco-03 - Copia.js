// foco-04.js
// Exclusivo da Seção 4: Análise do Destinatário (foco-04.html)
// Depende de: formulario.js

document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('form04')) return;

    const form04 = document.getElementById('form04');

    // ══════════════════════════════════════════════════════════════════════════
    // 1. VALIDAÇÃO EM TEMPO REAL DE TEXTAREAS OBRIGATÓRIAS
    // ══════════════════════════════════════════════════════════════════════════

    const requiredTextareas = form04.querySelectorAll('textarea[required]');
    requiredTextareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const isValid = this.value.trim().length > 0;
            this.classList.toggle('field-valid', isValid);
            this.classList.toggle('field-error', !isValid);
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 2. CHECKBOXES EXCLUSIVOS — 4.2 Pendências
    //    "Nenhuma identificada" é exclusivo com as demais opções
    // ══════════════════════════════════════════════════════════════════════════

    const campo42Nenhuma = document.getElementById('campo42-nenhuma');
    const campo42Outras  = document.querySelectorAll(
        'input[name="campo42[]"]:not(#campo42-nenhuma)'
    );

    if (campo42Nenhuma) {
        campo42Nenhuma.addEventListener('change', function () {
            if (this.checked) campo42Outras.forEach(function (cb) { cb.checked = false; });
        });
        campo42Outras.forEach(function (cb) {
            cb.addEventListener('change', function () {
                if (this.checked) campo42Nenhuma.checked = false;
            });
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. HELPER — mostra/oculta erro com classe .visivel
    // ══════════════════════════════════════════════════════════════════════════

    function setErro(erroId, invalido) {
        const el = document.getElementById(erroId);
        if (el) el.classList.toggle('visivel', invalido);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 4. VALIDAÇÃO NO SUBMIT
    // ══════════════════════════════════════════════════════════════════════════

    form04.addEventListener('submit', function (e) {
        e.preventDefault();
        let valido = true;

        // Radio obrigatório: campo41
        const radio41 = document.querySelector('input[name="campo41"]:checked');
        setErro('err41', !radio41);
        if (!radio41) valido = false;

        // Checkbox obrigatório: campo42[] — ao menos um marcado
        const check42 = document.querySelectorAll('input[name="campo42[]"]:checked');
        setErro('err42', check42.length === 0);
        if (check42.length === 0) valido = false;

        // Select obrigatório: campo43
        const campo43 = document.getElementById('campo43');
        const ok43    = campo43 && campo43.value !== '';
        setErro('err43', !ok43);
        if (!ok43) valido = false;

        if (!valido) {
            const primeiroErro = form04.querySelector('.error-msg.visivel');
            if (primeiroErro) primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const dados = new FormData(form04);
        console.log('Seção 4 válida. Dados:', Object.fromEntries(dados.entries()));
        alert('✅ Seção 4 enviada com sucesso!');
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 5. BOTÃO LIMPAR
    // ══════════════════════════════════════════════════════════════════════════

    const btnLimpar = document.getElementById('btnLimpar');

    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (!confirm('Deseja limpar todos os campos?')) return;

            form04.reset();

            form04.querySelectorAll('.error-msg').forEach(function (el) {
                el.classList.remove('visivel');
            });
        });
    }

}); // fim DOMContentLoaded
