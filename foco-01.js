// foco-01.js
// Exclusivo da Seção 1: Dados do Requerimento (foco-01.html)
// Depende de: formulario.js (mascaraCPFCNPJ, mascaraSEI)

window.ripsPesquisados = window.ripsPesquisados || {};
window.imovelCount = window.imovelCount || 0;

document.addEventListener('DOMContentLoaded', function () {
    const form01 = document.getElementById('form01');
    if (!form01) return;

    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
    // 1. MODAL DE SIMULAé!éO (Prioridade para interatividade)
    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
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

    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
    // 2. MéSCARAS E INICIALIZAé!éO
    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é

    if (typeof mascaraCPFCNPJ === 'function') mascaraCPFCNPJ(document.getElementById('campo14'));
    if (typeof mascaraSEI === 'function') mascaraSEI(document.getElementById('campo13'));

    // Méscara de telefone celular
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

    // =============================="é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é"é
    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
    // 3. VALIDAééO E SUBMIT
    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

    form01.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form01.checkValidity()) {
            const rootWindow = window.parent?.parent || window.parent || window;
            const seletorPerfil = document.getElementById('perfilSeletor') || rootWindow.document?.getElementById('perfilSeletor');
            
            // Atualização de status e status_flow será feita pelo sync.js no momento do sweep
            alert('= Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...');
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-02.html"]');
            if (btnTabNext) {
                setTimeout(() => btnTabNext.click(), 100);
            }
        } else {
            form01.reportValidity();
        }
    });

    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
    // 4. BOTéO LIMPAR
    // PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            if (confirm('Deseja limpar todos os campos?')) {
                form01.reset();
                document.querySelectorAll('#form01 .error-msg').forEach(e => e.style.display = 'none');
                document.querySelectorAll('#form01 input').forEach(el => el.style.borderColor = '');
                // Limpa também as seéées condicionais
                if (typeof verificarConceituacao === 'function') verificarConceituacao();
                document.getElementById('imoveis-container').innerHTML = '';
                document.getElementById('listaRIPsAssociados').innerHTML = '';
                document.getElementById('listaRIPsAssociados').style.display = 'none';
                window.ripsPesquisados = {};
                window.imovelCount = 0;
            }
        });
    }

    // Validaééo de submit para RIP foi removida, pois RIPs associados séo autométicos.

});
