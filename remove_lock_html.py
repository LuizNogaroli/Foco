import re

for filename in ['foco-02.html']:
    content = open(filename, encoding='utf-8').read()
    content = content.replace('🔒 ', '').replace('🔒', '')
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Cadeado removido de foco-02.html")
