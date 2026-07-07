import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update HTML structure for Restrições
target_html1 = '''          <!-- ==================== RESTRIÇÕES ==================== -->
          <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            Restrições
          </h4>

          <div class="form-group editavel">
            <label>Restrições verificadas:</label>

            <div class="checkbox-group" id="group-restricoes_${rip}" class="checkbox-group">'''

replacement_html1 = '''          <!-- ==================== RESTRIÇÕES ==================== -->
          <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            Restrições
          </h4>

          <div class="form-group editavel">
            <label>Há restrições e condições limitadoras?</label>
            <div class="radio-group" style="display: flex; gap: 15px; align-items: center; margin-top: 5px;">
              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][tem_restricoes]" value="Sim" required />
                Sim
              </label>
              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][tem_restricoes]" value="Não" />
                Não
              </label>
              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][tem_restricoes]" value="Não há informação suficiente" />
                Não há informação suficiente
              </label>
            </div>

            <div id="bloco-restricoes-detalhes_${rip}" style="display: none; flex-direction: column; gap: 8px; margin-top: 15px; padding-left: 15px; border-left: 3px solid #ccc;">
              <label>Restrições verificadas:</label>

              <div class="checkbox-group" id="group-restricoes_${rip}" class="checkbox-group">'''

target_html2 = '''            <div id="bloco-obs-restricoes_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 16px;">
              <label for="obs-restricoes_${rip}">Observações sobre as restrições:</label>
              <textarea
                id="obs-restricoes_${rip}"
                name="imoveis[${index}][obs_restricoes]"
                placeholder="Descreva informações complementares sobre as restrições verificadas..."
              ></textarea>
            </div>
          </div>'''

replacement_html2 = '''            <div id="bloco-obs-restricoes_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 16px;">
              <label for="obs-restricoes_${rip}">Observações sobre as restrições:</label>
              <textarea
                id="obs-restricoes_${rip}"
                name="imoveis[${index}][obs_restricoes]"
                placeholder="Descreva informações complementares sobre as restrições verificadas..."
              ></textarea>
            </div>
            </div> <!-- Fecha bloco-restricoes-detalhes -->
          </div>'''

if target_html1 in content:
    content = content.replace(target_html1, replacement_html1)
    print("HTML1 restricoes applied.")
if target_html2 in content:
    content = content.replace(target_html2, replacement_html2)
    print("HTML2 restricoes applied.")

# Regex to remove "Nenhuma restrição identificada" if it exists
remove_pattern = r'<label class="checkbox-option">\s*<input[^>]*value="Nenhuma restrição identificada"[^>]*>\s*Nenhuma restrição identificada\s*</label>'
content = re.sub(remove_pattern, '', content)

# 2. Add JavaScript logic
target_js = "populateChecks('restricoes', dados.restricoes);"

replacement_js = '''populateChecks('restricoes', dados.restricoes);

        // Lógica condicional para Restrições
        const restricaoRadios = bloco.querySelectorAll(`input[name="imoveis[${index}][tem_restricoes]"]`);
        const blocoRestricoesDetalhes = document.getElementById(`bloco-restricoes-detalhes_${rip}`);
        const blocoObsRestricoes = document.getElementById(`bloco-obs-restricoes_${rip}`);
        const restricoesCheckboxes = bloco.querySelectorAll(`input[name="imoveis[${index}][restricoes][]"]`);

        function updateTemRestricoes() {
            let val = '';
            restricaoRadios.forEach(r => { if (r.checked) val = r.value; });
            if (blocoRestricoesDetalhes) {
                blocoRestricoesDetalhes.style.display = (val === 'Sim') ? 'flex' : 'none';
            }
        }
        restricaoRadios.forEach(r => r.addEventListener('change', updateTemRestricoes));

        function updateObsRestricoes() {
            let hasChecked = false;
            restricoesCheckboxes.forEach(c => {
                if (c.checked && !c.value.toLowerCase().includes('nenhuma')) hasChecked = true;
            });
            if (blocoObsRestricoes) {
                blocoObsRestricoes.style.display = hasChecked ? 'flex' : 'none';
            }
        }
        restricoesCheckboxes.forEach(c => c.addEventListener('change', updateObsRestricoes));

        // Inicialização com dados do banco
        if (dados.tem_restricoes) {
            restricaoRadios.forEach(r => { if (r.value === dados.tem_restricoes) r.checked = true; });
        } else if (dados.restricoes && Array.isArray(dados.restricoes) && dados.restricoes.length > 0) {
            restricaoRadios.forEach(r => { if (r.value === 'Sim') r.checked = true; });
        }
        updateTemRestricoes();
        updateObsRestricoes();'''

if target_js in content:
    content = content.replace(target_js, replacement_js)
    print("JS restricoes applied.")

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
