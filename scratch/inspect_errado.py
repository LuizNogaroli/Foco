with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06-errado.html", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

print(f"Total lines in errado: {len(lines)}")
for idx, line in enumerate(lines[:600]):
    if '<h' in line:
        print(f"Line {idx+1}: {line.strip()}")
