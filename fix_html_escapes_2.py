html = open('foco-02.html', encoding='utf-8').read()
html = html.replace("\\'", "'")
with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Escapes corrigidos")
