import os

antigos_dir = r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos"
search_terms = ['area_terreno_destinada', 'area_total', 'area_construida', 'valor_total', 'area-destinada-box']

for f in os.listdir(antigos_dir):
    if 'foco-06' in f:
        path = os.path.join(antigos_dir, f)
        if os.path.isdir(path):
            continue
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
            found = [term for term in search_terms if term in content]
            if found:
                print(f"{f}: found {found}")
        except Exception as e:
            print(f"Error: {e}")
