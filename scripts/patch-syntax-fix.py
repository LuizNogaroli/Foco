import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove everything between modoEdicaoAtivo = false; and // ==================== Fim Modo de Edição ====================
pattern = r'(let modoEdicaoAtivo = false;).*?(// ==================== Fim Modo de Edi[^\n]*====================)'
content = re.sub(pattern, r'\1\n\n\2', content, flags=re.DOTALL)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Dangling syntax fixed!")
