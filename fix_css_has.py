import re

html = open('foco-02.html', encoding='utf-8').read()

old_css = r'input:checked ~ \.toggle-label-left \{ opacity: 0\.4; \}\s*input:checked ~ \.toggle-label-right \{ opacity: 1; \}'
new_css = """.edit-toggle:has(input:checked) .toggle-label-left { opacity: 0.4; }
.edit-toggle:has(input:checked) .toggle-label-right { opacity: 1; }"""

html = re.sub(old_css, new_css, html)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("CSS atualizado com :has()")
