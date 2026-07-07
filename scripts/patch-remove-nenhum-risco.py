import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

target_html = '''              <label class="checkbox-option">
                <input
                  type="checkbox"
                  name="imoveis[${index}][riscos][]"
                  value="Nenhum risco identificado"
                />
                Nenhum risco identificado
              </label>'''

if target_html in content:
    content = content.replace(target_html, '')
    print("HTML checkbox removed.")

target_js = "if (c.checked && c.value !== 'Nenhum risco identificado') hasChecked = true;"
replacement_js = "if (c.checked) hasChecked = true;"

if target_js in content:
    content = content.replace(target_js, replacement_js)
    print("JS logic updated.")

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
