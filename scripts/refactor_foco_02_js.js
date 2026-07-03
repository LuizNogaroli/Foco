const fs = require('fs');

let js = fs.readFileSync('foco-02.js', 'utf8');

// 1. Remove modal functions
js = js.replace(/\/\/ ==================== Modais de Edição ====================[\s\S]*?(?=\/\/ ==================== Salvar e Avançar ====================)/, '');

// 2. Add Inline Editing Logic before "Salvar e Avançar"
const inlineEditingLogic = `
// ==================== Modo de Edição Inline ====================
window.originalRipData = {};
let modoEdicaoAtivo = false;

window.habilitarModoEdicao = function() {
    modoEdicaoAtivo = true;
    document.getElementById('btnHabilitarEdicao').style.display = 'none';
    document.getElementById('avisoModoEdicao').style.display = 'block';
    
    // Pega todos os inputs e selects das áreas que vieram do datalake
    const inputs = document.querySelectorAll('#accordionIdentificacao input, #accordionIdentificacao select, #global-sections-container input, #global-sections-container select');
    
    inputs.forEach(input => {
        if (input.type !== 'button' && input.type !== 'submit') {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            
            // Adiciona evento para checar mudança
            input.addEventListener('input', verificarMudancaInline);
            input.addEventListener('change', verificarMudancaInline);
        }
    });
};

function verificarMudancaInline(e) {
    const el = e.target;
    const key = el.id || el.name;
    if (!key) return;
    
    // Qual era o valor original?
    const valorOriginal = window.originalRipData[key] || '';
    
    let valorAtual = '';
    if (el.type === 'checkbox' || el.type === 'radio') {
        valorAtual = el.checked ? (el.value || 'on') : '';
        // Para simplificar, checkboxes/radios complexos podem precisar de lógica extra, mas para textos/selects é direto:
    } else {
        valorAtual = el.value || '';
    }
    
    const alterado = (String(valorAtual).trim() !== String(valorOriginal).trim());
    
    let hintEl = el.parentNode.querySelector('.valor-original-hint');
    
    if (alterado) {
        el.classList.add('campo-alterado');
        if (!hintEl) {
            hintEl = document.createElement('span');
            hintEl.className = 'valor-original-hint';
            el.parentNode.insertBefore(hintEl, el.nextSibling);
        }
        hintEl.textContent = valorOriginal ? \`Original: \${valorOriginal}\` : 'Original: (vazio)';
    } else {
        el.classList.remove('campo-alterado');
        if (hintEl) {
            hintEl.remove();
        }
    }
}

// Intercepta a pesquisa para salvar o estado original
const pesquisarRipOriginal = window.pesquisarRip;
window.pesquisarRip = function() {
    const inputRip = document.getElementById('rip-search-input');
    const rip = inputRip ? inputRip.value.trim() : '';
    const ripData = window.ripsPesquisados ? window.ripsPesquisados[rip] : null;
    
    if (ripData) {
        // Mostra o botão de habilitar edição
        const containerBtn = document.getElementById('container-btn-edicao');
        if(containerBtn) containerBtn.style.display = 'block';
    }
    
    // Executa a busca normal
    if (typeof pesquisarRipOriginal === 'function') {
        pesquisarRipOriginal();
    }
    
    // Captura o estado dos campos LOGO APÓS o preenchimento pelo motor do FOCO
    setTimeout(() => {
        const inputs = document.querySelectorAll('#accordionIdentificacao input, #accordionIdentificacao select, #global-sections-container input, #global-sections-container select');
        inputs.forEach(input => {
            const key = input.id || input.name;
            if (key) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    window.originalRipData[key] = input.checked ? (input.value || 'on') : '';
                } else {
                    window.originalRipData[key] = input.value || '';
                }
            }
        });
    }, 500);
};

// ==================== Fim Modo de Edição ====================

`;

if (!js.includes('window.habilitarModoEdicao')) {
    js = js.replace('// ==================== Salvar e Avançar ====================', inlineEditingLogic + '// ==================== Salvar e Avançar ====================');
}

// 3. Modifica o Submit para gerar os divergencias_cadastro
const submitBad = `            // Simula salvamento`;
const submitGood = `            // Coleta divergências (diff)
            const divergencias = [];
            if (modoEdicaoAtivo) {
                const inputs = document.querySelectorAll('#accordionIdentificacao input, #accordionIdentificacao select, #global-sections-container input, #global-sections-container select');
                inputs.forEach(input => {
                    const key = input.id || input.name;
                    if (key && input.type !== 'button' && input.type !== 'submit') {
                        const original = String(window.originalRipData[key] || '').trim();
                        let atual = '';
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            atual = input.checked ? (input.value || 'on') : '';
                        } else {
                            atual = String(input.value || '').trim();
                        }
                        
                        if (original !== atual) {
                            divergencias.push({
                                campo: key,
                                valor_original: original === '' ? null : original,
                                valor_sugerido: atual,
                                status: original === '' ? 'preenchido' : 'alterado'
                            });
                        }
                    }
                });
            }
            
            // Aqui enviaria 'divergencias' via postMessage para o sync.js salvar no foco_drafts
            console.log("Divergências detectadas:", divergencias);
            if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({
                    type: 'DIVERGENCIAS_CADASTRO',
                    aba: 'foco-02',
                    data: divergencias
                }, '*');
            }
            
            // Simula salvamento`;

if (js.includes(submitBad) && !js.includes('const divergencias = [];')) {
    js = js.replace(submitBad, submitGood);
}

fs.writeFileSync('foco-02.js', js, 'utf8');
console.log('foco-02.js refatorado com sucesso.');
