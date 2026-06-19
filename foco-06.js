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

    // 5. SELETORES COMPLEMENTARES
    const addSelectToggle = (selectId, blockId) => {
        const sel = document.getElementById(selectId);
        const block = document.getElementById(blockId);
        if (sel && block) {
            const update = () => { block.style.display = sel.value ? 'block' : 'none'; };
            sel.addEventListener('change', update);
            update();
        }
    };

    addSelectToggle('campo51', 'bloco51_obs');
    addSelectToggle('campo55', 'bloco55_obs');
    addSelectToggle('campo58', 'bloco58_obs');
    addSelectToggle('campo510', 'bloco510_obs');
    addSelectToggle('campo511', 'bloco511_obs');
});
