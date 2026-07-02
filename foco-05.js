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
    
    if (radiosAtiva && blocoContratos) {
        radiosAtiva.forEach(r => {
            r.addEventListener('change', () => {
                blocoContratos.style.display = (r.value === 'Sim' && r.checked) ? 'flex' : 'none';
            });
        });
    }

    // 2. Pendências (Checkboxes Exclusivos e Bloco Obs)
    const chkNenhuma = document.getElementById('campo42-nenhuma');
    const chkOutros = form.querySelectorAll('input[name="campo42[]"]:not(#campo42-nenhuma)');
    const blocoPendObs = document.getElementById('bloco-pendencias-obs');

    if (chkNenhuma && chkOutros.length > 0 && blocoPendObs) {
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
    }

    // 3. Capacidade Técnica -> Obs
    const selCapacidade = document.getElementById('campo33');
    const blocoCapObs = document.getElementById('bloco33_obs');
    
    if (selCapacidade && blocoCapObs) {
        selCapacidade.addEventListener('change', () => {
            blocoCapObs.style.display = selCapacidade.value !== '' ? 'block' : 'none';
        });
    }

    // 4. Riscos Verificados (Toggles e Exclusividade)
    const chkNenhumRisco = document.querySelector('input[name="destinação_riscos[]"][value="Nenhum risco identificado"]');
    const chkOutrosRiscos = document.querySelectorAll('input[name="destinação_riscos[]"]:not([value="Nenhum risco identificado"])');
    const blocoRiscosObs = document.getElementById('bloco-obs-destinação-riscos');

    if (chkNenhumRisco && chkOutrosRiscos.length > 0 && blocoRiscosObs) {
        function updateRiscosUI() {
            const algumMarcado = Array.from(chkOutrosRiscos).some(cb => cb.checked);
            blocoRiscosObs.style.display = algumMarcado ? 'flex' : 'none';
            if (algumMarcado && chkNenhumRisco.checked) {
                chkNenhumRisco.checked = false;
            }
        }

        chkNenhumRisco.addEventListener('change', () => {
            if (chkNenhumRisco.checked) {
                chkOutrosRiscos.forEach(cb => cb.checked = false);
                blocoRiscosObs.style.display = 'none';
            }
        });

        chkOutrosRiscos.forEach(cb => {
            cb.addEventListener('change', updateRiscosUI);
        });
    }

    // 5. Restrições (Toggles e Exclusividade)
    const chkNenhumaRestricao = document.querySelector('input[name="destinação_restricoes[]"][value="Nenhuma restrição identificada"]');
    const chkOutrasRestricoes = document.querySelectorAll('input[name="destinação_restricoes[]"]:not([value="Nenhuma restrição identificada"])');
    const blocoRestricoesObs = document.getElementById('bloco-obs-destinação-restricoes');

    if (chkNenhumaRestricao && chkOutrasRestricoes.length > 0 && blocoRestricoesObs) {
        function updateRestricoesUI() {
            const algumaMarcada = Array.from(chkOutrasRestricoes).some(cb => cb.checked);
            blocoRestricoesObs.style.display = algumaMarcada ? 'flex' : 'none';
            if (algumaMarcada && chkNenhumaRestricao.checked) {
                chkNenhumaRestricao.checked = false;
            }
        }

        chkNenhumaRestricao.addEventListener('change', () => {
            if (chkNenhumaRestricao.checked) {
                chkOutrasRestricoes.forEach(cb => cb.checked = false);
                blocoRestricoesObs.style.display = 'none';
            }
        });

        chkOutrasRestricoes.forEach(cb => {
            cb.addEventListener('change', updateRestricoesUI);
        });
    }

    // 6. Custos de Manutenção -> Bloco Custos
    const radiosCustos = document.querySelectorAll('input[name="custos_manutencao"]');
    const blocoCustos = document.getElementById('bloco-custos-valor');

    if (radiosCustos && blocoCustos) {
        radiosCustos.forEach(r => {
            r.addEventListener('change', () => {
                blocoCustos.style.display = (r.value === 'Sim' && r.checked) ? 'flex' : 'none';
            });
        });
    }

    // 7. Outros Interessados -> Bloco Outros
    const radiosOutros = document.querySelectorAll('input[name="outros_interessados"]');
    const blocoOutros = document.getElementById('bloco-outros-interessados');

    if (radiosOutros && blocoOutros) {
        radiosOutros.forEach(r => {
            r.addEventListener('change', () => {
                blocoOutros.style.display = (r.value === 'Sim' && r.checked) ? 'flex' : 'none';
            });
        });
    }



    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            const rootWindow = window.parent?.parent || window.parent || window;
                        // O motor sync.js cuidará do salvamento na tabela intermediária (foco_drafts)
            alert('=é Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...');
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-06.html"]');
            if (btnTabNext) {
                setTimeout(() => btnTabNext.click(), 100);
            }
        } else {
            form.reportValidity();
        }
    });

    // Limpar
    const btnLimpar = document.getElementById('btnLimpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            if (confirm('Deseja limpar todos os campos?')) {
                form.reset();
                document.querySelectorAll('[id^="bloco"]').forEach(b => {
                    if (b.id !== 'bloco-pendencias-obs' && !b.id.includes('list')) b.style.display = 'none';
                });
                if (blocoPendObs) blocoPendObs.style.display = 'none';
                if (listDoc) listDoc.innerHTML = '';
            }
        });
    }

});
