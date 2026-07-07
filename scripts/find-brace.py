import sys

content = open('foco-02.js', encoding='utf-8').read()
count = 0
for i, c in enumerate(content):
    if c == '{':
        count += 1
    elif c == '}':
        count -= 1
        if count < 0:
            lines = content[:i].split('\n')
            print(f"Unbalanced '}}' at line {len(lines)}")
            sys.exit(0)
print("No unbalanced '}' found from left to right")
