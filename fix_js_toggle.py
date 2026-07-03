import re

js = open('foco-02.js', encoding='utf-8').read()
js = js.replace("\\'", "'")

old_js_toggle_generic = r'<label class="edit-toggle"><div class="switch"><input type="checkbox" id="icone-edicao-id-\$\{rip\}" onchange="habilitarEdicaoSecao\(\'secao-identificacao-\$\{rip\}\', \'icone-edicao-id-\$\{rip\}\'\)"><span class="slider round"></span></div><span class="toggle-label" id="label-icone-edicao-id-\$\{rip\}">Abre Edição</span></label>'
new_js_toggle = r'<label class="edit-toggle"><span class="toggle-label-left">Consulta</span><div class="switch"><input type="checkbox" id="icone-edicao-id-${rip}" onchange="habilitarEdicaoSecao(\'secao-identificacao-${rip}\', \'icone-edicao-id-${rip}\')"><span class="slider round"></span></div><span class="toggle-label-right">Edição</span></label>'

# fallback if exact string matching is easier
old_exact = '<label class="edit-toggle"><div class="switch"><input type="checkbox" id="icone-edicao-id-${rip}" onchange="habilitarEdicaoSecao(\'secao-identificacao-${rip}\', \'icone-edicao-id-${rip}\')"><span class="slider round"></span></div><span class="toggle-label" id="label-icone-edicao-id-${rip}">Abre Edição</span></label>'
new_exact = '<label class="edit-toggle"><span class="toggle-label-left">Consulta</span><div class="switch"><input type="checkbox" id="icone-edicao-id-${rip}" onchange="habilitarEdicaoSecao(\'secao-identificacao-${rip}\', \'icone-edicao-id-${rip}\')"><span class="slider round"></span></div><span class="toggle-label-right">Edição</span></label>'

js = js.replace(old_exact, new_exact)
js = re.sub(old_js_toggle_generic, new_js_toggle, js)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("JS atualizado")
