import re

with open('foco-02.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<style>', '<style>\n  .custom-empty-select { background-color: #ffffff !important; border: 1px solid #3b82f6 !important; box-shadow: 0 0 4px rgba(59,130,246,0.3) !important; }\n')

# update cache buster
content = re.sub(r'foco-02\.js\?v=\d+', 'foco-02.js?v=999999', content)
content = re.sub(r'sync\.js\?v=\d+', 'sync.js?v=999999', content)

with open('foco-02.html', 'w', encoding='utf-8') as f:
    f.write(content)
