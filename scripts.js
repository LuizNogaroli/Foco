document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.botao-concluir');
    const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');

    const despachoMap = {
        'uf-tecnica': 'Após análise minuciosa dos documentos e vistoria técnica, manifestamos concordância com a proposta de destinação sob o regime de Cessão de Uso Gratuito. O imóvel encontra-se em condições adequadas e a finalidade atende ao interesse público.',
        'uf-chefia': 'Acompanho o parecer da equipe técnica. O processo está devidamente instruído e em conformidade com as normas vigentes. Encaminho para apreciação da Coordenação.',
        'uf-coord': 'Manifestação favorável. O projeto de destinação está alinhado às diretrizes estratégicas da SPU. Encaminho para decisão da Superintendência.',
        'uf-super': 'Aprovo a manifestação técnica e os despachos precedentes. Encaminho o processo à Unidade Central (SPU/UC) para deliberação final e ciência da CDE.',
        'uc-tecnica': 'Processo revisado e validado tecnicamente pelo órgão central. As conformidades legais e orçamentárias foram atestadas. Encaminho para homologação da Diretoria.',
        'uc-coord': 'Parecer de mérito ratificado. Alinhado às políticas de destinação de ativos da União. Sugiro encaminhamento para deliberação da CDE.',
        'uc-diretoria': 'Manifestação de mérito homologada por esta Diretoria. Encaminhe-se para pauta da Comissão de Destinações Especiais (CDE).',
        'cde': 'Deliberação final aprovada pelo Comitê. Processo deferido conforme pauta e atas de reunião.'
    };

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

            const despachoText = despachoMap[currentProfileKey] || '';

            // 4. Coleta dados MANUALMENTE
            const data = {};
            const elements = document.querySelectorAll('input, select, textarea');
            elements.forEach(el => {
                const key = el.name || el.id;
                if (!key) return;
                
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
                despacho: despachoText
            }, '*');

            alert('✅ Manifestação concluída!');
        });
    }

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
