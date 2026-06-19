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
    const chkNenhumRisco = document.querySelector('input[name="destinacao_riscos[]"][value="Nenhum risco identificado"]');
    const chkOutrosRiscos = document.querySelectorAll('input[name="destinacao_riscos[]"]:not([value="Nenhum risco identificado"])');
    const blocoRiscosObs = document.getElementById('bloco-obs-destinacao-riscos');

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
    const chkNenhumaRestricao = document.querySelector('input[name="destinacao_restricoes[]"][value="Nenhuma restrição identificada"]');
    const chkOutrasRestricoes = document.querySelectorAll('input[name="destinacao_restricoes[]"]:not([value="Nenhuma restrição identificada"])');
    const blocoRestricoesObs = document.getElementById('bloco-obs-destinacao-restricoes');

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

    // 8. Lista Dinâmica de Documentos (Motor Simplificado)
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

    // Exposição global das funções de upload para botões no HTML
    window.triggerUpload = function(id) {
        const fileInput = document.getElementById('file_' + id);
        const hiddenInput = document.getElementById('val_' + id);
        
        if (!hiddenInput.value && fileInput.files && fileInput.files.length > 0) {
            // State B -> Clicked "Enviar arquivo"
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                hiddenInput.value = e.target.result; // Base64 Data URL
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true })); // Trigger sync.js save
                window.updateDocUI(id);
            };
            reader.readAsDataURL(file);
        } else {
            // State A -> Clicked "Carregar arquivo"
            if (fileInput) fileInput.click();
        }
    };

    window.handleFileUpload = function(id) {
        window.updateDocUI(id);
    };

    window.updateDocUI = function(id) {
        const hiddenInput = document.getElementById('val_' + id);
        const fileInput = document.getElementById('file_' + id);
        const hasFile = !!(hiddenInput && hiddenInput.value);
        
        const actionsDiv = document.getElementById('actions_' + id);
        if (!actionsDiv) return;
        const btnUpload = actionsDiv.querySelector('.btn-upload');
        const btnRemover = actionsDiv.querySelector('.btn-remove');
        const spanFilename = document.getElementById('filename_' + id);
        
        if (hasFile) {
            // State C
            if (btnUpload) btnUpload.style.display = 'none';
            if (spanFilename) spanFilename.style.display = 'none';
            if (btnRemover) btnRemover.style.display = 'inline-block';
        } else {
            const hasSelected = !!(fileInput && fileInput.files && fileInput.files.length > 0);
            if (hasSelected) {
                // State B
                if (btnUpload) {
                    btnUpload.innerHTML = '📤 Enviar arquivo';
                    btnUpload.style.backgroundColor = '#1e3a5f';
                    btnUpload.style.display = 'inline-block';
                }
                if (spanFilename) {
                    spanFilename.textContent = fileInput.files[0].name;
                    spanFilename.style.display = 'inline-block';
                }
                if (btnRemover) {
                    btnRemover.style.display = 'inline-block';
                }
            } else {
                // State A
                if (btnUpload) {
                    btnUpload.innerHTML = '📂 Carregar arquivo';
                    btnUpload.style.backgroundColor = '#2e7d32';
                    btnUpload.style.display = 'inline-block';
                }
                if (spanFilename) {
                    spanFilename.textContent = '';
                    spanFilename.style.display = 'none';
                }
                if (btnRemover) {
                    btnRemover.style.display = 'none';
                }
            }
        }
    };

    window.removerDoc = function(id) {
        const hiddenInput = document.getElementById('val_' + id);
        const fileInput = document.getElementById('file_' + id);
        const hasFile = !!(hiddenInput && hiddenInput.value);
        
        if (hasFile) {
            if (confirm('Deseja realmente remover este arquivo?')) {
                if (hiddenInput) {
                    hiddenInput.value = '';
                    hiddenInput.dispatchEvent(new Event('change', { bubbles: true })); // Trigger sync.js save
                }
                if (fileInput) fileInput.value = '';
                window.updateDocUI(id);
            }
        } else {
            // Cancel selected file
            if (fileInput) fileInput.value = '';
            window.updateDocUI(id);
        }
    };

    // Restaura o estado visual da certidão da matrícula
    const hiddenMatricula = document.getElementById('val_anexo_matricula');
    if (hiddenMatricula) {
        hiddenMatricula.addEventListener('change', () => {
            window.updateDocUI('anexo_matricula');
        });
        // Estado inicial
        setTimeout(() => {
            window.updateDocUI('anexo_matricula');
        }, 500);
    }
});
