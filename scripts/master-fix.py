import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update buildField function completely
pattern_buildfield = r"(function buildField\(label, name, value\) \{)(.*?)(return `.*?</div>\s*`;\s*\})"
def replace_buildfield(match):
    return """function buildField(label, name, value) {
        let valStr = (value !== null && value !== undefined) ? value : '';
        let iconHtml = '';
        
        let placeholderAttr = '';
        if (name === 'cep') placeholderAttr = 'placeholder="00000-000" maxlength="9" oninput="this.value = this.value.replace(/[^0-9]/g, \'\').replace(/^(\\\d{5})(\\\d)/, \'$1-$2\')"';
        else if (name === 'area_total' || name === 'area_uniao' || name.startsWith('area_')) placeholderAttr = 'placeholder="Ex: 1250.50"';
        else if (name === 'cartorio') placeholderAttr = 'placeholder="Ex: 1º CRI SP"';
        
        let readonlyAttr = 'readonly';
        let emptyClass = '';
        let styleInline = 'width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;';
        
        if (String(valStr).trim() === '') {
            readonlyAttr = '';
            emptyClass = 'custom-empty-select';
            styleInline = 'width: 100%; padding: 8px; border-radius: 4px;';
        }
        
        const config = typeof CAMPOS_COM_OPCOES !== 'undefined' ? CAMPOS_COM_OPCOES[name] : null;
        if (config && String(valStr).trim() === '') {
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
                    <select name="imoveis[${index}][${name}]" data-field-key="${name}" class="auto-loaded-field ${emptyClass}" style="${styleInline}" ${disabledAttr}>
                        ${selectOptionsHtml}
                    </select>
                </div>
            `;
        }
        
        return `
            <div class="form-group editavel" style="margin-bottom: 15px;">
                <label style="display:block; margin-bottom: 5px; font-weight: 600;">${label} ${iconHtml}</label>
                <input type="text" name="imoveis[${index}][${name}]" data-field-key="${name}" value="${valStr}" ${placeholderAttr} ${readonlyAttr} class="auto-loaded-field ${emptyClass}" style="${styleInline}">
            </div>
        `;
    }"""
content = re.sub(pattern_buildfield, replace_buildfield, content, flags=re.DOTALL)

# 2. Replace the 'Desbloquear Radios/Checkboxes' block to ONLY lock, no label styling
pattern_desbloquear = r"// Desbloquear Radios/Checkboxes.*?\}\s*\n\s*\}\s*\n\s*\}\)\;"
replacement_lock = """// Travar Radios/Checkboxes que possuem valor
        const allRadiosAndChecks = bloco.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        const groups = {};
        allRadiosAndChecks.forEach(el => {
            if(!groups[el.name]) groups[el.name] = [];
            groups[el.name].push(el);
        });
        Object.keys(groups).forEach(name => {
            const group = groups[name];
            const hasChecked = group.some(el => el.checked);
            if (hasChecked) {
                group.forEach(el => el.disabled = true);
            }
        });"""
content = re.sub(pattern_desbloquear, replacement_lock, content, flags=re.DOTALL)

# 3. Clean up the aggressive unlock in setupCondicionaisAba2
pattern_setup = r"(inputsInternos\.forEach\(ii => \{)\s*ii\.removeAttribute\('readonly'\);\s*ii\.removeAttribute\('disabled'\);\s*ii\.style\.backgroundColor = '#ffffff';\s*ii\.style\.color = '#1e293b';\s*ii\.style\.border = '1px solid #94a3b8';"
content = re.sub(pattern_setup, r"\1", content, flags=re.DOTALL)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Master fix applied to foco-02.js!")
