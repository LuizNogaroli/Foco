import re

# UPDATE FOCO-02.HTML
html = open('foco-02.html', encoding='utf-8').read()

# Current button style in HTML:
# style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 12px; font-weight: bold; color: #475569; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#e2e8f0'" onmouseout="this.style.backgroundColor='#f1f5f9'"

old_style_html = r'style="background-color:\s*#f1f5f9;\s*border:\s*1px\s*solid\s*#cbd5e1;\s*border-radius:\s*4px;\s*padding:\s*4px\s*10px;\s*cursor:\s*pointer;\s*font-size:\s*12px;\s*font-weight:\s*bold;\s*color:\s*#475569;\s*text-decoration:\s*none;\s*transition:\s*all\s*0\.2s;"\s*onmouseover="this\.style\.backgroundColor=\'#e2e8f0\'"\s*onmouseout="this\.style\.backgroundColor=\'#f1f5f9\'"'
new_style_html = r'style="background-color: #22c55e; border: 1px solid #16a34a; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 12px; font-weight: bold; color: #ffffff; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor=\'#16a34a\'" onmouseout="this.style.backgroundColor=\'#22c55e\'"'

html = re.sub(old_style_html, new_style_html, html)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)

# UPDATE FOCO-02.JS
js = open('foco-02.js', encoding='utf-8').read()

# 1. Update the button for 'Identificacao do Imovel' (around line 243)
# It looks like: style="background: none; border: none; cursor: pointer; font-size: 18px; color: #94a3b8; transition: color 0.2s;"></button>
old_btn_js = r'<button type="button" id="icone-edicao-id-\$\{rip\}" onclick="habilitarEdicaoSecao\(\'secao-identificacao-\$\{rip\}\', \'icone-edicao-id-\$\{rip\}\'\)" title="Habilitar edição desta seção" style="[^"]*">.*?</button>'
new_btn_js = r'<button type="button" id="icone-edicao-id-${rip}" onclick="habilitarEdicaoSecao(\'secao-identificacao-${rip}\', \'icone-edicao-id-${rip}\')" title="Habilitar edição desta seção" style="background-color: #22c55e; border: 1px solid #16a34a; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 12px; font-weight: bold; color: #ffffff; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor=\'#16a34a\'" onmouseout="this.style.backgroundColor=\'#22c55e\'">Abre Edição</button>'

# use re.sub with care, handling 'edição' or 'edi\ufffdo' or 'edi.o' etc just in case
old_btn_js_generic = r'<button type="button" id="icone-edicao-id-\$\{rip\}" onclick="habilitarEdicaoSecao[^>]+>.*?</button>'
js = re.sub(old_btn_js_generic, new_btn_js, js)

# 2. Update the habilitarEdicaoSecao toggle logic (around line 861+)
# We have:
# btn.textContent = 'Abre Edição';
# btn.style.backgroundColor = '#f1f5f9'; btn.style.color = '#475569'; btn.style.borderColor = '#cbd5e1'; btn.onmouseout = function(){this.style.backgroundColor='#f1f5f9'}; btn.onmouseover = function(){this.style.backgroundColor='#e2e8f0'};
# and
# btn.textContent = 'Fecha Edição';
# btn.style.backgroundColor = '#dcfce7'; btn.style.color = '#166534'; btn.style.borderColor = '#86efac'; btn.onmouseout = function(){this.style.backgroundColor='#dcfce7'}; btn.onmouseover = function(){this.style.backgroundColor='#bbf7d0'};

js = js.replace(
    "btn.style.backgroundColor = '#f1f5f9'; btn.style.color = '#475569'; btn.style.borderColor = '#cbd5e1'; btn.onmouseout = function(){this.style.backgroundColor='#f1f5f9'}; btn.onmouseover = function(){this.style.backgroundColor='#e2e8f0'};",
    "btn.style.backgroundColor = '#22c55e'; btn.style.color = '#ffffff'; btn.style.borderColor = '#16a34a'; btn.onmouseout = function(){this.style.backgroundColor='#22c55e'}; btn.onmouseover = function(){this.style.backgroundColor='#16a34a'};"
)

js = js.replace(
    "btn.style.backgroundColor = '#dcfce7'; btn.style.color = '#166534'; btn.style.borderColor = '#86efac'; btn.onmouseout = function(){this.style.backgroundColor='#dcfce7'}; btn.onmouseover = function(){this.style.backgroundColor='#bbf7d0'};",
    "btn.style.backgroundColor = '#ef4444'; btn.style.color = '#ffffff'; btn.style.borderColor = '#dc2626'; btn.onmouseout = function(){this.style.backgroundColor='#ef4444'}; btn.onmouseover = function(){this.style.backgroundColor='#dc2626'};"
)


with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Cores e botoes corrigidos com sucesso.")
