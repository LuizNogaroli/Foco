import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the Desbloquear Radios block with the logic to lock radios that have a value
pattern_desbloquear = r"// Desbloquear Radios/Checkboxes/Selects sem valor.*?\}\s*\n\s*\}\s*\n\s*\}\)\;"
# Actually let's use a simpler match because of nested braces
pattern_desbloquear2 = r"// Desbloquear Radios/Checkboxes/Selects sem valor.*?\}\s*\n\s*\}\s*\n\s*\}\s*\n\s*\}\)\;"

replacement_lock = """// Travar Radios/Checkboxes que possuem valor e formatar os vazios
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
            } else {
                group.forEach(el => {
                    const lbl = el.closest('label');
                    if(lbl) {
                        lbl.style.backgroundColor = '#ffffff';
                        lbl.style.border = '1px solid #3b82f6';
                        lbl.style.boxShadow = '0 0 4px rgba(59,130,246,0.3)';
                        lbl.style.borderRadius = '4px';
                        lbl.style.padding = '2px 4px';
                    }
                });
            }
        });"""
# Let's ensure the regex matches correctly. 
# To be absolutely safe, I will find the exact string indices.

idx1 = content.find("// Desbloquear Radios/Checkboxes/Selects sem valor")
if idx1 != -1:
    idx2 = content.find("});", idx1) + 3
    # Wait, the inner loop also ends with '});'.
    # Let's find the '});' that corresponds to `inputs.forEach`
    # Let's find "if (typeof window.repopulateImoveis" which is right after it, or just use regex with re.DOTALL and specific end pattern.
    
    match = re.search(r'// Desbloquear Radios/Checkboxes/Selects sem valor.*?\}\s*\n\s*\}\s*\n\s*\}\)\;', content, flags=re.DOTALL)
    if match:
        content = content[:match.start()] + replacement_lock + content[match.end():]
    else:
        # Fallback manual extraction
        match = re.search(r'// Desbloquear Radios/Checkboxes/Selects sem valor.*?\n\s*\}\)\;', content, flags=re.DOTALL)
        if match:
            # wait, the first }\); is from inputs.forEach, but maybe there are inner ones? 
            # No, no inner forEach in that block!
            pass

# Let's just do it with re.sub using a safe pattern
content = re.sub(r'// Desbloquear Radios/Checkboxes/Selects sem valor.*?\}\s*\n\s*\}\s*\n\s*\}\)\;', replacement_lock, content, flags=re.DOTALL)

# 2. Fix setupCondicionaisAba2
# Remove the unlocking logic inside setupCondicionaisAba2
pattern_setup = r"(inputsInternos\.forEach\(ii => \{)\s*ii\.removeAttribute\('readonly'\);\s*ii\.removeAttribute\('disabled'\);\s*ii\.style\.backgroundColor = '#ffffff';\s*ii\.style\.color = '#1e293b';\s*ii\.style\.border = '1px solid #94a3b8';"

replacement_setup = r"\1"
content = re.sub(pattern_setup, replacement_setup, content, flags=re.DOTALL)


with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch for unlocking logic applied!")
