html = open('foco-03-final.html', encoding='utf-8').read()

replacements = {
    # Programas
    "H vinculao com Programas/Estratgias de governo?": "Há vinculação com Programas/Estratégias de governo?",
    "H? vincula??o com Programas/Estrat?gias de governo?": "Há vinculação com Programas/Estratégias de governo?",
    "Programa de Regularizao Fundiria (REURB)": "Programa de Regularização Fundiária (REURB)",
    "Programa de Regulariza??o Fundi?ria (REURB)": "Programa de Regularização Fundiária (REURB)",
    "Programa de Desestatizao/Privatizao": "Programa de Desestatização/Privatização",
    "Programa de Desestatiza??o/Privatiza??o": "Programa de Desestatização/Privatização",
    "Outro programa ou estratgia": "Outro programa ou estratégia",
    "Outro programa ou estrat?gia": "Outro programa ou estratégia",

    # Politicas
    "H vinculao com Polticas Pblicas?": "Há vinculação com Políticas Públicas?",
    "H? vincula??o com Pol?ticas P?blicas?": "Há vinculação com Políticas Públicas?",
    "Poltica Nacional de Habitao": "Política Nacional de Habitação",
    "Pol?tica Nacional de Habita??o": "Política Nacional de Habitação",
    "Poltica Nacional de Mobilidade Urbana": "Política Nacional de Mobilidade Urbana",
    "Pol?tica Nacional de Mobilidade Urbana": "Política Nacional de Mobilidade Urbana",
    "Poltica Nacional de Meio Ambiente": "Política Nacional de Meio Ambiente",
    "Pol?tica Nacional de Meio Ambiente": "Política Nacional de Meio Ambiente",
    "Poltica Nacional de Segurana Pblica": "Política Nacional de Segurança Pública",
    "Pol?tica Nacional de Seguran?a P?blica": "Política Nacional de Segurança Pública",
    "Poltica Nacional de Defesa Nacional": "Política Nacional de Defesa Nacional",
    "Pol?tica Nacional de Defesa Nacional": "Política Nacional de Defesa Nacional",
    "Poltica Nacional de Sade": "Política Nacional de Saúde",
    "Pol?tica Nacional de Sa?de": "Política Nacional de Saúde",
    "Poltica Nacional de Educao": "Política Nacional de Educação",
    "Pol?tica Nacional de Educa??o": "Política Nacional de Educação",
    "Outra poltica pblica": "Outra política pública",
    "Outra pol?tica p?blica": "Outra política pública",
    "as polticas pblicas s quais a destinao": "as políticas públicas às quais a destinação",
    "as pol?ticas p?blicas ?s quais a destina??o": "as políticas públicas às quais a destinação",

    # Modificacao
    "H previso de modificao do terreno, aterro ou retirada de material, que acresa ou diminua a rea?": "Há previsão de modificação do terreno, aterro ou retirada de material, que acresça ou diminua a área?",
    "H? previs?o de modifica??o do terreno, aterro ou retirada de material, que acres?a ou diminua a ?rea?": "Há previsão de modificação do terreno, aterro ou retirada de material, que acresça ou diminua a área?",
    "Descrio da modificao prevista": "Descrição da modificação prevista",
    "Descri??o da modifica??o prevista": "Descrição da modificação prevista",

    # Impacto
    "H expectativa de impacto social?": "Há expectativa de impacto social?",
    "H? expectativa de impacto social?": "Há expectativa de impacto social?",
    "H expectativa de impacto ambiental?": "Há expectativa de impacto ambiental?",
    "H? expectativa de impacto ambiental?": "Há expectativa de impacto ambiental?",
    "Nmero estimado de beneficirios em potencial": "Número estimado de beneficiários em potencial",
    "N?mero estimado de benefici?rios em potencial": "Número estimado de beneficiários em potencial",
    
    # Compatibilidade
    "Compatibilidade urbanstica": "Compatibilidade urbanística",
    "Compatibilidade urban?stica": "Compatibilidade urbanística",

    # Comuns
    "No": "Não",
    "N?o": "Não",
    "Sem informao": "Sem informação",
    "Sem informa??o": "Sem informação",
    "Observaes complementares": "Observações complementares",
    "Observa??es complementares": "Observações complementares",
    "Informaes complementares": "Informações complementares",
    "Informa??es complementares": "Informações complementares",
    "Selecione uma opo": "Selecione uma opção",
    "Selecione uma op?o": "Selecione uma opção",

    # Regime Destinacao
    "Acordo de Cooperao Tcnica": "Acordo de Cooperação Técnica",
    "Acordo de Coopera??o T?cnica": "Acordo de Cooperação Técnica",
    "Regularizao Fundiria Urbana": "Regularização Fundiária Urbana",
    "Regulariza??o Fundi?ria Urbana": "Regularização Fundiária Urbana",
    "Afetao": "Afetação",
    "Afeta??o": "Afetação",
    "Autorizao": "Autorização",
    "Autoriza??o": "Autorização",
    "sustentvel": "sustentável",
    "sustent?vel": "sustentável",
    "Cesso": "Cessão",
    "Cess?o": "Cessão",
    "provisria": "provisória",
    "provis?ria": "provisória",
    "Concesso": "Concessão",
    "Concess?o": "Concessão",
    "Superfcie": "Superfície",
    "Superf?cie": "Superfície",
    "Dao em pagamento": "Dação em pagamento",
    "Da??o em pagamento": "Dação em pagamento",
    "Declarao": "Declaração",
    "Declara??o": "Declaração",
    "Servio Pblico": "Serviço Público",
    "Servi?o P?blico": "Serviço Público",
    "Doao": "Doação",
    "Doa??o": "Doação",
    "Inscrio": "Inscrição",
    "Inscri??o": "Inscrição",
    "ocupao": "ocupação",
    "ocupa??o": "ocupação",
    "Integralizao": "Integralização",
    "Integraliza??o": "Integralização",
    "Imobilirio": "Imobiliário",
    "Imobili?rio": "Imobiliário",
    "Locao": "Locação",
    "Loca??o": "Locação",
    "Permisso": "Permissão",
    "Permiss?o": "Permissão",
    "durao": "duração",
    "dura??o": "duração",
    
    # Uso Especifico / Imobiliario
    "Uso administrativo e representativo": "Uso administrativo e representativo",
    "rgo": "órgão",
    "?rg?o": "órgão",
    "representao diplomtica": "representação diplomática",
    "representa??o diplom?tica": "representação diplomática",
    "produo florestal": "produção florestal",
    "produ??o florestal": "produção florestal",
    "agropecuria": "agropecuária",
    "agropecu?ria": "agropecuária",
    "conservao": "conservação",
    "conserva??o": "conservação",
    "preservao": "preservação",
    "preserva??o": "preservação",
    "recreao pblica": "recreação pública",
    "recrea??o p?blica": "recreação pública",
    "estdio, ginsio": "estádio, ginásio",
    "est?dio, gin?sio": "estádio, ginásio",
    "Habitao": "Habitação",
    "Habita??o": "Habitação",
    "prestao de servios": "prestação de serviços",
    "presta??o de servi?os": "prestação de serviços",
    "resduos slidos": "resíduos sólidos",
    "res?duos s?lidos": "resíduos sólidos",
    "infraestrutura de servios pblicos": "infraestrutura de serviços públicos",
    "infraestrutura de servi?os p?blicos": "infraestrutura de serviços públicos",
    "metr": "metrô",
    "metr?": "metrô",
    "requalificao": "requalificação",
    "requalifica??o": "requalificação",
    "operao urbana consorciada": "operação urbana consorciada",
    "opera??o urbana consorciada": "operação urbana consorciada",
    "revitalizao de rea porturia": "revitalização de área portuária",
    "revitaliza??o de ?rea portu?ria": "revitalização de área portuária",
    "povos originrios": "povos originários",
    "povos origin?rios": "povos originários",
    "indgena": "indígena",
    "ind?gena": "indígena",
    "territrio quilombola": "território quilombola",
    "territ?rio quilombola": "território quilombola",
    "instituio de pesquisa": "instituição de pesquisa",
    "institui??o de pesquisa": "instituição de pesquisa",
    "extenso": "extensão",
    "extens?o": "extensão",
    "capacitao": "capacitação",
    "capacita??o": "capacitação",
    "assistncia social": "assistência social",
    "assist?ncia social": "assistência social",
    "cidado": "cidadão",
    "cidad?o": "cidadão",
    "filantrpica": "filantrópica",
    "filantr?pica": "filantrópica",
    "bsica de sade": "básica de saúde",
    "b?sica de sa?de": "básica de saúde",
    "laboratrio": "laboratório",
    "laborat?rio": "laboratório",
    "residncia funcional": "residência funcional",
    "resid?ncia funcional": "residência funcional",
    "instalao militar": "instalação militar",
    "instala??o militar": "instalação militar",
    "presdio ou unidade de custdia": "presídio ou unidade de custódia",
    "pres?dio ou unidade de cust?dia": "presídio ou unidade de custódia",
    "segurana pblica": "segurança pública",
    "seguran?a p?blica": "segurança pública",
    "espao de culto": "espaço de culto",
    "espa?o de culto": "espaço de culto",
    "cemitrio ou crematrio": "cemitério ou crematório",
    "cemit?rio ou cremat?rio": "cemitério ou crematório"
}

for k, v in replacements.items():
    html = html.replace(k, v)

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
        start_prevent = html.find("e.preventDefault();", submit_func_start) + len("e.preventDefault();")
        html = html[:start_prevent] + "\n          " + html[submit_valid_start:]

with open('foco-03.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Foco-03 restaurado e corrigido corretamente!")
