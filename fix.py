import re
html = open('foco-03.html', encoding='utf-8').read()

# Fix encoding issues in the labels
html = html.replace('H previso de modificao do terreno, aterro ou retirada de material, que acresa ou diminua a rea?', 'Há previsão de modificação do terreno, aterro ou retirada de material, que acresça ou diminua a área?')
html = html.replace('H? previs?o de modifica??o do terreno, aterro ou retirada de material, que acres?a ou diminua a ?rea?', 'Há previsão de modificação do terreno, aterro ou retirada de material, que acresça ou diminua a área?')
html = html.replace('H vinculao com Programas/Estratgias de governo?', 'Há vinculação com Programas/Estratégias de governo?')
html = html.replace('H? vincula??o com Programas/Estrat?gias de governo?', 'Há vinculação com Programas/Estratégias de governo?')
html = html.replace('H vinculao com Polticas Pblicas?', 'Há vinculação com Políticas Públicas?')
html = html.replace('H? vincula??o com Pol?ticas P?blicas?', 'Há vinculação com Políticas Públicas?')
html = html.replace('H expectativa de impacto social?', 'Há expectativa de impacto social?')
html = html.replace('H? expectativa de impacto social?', 'Há expectativa de impacto social?')
html = html.replace('H expectativa de impacto ambiental?', 'Há expectativa de impacto ambiental?')
html = html.replace('H? expectativa de impacto ambiental?', 'Há expectativa de impacto ambiental?')

html = html.replace('Nmero estimado de beneficirios em potencial:', 'Número estimado de beneficiários em potencial:')
html = html.replace('N?mero estimado de benefici?rios em potencial:', 'Número estimado de beneficiários em potencial:')
html = html.replace('Compatibilidade urbanstica', 'Compatibilidade urbanística')
html = html.replace('Compatibilidade urban?stica', 'Compatibilidade urbanística')
html = html.replace('Descrio da modificao prevista', 'Descrição da modificação prevista')
html = html.replace('Descri??o da modifica??o prevista', 'Descrição da modificação prevista')

# Remove the accordeon block
start_acc = html.find('<div class="acordeao-wrapper"')
end_acc = html.find('<div class="button-group"')
if start_acc != -1 and end_acc != -1:
    html = html[:start_acc] + html[end_acc:]

# Fix submit event listener to remove decl check
submit_func_start = html.find("document.getElementById('form03').addEventListener('submit', function(e) {")
if submit_func_start != -1:
    submit_valid_start = html.find("const form = e.target;\n          if (form.checkValidity()) {", submit_func_start)
    if submit_valid_start != -1:
        # replace the check between e.preventDefault(); and const form = e.target;
        start_prevent = html.find("e.preventDefault();", submit_func_start) + len("e.preventDefault();")
        html = html[:start_prevent] + "\n          " + html[submit_valid_start:]

# Save
with open('foco-03.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Correções aplicadas!")
