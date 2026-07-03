import re

html = open('foco-02.html', encoding='utf-8').read()

old_css = r'\.toggle-label-left \{ color: #16a34a; transition: color 0\.3s; \}\s*\.toggle-label-right \{ color: #94a3b8; transition: color 0\.3s; \}\s*input:checked ~ \.toggle-label-left \{ color: #94a3b8; \}\s*input:checked ~ \.toggle-label-right \{ color: #dc2626; \}'

new_css = """.toggle-label-left { color: #16a34a; transition: opacity 0.3s; opacity: 1; }
.toggle-label-right { color: #dc2626; transition: opacity 0.3s; opacity: 0.4; }
input:checked ~ .toggle-label-left { opacity: 0.4; }
input:checked ~ .toggle-label-right { opacity: 1; }"""

html = re.sub(old_css, new_css, html)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("CSS atualizado!")
