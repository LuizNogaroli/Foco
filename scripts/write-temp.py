import sys

with open('foco-02.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('temp_view.txt', 'w', encoding='utf-8') as f:
    for i, l in enumerate(lines[750:820]):
        f.write(f"{i+750}: {l}")
