import re

html = open('foco-03.html', encoding='utf-8').read()

replacements = {
    'agropecu\ufffdria': 'agropecuária',
    'produ\ufffdo florestal': 'produção florestal',
    'dura\ufffdo': 'duração',
    'presta\ufffdo de servi\ufffdos': 'prestação de serviços',
    'servi\ufffdos p\ufffdblicos': 'serviços públicos',
    'requalifica\ufffdo': 'requalificação',
    'origin\ufffdrios': 'originários',
    'extens\ufffdo': 'extensão',
    'sa\ufffdde': 'saúde',
    'seguran\ufffda p\ufffdblica': 'segurança pública',
    'informa\ufffdo': 'informação',
    
    'escrit\ufffdrio': 'escritório',
    '\ufffdrg\ufffdo': 'órgão',
    'Representa\ufffdo diplom\ufffdtica': 'Representação diplomática',
    'Pecu\ufffdria': 'Pecuária',
    'Produ\ufffdo': 'Produção',
    'agropecu\ufffdrio': 'agropecuário',
    'conserva\ufffdo': 'conservação',
    '\ufffdrea de': 'área de',
    'preserva\ufffdo': 'preservação',
    'recupera\ufffdo': 'recuperação',
    'est\ufffddio': 'estádio',
    'gin\ufffdsio': 'ginásio',
    'recrea\ufffdo': 'recreação',
    'c\ufffdvico': 'cívico',
    'Habita\ufffdo': 'Habitação',
    'espec\ufffdficos': 'específicos',
    'defici\ufffdncia': 'deficiência',
    'Presta\ufffdo': 'Prestação',
    'servi\ufffdos': 'serviços',
    '\ufffdgua': 'água',
    'sanit\ufffdrio': 'sanitário',
    'el\ufffdtrica': 'elétrica',
    'G\ufffds': 'Gás',
    'Telecomunica\ufffdes': 'Telecomunicações',
    'Res\ufffdduos': 'Resíduos',
    's\ufffdlidos': 'sólidos',
    'instala\ufffdo portu\ufffdria': 'instalação portuária',
    'aer\ufffddromo': 'aeródromo',
    'metr\ufffd': 'metrô',
    'Opera\ufffdo': 'Operação',
    'revitaliza\ufffdo de \ufffdrea portu\ufffdria': 'revitalização de área portuária',
    'multifinalit\ufffdrio': 'multifinalitário',
    'ind\ufffdgena': 'indígena',
    'Territ\ufffdrio': 'Território',
    'Institui\ufffdo': 'Instituição',
    'capacita\ufffdo': 'capacitação',
    'assist\ufffdncia': 'assistência',
    'cidad\ufffdo': 'cidadão',
    'filantr\ufffdpica': 'filantrópica',
    'b\ufffdsica': 'básica',
    'Laborat\ufffdrio': 'Laboratório',
    'Resid\ufffdncia': 'Residência',
    'Instala\ufffdo': 'Instalação',
    'pres\ufffddio': 'presídio',
    'cust\ufffddia': 'custódia',
    'espa\ufffdo': 'espaço',
    'Cemit\ufffdrio': 'Cemitério',
    'cremat\ufffdrio': 'crematório',
    'vincula\ufffdo': 'vinculação'
}

for k, v in replacements.items():
    html = html.replace(k, v)

with open('foco-03.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Correcoes da tabela taxonomica aplicadas com o caractere U+FFFD. v2")
