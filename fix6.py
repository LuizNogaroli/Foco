import re

html = open('foco-03.html', encoding='utf-8').read()

replacements = {
    'agropecuria': 'agropecuária',
    'produo florestal': 'produção florestal',
    'durao': 'duração',
    'prestao de servios': 'prestação de serviços',
    'servios pblicos': 'serviços públicos',
    'requalificao': 'requalificação',
    'originrios': 'originários',
    'extenso': 'extensão',
    'sade': 'saúde',
    'segurana pblica': 'segurança pública',
    'informao': 'informação',
    
    'escritrio': 'escritório',
    'rgo': 'órgão',
    'Representao diplomtica': 'Representação diplomática',
    'Pecuria': 'Pecuária',
    'Produo': 'Produção',
    'agropecurio': 'agropecuário',
    'conservao': 'conservação',
    'rea de': 'área de',
    'preservao': 'preservação',
    'recuperao': 'recuperação',
    'estdio': 'estádio',
    'ginsio': 'ginásio',
    'recreao pblica': 'recreação pública',
    'rea verde pblica': 'área verde pública',
    'cvico': 'cívico',
    'Habitao': 'Habitação',
    'especficos': 'específicos',
    'deficincia': 'deficiência',
    'Prestao': 'Prestação',
    'servios': 'serviços',
    'gua': 'água',
    'sanitrio': 'sanitário',
    'eltrica': 'elétrica',
    'Gs': 'Gás',
    'Telecomunicaes': 'Telecomunicações',
    'Resduos': 'Resíduos',
    'slidos': 'sólidos',
    'instalao porturia': 'instalação portuária',
    'aerdromo': 'aeródromo',
    'metr': 'metrô',
    'Operao': 'Operação',
    'revitalizao de rea porturia': 'revitalização de área portuária',
    'multifinalitrio': 'multifinalitário',
    'indgena': 'indígena',
    'Territrio': 'Território',
    'Instituio': 'Instituição',
    'capacitao': 'capacitação',
    'assistncia': 'assistência',
    'cidado': 'cidadão',
    'filantrpica': 'filantrópica',
    'bsica de sade': 'básica de saúde',
    'Laboratrio': 'Laboratório',
    'Residncia funcional': 'Residência funcional',
    'Instalao': 'Instalação',
    'presdio': 'presídio',
    'custdia': 'custódia',
    'espao de culto': 'espaço de culto',
    'Cemitrio': 'Cemitério',
    'crematrio': 'crematório',
    'vinculao': 'vinculação'
}

for k, v in replacements.items():
    html = html.replace(k, v)

with open('foco-03.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Correcoes da tabela taxonomica aplicadas com o caractere U+FFFD.")
