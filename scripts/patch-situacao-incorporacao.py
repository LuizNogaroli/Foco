import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update options
target_options = """    'situacao_incorporacao': [
        'Em processo de incorporação',
        'Outros'
    ],"""
replacement_options = """    'situacao_incorporacao': [
        'Em processo de incorporação',
        'Incorporado',
        'Outros'
    ],"""
# Since encoding might have messed up characters in the read, I will use regex
options_pattern = r"'situacao_incorporacao':\s*\[\s*'Em processo de incorpora[^']+',\s*'Outros'\s*\]"
replacement_options = """'situacao_incorporacao': [
        'Em processo de incorporação',
        'Incorporado',
        'Outros'
    ]"""
content = re.sub(options_pattern, replacement_options, content)

# 2. Add conditional block after the situacao_incorporacao field
field_pattern = r"(\$\{buildField\('Situa[^']+', 'situacao_incorporacao', [^}]+}\})"
replacement_field = r"""\1
            <div class="bloco-condicional" data-controlled-by="situacao_incorporacao" data-show-when="Outros" style="display:none; padding-left:16px; border-left:3px solid #94a3b8; margin-top:4px;">
                ${buildField('Observação', 'obs_situacao_incorporacao', dados.obs_situacao_incorporacao)}
            </div>"""
content = re.sub(field_pattern, replacement_field, content)

# 3. Add override for RIP 2026001 after DB fetch
# Let's find where the API response is assigned to dados.
# Usually: const dados = ...
# I will just inject it in the window.criarAccordionRIP function
target_override = "const bloco = document.createElement('div');"
replacement_override = """if (rip === '2026001') {
        dados.situacao_incorporacao = '';
        dados.situacao = '';
    }
    const bloco = document.createElement('div');"""
content = content.replace(target_override, replacement_override)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("foco-02.js patched with situacao_incorporacao rules!")
