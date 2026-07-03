import re

# UPDATE HTML
html = open('foco-02.html', encoding='utf-8').read()

css = """
.switch { position: relative; display: inline-block; width: 34px; height: 20px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #22c55e; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; }
input:checked + .slider { background-color: #ef4444; }
input:checked + .slider:before { transform: translateX(14px); }
.slider.round { border-radius: 20px; }
.slider.round:before { border-radius: 50%; }
.edit-toggle { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: bold; cursor: pointer; margin: 0; }
.edit-toggle span.toggle-label { color: #16a34a; }
input:checked ~ span.toggle-label { color: #dc2626; }
"""

if '.switch {' not in html:
    html = html.replace('<style>', '<style>\n' + css)

button_pattern = r'<button type="button" id="(icone-edicao-[^"]*)" onclick="habilitarEdicaoSecao\(\'(secao-[^\']*)\', \'[^\']*\'\)"[^>]*>Abre Edição</button>'
toggle_replacement = r'<label class="edit-toggle"><div class="switch"><input type="checkbox" id="\1" onchange="habilitarEdicaoSecao(\'\2\', \'\1\')"><span class="slider round"></span></div><span class="toggle-label" id="label-\1">Abre Edição</span></label>'

html = re.sub(button_pattern, toggle_replacement, html)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)

# UPDATE JS
js = open('foco-02.js', encoding='utf-8').read()
button_js_pattern = r'<button type="button" id="icone-edicao-id-\$\{rip\}" onclick="habilitarEdicaoSecao\(\'secao-identificacao-\$\{rip\}\', \'icone-edicao-id-\$\{rip\}\'\)"[^>]*>Abre Edição</button>'
toggle_js_replacement = r'<label class="edit-toggle"><div class="switch"><input type="checkbox" id="icone-edicao-id-${rip}" onchange="habilitarEdicaoSecao(\'secao-identificacao-${rip}\', \'icone-edicao-id-${rip}\')"><span class="slider round"></span></div><span class="toggle-label" id="label-icone-edicao-id-${rip}">Abre Edição</span></label>'

js = re.sub(button_js_pattern, toggle_js_replacement, js)

new_func = """window.habilitarEdicaoSecao = function(secaoId, btnId) {
    modoEdicaoAtivo = true;
    const secao = document.getElementById(secaoId);
    if (!secao) return;

    const btn = document.getElementById(btnId);
    let isEditing = false;
    
    if (btn) {
        // btn is now the checkbox
        isEditing = !btn.checked; // if checked (ON), we are opening edit mode, so isEditing becomes false (we WERE NOT editing before, now we are. Wait, the logic below says if (isEditing) { fechar } else { abrir }.
        // If btn.checked is true, we just turned it ON, so we want to OPEN edit. Therefore isEditing should be false so it runs the 'else' block (ABRIR).
        // If btn.checked is false, we just turned it OFF, so we want to CLOSE edit. Therefore isEditing should be true so it runs the 'if' block (FECHAR).
        // That means isEditing = !btn.checked; is perfectly correct.
        isEditing = !btn.checked;
        
        const labelText = document.getElementById('label-' + btnId);
        if (labelText) {
            if (btn.checked) {
                labelText.textContent = 'Fecha Edição';
            } else {
                labelText.textContent = 'Abre Edição';
            }
        }
    }

    const inputs = secao.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'button' || input.type === 'submit' || input.type === 'hidden') return;

        if (isEditing) {
            // VOLTAR PARA MODO LEITURA (Fechou)
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
            // HABILITAR EDICAO (Abriu)
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
js = pattern.sub(lambda m: new_func + "\n\n", js)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Transformado em toggle switch com sucesso.")
