/**
 * foco-05.js
 * Lógica de interatividade para a Etapa 5: Análise do Destinatário
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form05');
    if (!form) return;

    // 1. Destinação Ativa -> Bloco Contratos
    const radiosAtiva = document.querySelectorAll('input[name="campo31"]');
    const blocoContratos = document.getElementById('bloco31');
    
    radiosAtiva.forEach(r => {
        r.addEventListener('change', () => {
            blocoContratos.style.display = (r.value === 'Sim' && r.checked) ? 'flex' : 'none';
        });
    });

    // ── LÓGICA DE REGULARIDADE E NATUREZA JURÍDICA ──────────────────────
    const radiosCNPJ = document.querySelectorAll('input[name="cnpj_regular"]');
    const blocoNatureza = document.getElementById('bloco-natureza-juridica');
    const selNatureza = document.getElementById('campo16');

    radiosCNPJ.forEach(r => {
        r.addEventListener('change', () => {
            if (r.value === 'Sim' && r.checked) {
                blocoNatureza.style.display = 'block';
                if (selNatureza) selNatureza.required = true;
            } else {
                blocoNatureza.style.display = 'none';
                if (selNatureza) {
                    selNatureza.required = false;
                    selNatureza.value = ""; // Opcional: limpa a seleção se ocultar
                }
            }
        });
    });

    // 2. Pendências (Checkboxes Exclusivos e Bloco Obs)
    const chkNenhuma = document.getElementById('campo42-nenhuma');
    const chkOutros = form.querySelectorAll('input[name="campo42[]"]:not(#campo42-nenhuma)');
    const blocoPendObs = document.getElementById('bloco-pendencias-obs');

    function updatePendenciasUI() {
        const algumOutroMarcado = Array.from(chkOutros).some(cb => cb.checked);
        blocoPendObs.style.display = algumOutroMarcado ? 'block' : 'none';
        
        if (chkNenhuma.checked && algumOutroMarcado) {
            chkNenhuma.checked = false;
        }
    }

    chkNenhuma.addEventListener('change', () => {
        if (chkNenhuma.checked) {
            chkOutros.forEach(cb => cb.checked = false);
            blocoPendObs.style.display = 'none';
        }
    });

    chkOutros.forEach(cb => {
        cb.addEventListener('change', updatePendenciasUI);
    });

    // 3. Capacidade Técnica -> Obs
    const selCapacidade = document.getElementById('campo33');
    const blocoCapObs = document.getElementById('bloco33_obs');
    
    if (selCapacidade && blocoCapObs) {
        selCapacidade.addEventListener('change', () => {
            blocoCapObs.style.display = selCapacidade.value !== '' ? 'block' : 'none';
        });
    }

    // 4. Lista Dinâmica de Documentos (Motor Simplificado)
    const btnAddDoc = document.getElementById('btnAdicionarDocumento05');
    const listDoc = document.getElementById('documentos-list-05');

    if (btnAddDoc && listDoc) {
        btnAddDoc.addEventListener('click', () => {
            const row = document.createElement('div');
            row.className = 'imagem-item';
            row.style.cssText = 'display:flex; gap:6px; align-items:center; margin-top:6px;';
            row.innerHTML = `
                <input type="text" name="docs_gerais_05[]" placeholder="Link/Documento Anexado" class="imagem-input" style="flex: 1;">
                <button type="button" class="btn-remove-imagem">✕</button>
            `;
            listDoc.appendChild(row);
            row.querySelector('input').focus();
            row.querySelector('.btn-remove-imagem').addEventListener('click', () => row.remove());
        });
    }

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            alert('✅ Rascunho salvo com sucesso!\n📄 O resumo do processo foi atualizado e está disponível para visualização.');
        } else {
            form.reportValidity();
        }
    });

    // Limpar
    document.getElementById('btnLimpar').addEventListener('click', () => {
        if (confirm('Deseja limpar todos os campos?')) {
            form.reset();
            document.querySelectorAll('[id^="bloco"]').forEach(b => {
                if(b.id !== 'bloco-pendencias-obs' || !b.id.includes('list')) b.style.display = 'none';
            });
            blocoPendObs.style.display = 'none';
            listDoc.innerHTML = '';
        }
    });
});
