import re

js = open('foco-02.js', encoding='utf-8').read()

# Replace any literal \' with ' since it's already inside a template literal (``) 
# and we want raw single quotes for HTML attributes
js = js.replace(r"\'", "'")

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)
