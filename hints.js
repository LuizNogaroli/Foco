/* ══════════════════════════════════════════════════════════════════════════
   hints.js  — v6
   Gerencia todos os tooltips/hints do sistema FOCO/SPU
   ══════════════════════════════════════════════════════════════════════════ */

if (window.__hintsJsCarregado) {
    console.warn('hints.js: já inicializado, ignorando carregamento duplicado.');
} else {
    window.__hintsJsCarregado = true;

(function () {
    'use strict';

    let tooltipAtivo = null;
    let iconAtivo    = null;

    const TOOLTIP_CLASSES = {
        verde:    'tooltip-verde',
        amarelo:  'tooltip-amarelo',
        vermelho: 'tooltip-vermelho',
    };

    const POPUP_AVISOS = {
        amarelo:  '⚠ Clique para abrir detalhes em nova janela.',
        vermelho: '🔴 Clique para abrir informações importantes em nova janela.',
    };

    // ── Funções core ──────────────────────────────────────────────────────────

    // ✅ Remove TODOS os tooltips do DOM, não só o rastreado
    function removerTooltip() {
        document.querySelectorAll('.hint-tooltip, .hint-tooltip-semaforo')
                .forEach(function (el) { el.remove(); });
        tooltipAtivo = null;
        iconAtivo    = null;
    }

    function posicionarTooltip(icon) {
        if (!tooltipAtivo) return;
        const rect    = icon.getBoundingClientRect();
        const largura = 320;

        let top  = rect.bottom + 8;
        let left = rect.left;

        if (left + largura > window.innerWidth - 16) left = window.innerWidth - largura - 16;
        if (left < 8) left = 8;
        if (top + (tooltipAtivo.offsetHeight || 100) > window.innerHeight) {
            top = rect.top - (tooltipAtivo.offsetHeight || 80) - 8;
        }

        tooltipAtivo.style.top  = top  + 'px';
        tooltipAtivo.style.left = left + 'px';
    }

    function criarTooltipSemaforo(icon) {
        if (iconAtivo === icon) return;
        removerTooltip(); // ✅ limpa tudo antes de criar

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
        iconAtivo = icon;
        posicionarTooltip(icon);
    }

    function criarTooltipLegado(icon) {
        if (iconAtivo === icon) return;
        removerTooltip(); // ✅ limpa tudo antes de criar

        const texto = icon.getAttribute('data-hint');
        if (!texto) return;

        tooltipAtivo = document.createElement('div');
        tooltipAtivo.className   = 'hint-tooltip';
        tooltipAtivo.textContent = texto;
        document.body.appendChild(tooltipAtivo);
        iconAtivo = icon;
        posicionarTooltip(icon);
    }

    function abrirPopup(url, largura, altura) {
        if (!url) return;
        largura = largura || 900;
        altura  = altura  || 720;
        window.open(
            url, 'hintPopup',
            'width='   + largura +
            ',height=' + altura  +
            ',left='   + Math.round(screen.width  / 2 - largura / 2) +
            ',top='    + Math.round(screen.height / 2 - altura  / 2)
        );
    }

    // ── Fallbacks globais ─────────────────────────────────────────────────────

    window.addEventListener('blur',   removerTooltip);

    window.addEventListener('scroll', removerTooltip, { passive: true });

    window.addEventListener('resize', function () {
        if (iconAtivo) {
            const rect = iconAtivo.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                removerTooltip();
            } else {
                posicionarTooltip(iconAtivo);
            }
        } else {
            removerTooltip(); // ✅ limpa órfãos mesmo sem iconAtivo
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest || !e.target.closest('.hint-icon')) removerTooltip();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') removerTooltip();
    });

    // ── Bind de eventos por ícone ─────────────────────────────────────────────

    function bindIcon(icon) {
        if (icon.dataset.hintBound === '1') return;
        icon.dataset.hintBound = '1';

        const isSemaforo = !!icon.closest('.hint-semaforo');
        const tipo       = icon.getAttribute('data-hint-tipo') || 'verde';
        const popup      = icon.getAttribute('data-popup');

        const temPopup = popup && (
            tipo === 'amarelo' ||
            tipo === 'vermelho' ||
            icon.classList.contains('hint-link') ||
            icon.classList.contains('hint-popup')
        );

        const criar = isSemaforo ? criarTooltipSemaforo : criarTooltipLegado;

        icon.addEventListener('mouseenter', function () { criar(icon); });
        icon.addEventListener('mouseleave', removerTooltip);

        if (tipo === 'verde') {
            icon.style.cursor = 'default';
            icon.addEventListener('click', removerTooltip);
        } else {
            if (!icon.hasAttribute('tabindex')) icon.setAttribute('tabindex', '0');
            icon.addEventListener('focus', function () { criar(icon); });
            icon.addEventListener('blur',  removerTooltip);

            if (temPopup) {
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', function () {
                    removerTooltip();
                    abrirPopup(popup);
                });
                icon.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        removerTooltip();
                        abrirPopup(popup);
                    }
                });
            }
        }
    }

    // ── Inicialização ─────────────────────────────────────────────────────────

    function init() {
        document.querySelectorAll('.hint-icon').forEach(bindIcon);
        console.log('hints.js v6: inicializado. Ícones: ' +
                    document.querySelectorAll('.hint-icon').length);
    }
    window.rebindHints = init;

    // ✅ Garante inicialização independente do estado do DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); // DOM já estava pronto quando o script carregou
    }

})();

} // fim proteção anti-duplicata
