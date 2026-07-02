with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06-bkp-03.html", "r", encoding="utf-8", errors="ignore") as f:
    bkp = f.read()

with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06 - Copia (4).html", "r", encoding="utf-8", errors="ignore") as f:
    copia4 = f.read()

print(f"BKP lines: {len(bkp.splitlines())}")
print(f"Copia (4) lines: {len(copia4.splitlines())}")

# Let's inspect where they diverge
bkp_lines = bkp.splitlines()
copia4_lines = copia4.splitlines()

# We can print the first few lines that are different
differences = 0
for idx in range(min(len(bkp_lines), len(copia4_lines))):
    if bkp_lines[idx] != copia4_lines[idx]:
        print(f"First difference at line {idx+1}:")
        print(f"  BKP: {bkp_lines[idx][:120]}")
        print(f"  Copia4: {copia4_lines[idx][:120]}")
        differences += 1
        if differences >= 5:
            break
