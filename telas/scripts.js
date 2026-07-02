document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.botao-concluir');
    const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');

    // --- Helper to normalize text ---
    const normalize = (text) => {
        return text.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    // --- Profile Identification Logic (Sincronizado com manifestacao-02.html) ---
    const profileMap = {
        'uf-tecnica': 1,
        'uf-chefia': 2,
        'uf-coord': 3,
        'uf-super': 4,
        'uc-tecnica': 5,
        'uc-coord': 6,
        'uc-diretoria': 7,
        'cde': 8
    };

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
        // Mapeamento de nomes de arquivos para chaves curtas
        if (url.includes('uf-equipe-tecnica')) return 'uf-tecnica';
        if (url.includes('uf-chefia')) return 'uf-chefia';
        if (url.includes('uf-coordenacao')) return 'uf-coord';
        if (url.includes('uf-superintendencia')) return 'uf-super';
        if (url.includes('uc-equipe-tecnica')) return 'uc-tecnica';
        if (url.includes('uc-coordenacao-geral')) return 'uc-coord';
        if (url.includes('uc-diretoria')) return 'uc-diretoria';
        if (url.includes('cde.html')) return 'cde';
        return null;
    };

    const currentProfileKey = getProfileKeyFromUrl();

    // --- Core Logic ---
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (!confirm('✍️ Deseja realmente concluir e assinar digitalmente esta manifestação?')) {
                return;
            }

            const form = document.querySelector('form') || document.body;
            
            // 1. Atualiza Status Visual
            const statusEl = document.querySelector('.status');
            if (statusEl) {
                statusEl.textContent = '✅ Concluído';
                statusEl.className = 'status status-concluido';
                statusEl.style.backgroundColor = '#1a7a4a';
                statusEl.style.color = 'white';
            }

            // 2. Bloqueia o formulário
            allInputs.forEach(i => i.disabled = true);
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(t => t.disabled = true);
            submitButton.disabled = true;
            submitButton.textContent = '🔒 Manifestação Assinada';

            // 3. Obtém despacho
            const despachoText = despachoMap[currentProfileKey] || '';

            // 4. Gera Resumo e Notifica
            if (window.parent && typeof window.parent.gerarResumo === 'function') {
                alert('✅ Manifestação concluída com sucesso!\n📄 O resumo do documento foi gerado e salvo no histórico.');
                window.parent.gerarResumo(form, despachoText);
            } else {
                alert('✅ Manifestação concluída!');
            }
        });
    }

    const checkButtonState = () => {
        let anyOptionSelected = false;
        allInputs.forEach(input => { if (input.checked) anyOptionSelected = true; });
        if (submitButton) submitButton.disabled = !anyOptionSelected;
    };

    let lastCheckedRadioValue = {}; 
    const handleRadioClick = (event) => {
        const currentRadio = event.target;
        const radioGroup = currentRadio.name;
        if (lastCheckedRadioValue[radioGroup] === currentRadio.value) {
            currentRadio.checked = false;
            delete lastCheckedRadioValue[radioGroup];
        } else {
            lastCheckedRadioValue[radioGroup] = currentRadio.value;
        }
        document.querySelectorAll(`input[type="radio"][name="${radioGroup}"]`).forEach(radio => {
            const pDiv = radio.closest('div');
            if (pDiv) {
                const d = pDiv.querySelector('.opcao-descricao');
                if (d) d.classList.remove('active');
            }
        });
        if (currentRadio.checked) {
            const pDiv = currentRadio.closest('div');
            if (pDiv) {
                const d = pDiv.querySelector('.opcao-descricao');
                if (d) d.classList.add('active');
            }
        }
        checkButtonState();
    };

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('click', handleRadioClick);
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const pDiv = checkbox.closest('div');
            if (pDiv) {
                const d = pDiv.querySelector('.opcao-descricao');
                if (d) {
                    if (checkbox.checked) d.classList.add('active');
                    else d.classList.remove('active');
                }
            }
            checkButtonState();
        });
    });

    loadComments();
    checkButtonState(); 
});