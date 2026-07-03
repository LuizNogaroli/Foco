import re

# ===================== UPDATE HTML =====================
html = open('foco-02.html', encoding='utf-8').read()

# Update CSS
old_css = r'\.edit-toggle \{ display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: bold; cursor: pointer; margin: 0; \}\s*\.edit-toggle span\.toggle-label \{ color: #16a34a; \}\s*input:checked ~ span\.toggle-label \{ color: #dc2626; \}'
new_css = """.edit-toggle { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: bold; cursor: pointer; margin: 0; }
.toggle-label-left { color: #16a34a; transition: color 0.3s; }
.toggle-label-right { color: #94a3b8; transition: color 0.3s; }
input:checked ~ .toggle-label-left { color: #94a3b8; }
input:checked ~ .toggle-label-right { color: #dc2626; }"""

html = re.sub(old_css, new_css, html)

# Replace existing toggles in HTML
# Currently they look like:
# <label class="edit-toggle"><div class="switch"><input type="checkbox" id="icone-edicao-avaliacao" onchange="habilitarEdicaoSecao('secao-avaliacao', 'icone-edicao-avaliacao')"><span class="slider round"></span></div><span class="toggle-label" id="label-icone-edicao-avaliacao">Abre Edição</span></label>
# or 'Abre Edi..o'
old_html_toggle = r'<label class="edit-toggle"><div class="switch"><input type="checkbox" id="([^"]+)" onchange="habilitarEdicaoSecao\(\'([^\']+)\', \'([^\']+)\'\)"><span class="slider round"></span></div><span class="toggle-label" id="label-[^"]+">[^<]*</span></label>'
new_html_toggle = r'<label class="edit-toggle"><span class="toggle-label-left">Consulta</span><div class="switch"><input type="checkbox" id="\1" onchange="habilitarEdicaoSecao(\'\2\', \'\3\')"><span class="slider round"></span></div><span class="toggle-label-right">Edição</span></label>'

html = re.sub(old_html_toggle, new_html_toggle, html)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)

# ===================== UPDATE JS =====================
js = open('foco-02.js', encoding='utf-8').read()

# Update toggles generated dynamically in JS
old_js_toggle = r'<label class="edit-toggle"><div class="switch"><input type="checkbox" id="icone-edicao-id-\$\{rip\}" onchange="habilitarEdicaoSecao\(\'secao-identificacao-\$\{rip\}\', \'icone-edicao-id-\$\{rip\}\'\)"><span class="slider round"></span></div><span class="toggle-label" id="label-icone-edicao-id-\$\{rip\}">Abre Edição</span></label>'
new_js_toggle = r'<label class="edit-toggle"><span class="toggle-label-left">Consulta</span><div class="switch"><input type="checkbox" id="icone-edicao-id-${rip}" onchange="habilitarEdicaoSecao(\'secao-identificacao-${rip}\', \'icone-edicao-id-${rip}\')"><span class="slider round"></span></div><span class="toggle-label-right">Edição</span></label>'

js = re.sub(old_js_toggle, new_js_toggle, js)

# Remove the JS logic that changes label text manually
js_logic_to_remove = r"""const labelText = document.getElementById\('label-' \+ btnId\);
\s*if \(labelText\) \{
\s*if \(btn\.checked\) \{
\s*labelText\.textContent = 'Fecha Edição';
\s*\} else \{
\s*labelText\.textContent = 'Abre Edição';
\s*\}
\s*\}"""

js = re.sub(js_logic_to_remove, "", js)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Toggles atualizados com Consulta e Edição")
