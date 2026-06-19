// foco-02.js
// Compatível com o layout original do foco-02.html
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form0203');
    if (!form) return;

    const container = document.getElementById('imoveis-container');

    // Função de inicialização chamada para cada bloco criado
    function initImovelBlock(block) {
        const index = block.dataset.index;

        // ── Máscara CEP ──────────────────────────────────────────────
        const inputCEP = block.querySelector(`#campo21_${index}`);
        if (inputCEP) {
            inputCEP.addEventListener('input', function (e) {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
                e.target.value = v;
            });
        }

        // ── Máscaras moeda e áreas ─────────────────────────────────────
        // Utiliza as classes do motor formulario.js para maquete
        const campoMoeda = block.querySelector(`#campo213_${index}`);
        if (campoMoeda) {
            campoMoeda.classList.add('mask-moeda');
        }
        
        // Inicializa máscaras do motor para o novo bloco
        if (typeof autoInitMasks === 'function') {
            autoInitMasks();
        }
    }

    // Sobrescrevemos a função criarBlocoImovel original (que está no HTML inline) 
    // para garantir que ela use o motor de máscaras correto.
    const originalCriarBlocoImovel = window.criarBlocoImovel;
    window.criarBlocoImovel = function(rip, dados) {
        // Chama a original (que injeta o HTML no container)
        originalCriarBlocoImovel(rip, dados);
        
        // Pega o último bloco adicionado
        const blocks = container.querySelectorAll('.imovel-block');
        const lastBlock = blocks[blocks.length - 1];
        
        if (lastBlock) {
            initImovelBlock(lastBlock);
        }
    };

    // ── Envio / Validação ──────────────────────────────────────────────
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form.checkValidity()) {
            alert('✅ Rascunho salvo com sucesso!\n📄 O resumo do processo foi atualizado e está disponível para visualização.');
        } else {
            form.reportValidity();
        }
    });

    // ── Limpar ─────────────────────────────────────────────────────────
    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja limpar todos os campos?')) {
                window.location.reload();
            }
        });
    }
});
