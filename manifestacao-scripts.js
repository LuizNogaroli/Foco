document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.botao-concluir');
    const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');

    const getProfileKeyFromUrl = () => {
        const url = window.location.pathname.toLowerCase();
        if (url.includes('uf-tecnica')) return 'uf-tecnica';
        if (url.includes('uf-chefia')) return 'uf-chefia';
        if (url.includes('uf-coord')) return 'uf-coord';
        if (url.includes('uf-super')) return 'uf-super';
        if (url.includes('uc-tecnica')) return 'uc-tecnica';
        if (url.includes('uc-coord')) return 'uc-coord';
        if (url.includes('uc-diretoria')) return 'uc-diretoria';
        if (url.includes('cde')) return 'cde';
        if (url.includes('secretaria')) return 'secretaria';
        return null;
    };

    const currentProfileKey = getProfileKeyFromUrl();

    // Habilita botão quando houver seleção
    const checkState = () => {
        let ok = false;
        allInputs.forEach(i => { if(i.checked) ok = true; });
        if(submitButton) submitButton.disabled = !ok;
    };

    allInputs.forEach(i => i.addEventListener('change', checkState));

    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (!confirm('✍️ Deseja realmente concluir e assinar digitalmente esta manifestação?')) return;

            // UI Status
            const statusEl = document.querySelector('.status');
            if (statusEl) {
                statusEl.textContent = '✅ Concluído';
                statusEl.style.backgroundColor = '#1a7a4a';
                statusEl.style.color = 'white';
            }

            // Lock
            allInputs.forEach(i => i.disabled = true);
            document.querySelectorAll('textarea').forEach(t => t.disabled = true);
            submitButton.disabled = true;
            submitButton.textContent = '🔒 Assinado';

            // Coleta o que o usuário escreveu em todos os campos de texto (textarea)
            const allTextareas = Array.from(document.querySelectorAll('textarea'));
            const userObs = allTextareas
                .map(t => t.value.trim())
                .filter(v => v !== '')
                .join('\n\n');

            // Coleta TODAS as seleções (para perfis com múltiplas perguntas como Equipe C.G.)
            const detalhesManifestacao = [];
            const checkedInputs = Array.from(allInputs).filter(i => i.checked);
            
            checkedInputs.forEach(input => {
                const container = input.closest('.opcoes')?.previousElementSibling;
                const pergunta = container?.classList.contains('pergunta') ? container.textContent.trim() : null;
                const resposta = input.closest('label')?.querySelector('.opcao-texto')?.textContent.trim() || 
                                input.closest('label')?.textContent.trim() || input.value;
                
                if (pergunta) {
                    detalhesManifestacao.push({ pergunta, resposta });
                }
            });

            // Coleta o texto da última opção selecionada (conclusão principal)
            const lastRadio = checkedInputs[checkedInputs.length - 1];
            const textoDaOpcaoSelecionada = lastRadio ? 
                (lastRadio.closest('label')?.querySelector('.opcao-texto')?.textContent || 
                 lastRadio.closest('label')?.textContent || lastRadio.value).replace(/\s\s+/g, ' ').trim() : '';
            // Salva no estado central (Supabase) para o resumo
            const profileData = {
                manifestacao: textoDaOpcaoSelecionada,
                detalhes: detalhesManifestacao,
                observacoes: userObs
            };
            if (window.parent && window.parent.parent && typeof window.parent.parent.updateField === 'function') {
                window.parent.parent.updateField('foco_data_' + currentProfileKey, profileData);
                
                // --- REGRA DE NEGÓCIO: Mudança de Status ---
                const v = lastRadio ? lastRadio.value.toLowerCase() : '';
                if (currentProfileKey === 'cde') {
                    if (v === 'aprovar_proposta') {
                        window.parent.parent.updateField('status', 'Viabilidade confirmada');
                    } else {
                        // A outra opção "Devolvido complementação" cai na regra 3) -> "Devolvido para complementação"
                        window.parent.parent.updateField('status', 'Devolvido para complementação');
                    }
                } else {
                    const requiresReturn = v.includes('complementacao') || v.includes('insuficiente') || v.includes('retornar') || v.includes('diligencia') || v.includes('nao_apta') || v.includes('devolver') || v.includes('restituir') || v === 'indefiro';
                    
                    if (v === 'devolver_equipe' || v === 'restituir' || v === 'nao_apta_retornar' || v === 'necessita_complementacao' || v === 'diligencia') {
                        // Limpa as manifestações superiores da SPU/UF para forçar o recomeço
                        window.parent.parent.updateField('foco_data_uf-chefia', null);
                        window.parent.parent.updateField('foco_data_uf-coord', null);
                        window.parent.parent.updateField('foco_data_uf-super', null);
                        window.parent.parent.updateField('manifestacao_uf-chefia', false);
                        window.parent.parent.updateField('manifestacao_uf-coord', false);
                        window.parent.parent.updateField('manifestacao_uf-super', false);
                        
                        // Se for uma devolução da UC (Órgão Central), limpa também os pareceres da UC
                        if (['uc-tecnica', 'uc-coord', 'uc-diretoria'].includes(currentProfileKey)) {
                            window.parent.parent.updateField('foco_data_uc-tecnica', null);
                            window.parent.parent.updateField('foco_data_uc-coord', null);
                            window.parent.parent.updateField('foco_data_uc-diretoria', null);
                            window.parent.parent.updateField('manifestacao_uc-tecnica', false);
                            window.parent.parent.updateField('manifestacao_uc-coord', false);
                            window.parent.parent.updateField('manifestacao_uc-diretoria', false);
                            window.parent.parent.updateField('status', 'Devolvido pelo Órgão Central para SPU/UF');
                        } else {
                            window.parent.parent.updateField('status', 'Devolvido para Equipe SPU/UF');
                        }
                    } else if (requiresReturn) {
                        window.parent.parent.updateField('status', 'Devolvido para complementação');
                    }
                }
                
                // --- REGRA DE NEGÓCIO: Checkpoint status_flow ---
                let sf = '';
                if (['uf-tecnica', 'uf-chefia', 'uf-coord', 'uf-super'].includes(currentProfileKey)) sf = 'SPU/UF';
                else if (['uc-tecnica', 'uc-coord', 'uc-diretoria'].includes(currentProfileKey)) sf = 'Direção';
                else if (['cde'].includes(currentProfileKey)) sf = 'CDE';
                
                if (sf) {
                    window.parent.parent.updateField('status_flow', sf);
                }
            }

            // 4. Coleta dados MANUALMENTE (apenas inputs e selects, ignorando textareas já capturados)
            const data = {};
            const elements = document.querySelectorAll('input, select');
            elements.forEach(el => {
                const key = el.name || el.id;
                if (!key || el.type === 'button' || el.type === 'submit') return;
                
                if ((el.type === 'radio' || el.type === 'checkbox')) {
                    if (el.checked) {
                        const texto = el.closest('label')?.querySelector('.opcao-texto')?.textContent || 
                                      el.closest('label')?.textContent || el.value;
                        if (el.type === 'checkbox') {
                            data[key] = data[key] ? (data[key] + ', ' + texto) : texto;
                        } else {
                            data[key] = texto.replace(/\s\s+/g, ' ').trim();
                        }
                    }
                } else {
                    data[key] = el.value;
                }
            });

            window.parent.postMessage({
                type: 'CONCLUIR_MANIFESTACAO',
                titulo: document.querySelector('.titulo')?.textContent.trim() || document.title,
                dados: data,
                despacho: userObs
            }, '*');

            // Força o salvamento antes do alert para garantir que o BD registre a ação
            if (window.parent && window.parent.parent && typeof window.parent.parent.forceSaveDraft === 'function') {
                window.parent.parent.forceSaveDraft().then(() => {
                    alert('✅ Manifestação concluída!');
                });
            } else {
                alert('✅ Manifestação concluída!');
            }
        });
    }

    // Toggle de descrições
    const handleRadioToggle = (e) => {
        const parentDiv = e.target.closest('div');
        if (!parentDiv) return;
        const name = e.target.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
            const d = input.closest('div')?.querySelector('.opcao-descricao');
            if (d) d.classList.remove('active');
        });
        const desc = parentDiv.querySelector('.opcao-descricao');
        if (desc) desc.classList.add('active');
    };

    allInputs.forEach(input => input.addEventListener('change', handleRadioToggle));
    checkState();
});
