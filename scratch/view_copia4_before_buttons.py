import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06 - Copia (4).html", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

for idx in range(699, min(len(lines), 735)):
    print(f"{idx+1}: {lines[idx]}", end="")
