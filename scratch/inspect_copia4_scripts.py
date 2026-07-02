with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06 - Copia (4).html", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

print("Script tags and locations:")
for idx, line in enumerate(lines):
    if '<script' in line:
        print(f"Line {idx+1}: {line.strip()}")
