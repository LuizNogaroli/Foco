import os
import re

antigos_dir = r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos"

for f in os.listdir(antigos_dir):
    if 'foco-06' in f:
        path = os.path.join(antigos_dir, f)
        if os.path.isdir(path):
            continue
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
            title = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            form = re.search(r'<form (.*?)>', content, re.IGNORECASE)
            print(f"{f} ({len(content)} bytes):")
            print(f"  Title: {title.group(1) if title else 'None'}")
            print(f"  Form: {form.group(0) if form else 'None'}")
        except Exception as e:
            print(f"Error reading {f}: {e}")
