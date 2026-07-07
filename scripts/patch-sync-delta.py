import re

with open('sync.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''        document.addEventListener('submit', () => {
            console.log("🔥 [sync.js] Form submetido. Forçando salvamento de todos os campos.");
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.name && input.type !== 'submit' && input.type !== 'button') {
                    saveField(input);
                }
            });'''

replacement = '''        document.addEventListener('submit', () => {
            console.log("🔥 [sync.js] Form submetido. Forçando salvamento de todos os campos (com filtro para Aba 2).");
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.name && input.type !== 'submit' && input.type !== 'button') {
                    // REGRA DE NEGÓCIO ABA 2: Só salva campos modificados/preenchidos pelo usuário
                    if (window.location.pathname.includes('foco-02.html')) {
                        if (input.hasAttribute('readonly') || input.disabled) {
                            return; // Ignora
                        }
                    }
                    saveField(input);
                }
            });'''

if target in content:
    content = content.replace(target, replacement)
    with open('sync.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("sync.js patched!")
else:
    print("Could not find target in sync.js")
