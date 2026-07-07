import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''        // Radios: situacao_ocupacional
        if (dados.situacao_ocupacional) {
            const radios = bloco.querySelectorAll(`input[name="imoveis[${index}][situacao_ocupacional]"]`);
            radios.forEach(r => { if (r.value === dados.situacao_ocupacional) r.checked = true; });
        }'''

replacement = '''        // Radios: situacao_ocupacional com regras de exibição
        const ocupRadios = bloco.querySelectorAll(`input[name="imoveis[${index}][situacao_ocupacional]"]`);
        const blocoDesocupado = document.getElementById(`bloco-desocupado_${rip}`);
        const blocoOcupado = document.getElementById(`bloco-ocupado_${rip}`);
        const blocoUsoAtual = document.getElementById(`bloco-uso-atual_${rip}`);
        
        function updateOcupacao() {
            let val = '';
            ocupRadios.forEach(r => { if (r.checked) val = r.value; });
            if (val === 'Desocupado') {
                if (blocoDesocupado) blocoDesocupado.style.display = 'flex';
                if (blocoOcupado) blocoOcupado.style.display = 'none';
                if (blocoUsoAtual) blocoUsoAtual.style.display = 'none';
            } else if (val === 'Ocupado regularmente' || val === 'Ocupado irregularmente') {
                if (blocoDesocupado) blocoDesocupado.style.display = 'none';
                if (blocoOcupado) blocoOcupado.style.display = 'flex';
                if (blocoUsoAtual) blocoUsoAtual.style.display = 'flex';
            } else {
                if (blocoDesocupado) blocoDesocupado.style.display = 'none';
                if (blocoOcupado) blocoOcupado.style.display = 'none';
                if (blocoUsoAtual) blocoUsoAtual.style.display = 'none';
            }
        }
        
        ocupRadios.forEach(r => {
            r.addEventListener('change', updateOcupacao);
        });
        
        if (dados.situacao_ocupacional) {
            ocupRadios.forEach(r => { if (r.value === dados.situacao_ocupacional) r.checked = true; });
        }
        updateOcupacao();'''

if target in content:
    content = content.replace(target, replacement)
    with open('foco-02.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("foco-02.js patched with ocupacao rules!")
else:
    print("Could not find target block in foco-02.js")
