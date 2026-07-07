import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update bgStyle border
target = r"bgStyle = 'background-color: #ffffff; border-color: #3b82f6; box-shadow: 0 0 4px rgba\(59,130,246,0\.3\);';"
replacement = r"bgStyle = 'background-color: #ffffff; border: 1px solid #3b82f6 !important; box-shadow: 0 0 4px rgba(59,130,246,0.3);';"

content = re.sub(target, replacement, content)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated bgStyle for empty fields!")
