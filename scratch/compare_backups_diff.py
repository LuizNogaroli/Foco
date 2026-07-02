with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06-bkp-03.html", "r", encoding="utf-8", errors="ignore") as f:
    bkp = f.read()

with open(r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06 - Copia (4).html", "r", encoding="utf-8", errors="ignore") as f:
    copia4 = f.read()

bkp_clean = [l.strip() for l in bkp.splitlines() if l.strip()]
copia4_clean = [l.strip() for l in copia4.splitlines() if l.strip()]

print(f"Cleaned BKP lines: {len(bkp_clean)}")
print(f"Cleaned Copia (4) lines: {len(copia4_clean)}")

differences = 0
for idx in range(min(len(bkp_clean), len(copia4_clean))):
    if bkp_clean[idx] != copia4_clean[idx]:
        print(f"First clean difference at line {idx+1}:")
        print(f"  BKP: {bkp_clean[idx][:120]}")
        print(f"  Copia4: {copia4_clean[idx][:120]}")
        differences += 1
        if differences >= 10:
            break
