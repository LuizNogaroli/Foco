// foco-0203.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form0203');
    if (!form) return;

    const btnAdicionarImovel = document.getElementById('btnAdicionarImovel');
    const container = document.getElementById('imoveis-container');

    function initImovelBlock(block) {
        const index = block.dataset.index;

        const btnRemove = block.querySelector('.btn-remove-imovel');
        if (btnRemove) {
            btnRemove.addEventListener('click', function(e) {
                e.stopPropagation(); // Evita acionar o clique da sanfona
                if (container.querySelectorAll('.imovel-block').length > 1) {
                    block.remove();
                    updateImovelTitles();

                    // Se fechou a sanfona atual e sobrou outra, abre a primeira automaticamente
                    if (!container.querySelector('.accordion-content.open')) {
                        const firstContent = container.querySelector('.accordion-content');
                        const firstIcon = container.querySelector('.accordion-icon');
                        if (firstContent) firstContent.classList.add('open');
                        if (firstIcon) firstIcon.classList.add('open');
                    }
                }
            });
        }

        // Comportamento Sanfona (Accordion)
        const header = block.querySelector('.accordion-header');
        const content = block.querySelector('.accordion-content');
        const icon = block.querySelector('.accordion-icon');

        if (header && content) {
            header.addEventListener('click', function(e) {
                if (e.target.closest('.btn-remove-imovel')) return;
                
                const isOpen = content.classList.contains('open');
                
                // Força o fechamento de todas as outras sanfonas
                container.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
                container.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('open'));
                
                // Se a clicada estava fechada, agora abrimos
                if (!isOpen) {
                    content.classList.add('open');
                    if (icon) icon.classList.add('open');
                }
            });
        }

        // 1. Configurar máscaras e Busca de CEP
        const inputCEP = block.querySelector(`#campo21_${index}`);
        if (inputCEP) {
            inputCEP.addEventListener('input', function (e) {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
                e.target.value = v;
            });
            
            if (typeof consultaCEP === 'function') {
                consultaCEP(inputCEP, { 
                    uf: `campo22_${index}`, 
                    cidade: `campo23_${index}`, 
                    logradouro: `campo24_${index}` 
                }, `err21_${index}`);
            }
        }

        const inputValor = block.querySelector(`#campo213_${index}`);
        if (inputValor && typeof mascaraMoeda === 'function') mascaraMoeda(inputValor);
        
        const inputCustos = block.querySelector(`#campo37_${index}`);
        if (inputCustos && typeof mascaraMoeda === 'function') mascaraMoeda(inputCustos);

        function toggleVisibilidadeLocal(blocoId, mostrar) {
            const b = block.querySelector(`#${blocoId}`);
            if (b) b.style.display = mostrar ? '' : 'none';
        }

        // 2.1 Benfeitorias
        const radiosBenf = block.querySelectorAll(`input[name="imoveis[${index}][benfeitorias]"]`);
        function checkBenfeitorias() {
            const checked = block.querySelector(`input[name="imoveis[${index}][benfeitorias]"]:checked`);
            const sim = checked && checked.value === 'Sim';
            toggleVisibilidadeLocal(`bloco210_${index}`, sim);
            toggleVisibilidadeLocal(`bloco211_${index}`, sim);
        }
        radiosBenf.forEach(r => r.addEventListener('change', checkBenfeitorias));
        checkBenfeitorias();

        // 2.2 Conceituação -> LPM/LMEO
        const selectConceituacao = block.querySelector(`#campo216_${index}`);
        function checkConceituacao() {
            const val = selectConceituacao ? selectConceituacao.value : '';
            const mostrar = val === "Terreno/acrescido de marinha" || val === "Terreno/Acrescido marginal";
            toggleVisibilidadeLocal(`bloco219_${index}`, mostrar);
        }
        if (selectConceituacao) {
            selectConceituacao.addEventListener('change', checkConceituacao);
            checkConceituacao();
        }

        // 2.3 Custos SPU
        const radiosCustos = block.querySelectorAll(`input[name="imoveis[${index}][custos_manutencao]"]`);
        function checkCustos() {
            const checked = block.querySelector(`input[name="imoveis[${index}][custos_manutencao]"]:checked`);
            const sim = checked && checked.value === 'Sim';
            toggleVisibilidadeLocal(`bloco37_${index}`, sim);
        }
        radiosCustos.forEach(r => r.addEventListener('change', checkCustos));
        checkCustos();

        // 3. Listas Dinâmicas (Imagens)
        const imagensList = block.querySelector(`#imagens-list_${index}`);
        const btnAddImagem = block.querySelector(`#btnAdicionarImagem_${index}`);
        
        if (imagensList && btnAddImagem) {
            imagensList.addEventListener('click', function(e) {
                if (e.target.classList.contains('btn-remove-imagem')) {
                    const items = imagensList.querySelectorAll('.imagem-item');
                    if (items.length > 1) {
                        e.target.closest('.imagem-item').remove();
                    } else {
                        const input = e.target.closest('.imagem-item').querySelector('input');
                        if (input) input.value = '';
                    }
                }
            });

            btnAddImagem.addEventListener('click', function() {
                const newItem = document.createElement('div');
                newItem.className = 'imagem-item';
                newItem.innerHTML = `
                    <input type="text" name="imoveis[${index}][imagens][]" placeholder="Ex: https://sei.gov.br/..." autocomplete="off" class="imagem-input" style="flex: 1;">
                    <button type="button" class="btn-remove-imagem" title="Remover">✕</button>
                `;
                imagensList.appendChild(newItem);
                newItem.querySelector('input').focus();
            });
        }

        if (typeof window.rebindHints === 'function') {
            window.rebindHints();
        }
    }

    function updateImovelTitles() {
        const blocks = container.querySelectorAll('.imovel-block');
        blocks.forEach((b, i) => {
            const title = b.querySelector('.imovel-title');
            if (title) title.textContent = `Imóvel ${i + 1}`;
            
            const btnRemove = b.querySelector('.btn-remove-imovel');
            if (btnRemove) btnRemove.style.display = blocks.length > 1 ? 'block' : 'none';
        });
    }

    const initialBlocks = container.querySelectorAll('.imovel-block');
    initialBlocks.forEach(initImovelBlock);
    updateImovelTitles();

    if (btnAdicionarImovel) {
        btnAdicionarImovel.addEventListener('click', function () {
            const blocks = container.querySelectorAll('.imovel-block');
            const template = blocks[0];
            const newBlock = template.cloneNode(true);
            
            let newIndex = 0;
            blocks.forEach(b => {
                const idx = parseInt(b.dataset.index, 10);
                if (idx >= newIndex) newIndex = idx + 1;
            });

            newBlock.dataset.index = newIndex;
            newBlock.id = `imovel_${newIndex}`;

            newBlock.querySelectorAll('[id]').forEach(el => {
                el.id = el.id.replace(/_0$/, `_${newIndex}`);
            });
            newBlock.querySelectorAll('[for]').forEach(el => {
                el.setAttribute('for', el.getAttribute('for').replace(/_0$/, `_${newIndex}`));
            });
            newBlock.querySelectorAll('[name]').forEach(el => {
                el.name = el.name.replace(/\[0\]/, `[${newIndex}]`);
            });

            newBlock.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea, select').forEach(el => {
                if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0;
                } else {
                    el.value = '';
                }
                el.classList.remove('field-error', 'field-valid');
            });
            
            const firstImageItem = newBlock.querySelector('.imagem-item');
            const imagensList = newBlock.querySelector(`#imagens-list_${newIndex}`);
            if (imagensList && firstImageItem) {
                imagensList.innerHTML = '';
                imagensList.appendChild(firstImageItem);
            }

            // Fecha as sanfonas antigas antes de adicionar a nova
            container.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
            container.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('open'));

            // Força a nova sanfona a já vir aberta
            const newContent = newBlock.querySelector('.accordion-content');
            const newIcon = newBlock.querySelector('.accordion-icon');
            if (newContent) newContent.classList.add('open');
            if (newIcon) newIcon.classList.add('open');

            container.appendChild(newBlock);
            initImovelBlock(newBlock);
            updateImovelTitles();
            
            newBlock.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 4. Tratamento do Envio do Formulário (Validation de exemplo)
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Aqui implementaremos lógicas de validação mais rígidas similares as do Foco-01 se necessário.
        // No momento, delegamos as flags required e min-length direto nos inputs no HTML.

        if (form.checkValidity()) {
            alert('✅ Seções 2 e 3 processadas e unificadas com sucesso!');
        } else {
            alert('⚠️ Verifique os campos marcados com erro ou de preenchimento obrigatório.');
            form.reportValidity();
        }
    });

    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja limpar todos os campos deste formulário?')) {
                window.location.reload();
            }
        });
    }
});