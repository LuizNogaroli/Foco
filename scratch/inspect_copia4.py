with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06 - Copia (4).html", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
# Find occurrences of 'declaracao', 'btnEnviarSPU', 'modalEnvio'
for idx, line in enumerate(lines):
    if 'declaracao' in line or 'btnEnviarSPU' in line or 'modalEnvio' in line:
        print(f"Line {idx+1}: {line.strip()[:120]}")
