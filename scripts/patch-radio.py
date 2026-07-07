import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix radio/checkbox yellow label
target_radio = r"lbl\.style\.backgroundColor = '#fefce8';"
replacement_radio = r"lbl.style.backgroundColor = '#ffffff';\n                        lbl.style.border = '1px solid #3b82f6';\n                        lbl.style.boxShadow = '0 0 4px rgba(59,130,246,0.3)';"

content = re.sub(target_radio, replacement_radio, content)

# Fix empty-unlocked fallback color if present
target_empty = r"input\.style\.backgroundColor = '#fefce8';"
replacement_empty = r"input.style.backgroundColor = '#ffffff';\n                    input.style.borderColor = '#3b82f6';\n                    input.style.boxShadow = '0 0 4px rgba(59,130,246,0.3)';"
content = re.sub(target_empty, replacement_empty, content)

content = content.replace("input.style.borderColor = '#fde047';", "")

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Radio/checkbox yellow styling removed!")
