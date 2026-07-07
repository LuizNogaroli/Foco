import json

data = json.load(open('portal_backup.json', encoding='utf-8-sig'))['value']
data.sort(key=lambda x: int(x['process_id']))

sql1 = 'TRUNCATE tabela_requerimentos CASCADE;\n\nINSERT INTO tabela_requerimentos (numero_requerimento, dados_json) VALUES\n'
sql2 = 'INSERT INTO tabela_status_fluxo (numero_requerimento, dados_json) VALUES\n'
sql3 = 'INSERT INTO tabela_atribuicao (numero_requerimento, dados_json) VALUES\n'

vals1 = []
vals2 = []
vals3 = []

import random

docs_possiveis = [
    {'url': '#', 'nome': 'Requerimento inicial'},
    {'url': '#', 'nome': 'Contrato social / Estatuto'},
    {'url': '#', 'nome': 'Identificação do representante'},
    {'url': '#', 'nome': 'Procuração'},
    {'url': '#', 'nome': 'Comprovante de situação cadastral'}
]

for idx, d in enumerate(data):
    fd = d['form_data']
    num = fd.get('campo11', '')
    uf = fd.get('uf', '')
    
    # Randomiza a quantidade de documentos entre 1 e 5 (usando hash básico para ser pseudoaleatório determinístico)
    num_docs = (hash(num) % 5) + 1
    docs_selecionados = docs_possiveis[:num_docs]

    req = {
        'data_req': fd.get('campo12', ''),
        'uf': uf,
        'municipio': fd.get('municipio', ''),
        'interessado': fd.get('campo15', ''),
        'processo_sei': fd.get('campo13', ''),
        'regime_requerido': fd.get('procedimento', ''),
        'cpf_cnpj': fd.get('campo14', ''),
        'telefone': fd.get('campo19', ''),
        'pessoa_estrangeira': fd.get('campo17', 'Não'),
        'prioridade_legal': fd.get('prioridade_legal', 'Não se aplica'),
        'cpf_cnpj_rep': fd.get('campo14_rep', ''),
        'nome_rep': fd.get('campo15_rep', ''),
        'telefone_rep': fd.get('campo19_rep', ''),
        'documentos_anexados': docs_selecionados
    }
    
    chk = f'SPU/{uf}'
    stat = {
        'checkpoint': chk,
        'status_geral': 'Aguardando Análise'
    }
    
    atr = {
        'atribuido_para': 'Não atribuído'
    }
    
    vals1.append(f"('{num}', '{json.dumps(req, ensure_ascii=False)}')")
    vals2.append(f"('{num}', '{json.dumps(stat, ensure_ascii=False)}')")
    vals3.append(f"('{num}', '{json.dumps(atr, ensure_ascii=False)}')")

out = sql1 + ',\n'.join(vals1) + ';\n\n'
out += sql2 + ',\n'.join(vals2) + ';\n\n'
out += sql3 + ',\n'.join(vals3) + ';\n'

with open('seed_20_foco11_v4.sql', 'w', encoding='utf-8') as f:
    f.write(out)

print("SQL gerado!")
