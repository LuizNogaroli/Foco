target_path = r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\foco-06.html"

with open(target_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# The redundant script block starts at line 481 (index 480)
# and ends at line 738 (index 737)
new_lines = lines[:480] + lines[738:]

with open(target_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Successfully removed redundant script block. New line count: {len(new_lines)}")
