import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"if \(hasChecked\) \{\s*group\.forEach\(el => el\.disabled = true\);\s*\}\s*else\s*\{\s*group\.forEach\(el => \{\s*const lbl = el\.closest\('label'\);\s*if\(lbl\)\s*\{\s*lbl\.style\.backgroundColor = '#ffffff';\s*lbl\.style\.border = '1px solid #3b82f6';\s*lbl\.style\.boxShadow = '0 0 4px rgba\(59,130,246,0\.3\)';\s*lbl\.style\.borderRadius = '4px';\s*lbl\.style\.padding = '2px 4px';\s*\}\s*\}\);\s*\}"
replacement = r"if (hasChecked) { group.forEach(el => el.disabled = true); }"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed label styling!")
