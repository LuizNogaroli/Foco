import re

with open('sync.js', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(
    r"document\.addEventListener\('submit', \(\) => \{\s+"
    r"console\.log\([^)]+\);\s+"
    r"const inputs = document\.querySelectorAll\('input, select, textarea'\);\s+"
    r"inputs\.forEach\(input => \{\s+"
    r"if \(input\.name && input\.type !== 'submit' && input\.type !== 'button'\) \{\s+"
    r"saveField\(input\);\s+"
    r"\}\s+"
    r"\}\);"
)

replacement = '''document.addEventListener('submit', () => {
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

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('sync.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("sync.js patched!")
else:
    print("Could not find target in sync.js using regex")
