import os

campo = open('campo.txt', encoding='utf-8', errors='ignore').read()
foco03 = open('foco-03.html', encoding='utf-8').read()

# Extrair CSS de campo.txt
css_match = campo.find('.acordeao-wrapper')
css_end = campo.find('</style>')
if css_match != -1 and css_end != -1:
    css = campo[css_match:css_end].strip()
    foco03 = foco03.replace('</style>', '\n' + css + '\n  </style>')

# Extrair campos novos de campo.txt
start_campos = campo.find('<div class="form-group editavel">\n    <label for="campo51">Tipo de procedimento pretendido:')
end_campos = campo.find('<div class="button-group">')

if start_campos != -1 and end_campos != -1:
    novos_campos = campo[start_campos:end_campos].strip()
    
    # Em foco03.html, remover tudo de '<!-- Proposta de Destinação -->' até '<!-- Contrapartida -->'
    # e colocar novos_campos lá.
    foco_start = foco03.find('<!-- Proposta de Destinação -->')
    foco_end = foco03.find('<!-- Contrapartida -->')
    
    if foco_start != -1 and foco_end != -1:
        foco03 = foco03[:foco_start] + '<!-- Proposta de Destinação e Impactos -->\n      <h4 class="section-title">Proposta de Destinação e Impactos</h4>\n      ' + novos_campos + '\n\n      ' + foco03[foco_end:]

# Extrair JS de campo.txt
js_start = campo.find('<script>\nconst usoEspecificoMap=')
if js_start != -1:
    js_content = campo[js_start:]
    # Remover o btnEnviarSPU listener que ia pra foco-07 e validarFormulario que falta funcoes, etc.
    # Na verdade, a lógica do campo.txt tem um "validarFormulario" que não copiei.
    # Vamos pegar apenas a inicialização dos selects e os eventos change.
    
    # Ao invés de pegar todo o <script>, vou usar substituições finas depois no foco-03, ou posso extrair tudo e dar um replace.
    
    foco03 = foco03.replace('</body>', js_content + '\n</body>')

with open('foco-03-v2.html', 'w', encoding='utf-8') as f:
    f.write(foco03)
print('Merge concluído em foco-03-v2.html')
