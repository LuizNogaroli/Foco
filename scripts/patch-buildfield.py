import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find buildField function body
pattern = r"(function buildField\(label, name, value\) \{.*?\s+return `\s+<div class=\"form-group editavel\".*?</div>\s+`;\s+\})"

replacement = """function buildField(label, name, value) {
          let valStr = value || '';
          let iconHtml = ``;
          let placeholderAttr = '';
          if (name === 'numero_processo') placeholderAttr = 'placeholder="1234.56790/2026-00"';
          else if (name === 'matricula') placeholderAttr = 'placeholder="123.456 - 1º CRI SP"';
          else if (name === 'cartorio') placeholderAttr = 'placeholder="Ex: 1º CRI SP"';
          
          let readonlyAttr = 'readonly';
          let bgStyle = 'background-color: #f8f9fa;';
          let emptyClass = '';
          if (String(valStr).trim() === '') {
              readonlyAttr = '';
              bgStyle = 'background-color: #fefce8; border-color: #fde047; box-shadow: 0 0 4px rgba(253,224,71,0.5);';
              emptyClass = 'empty-unlocked';
          }
          
          const config = typeof CAMPOS_COM_OPCOES !== 'undefined' ? CAMPOS_COM_OPCOES[name] : null;
          if (config) {
              const opcoes = Array.isArray(config) ? config : config.opcoes;
              let selectOptionsHtml = `<option value="">-- Selecione --</option>`;
              opcoes.forEach(opt => {
                  const selected = (opt.toLowerCase() === String(valStr).toLowerCase()) ? 'selected' : '';
                  selectOptionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
              });
              
              let disabledAttr = readonlyAttr === 'readonly' ? 'disabled' : '';
              
              return `
                  <div class="form-group editavel" style="margin-bottom: 15px;">
                      <label style="display:block; margin-bottom: 5px; font-weight: 600;">${label} ${iconHtml}</label>
                      <select name="imoveis[${index}][${name}]" data-field-key="${name}" class="auto-loaded-field ${emptyClass}" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; ${bgStyle} color: #495057;" ${disabledAttr}>
                          ${selectOptionsHtml}
                      </select>
                  </div>
              `;
          }
          
          return `
              <div class="form-group editavel" style="margin-bottom: 15px;">
                  <label style="display:block; margin-bottom: 5px; font-weight: 600;">${label} ${iconHtml}</label>
                  <input type="text" name="imoveis[${index}][${name}]" data-field-key="${name}" value="${valStr}" ${placeholderAttr} ${readonlyAttr} class="auto-loaded-field ${emptyClass}" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; ${bgStyle} color: #495057;">
              </div>
          `;
      }"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("buildField patched to support native selects!")
