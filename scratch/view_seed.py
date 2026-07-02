import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("db.js", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's print around 'seedDatabase'
import re
match = re.search(r'window\.seedDatabase\s*=\s*async\s*function', content)
if match:
    start_pos = match.start()
    print(content[start_pos:start_pos+2000])
else:
    print("Could not find seedDatabase.")
