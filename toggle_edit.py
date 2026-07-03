import re

js_content = open('foco-02.js', encoding='utf-8').read()

new_func = """window.habilitarEdicaoSecao = function(secaoId, btnId) {
    modoEdicaoAtivo = true;
    const secao = document.getElementById(secaoId);
    if (!secao) return;

    const btn = document.getElementById(btnId);
    let isEditing = false;
    
    if (btn) {
        if (btn.dataset.editando === 'true') {
            isEditing = true;
        }
        
        if (isEditing) {
            // FECHAR EDICAO
            btn.dataset.editando = 'false';
            btn.textContent = '✏️'; // Lápis
            btn.style.color = '#94a3b8';
            btn.title = 'Habilitar edição desta seção';
        } else {
            // ABRIR EDICAO
            btn.dataset.editando = 'true';
            btn.textContent = '✅'; // Check
            btn.style.color = '#22c55e';
            btn.title = 'Concluir edição desta seção';
        }
    }

    const inputs = secao.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'button' || input.type === 'submit' || input.type === 'hidden') return;

        if (isEditing) {
            // VOLTAR PARA MODO LEITURA
            if (input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'radio') {
                input.setAttribute('disabled', 'true');
            } else {
                input.setAttribute('readonly', 'true');
            }
            input.classList.add('auto-loaded-field');
            
            input.style.backgroundColor = '#f8f9fa';
            input.style.color = '#495057';
            input.style.border = '1px solid #ccc';
            input.style.cursor = 'default';
        } else {
            // HABILITAR EDICAO
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.classList.remove('auto-loaded-field');

            input.style.cssText = input.style.cssText
                .replace(/background-color\\s*:\\s*[^;]+;?/gi, '')
                .replace(/background\\s*:\\s*[^;]+;?/gi, '')
                .replace(/color\\s*:\\s*[^;]+;?/gi, '');

            input.style.backgroundColor = '#ffffff';
            input.style.color = '#1e293b';
            input.style.border = '1px solid #94a3b8';
            input.style.cursor = 'text';

            input.addEventListener('input', verificarMudancaInline);
            input.addEventListener('change', verificarMudancaInline);
        }
    });

    if (!isEditing) {
        transformarCamposComOpcoes(secao);
    }
};"""

pattern = re.compile(r"window\.habilitarEdicaoSecao\s*=\s*function\(secaoId,\s*btnId\)\s*\{.*?\n\};\n", re.DOTALL)
js_content = pattern.sub(lambda m: new_func + "\n\n", js_content)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Funcao habilitarEdicaoSecao substituida com toggle.")
