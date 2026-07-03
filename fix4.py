import re

html = open('foco-03.html', encoding='utf-8').read()

# Substituies para caracteres perdidos
replacements = {
    # campo52 select
    'agropecuria': 'agropecuária',
    'produo': 'produção',
    'durao': 'duração',
    'prestao': 'prestação',
    'servios': 'serviços',
    'pblicos': 'públicos',
    'requalificao': 'requalificação',
    'originrios': 'originários',
    'extenso': 'extensão',
    'sade': 'saúde',
    'segurana': 'segurança',
    'pblica': 'pública',
    'informao': 'informação',

    # campo53 (usoEspecificoMap)
    'escritrio': 'escritório',
    'rgo': 'órgão',
    'pblica': 'pública',
    'Representao': 'Representação',
    'diplomtica': 'diplomática',
    'Pecuria': 'Pecuária',
    'Produo': 'Produção',
    'agropecurio': 'agropecuário',
    'conservao': 'conservação',
    'rea de': 'área de',
    'preservao': 'preservação',
    'recuperao': 'recuperação',
    'estdio': 'estádio',
    'ginsio': 'ginásio',
    'recreao': 'recreação',
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
    'instalao': 'instalação',
    'porturia': 'portuária',
    'aerdromo': 'aeródromo',
    'metr': 'metrô',
    'Operao': 'Operação',
    'revitalizao': 'revitalização',
    'rea': 'área',
    'porturia': 'portuária',
    'multifinalitrio': 'multifinalitário',
    'indgena': 'indígena',
    'Territrio': 'Território',
    'Instituio': 'Instituição',
    'capacitao': 'capacitação',
    'assistncia': 'assistência',
    'cidado': 'cidadão',
    'filantrpica': 'filantrópica',
    'bsica': 'básica',
    'Laboratrio': 'Laboratório',
    'sade': 'saúde',
    'Residncia': 'Residência',
    'Instalao': 'Instalação',
    'presdio': 'presídio',
    'custdia': 'custódia',
    'espao': 'espaço',
    'Cemitrio': 'Cemitério',
    'crematrio': 'crematório',
    'vinculao': 'vinculação',
    'Alojamento': 'Alojamento'
}

for k, v in replacements.items():
    html = html.replace(k, v)
    # capitalize both?
    html = html.replace(k.capitalize(), v.capitalize())

with open('foco-03.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fix options completed.")
