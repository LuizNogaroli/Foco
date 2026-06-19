/**
 * foco-06.js
 * Lógica de interatividade e taxonomia para a Etapa 6
 * Padrão de Assinatura SPU/UF integrado
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form06');
    if (!form) return;

    // 1. MAPEAMENTO TAXONÔMICO
    const usoEspecificoMap = {
        "0101": ["01.01.01 Sede/Escritório Federal", "01.01.02 Sede Estadual/Municipal", "01.01.99 Outros"],
        "0102": ["01.02.01 Agricultura", "01.02.02 Pecuária", "01.02.05 Pesca"],
        "0103": ["01.03.01 Unidade de Conservação", "01.03.02 APP", "01.03.04 Recuperação Ambiental"],
        "0104": ["01.04.01 Museu/Teatro", "01.04.02 Estádio/Ginásio", "01.04.03 Lazer Público"],
        "0106": ["01.06.01 Habitação Interesse Social", "01.06.02 Mercado Popular"],
        "0111": ["01.11.01 Terra Indígena", "01.11.02 Quilombola", "01.11.04 Ribeirinha"]
    };

    const selUso = document.getElementById('campo52');
    const selEsp = document.getElementById('campo53');

    if (selUso) {
        selUso.addEventListener('change', () => {
            const val = selUso.value;
            selEsp.innerHTML = '';
            if (usoEspecificoMap[val]) {
                selEsp.disabled = false;
                selEsp.innerHTML = '<option value="">Selecione o uso específico...</option>';
                usoEspecificoMap[val].forEach(opt => {
                    const el = document.createElement('option'); el.value = opt; el.textContent = opt; selEsp.appendChild(el);
                });
            } else {
                selEsp.disabled = true;
                selEsp.innerHTML = '<option value="">Opções automáticas para este uso...</option>';
            }
        });
    }

    // 2. EXIBIÇÃO CONDICIONAL
    const c51 = document.getElementById('campo51');
    const blocoContratos = document.getElementById('bloco_contratos_anteriores');

    if (c51 && blocoContratos) {
        c51.addEventListener('change', () => {
            // Mostra o bloco de contratos apenas se a opção for Renovação/alteração contratual
            if (c51.value === 'Renovação/alteração contratual') {
                blocoContratos.style.display = 'block';
            } else {
                blocoContratos.style.display = 'none';
            }
        });
    }

    const radios54 = document.querySelectorAll('input[name="campo54"]');
    const b54 = document.getElementById('bloco54');
    radios54.forEach(r => r.addEventListener('change', () => b54.style.display = r.value === 'Sim' ? 'block' : 'none'));

    // Novas condicionais conforme demanda
    const handleRadioToggle = (radioName, blockId) => {
        const radios = document.querySelectorAll(`input[name="${radioName}"]`);
        const block = document.getElementById(blockId);
        if (radios.length && block) {
            radios.forEach(r => r.addEventListener('change', () => {
                block.style.display = r.value === 'Sim' ? 'block' : 'none';
            }));
        }
    };

    handleRadioToggle('campo56_radio', 'group-campo56');
    handleRadioToggle('campo57_radio', 'group-campo57');
    handleRadioToggle('campo58_radio', 'group-campo58');
    handleRadioToggle('campo510_radio', 'group-campo510');

    // 3. ACORDEÃO E ASSINATURA (PADRÃO FOCO-07)
    const accHeader = document.getElementById('header-declaracao');
    const accWrapper = document.getElementById('acordeao-declaracao');
    const btnAssinar = document.getElementById('btn-assinar');
    const btnLimparDec = document.getElementById('btn-limpar-decl');
    const chkDec = document.getElementById('decl-check1');
    const badge = document.getElementById('badge-ok');
    const badgePend = document.getElementById('pendente-ok');
    const status = document.getElementById('status-assinado');
    const overlay = document.getElementById('overlay-assinado');
    const conteudoDec = document.getElementById('conteudo-declaracao');
    const flag = document.getElementById('flag-assinado');

    if (accHeader) {
        accHeader.addEventListener('click', () => accWrapper.classList.toggle('aberto'));
    }

    if (chkDec) {
        chkDec.addEventListener('change', () => btnAssinar.disabled = !chkDec.checked);
    }

    if (btnAssinar) {
        btnAssinar.addEventListener('click', () => {
            flag.value = "1";
            badge.classList.add('visivel');
            if (badgePend) badgePend.classList.add('oculto');
            status.classList.add('visivel');
            overlay.classList.add('visivel');
            btnAssinar.style.display = 'none';
            btnLimparDec.style.display = 'inline-block';
            
            // Bloqueia conteúdo (Padrão FOCO-07)
            if (conteudoDec) {
                conteudoDec.classList.add('decl-conteudo-bloqueado');
                conteudoDec.querySelectorAll('input').forEach(i => i.disabled = true);
            }
        });
    }

    if (btnLimparDec) {
        btnLimparDec.addEventListener('click', () => {
            flag.value = "0";
            badge.classList.remove('visivel');
            if (badgePend) badgePend.classList.remove('oculto');
            status.classList.remove('visivel');
            overlay.classList.remove('visivel');
            btnAssinar.style.display = 'inline-block';
            btnLimparDec.style.display = 'none';
            
            if (conteudoDec) {
                conteudoDec.classList.remove('decl-conteudo-bloqueado');
                chkDec.disabled = false;
                chkDec.checked = false;
                btnAssinar.disabled = true;
            }
        });
    }

    // 4. SUBMIT E MODAL
    const modal = document.getElementById('modalEnvio');
    const btnFecharModal = document.getElementById('btnFecharModal');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form.checkValidity()) {
            alert('✅ Rascunho salvo com sucesso!\n📄 O resumo do processo foi atualizado e está disponível para visualização.');
        } else {
            form.reportValidity();
        }
    });

    document.getElementById('btnEnviarSPU').addEventListener('click', () => {
        if(flag.value !== "1") {
            alert('⚠️ Você precisa concluir a Manifestação do Técnico antes de enviar.');
            if(!accWrapper.classList.contains('aberto')) accWrapper.classList.add('aberto');
            return;
        }
        if (modal) modal.style.display = 'flex';
    });

    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Botão Limpar Global
    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            if (confirm('Limpar todos os campos?')) {
                location.reload();
            }
        });
    }
});
