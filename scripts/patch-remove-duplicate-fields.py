import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Try to remove the three fields
pattern1 = r'\s*\$\{buildField\(\'Valor avaliado \(R\$\)\', \'valor_avaliado\', dados\.valor_avaliado \|\| dados\.valor_imovel\)\}'
pattern2 = r'\s*\$\{buildField\(\'Data da avaliação\', \'data_avaliacao\', dados\.data_avaliacao\)\}'
pattern3 = r'\s*\$\{buildField\(\'Instrumento de avaliação\', \'instrumento_avaliacao\', dados\.instrumento_avaliacao\)\}'

# Since the encoding might have changed characters like ã to something else (as seen in Get-Content output `avaliaǜo`),
# it is safer to use a more generic regex that matches just the variable names:
pattern = r'\s*\$\{buildField\([^,]+, \'valor_avaliado\', [^\}]+\}\)\s*\$\{buildField\([^,]+, \'data_avaliacao\', [^\}]+\}\)\s*\$\{buildField\([^,]+, \'instrumento_avaliacao\', [^\}]+\}\)'

content = re.sub(r'\s*\$\{buildField\([^,]+, \'valor_avaliado\', [^\}]+\}\)', '', content)
content = re.sub(r'\s*\$\{buildField\([^,]+, \'data_avaliacao\', [^\}]+\}\)', '', content)
content = re.sub(r'\s*\$\{buildField\([^,]+, \'instrumento_avaliacao\', [^\}]+\}\)', '', content)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fields removed.")
