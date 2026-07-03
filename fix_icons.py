import re

# Update HTML
html = open('foco-02.html', encoding='utf-8').read()

# Substituir o emoji de lapis nas tags button por "Abre Edicao"
# E ajustar o font-size para ficar de acordo.
html = re.sub(
    r'(<button type="button" id="icone-edicao-[^>]+)(font-size:\s*18px;)([^>]+>)(?:✏️|✅|🔒|.*?)(</button>)',
    r'\1font-size: 14px; font-weight: bold; text-decoration: underline;\3Abre Edição\4',
    html
)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Update JS
js = open('foco-02.js', encoding='utf-8').read()

js = js.replace("btn.textContent = '✏️';", "btn.textContent = 'Abre Edição';")
js = js.replace("btn.textContent = '✅';", "btn.textContent = 'Fecha Edição';")
# Optional: remove the style color changes if they clash with text, but green/gray is fine for text too.

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Textos dos botoes alterados com sucesso!")
