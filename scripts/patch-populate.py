import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

population_code = '''
    // ================= POPULAÇÃO DINÂMICA DE SELECTS E CHECKBOXES =================
    setTimeout(() => {
        const bloco = document.querySelector(`.imovel-block[data-rip="${rip}"]`);
        if (!bloco) return;
        
        // Populate Selects
        const selects = {
            [`campo32_${rip}`]: dados.tipo_uso_atual,
            [`campo-condicao-urbanizacao_${rip}`]: dados.condicao_urbanizacao,
            [`campo-tipo-imovel_${rip}`]: dados.tipo_imovel
        };
        for (const [id, val] of Object.entries(selects)) {
            if (val) {
                const el = bloco.querySelector(`#${id}`);
                if (el) el.value = val;
            }
        }
        
        // Radios: situacao_ocupacional
        if (dados.situacao_ocupacional) {
            const radios = bloco.querySelectorAll(`input[name="imoveis[${index}][situacao_ocupacional]"]`);
            radios.forEach(r => { if (r.value === dados.situacao_ocupacional) r.checked = true; });
        }
        
        // Checkboxes Arrays
        const populateChecks = (name, arr) => {
            if (Array.isArray(arr)) {
                const checks = bloco.querySelectorAll(`input[name="imoveis[${index}][${name}][]"]`);
                checks.forEach(c => { if (arr.includes(c.value)) c.checked = true; });
            }
        };
        populateChecks('incidencia_ambiental', dados.incidencia_ambiental);
        populateChecks('riscos', dados.riscos);
        populateChecks('restricoes', dados.restricoes);
        
        // Disparar change para exibir blocos condicionais
        const triggers = bloco.querySelectorAll('input[type="radio"], select, input[type="checkbox"]');
        triggers.forEach(t => t.dispatchEvent(new Event('change', { bubbles: true })));
    }, 50);
'''

insert_pos = content.find('imoveisContainer.appendChild(div);')
if insert_pos == -1:
    print('Error: Could not find insert position')
    exit(1)

insert_pos += len('imoveisContainer.appendChild(div);')

new_content = content[:insert_pos] + '\\n' + population_code + content[insert_pos:]

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Population logic inserted successfully!')
