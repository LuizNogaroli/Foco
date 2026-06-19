// formulario.js
// Compartilhado por todos os formulários do projeto FOCO/SPU
// Responsabilidades:
//   1. Sistema de hints semáforo (verde / amarelo / vermelho)
//   2. Fallback para hints legados (.hint-icon antigo)
//   3. Funções de utilidade global (máscaras, consulta CEP)

(function () {
    "use strict";

    // ── CONFIGURAÇÃO E ESTADOS ───────────────────────────────────────────
    var tooltipAtivo = null;
    var tooltipLegado = null;

    /**
     * Inicializa o sistema de hints (Etiquetas de ajuda)
     */
    function initHints() {
        // 1. Hints tipo "Semáforo" (Modernos)
        var hintsSemaforo = document.querySelectorAll('.hint-semaforo .hint-icon');
        hintsSemaforo.forEach(function (icon) {
            function mostrarTooltip(e) {
                removerTooltip();
                var tipo = icon.getAttribute('data-hint-tipo') || 'verde';
                var texto = icon.getAttribute('data-hint');
                if (!texto) return;

                tooltipAtivo = document.createElement('div');
                tooltipAtivo.className = 'hint-tooltip hint-tipo-' + tipo;
                tooltipAtivo.textContent = texto;
                tooltipAtivo.style.position = 'fixed';
                tooltipAtivo.style.zIndex = '9999';
                document.body.appendChild(tooltipAtivo);

                var rect = icon.getBoundingClientRect();
                tooltipAtivo.style.top = (rect.bottom + 6) + 'px';
                tooltipAtivo.style.left = rect.left + 'px';
            }

            function removerTooltip() {
                if (tooltipAtivo) { tooltipAtivo.remove(); tooltipAtivo = null; }
            }

            icon.addEventListener('mouseenter', mostrarTooltip);
            icon.addEventListener('mouseleave', removerTooltip);
            icon.addEventListener('focus', mostrarTooltip);
            icon.addEventListener('blur', removerTooltip);
            icon.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') removerTooltip();
            });

            // Se for do tipo link/popup (ex: foco-05)
            if (icon.classList.contains('hint-link')) {
                icon.addEventListener('click', function () {
                    removerTooltip();
                    var url = icon.getAttribute('data-popup');
                    if (url && typeof abrirPopup === 'function') {
                        abrirPopup(url);
                    }
                });
            }
        });

        // 2. Hints Legados (compatibilidade com foco-01 e outros)
        var iconsLegados = document.querySelectorAll('.hint-icon:not([data-hint-tipo])');
        iconsLegados.forEach(function (icon) {
            var isLink = icon.classList.contains('hint-link');
            var isPopup = !!icon.getAttribute('data-popup');

            function mostrarTooltipLegado(e) {
                removerTooltipLegado();
                var texto = icon.getAttribute('data-hint');
                if (!texto) return;
                tooltipLegado = document.createElement('div');
                tooltipLegado.className = 'hint-tooltip';
                tooltipLegado.textContent = texto;
                tooltipLegado.style.position = 'fixed';
                tooltipLegado.style.zIndex = '9999';
                document.body.appendChild(tooltipLegado);
                var rect = icon.getBoundingClientRect();
                tooltipLegado.style.top = (rect.bottom + 6) + 'px';
                tooltipLegado.style.left = rect.left + 'px';
            }

            function removerTooltipLegado() {
                if (tooltipLegado) { tooltipLegado.remove(); tooltipLegado = null; }
            }

            icon.addEventListener('mouseenter', mostrarTooltipLegado);
            icon.addEventListener('mouseleave', removerTooltipLegado);
            icon.addEventListener('focus', mostrarTooltipLegado);
            icon.addEventListener('blur', removerTooltipLegado);

            if (isLink || isPopup) {
                icon.addEventListener('click', function () {
                    removerTooltipLegado();
                    var url = icon.getAttribute('data-popup');
                    if (url && typeof abrirPopup === 'function') {
                        abrirPopup(url);
                    }
                });
            }
        });
    }

    /**
     * Abre uma URL em janela popup centralizada
     */
    window.abrirPopup = function (url, largura, altura) {
        if (!url) return;
        largura = largura || 900;
        altura = altura || 720;
        window.open(
            url,
            'hintPopup',
            'width=' + largura +
            ',height=' + altura +
            ',left=' + Math.round(screen.width / 2 - largura / 2) +
            ',top=' + Math.round(screen.height / 2 - altura / 2)
        );
    };

    /**
     * MÁSCARAS GLOBAIS
     */
    window.mascaraCPFCNPJ = function (el) {
        if (!el) return;
        el.addEventListener('input', function (e) {
            var v = e.target.value.replace(/\D/g, '');
            if (v.length <= 11) {
                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            } else {
                v = v.replace(/^(\d{2})(\d)/, "$1.$2");
                v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
                v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
                v = v.replace(/(\d{4})(\d)/, "$1-$2");
            }
            e.target.value = v.substring(0, 18);
        });
    };

    window.mascaraSEI = function (el) {
        if (!el) return;
        el.addEventListener('input', function (e) {
            var v = e.target.value.replace(/\D/g, '');
            v = v.replace(/(\d{5})(\d)/, "$1.$2");
            v = v.replace(/(\d{5})\.(\d{6})(\d)/, "$1.$2/$3");
            v = v.replace(/(\d{4})(\d)/, "$1-$2");
            e.target.value = v.substring(0, 22);
        });
    };

    window.consultarCEP = function (inputCEP, errId, campos) {
        if (!inputCEP) return;
        inputCEP.addEventListener('blur', function () {
            var v = inputCEP.value.replace(/\D/g, '');
            if (v.length !== 8) return;
            fetch('https://viacep.com.br/ws/' + v + '/json/')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    var errEl = document.getElementById(errId);
                    if (!errEl) return;
                    if (data.erro) {
                        errEl.textContent = 'CEP não encontrado.';
                        errEl.style.display = 'block';
                        return;
                    }
                    errEl.style.display = 'none';
                    if (campos.uf && document.getElementById(campos.uf)) document.getElementById(campos.uf).value = data.uf || '';
                    if (campos.cidade && document.getElementById(campos.cidade)) document.getElementById(campos.cidade).value = data.localidade || '';
                    if (campos.logradouro && document.getElementById(campos.logradouro)) {
                        document.getElementById(campos.logradouro).value = [data.logradouro, data.bairro].filter(Boolean).join(', ');
                    }
                });
        });
    };

    /**
     * UPLOAD DE ARQUIVOS (BASE64) - REUTILIZÁVEL E GLOBAL
     */
    window.triggerUpload = function(id) {
        const fileInput = document.getElementById('file_' + id);
        if (fileInput) {
            fileInput.click();
        }
    };

    window.handleFileUpload = function(id) {
        const fileInput = document.getElementById('file_' + id);
        const hiddenInput = document.getElementById('val_' + id);
        const filenameInput = document.getElementById('val_filename_' + id);
        const btnUpload = document.querySelector(`#actions_${id} .btn-upload`);
        
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // Feedback visual de carregamento
            if (btnUpload) {
                btnUpload.innerHTML = '⌛ Carregando...';
                btnUpload.disabled = true;
                btnUpload.style.opacity = '0.7';
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                hiddenInput.value = e.target.result; // Salva o Base64
                
                if (filenameInput) {
                    filenameInput.value = file.name; // Salva o nome original
                    filenameInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true })); // Dispara sync.js
                window.updateDocUI(id);
            };
            reader.onerror = function() {
                alert('Erro ao carregar o arquivo.');
                window.updateDocUI(id);
            };
            reader.readAsDataURL(file);
        }
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
            // State C (Arquivo Carregado/Salvo)
            if (btnUpload) {
                btnUpload.style.display = 'none';
                btnUpload.disabled = false;
                btnUpload.style.opacity = '1';
            }
            if (spanFilename) {
                const filenameInput = document.getElementById('val_filename_' + id);
                spanFilename.textContent = (filenameInput && filenameInput.value) ? filenameInput.value : 'Arquivo carregado';
                spanFilename.style.display = 'inline-block';
            }
            if (btnRemover) btnRemover.style.display = 'inline-block';
        } else {
            // State A (Vazio)
            if (btnUpload) {
                btnUpload.innerHTML = '📂 Carregar arquivo';
                btnUpload.style.backgroundColor = '#2e7d32';
                btnUpload.style.display = 'inline-block';
                btnUpload.disabled = false;
                btnUpload.style.opacity = '1';
            }
            if (spanFilename) {
                spanFilename.textContent = '';
                spanFilename.style.display = 'none';
            }
            if (btnRemover) btnRemover.style.display = 'none';
        }
    };

    window.removerDoc = function(id) {
        const hiddenInput = document.getElementById('val_' + id);
        const fileInput = document.getElementById('file_' + id);
        const hasFile = !!(hiddenInput && hiddenInput.value);
        
        if (hasFile) {
            if (confirm('Deseja realmente remover este arquivo?')) {
                hiddenInput.value = '';
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true })); // Dispara sync.js
                
                const filenameInput = document.getElementById('val_filename_' + id);
                if (filenameInput) {
                    filenameInput.value = '';
                    filenameInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                if (fileInput) fileInput.value = '';
                window.updateDocUI(id);
            }
        }
    };

    // Auto-inicialização dos campos de upload estáticos
    function initFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(fileInput => {
            // Ignora campos dinâmicos da lista customizada
            if (fileInput.id.startsWith('file_custom_')) return;
            
            const id = fileInput.id.replace('file_', '');
            const hiddenInput = document.getElementById('val_' + id);
            if (hiddenInput) {
                hiddenInput.addEventListener('change', () => window.updateDocUI(id));
                
                const filenameInput = document.getElementById('val_filename_' + id);
                if (filenameInput) {
                    filenameInput.addEventListener('change', () => window.updateDocUI(id));
                }
                
                // Adiciona o listener change para o input do arquivo se não estiver no HTML
                if (!fileInput.getAttribute('onchange')) {
                    fileInput.addEventListener('change', () => window.handleFileUpload(id));
                }
                
                // Estado inicial
                setTimeout(() => window.updateDocUI(id), 400);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initHints();
            initFileUploads();
        });
    } else {
        initHints();
        initFileUploads();
    }

})();

/**
 * Gera e exibe o resumo a partir de um objeto de dados (usado por postMessage)
 */
window.gerarResumoDosDados = function(dataObj, titulo, despacho) {
    const pageTitle = document.title;
    let reportHtml = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Resumo - ${pageTitle}</title>
            <link rel="stylesheet" href="report.css">
        </head>
        <body>
            <div class="report-container">
                <div class="no-print report-button-group">
                    <button class="btn-report btn-report-print" onclick="window.print()">🖨️ Imprimir Relatório</button>
                    <button class="btn-report" style="background:#6c757d; color:white;" onclick="window.close()">Fechar</button>
                </div>

                <div class="report-header">
                    <p style="font-weight:bold; margin-top:10px;">Relatório - ${titulo}</p>
                </div>

                <div class="report-section">
                    <div class="report-section-title">Manifestação</div>
                    <div class="report-grid">
    `;

    // Mapeia nomes amigáveis para campos comuns da pasta telas
    const labelsMap = {
        'campo16': 'Natureza Jurídica',
        'declaracao_confirmacao': '',
        'declaracao': '',
        'observacoes': 'Observações Técnicas',
        'observacoes_super': 'Observações da Superintendência',
        'obs': 'Parecer Técnico Central',
        'interesse': 'Demonstração de Interesse Público',
        'cg': 'Manifestação da CG',
        'dir': 'Manifestação da Diretoria',
        'decisao_final': 'Decisão Superior (Gabinete)',
        'observacoes_gabinete': 'Despacho de Gabinete',
        'aspectos_interesse_publico': 'Aspectos de Interesse Público',
        'escolha_destinatario': 'Escolha do Destinatário',
        'impactos': 'Impactos Identificados',
        'regime_destinacao': 'Regime de Destinação',
        'deliberacao': 'Deliberação Final'
    };

    for (let key in dataObj) {
        let label = labelsMap[key] || key;
        let value = dataObj[key] || 'Não informado';

        // Pula campos vazios ou botões
        if (!value || value === 'Não informado') continue;

        // Pula campos que devem ir para o box de "Observações" ou que são IDs internos
        if (key.startsWith('observacoes') || key.startsWith('obs') || key === 'despacho' || key === 'condicionantes' || key === 'parecer') continue;

        const isLongText = key.includes('observacoes') || key === 'obs' || key === 'parecer' || key === 'declaracao_confirmacao' || key === 'declaracao';
        
        // Se for a declaração de confirmação ou manifestação de mérito, não exibe o label, apenas o texto ocupando tudo
        if (key === 'declaracao_confirmacao' || key === 'declaracao') {
            reportHtml += `
                <div class="report-item" style="grid-column: span 2; border: none; padding-top: 0;">
                    <span class="report-value" style="font-size: 1rem; color: #333; width: 100%; display: block;">${value}</span>
                </div>
            `;
            continue;
        }

        // Se o campo não tiver um label amigável mapeado, pula para evitar mostrar IDs técnicos (como observacoes_superintendencia)
        if (!labelsMap[key]) continue;

        reportHtml += `
            <div class="report-item" style="grid-column: span ${isLongText ? '2' : '1'}">
                <span class="report-label">${label}</span>
                <span class="report-value">${value}</span>
            </div>
        `;
    }

    reportHtml += `
                    </div>
                </div>
    `;

    if (despacho) {
        reportHtml += `
                <div class="report-section">
                    <div class="report-section-title">Observações</div>
                    <div class="report-value" style="font-style: italic; background: #fdfdfd; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                        "${despacho}"
                    </div>
                </div>
        `;
    }

    // Identificação dinâmica para assinatura
    const seletorPerfil = document.getElementById('perfilSeletor') || window.parent?.document.getElementById('perfilSeletor');
    let nomeResponsavel = "Usuário do System";
    let cargoResponsavel = "Servidor SPU";
    let perfilValue = "";

    if (seletorPerfil) {
        perfilValue = seletorPerfil.value;
        const option = seletorPerfil.options[seletorPerfil.selectedIndex];
        cargoResponsavel = option.text;
        const nomesMock = {
            'uf-tecnica': 'João Silva', 'uf-chefia': 'Maria Oliveira', 'uf-coord': 'Roberto Costa',
            'uf-super': 'Dra. Helena Martins', 'uc-tecnica': 'Ricardo Lima', 'uc-coord': 'Carlos Eduardo',
            'uc-diretoria': 'Patrícia Souza', 'cde': 'CDE - Comissão de Destinações Especiais',
            'secretaria': 'Dra. Regina Santos (Secretária / Ministra)'
        };
        nomeResponsavel = nomesMock[perfilValue] || "Usuário Identificado";
    }

    const hashVerificacao = Math.random().toString(16).substring(2, 10).toUpperCase() + '-' + Math.random().toString(16).substring(2, 10).toUpperCase();

    reportHtml += `
                <div style="margin-top: 40px; padding: 15px; border: 1px solid #ddd; border-left: 6px solid #1a7a4a; background: #fdfdfd; width: 100%; box-sizing: border-box; font-size: 0.85rem; color: #444; font-family: sans-serif;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                        Responsável: <span style="color:#1a4e8a; font-weight:bold;">${nomeResponsavel} (${cargoResponsavel})</span><br>
                        Status do Documento: <span style="color:#1a7a4a; font-weight:bold;">CONSOLIDADO E CONFERIDO</span>
                    </div>
                        <div style="text-align: right;">
                            <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}<br>
                            <strong>ID de Autenticidade:</strong> <span style="font-family: monospace; color: #666;">${hashVerificacao}</span>
                        </div>
                    </div>
                </div>
                <div class="report-footer">
                </div>
            </div>
        </body>
        </html>
    `;

    if (perfilValue) {
        const rootWindow = window.parent?.parent || window.parent || window;
        if (rootWindow.saveReportToDB) {
            rootWindow.saveReportToDB(perfilValue, reportHtml);
        } else {
            localStorage.setItem('foco_report_' + perfilValue, reportHtml);
        }
    }

    const win = window.open('', 'ResumoFOCO', 'width=1100,height=850');
    if (win) {
        win.document.write(reportHtml);
        win.document.close();
    } else {
        alert('✅ Manifestação Salva com Sucesso!\n\n⚠️ O popup do relatório foi bloqueado pelo navegador, mas a sua manifestação já está disponível no "Histórico de Manifestações" (coluna central).\n\nPara visualizar o relatório agora, clique no botão correspondente no Histórico ou permita popups neste site.');
    }
};

// Listener para receber dados do iframe (CORS bypass for file://)
window.addEventListener('message', function(event) {
    if (event.data.type === 'CONCLUIR_MANIFESTACAO') {
        window.gerarResumoDosDados(event.data.dados, event.data.titulo, event.data.despacho);
    }
});
