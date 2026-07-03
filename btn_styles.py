import re

# Update HTML
html = open('foco-02.html', encoding='utf-8').read()

html = re.sub(
    r'style="background:\s*none;\s*border:\s*none;\s*cursor:\s*pointer;\s*font-size:\s*14px;\s*font-weight:\s*bold;\s*text-decoration:\s*underline;\s*color:\s*#[a-fA-F0-9]+;\s*transition:\s*color\s*0\.2s;"',
    r'style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 12px; font-weight: bold; color: #475569; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor=\'#e2e8f0\'" onmouseout="this.style.backgroundColor=\'#f1f5f9\'"',
    html
)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Update JS
js = open('foco-02.js', encoding='utf-8').read()

# Replace the toggle logic for colors
js = js.replace("btn.style.color = '#94a3b8';", "btn.style.backgroundColor = '#f1f5f9'; btn.style.color = '#475569'; btn.style.borderColor = '#cbd5e1'; btn.onmouseout = function(){this.style.backgroundColor='#f1f5f9'}; btn.onmouseover = function(){this.style.backgroundColor='#e2e8f0'};")
js = js.replace("btn.style.color = '#22c55e';", "btn.style.backgroundColor = '#dcfce7'; btn.style.color = '#166534'; btn.style.borderColor = '#86efac'; btn.onmouseout = function(){this.style.backgroundColor='#dcfce7'}; btn.onmouseover = function(){this.style.backgroundColor='#bbf7d0'};")

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Botões transformados com sucesso!")
