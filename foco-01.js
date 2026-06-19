// foco-01.js
// Exclusivo da Seção 1: Dados do Requerimento (foco-01.html)
// Depende de: formulario.js (mascaraCPFCNPJ, mascaraSEI)

document.addEventListener('DOMContentLoaded', function () {
    const form01 = document.getElementById('form01');
    if (!form01) return;

    // ══════════════════════════════════════════════════════════════════════════
    // 1. MODAL DE SIMULAÇÃO (Prioridade para interatividade)
    // ══════════════════════════════════════════════════════════════════════════
    const modalSim = document.getElementById('modalSimulacao');
    const btnFecharSim = document.getElementById('btnFecharSimulacao');
    
    // Seleciona todos os botões que devem abrir o popup
    const btnsAbrir = document.querySelectorAll('.btn-simular-doc');

    btnsAbrir.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (modalSim) {
                modalSim.style.display = 'flex';
            }
        });
    });

    if (btnFecharSim) {
        btnFecharSim.addEventListener('click', function() {
            if (modalSim) modalSim.style.display = 'none';
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 2. MÁSCARAS E INICIALIZAÇÃO
    // ══════════════════════════════════════════════════════════════════════════

    if (typeof mascaraCPFCNPJ === 'function') mascaraCPFCNPJ(document.getElementById('campo14'));
    if (typeof mascaraSEI === 'function') mascaraSEI(document.getElementById('campo13'));

    // Máscara de telefone celular
    const inputTel = document.getElementById('campo19');
    if (inputTel) {
        inputTel.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').slice(0, 11);
            if (v.length <= 10) {
                v = v.replace(/(\d{2})(\d)/,       '($1) $2');
                v = v.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
            } else {
                v = v.replace(/(\d{2})(\d)/,       '($1) $2');
                v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
            }
            this.value = v;
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. VALIDAÇÃO E SUBMIT
    // ══════════════════════════════════════════════════════════════════════════

    form01.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form01.checkValidity()) {
            alert('✅ Rascunho salvo com sucesso!\n📄 O resumo do processo foi atualizado e está disponível para visualização.');
        } else {
            form01.reportValidity();
        }
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 4. BOTÃO LIMPAR
    // ══════════════════════════════════════════════════════════════════════════

    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Deseja limpar todos os campos?')) {
                form01.reset();
                document.querySelectorAll('#form01 .error-msg').forEach(e => e.style.display = 'none');
                document.querySelectorAll('#form01 input').forEach(el => el.style.borderColor = '');
            }
        });
    }
});
