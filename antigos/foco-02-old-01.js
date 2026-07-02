// foco-02.js
// Exclusivo da Seção 2: Identificação do Imóvel Ofertado/Requerido (foco-02.html)
// Depende de: formulario.js (consultaCEP, mascaraMoeda)

document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('form02')) return;

    const form02 = document.getElementById('form02');

    // ══════════════════════════════════════════════════════════════════════════
    // 1. CEP — máscara + auto-preenchimento via ViaCEP
    // ══════════════════════════════════════════════════════════════════════════

    consultaCEP(
        document.getElementById('campo21'),
        { uf: 'campo22', cidade: 'campo23', logradouro: 'campo24' },
        'err21'
    );

    // ══════════════════════════════════════════════════════════════════════════
    // 2. MÁSCARA MONETÁRIA (2.13)
    // ══════════════════════════════════════════════════════════════════════════

    mascaraMoeda(document.getElementById('campo213'));

    // ══════════════════════════════════════════════════════════════════════════
    // 3. CAMPOS CONDICIONAIS — 2.10 e 2.11 (benfeitorias)
    // ══════════════════════════════════════════════════════════════════════════

    const bloco210 = document.getElementById('bloco210');
    const bloco211 = document.getElementById('bloco211');
    const inp210   = document.getElementById('campo210');
    const inp211   = document.getElementById('campo211');

    if (inp210) inp210.disabled = true;
    if (inp211) inp211.disabled = true;

    function toggleBenfeitorias() {
        const sel   = document.querySelector('input[name="benfeitorias"]:checked');
        const isSim = sel && sel.value === 'Sim';

        if (bloco210) {
            if (isSim) bloco210.classList.remove('visivel-nao');
            else       bloco210.classList.add('visivel-nao');
        }
        if (bloco211) {
            if (isSim) bloco211.classList.remove('visivel-nao');
            else       bloco211.classList.add('visivel-nao');
        }

        if (inp210) { inp210.disabled = !isSim; if (!isSim) inp210.value = ''; }
        if (inp211) { inp211.disabled = !isSim; if (!isSim) inp211.value = ''; }
    }

    document.querySelectorAll('input[name="benfeitorias"]').forEach(function (r) {
        r.addEventListener('change', toggleBenfeitorias);
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 4. CAMPO CONDICIONAL — 2.19 (LPM / LMEO)
    // ══════════════════════════════════════════════════════════════════════════

    const campo216 = document.getElementById('campo216');
    const bloco219 = document.getElementById('bloco219');

    if (campo216 && bloco219) {
        const lpmInputs = bloco219.querySelectorAll('input[name="lpm_lmeo"]');

        lpmInputs.forEach(function (i) { i.disabled = true; });

        function toggleLPM() {
            const v     = campo216.value;
            const exibe = v === 'Terreno/acrescido de marinha' || v === 'Terreno/Acrescido marginal';

            if (exibe) bloco219.classList.remove('visivel-nao');
            else       bloco219.classList.add('visivel-nao');

            lpmInputs.forEach(function (i) { i.disabled = !exibe; });
            if (!exibe) lpmInputs.forEach(function (i) { i.checked = false; });
        }

        campo216.addEventListener('change', toggleLPM);
        form02._toggleLPM = toggleLPM;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 5. CHECKBOXES EXCLUSIVOS — faixas (Nenhuma das alternativas)
    // ══════════════════════════════════════════════════════════════════════════

    const faixaNenhuma = document.getElementById('faixa-nenhuma');
    const faixasOutras = document.querySelectorAll('input[name="faixas[]"]:not(#faixa-nenhuma)');

    if (faixaNenhuma) {
        faixaNenhuma.addEventListener('change', function () {
            if (this.checked) faixasOutras.forEach(function (c) { c.checked = false; });
        });
        faixasOutras.forEach(function (cb) {
            cb.addEventListener('change', function () {
                if (this.checked) faixaNenhuma.checked = false;
            });
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 6. LISTA DINÂMICA — RIPs
    // ══════════════════════════════════════════════════════════════════════════

    const ripList         = document.getElementById('rip-list');
    const btnAdicionarRIP = document.getElementById('btnAdicionarRIP');

    if (btnAdicionarRIP && ripList) {
        const removeInicial = ripList.querySelector('.btn-remove-rip');
        if (removeInicial) {
            removeInicial.addEventListener('click', function () {
                const items = ripList.querySelectorAll('.rip-item');
                if (items.length > 1) this.closest('.rip-item').remove();
            });
        }

        btnAdicionarRIP.addEventListener('click', function () {
            const item = document.createElement('div');
            item.className = 'rip-item';
            item.innerHTML = `
                <input type="text" name="rips[]" placeholder="Ex: 0101000001-00"
                       autocomplete="off" class="rip-input">
                <button type="button" class="btn-remove-rip" title="Remover RIP">✕</button>
            `;
            item.querySelector('.btn-remove-rip').addEventListener('click', function () {
                const items = ripList.querySelectorAll('.rip-item');
                if (items.length > 1) item.remove();
            });
            ripList.appendChild(item);
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 7. LISTA DINÂMICA — Imagens / Links
    // ══════════════════════════════════════════════════════════════════════════

    const imagensList        = document.getElementById('imagens-list');
    const btnAdicionarImagem = document.getElementById('btnAdicionarImagem');

    if (btnAdicionarImagem && imagensList) {
        const removeInicialImg = imagensList.querySelector('.btn-remove-imagem');
        if (removeInicialImg) {
            removeInicialImg.addEventListener('click', function () {
                const items = imagensList.querySelectorAll('.imagem-item');
                if (items.length > 1) this.closest('.imagem-item').remove();
            });
        }

        btnAdicionarImagem.addEventListener('click', function () {
            const item = document.createElement('div');
            item.className = 'imagem-item';
            item.innerHTML = `
                <input type="text" name="imagens[]" placeholder="Ex: https://sei.gov.br/..."
                       autocomplete="off" class="imagem-input">
                <button type="button" class="btn-remove-imagem" title="Remover">✕</button>
            `;
            item.querySelector('.btn-remove-imagem').addEventListener('click', function () {
                const items = imagensList.querySelectorAll('.imagem-item');
                if (items.length > 1) item.remove();
            });
            imagensList.appendChild(item);
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 8. VALIDAÇÃO NO SUBMIT
    // ══════════════════════════════════════════════════════════════════════════

    const camposF02 = [
        { id: 'campo21',  erro: 'err21',  check: v => /^\d{5}-\d{3}$/.test(v) },
        { id: 'campo22',  erro: 'err22',  check: v => v !== '' },
        { id: 'campo23',  erro: 'err23',  check: v => v.trim().length >= 2 },
        { id: 'campo24',  erro: 'err24',  check: v => v.trim().length >= 5 },
        { id: 'campo27',  erro: 'err27',  check: v => v !== '' && parseFloat(v) > 0 },
        { id: 'campo216', erro: 'err216', check: v => v !== '' },
        { id: 'campo217', erro: 'err217', check: v => v !== '' },
        { id: 'campo221', erro: 'err221', check: v => v !== '' },
        { id: 'campo223', erro: 'err223', check: v => v !== '' },
    ];

    const gruposF02 = [
        { name: 'rip_apresentado', erro: 'err25'  },
        { name: 'benfeitorias',    erro: 'err29'  },
        { name: 'incorporacao',    erro: 'err222' },
    ];

    // Condicional: lpm_lmeo (só valida se bloco219 estiver visível)
    function validarGrupoLPM() {
        if (!bloco219 || bloco219.classList.contains('visivel-nao')) return true;
        const marcado = document.querySelector('input[name="lpm_lmeo"]:checked');
        const err     = document.getElementById('err219');
        if (err) err.classList.toggle('visivel', !marcado);
        return !!marcado;
    }

    form02.addEventListener('submit', function (e) {
        e.preventDefault();
        let valido = true;

        camposF02.forEach(function (cfg) {
            const el  = document.getElementById(cfg.id);
            const err = document.getElementById(cfg.erro);
            if (!el) return;
            const ok = cfg.check(el.value);
            if (err) err.classList.toggle('visivel', !ok);
            if (!ok) valido = false;
        });

        gruposF02.forEach(function (grp) {
            const marcado = document.querySelector('input[name="' + grp.name + '"]:checked');
            const err     = document.getElementById(grp.erro);
            if (err) err.classList.toggle('visivel', !marcado);
            if (!marcado) valido = false;
        });

        if (!validarGrupoLPM()) valido = false;

        if (!valido) {
            const primeiroErro = form02.querySelector('.error-msg.visivel');
            if (primeiroErro) primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const dados = new FormData(form02);
        console.log('Seção 2 válida. Dados:', Object.fromEntries(dados.entries()));
        alert('Seção 2 enviada com sucesso!');
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 9. BOTÃO LIMPAR
    // ══════════════════════════════════════════════════════════════════════════

    const btnLimpar = document.getElementById('btnLimpar');

    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            form02.reset();

            form02.querySelectorAll('.error-msg').forEach(function (el) {
                el.classList.remove('visivel');
            });

            toggleBenfeitorias();
            if (form02._toggleLPM) form02._toggleLPM();

            if (ripList) {
                const rips = ripList.querySelectorAll('.rip-item');
                rips.forEach(function (item, i) { if (i > 0) item.remove(); });
                const inputRip = ripList.querySelector('.rip-input');
                if (inputRip) inputRip.value = '';
            }

            if (imagensList) {
                const imgs = imagensList.querySelectorAll('.imagem-item');
                imgs.forEach(function (item, i) { if (i > 0) item.remove(); });
                const inputImg = imagensList.querySelector('.imagem-input');
                if (inputImg) inputImg.value = '';
            }
        });
    }

}); // fim DOMContentLoaded
