import sys
with open('sync.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
with open('temp_sync.txt', 'w', encoding='utf-8') as f:
    for i, l in enumerate(lines[260:280]):
        f.write(f"{i+260}: {l}")
