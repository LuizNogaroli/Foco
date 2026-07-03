import re

js = open('foco-02.js', encoding='utf-8').read()
js = js.replace('🔒 ', '').replace('🔒', '')
with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Cadeado removido de foco-02.js")
