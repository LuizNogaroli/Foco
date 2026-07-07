import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject conditional block in HTML
# Look for: ${buildField('Há benfeitorias?', 'benfeitorias', dados.benfeitorias)}
target_field = r"(\$\{buildField\([^,]+,\s*'benfeitorias',\s*dados\.benfeitorias\}\))"
replacement_field = r"""\1
            <div class="bloco-condicional" data-controlled-by="benfeitorias" data-show-when="Sim" style="display:none; padding-left:16px; border-left:3px solid #94a3b8; margin-top:4px;">
                ${buildField('Quais benfeitorias?', 'benfeitorias_descricao', dados.benfeitorias_descricao)}
            </div>"""

content = re.sub(target_field, replacement_field, content)

# 2. Update the mock block to also clear benfeitorias for RIP 2026001
target_mock = r"(if \(rip === '2026001'\) \{[^}]*dados\.situacao_incorporacao = '';\s*dados\.situacao = '';)"
replacement_mock = r"\1\n        dados.benfeitorias = '';\n        dados.benfeitorias_descricao = '';"

content = re.sub(target_mock, replacement_mock, content)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("foco-02.js patched with benfeitorias rules!")
