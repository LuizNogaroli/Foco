// foco-02.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form0203');
    if (!form) return;

    const btnAdicionarImovel = document.getElementById('btnAdicionarImovel');
    const container = document.getElementById('imoveis-container');

    function initImovelBlock(block) {
        const index = block.dataset.index;

        // ── Botão Remover ──────────────────────────────────────────────
        const btnRemove = block.querySelector('.btn-remove-imovel');
        if (btnRemove) {
            btnRemove.addEventListener('click', function (e) {
                e.stopPropagation();
                if (container.querySelectorAll('.imovel-block').length > 1) {
                    block.remove();
                    updateImovelTitles();

                    // Se não sobrou nenhuma sanfona aberta, abre a primeira
                    if (!container.querySelector('.accordion-content.open')) {
                        const firstContent = container.querySelector('.accordion-content');
                        const firstIcon    = container.querySelector('.accordion-icon');
                        if (firstContent) firstContent.classList.add('open');
                        if (firstIcon)    firstIcon.classList.add('open');
                    }
                }
            });
        }

        // ── Sanfona (Accordion) ────────────────────────────────────────
        const header  = block.querySelector('.accordion-header');
        const content = block.querySelector('.accordion-content');
        const icon    = block.querySelector('.accordion-icon');

        if (header && content) {
            header.addEventListener('click', function (e) {
                if (e.target.closest('.btn-remove-imovel')) return;

                const isOpen = content.classList.contains('open');

                container.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
                container.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('open'));

                if (!isOpen) {
                    content.classList.add('open');
                    if (icon) icon.classList.add('open');
                }
            });
        }

        // ── Máscara CEP + busca ────────────────────────────────────────
        const inputCEP = block.querySelector(`#campo21_${index}`);
        if (inputCEP) {
            inputCEP.addEventListener('input', function (e) {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
                e.target.value = v;
            });

            if (typeof consultaCEP === 'function') {
                consultaCEP(inputCEP, {
                    uf:          `campo22_${index}`,
                    cidade:      `campo23_${index}`,
                    logradouro:  `campo24_${index}`
                }, `err21_${index}`);
            }
        }

        // ── Máscaras moeda ─────────────────────────────────────────────
        const inputValor  = block.querySelector(`#campo213_${index}`);
        const inputCustos = block.querySelector(`#campo37_${index}`);
        if (inputValor  && typeof mascaraMoeda === 'function') mascaraMoeda(inputValor);
        if (inputCustos && typeof mascaraMoeda === 'function') mascaraMoeda(inputCustos);

        // ── Helpers locais ─────────────────────────────────────────────
        function toggleVisibilidadeLocal(blocoId, mostrar) {
            const b = block.querySelector(`#${blocoId}`);
            if (b) b.style.display = mostrar ? '' : 'none';
        }

        // ── Benfeitorias ───────────────────────────────────────────────
        const radiosBenf = block.querySelectorAll(`input[name="imoveis[${index}][benfeitorias]"]`);
        function checkBenfeitorias() {
            const checked = block.querySelector(`input[name="imoveis[${index}][benfeitorias]"]:checked`);
            const sim = checked && checked.value === 'Sim';
            toggleVisibilidadeLocal(`bloco210_${index}`, sim);
            toggleVisibilidadeLocal(`bloco211_${index}`, sim);
        }
        radiosBenf.forEach(r => r.addEventListener('change', checkBenfeitorias));
        checkBenfeitorias();

        // ── Conceituação → LPM/LMEO ───────────────────────────────────
        const inputConceituacao = block.querySelector(`#campo216_${index}`);
        function checkConceituacao() {
            const val = inputConceituacao ? inputConceituacao.value : '';
            const mostrar = val === 'Terreno/acrescido de marinha' || val === 'Terreno/Acrescido marginal';
            toggleVisibilidadeLocal(`bloco219_${index}`, mostrar);
        }
        if (inputConceituacao) {
            inputConceituacao.addEventListener('input',  checkConceituacao);
            inputConceituacao.addEventListener('change', checkConceituacao);
            checkConceituacao();
        }

        // ── Custos SPU ─────────────────────────────────────────────────
        const radiosCustos = block.querySelectorAll(`input[name="imoveis[${index}][custos_manutencao]"]`);
        function checkCustos() {
            const checked = block.querySelector(`input[name="imoveis[${index}][custos_manutencao]"]:checked`);
            toggleVisibilidadeLocal(`bloco-obs37_${index}`, checked && checked.value === 'Sim');
        }
        radiosCustos.forEach(r => r.addEventListener('change', checkCustos));
        checkCustos();

        // ── Listas dinâmicas (delegadas ao initImovelToggle do HTML) ───
        // initDynamicList já é chamado pelo initImovelToggle definido no HTML inline.
        // Chamamos aqui para garantir que novos blocos clonados também inicializem.
        if (typeof window.initImovelToggle === 'function') {
            window.initImovelToggle(index);
        }

        if (typeof window.rebindHints === 'function') {
            window.rebindHints();
        }
    }

    // ── Atualiza títulos e visibilidade do botão Remover ──────────────
    function updateImovelTitles() {
        const blocks = container.querySelectorAll('.imovel-block');
        blocks.forEach((b, i) => {
            const title     = b.querySelector('.imovel-title');
            const btnRemove = b.querySelector('.btn-remove-imovel');
            if (title)     title.textContent       = `Imóvel ${i + 1}`;
            if (btnRemove) btnRemove.style.display  = blocks.length > 1 ? 'block' : 'none';
        });
    }

    // ── Inicializa blocos já existentes no HTML ────────────────────────
    container.querySelectorAll('.imovel-block').forEach(initImovelBlock);
    updateImovelTitles();

    // ── Adicionar novo imóvel ──────────────────────────────────────────
    if (btnAdicionarImovel) {
        btnAdicionarImovel.addEventListener('click', function () {
            const blocks   = container.querySelectorAll('.imovel-block');
            const template = blocks[0];
            const newBlock = template.cloneNode(true);

            // Calcula o próximo índice
            let newIndex = 0;
            blocks.forEach(b => {
                const idx = parseInt(b.dataset.index, 10);
                if (idx >= newIndex) newIndex = idx + 1;
            });

            newBlock.dataset.index = newIndex;
            newBlock.id = `imovel_${newIndex}`;

            // Substitui sufixo _0 pelo novo índice em ids, fors e names
            newBlock.querySelectorAll('[id]').forEach(el => {
                el.id = el.id.replace(/_0$/, `_${newIndex}`);
            });
            newBlock.querySelectorAll('[for]').forEach(el => {
                el.setAttribute('for', el.getAttribute('for').replace(/_0$/, `_${newIndex}`));
            });
            newBlock.querySelectorAll('[name]').forEach(el => {
                el.name = el.name.replace(/\[0\]/g, `[${newIndex}]`);
            });

            // Limpa valores dos campos (exceto radio/checkbox)
            newBlock.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea, select').forEach(el => {
                if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0;
                } else {
                    el.value = '';
                }
                el.classList.remove('field-error', 'field-valid');
            });

            // Limpa as listas de documentos do bloco clonado
            ['ident', 'ocup', 'rest'].forEach(section => {
                const listEl = newBlock.querySelector(`#imagens-list-${section}_${newIndex}`);
                if (listEl) listEl.innerHTML = '';
            });

            // Fecha sanfonas antigas; abre a nova
            container.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
            container.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('open'));

            const newContent = newBlock.querySelector('.accordion-content');
            const newIcon    = newBlock.querySelector('.accordion-icon');
            if (newContent) newContent.classList.add('open');
            if (newIcon)    newIcon.classList.add('open');

            container.appendChild(newBlock);

            // Inicializa toggles e listas do novo bloco
            if (typeof window.initImovelToggle === 'function') {
                window.initImovelToggle(newIndex);
            }
            initImovelBlock(newBlock);
            updateImovelTitles();

            newBlock.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ── Envio / Validação ──────────────────────────────────────────────
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form.checkValidity()) {
            alert('✅ Seções 2 e 3 processadas e unificadas com sucesso!');
        } else {
            alert('⚠️ Verifique os campos marcados com erro ou de preenchimento obrigatório.');
            form.reportValidity();
        }
    });

    // ── Limpar ─────────────────────────────────────────────────────────
    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja limpar todos os campos deste formulário?')) {
                window.location.reload();
            }
        });
    }
});
