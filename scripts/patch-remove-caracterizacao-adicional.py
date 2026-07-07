import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove HTML section
pattern_html = r'\s*<!-- ==================== CARACTERIZAÇÃO ADICIONAL \(NOVO\) ==================== -->\s*<div class="form-group editavel">.*?</div>\s*<div class="form-group editavel">.*?</div>'
content = re.sub(pattern_html, '', content, flags=re.DOTALL)

# Remove from selects mapping
target_js = '''        const selects = {
            [`campo32_${rip}`]: dados.tipo_uso_atual,
            [`campo-condicao-urbanizacao_${rip}`]: dados.condicao_urbanizacao,
            [`campo-tipo-imovel_${rip}`]: dados.tipo_imovel
        };'''

replacement_js = '''        const selects = {
            [`campo32_${rip}`]: dados.tipo_uso_atual
        };'''

if target_js in content:
    content = content.replace(target_js, replacement_js)

# Also remove fill calls if they exist globally
content = re.sub(r"^\s*fill\('condicao_urbanizacao', dados\.condicao_urbanizacao\);\s*$", '', content, flags=re.MULTILINE)
content = re.sub(r"^\s*fill\('tipo_imovel_global', dados\.tipo_imovel\);\s*$", '', content, flags=re.MULTILINE)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fields removed.")
