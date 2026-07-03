import re

# UPDATE HTML
html = open('foco-02.html', encoding='utf-8').read()

# Replace any style starting with background-color: #f1f5f9 for these buttons
old_btn = r'(<button type="button" id="icone-edicao-[^"]*" onclick="habilitarEdicaoSecao[^"]*" title="[^"]*") style="[^"]*" onmouseover="[^"]*" onmouseout="[^"]*">(Abre Edi..o|Abre Edição)</button>'
new_btn = r'\1 style="background-color: #22c55e; border: 1px solid #16a34a; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 12px; font-weight: bold; color: #ffffff; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor=\'#16a34a\'" onmouseout="this.style.backgroundColor=\'#22c55e\'">Abre Edição</button>'

html = re.sub(old_btn, new_btn, html)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("foco-02.html atualizado!")
