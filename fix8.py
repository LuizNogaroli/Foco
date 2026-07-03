import re

html = open('foco-03.html', encoding='utf-8', errors='ignore').read()

# Using regex to replace the specific corrupted words
replacements = [
    (r'agropecu.ria', 'agropecuária'),
    (r'produ.o florestal', 'produção florestal'),
    (r'dura.o', 'duração'),
    (r'presta.o', 'prestação'),
    (r'servi.os p.blicos', 'serviços públicos'),
    (r'requalifica.o', 'requalificação'),
    (r'origin.rios', 'originários'),
    (r'extens.o', 'extensão'),
    (r'sa.de', 'saúde'),
    (r'seguran.a p.blica', 'segurança pública'),
    (r'informa.o', 'informação'),
    
    (r'escrit.rio', 'escritório'),
    (r'.rg.o', 'órgão'),
    (r'Representa.o diplom.tica', 'Representação diplomática'),
    (r'Pecu.ria', 'Pecuária'),
    (r'Produ.o', 'Produção'),
    (r'agropecu.rio', 'agropecuário'),
    (r'conserva.o', 'conservação'),
    (r'.rea de', 'área de'),
    (r'preserva.o', 'preservação'),
    (r'recupera.o', 'recuperação'),
    (r'est.dio', 'estádio'),
    (r'gin.sio', 'ginásio'),
    (r'recrea.o', 'recreação'),
    (r'c.vico', 'cívico'),
    (r'Habita.o', 'Habitação'),
    (r'espec.ficos', 'específicos'),
    (r'defici.ncia', 'deficiência'),
    (r'Presta.o', 'Prestação'),
    (r'servi.os', 'serviços'),
    (r'.gua', 'água'),
    (r'sanit.rio', 'sanitário'),
    (r'el.trica', 'elétrica'),
    (r'G.s', 'Gás'),
    (r'Telecomunica.es', 'Telecomunicações'),
    (r'Res.duos', 'Resíduos'),
    (r's.lidos', 'sólidos'),
    (r'instala.o portu.ria', 'instalação portuária'),
    (r'aer.dromo', 'aeródromo'),
    (r'metr.', 'metrô'),
    (r'Opera.o', 'Operação'),
    (r'revitaliza.o de .rea portu.ria', 'revitalização de área portuária'),
    (r'multifinalit.rio', 'multifinalitário'),
    (r'ind.gena', 'indígena'),
    (r'Territ.rio', 'Território'),
    (r'Institui.o', 'Instituição'),
    (r'capacita.o', 'capacitação'),
    (r'assist.ncia', 'assistência'),
    (r'cidad.o', 'cidadão'),
    (r'filantr.pica', 'filantrópica'),
    (r'b.sica', 'básica'),
    (r'Laborat.rio', 'Laboratório'),
    (r'Resid.ncia', 'Residência'),
    (r'Instala.o', 'Instalação'),
    (r'pres.dio', 'presídio'),
    (r'cust.dia', 'custódia'),
    (r'espa.o', 'espaço'),
    (r'Cemit.rio', 'Cemitério'),
    (r'cremat.rio', 'crematório'),
    (r'vincula.o', 'vinculação'),
    (r'Alojamento', 'Alojamento')
]

for pattern, replacement in replacements:
    html = re.sub(pattern, replacement, html)

with open('foco-03.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Correcoes da tabela taxonomica aplicadas com regex!")
