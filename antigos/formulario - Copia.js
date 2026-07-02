// formulario.js
// Compartilhado por todos os formulários do projeto FOCO/SPU
// Responsabilidades:
//   1. Sistema de hints semáforo (verde / amarelo / vermelho)
//   2. Fallback para hints legados (.hint-icon antigo)
//   3. Funções utilitárias reutilizáveis (máscaras, CEP, popup)

// ══════════════════════════════════════════════════════════════════════════════
// UTILITÁRIOS GLOBAIS — disponíveis para todos os foco-XX.js
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Aplica máscara de CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00)
 * conforme o número de dígitos digitados.
 * @param {HTMLInputElement} input
 */
function mascaraCPFCNPJ(input) {
    if (!input) return;
    input.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        if (v.length <= 11) {
            v = v.replace(/(\d{3})(\d)/,       '$1.$2');
            v = v.replace(/(\d{3})(\d)/,       '$1.$2');
            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            v = v.substring(0, 14);
            v = v.replace(/(\d{2})(\d)/,       '$1.$2');
            v = v.replace(/(\d{3})(\d)/,       '$1.$2');
            v = v.replace(/(\d{3})(\d)/,       '$1/$2');
            v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }
        this.value = v;
    });
}

/**
 * Aplica máscara ao número SEI (00000.000000/0000-00).
 * @param {HTMLInputElement} input
 */
function mascaraSEI(input) {
    if (!input) return;
    input.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        v = v.substring(0, 17);
        if (v.length > 11)     v = v.replace(/(\d{5})(\d{6})(\d{4})(\d{0,2})/, '$1.$2/$3-$4');
        else if (v.length > 5) v = v.replace(/(\d{5})(\d+)/, '$1.$2');
        this.value = v;
    });
}

/**
 * Aplica máscara monetária brasileira (R$ 0,00) a um input.
 * @param {HTMLInputElement} input
 */
function mascaraMoeda(input) {
    if (!input) return;
    input.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        if (!v) { this.value = ''; return; }
        v = (parseInt(v, 10) / 100).toFixed(2);
        this.value = 'R$ ' + v.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    });
}

/**
 * Preenche automaticamente UF, cidade e logradouro a partir do CEP
 * via API ViaCEP. Aplica máscara 00000-000 enquanto digita.
 *
 * @param {HTMLInputElement} inputCEP
 * @param {object} campos  - { uf, cidade, logradouro } — cada valor é o id do input destino
 * @param {string} errId   - id do elemento de erro do CEP
 */
function consultaCEP(inputCEP, campos, errId) {
    if (!inputCEP) return;
    inputCEP.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 8);
        this.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v;

        if (v.length !== 8) return;

        fetch('https://viacep.com.br/ws/' + v + '/json/')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                const errEl = document.getElementById(errId);
                if (!errEl) return;

                if (data.erro) {
                    errEl.textContent   = 'CEP não encontrado.';
                    errEl.style.display = 'block';
                    inputCEP.classList.add('field-error');
                    inputCEP.classList.remove('field-valid');
                    if (campos.uf)         document.getElementById(campos.uf).value         = '';
                    if (campos.cidade)     document.getElementById(campos.cidade).value      = '';
                    if (campos.logradouro) document.getElementById(campos.logradouro).value  = '';
                    return;
                }

                errEl.style.display = 'none';
                inputCEP.classList.remove('field-error');
                inputCEP.classList.add('field-valid');

                if (campos.uf) {
                    const elUF = document.getElementById(campos.uf);
                    if (elUF) elUF.value = data.uf || '';
                }
                if (campos.cidade) {
                    const elCidade = document.getElementById(campos.cidade);
                    if (elCidade) {
                        elCidade.value = data.localidade || '';
                        if (data.localidade) elCidade.classList.add('field-valid');
                    }
                }
                if (campos.logradouro) {
                    const elLog = document.getElementById(campos.logradouro);
                    if (elLog) {
                        const end = [data.logradouro, data.bairro].filter(Boolean).join(', ');
                        elLog.value = end;
                        if (end) elLog.classList.add('field-valid');
                    }
                }
            })
            .catch(function () {
                const errEl = document.getElementById(errId);
                if (!errEl) return;
                errEl.textContent   = 'Erro ao consultar o CEP. Verifique sua conexão.';
                errEl.style.display = 'block';
            });
    });
}

/**
 * Abre uma URL em janela popup centralizada na tela.
 * @param {string} url
 * @param {number} [largura=900]
 * @param {number} [altura=720]
 */
function abrirPopup(url, largura, altura) {
    if (!url) return;
    largura = largura || 900;
    altura  = altura  || 720;
    window.open(
        url,
        'hintPopup',
        'width='   + largura +
        ',height=' + altura  +
        ',left='   + Math.round(screen.width  / 2 - largura / 2) +
        ',top='    + Math.round(screen.height / 2 - altura  / 2)
    );
}


// ══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE HINTS SEMÁFORO — inicializado após o DOM estar pronto
// ══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

    // ── Sistema semáforo (Verde / Amarelo / Vermelho) ─────────────────────────
    (function () {

        let tooltipAtivo = null;

        const TOOLTIP_CLASSES = {
            verde:    'tooltip-verde',
            amarelo:  'tooltip-amarelo',
            vermelho: 'tooltip-vermelho',
        };

        const POPUP_AVISOS = {
            amarelo:  '⚠ Clique para abrir detalhes em nova janela.',
            vermelho: '🔴 Clique para abrir informações importantes em nova janela.',
        };

        function criarTooltip(icon) {
            const texto = icon.getAttribute('data-hint');
            const tipo  = icon.getAttribute('data-hint-tipo') || 'verde';
            const popup = icon.getAttribute('data-popup');
            if (!texto) return;

            tooltipAtivo = document.createElement('div');
            tooltipAtivo.className = 'hint-tooltip-semaforo ' + (TOOLTIP_CLASSES[tipo] || '');

            const span = document.createElement('span');
            span.textContent = texto;
            tooltipAtivo.appendChild(span);

            if (popup && POPUP_AVISOS[tipo]) {
                const aviso = document.createElement('span');
                aviso.className   = 'tooltip-link-aviso';
                aviso.textContent = POPUP_AVISOS[tipo];
                tooltipAtivo.appendChild(aviso);
            }

            document.body.appendChild(tooltipAtivo);
            posicionarTooltip(icon);
        }

        function posicionarTooltip(icon) {
            if (!tooltipAtivo) return;
            const rect    = icon.getBoundingClientRect();
            const largura = 320;

            let top  = rect.bottom + 8;  // sem window.scrollY (position: fixed)
            let left = rect.left;         // sem window.scrollX (position: fixed)

            // Evita que saia pela direita
            if (left + largura > window.innerWidth - 16) {
                left = window.innerWidth - largura - 16;
            }

            // Evita que saia por baixo
            if (top + 80 > window.innerHeight) {
                top = rect.top - 80;
            }

            tooltipAtivo.style.top  = top  + 'px';
            tooltipAtivo.style.left = left + 'px';
        }

        function removerTooltip() {
            if (tooltipAtivo) { tooltipAtivo.remove(); tooltipAtivo = null; }
        }

        // Aplica comportamento em todos os ícones semáforo
        document.querySelectorAll('.hint-semaforo .hint-icon').forEach(function (icon) {
            const tipo  = icon.getAttribute('data-hint-tipo') || 'verde';
            const popup = icon.getAttribute('data-popup');

            icon.addEventListener('mouseenter', function () { criarTooltip(icon); });
            icon.addEventListener('mouseleave', removerTooltip);
            icon.addEventListener('focus',      function () { criarTooltip(icon); });
            icon.addEventListener('blur',       removerTooltip);

            if (popup && (tipo === 'amarelo' || tipo === 'vermelho')) {
                icon.addEventListener('click', function () {
                    removerTooltip(); // ✅ remove o tooltip antes de abrir o popup
                    abrirPopup(popup);
                });
            }

            icon.addEventListener('keydown', function (e) {
                if ((e.key === 'Enter' || e.key === ' ') &&
                     popup && (tipo === 'amarelo' || tipo === 'vermelho')) {
                    e.preventDefault();
                    removerTooltip(); // ✅ remove o tooltip antes de abrir o popup
                    abrirPopup(popup);
                }
                if (e.key === 'Escape') removerTooltip();
            });
        });

    })();


    // ── Fallback: hints legados fora de .hint-semaforo ────────────────────────
    // Garante compatibilidade com formulários ainda não migrados para o semáforo

    // Tipo A — só tooltip
    document.querySelectorAll(
        '.hint-icon:not(.hint-semaforo .hint-icon):not(.hint-link):not(.hint-popup)'
    ).forEach(function (icon) {
        let tooltipLegado = null;

        icon.addEventListener('mouseenter', function () {
            const texto = icon.getAttribute('data-hint');
            if (!texto) return;
            tooltipLegado = document.createElement('div');
            tooltipLegado.className   = 'hint-tooltip';
            tooltipLegado.textContent = texto;
            document.body.appendChild(tooltipLegado);
            const rect = icon.getBoundingClientRect();
            // sem window.scrollY/scrollX (position: fixed)
            tooltipLegado.style.top  = (rect.bottom + 6) + 'px';
            tooltipLegado.style.left = rect.left + 'px';
        });
        icon.addEventListener('mouseleave', function () {
            if (tooltipLegado) { tooltipLegado.remove(); tooltipLegado = null; }
        });
    });

    // Tipo B — tooltip + popup
    document.querySelectorAll(
        '.hint-icon:not(.hint-semaforo .hint-icon).hint-link, ' +
        '.hint-icon:not(.hint-semaforo .hint-icon).hint-popup'
    ).forEach(function (icon) {
        let tooltipLegado = null;

        icon.addEventListener('mouseenter', function () {
            const texto = icon.getAttribute('data-hint');
            if (!texto) return;
            tooltipLegado = document.createElement('div');
            tooltipLegado.className   = 'hint-tooltip';
            tooltipLegado.textContent = texto;
            document.body.appendChild(tooltipLegado);
            const rect = icon.getBoundingClientRect();
            // sem window.scrollY/scrollX (position: fixed)
            tooltipLegado.style.top  = (rect.bottom + 6) + 'px';
            tooltipLegado.style.left = rect.left + 'px';
        });
        icon.addEventListener('mouseleave', function () {
            if (tooltipLegado) { tooltipLegado.remove(); tooltipLegado = null; }
        });

        icon.addEventListener('click', function () {
            if (tooltipLegado) { tooltipLegado.remove(); tooltipLegado = null; } // ✅
            abrirPopup(icon.getAttribute('data-popup'));
        });
        icon.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (tooltipLegado) { tooltipLegado.remove(); tooltipLegado = null; } // ✅
                abrirPopup(icon.getAttribute('data-popup'));
            }
        });
    });

}); // fim DOMContentLoaded
