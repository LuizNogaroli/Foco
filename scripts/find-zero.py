import sys

content = open('foco-02.js', encoding='utf-8').read()
count = 0
for i, c in enumerate(content):
    if c == '{':
        count += 1
    elif c == '}':
        count -= 1
        if count == 0:
            lines = content[:i].split('\n')
            if len(lines) > 290:
                print(f"Count hit 0 at line {len(lines)}")
