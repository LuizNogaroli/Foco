/**
 * Gerenciamento de Navegação via Iframe e URL Hash
 */

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.circle-btn');
    const iframe = document.getElementById('frame');
    const btnReturnEdit = document.getElementById('btnReturnEdit');
    let isSummaryMode = false;

    const summaryMap = {
        'foco-01.html': 'foco-01-resumo.html',
        'foco-02.html': 'foco-02-resumo.html',
        'foco-03.html': 'foco-03.html', 
        'foco-04.html': 'foco-04-resumo.html',
        'foco-05.html': 'foco-05-resumo.html',
        'foco-06.html': 'foco-06-resumo.html'
    };

    /**
     * Carrega a página com base no botão clicado ou no Hash da URL
     * @param {string} url - Caminho do arquivo .html
     * @param {HTMLElement} element - O botão que foi clicado
     */
    function navigate(url, element) {
        if (!url) return;

        // Ativa o modo resumo permanentemente se chegar na etapa 7
        if (url === 'manifestacao.html') {
            isSummaryMode = true;
            if (btnReturnEdit) btnReturnEdit.style.display = 'block';
        }

        let targetUrl = url;
        if (isSummaryMode && url !== 'manifestacao.html') {
            targetUrl = summaryMap[url] || url;
        }

        // Atualiza o iframe
        iframe.src = targetUrl;

        // Atualiza a classe ativa nos botões
        buttons.forEach(btn => btn.classList.remove('active-btn'));
        if (element) {
            element.classList.add('active-btn');
        } else {
            // Se não houver elemento (carregamento inicial via Hash), procura pelo data-url
            const targetBtn = document.querySelector(`[data-url="${url}"]`);
            if (targetBtn) targetBtn.classList.add('active-btn');
        }

        // Atualiza o Hash da URL sem recarregar a página
        window.location.hash = url.replace('.html', '');
    }

    if (btnReturnEdit) {
        btnReturnEdit.addEventListener('click', () => {
            // Recarrega a aplicação no estado inicial (Edit Mode)
            window.location.href = 'index.html';
        });
    }

    // Adiciona evento de clique em todos os botões
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            navigate(url, button);
        });
    });

    // Lógica para carregar a página correta ao iniciar ou ao usar "Voltar/Avançar"
    const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const url = `${hash}.html`;
            // Ativa o modo resumo se o hash for da manifestação
            if (url === 'manifestacao.html') {
                isSummaryMode = true;
                if (btnReturnEdit) btnReturnEdit.style.display = 'block';
            }
            navigate(url);
        } else {
            // Página padrão inicial
            navigate('foco-01.html');
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Executa no carregamento inicial
    handleHashChange();
});
