import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update HTML structure for Riscos
target_html1 = '''          <!-- ==================== RISCOS ==================== -->
          <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            Riscos
          </h4>

          <div class="form-group editavel">
            <label>Riscos verificados:</label>

            <div class="checkbox-group" id="group-riscos_${rip}" class="checkbox-group">'''

replacement_html1 = '''          <!-- ==================== RISCOS ==================== -->
          <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
            Riscos
          </h4>

          <div class="form-group editavel">
            <label>Há riscos identificados no imóvel?</label>
            <div class="radio-group radio-group--vertical">
              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][tem_riscos]" value="Sim" required />
                Sim
              </label>
              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][tem_riscos]" value="Não" />
                Não
              </label>
              <label class="radio-option">
                <input type="radio" name="imoveis[${index}][tem_riscos]" value="Não há informação suficiente" />
                Não há informação suficiente
              </label>
            </div>

            <div id="bloco-riscos-detalhes_${rip}" style="display: none; flex-direction: column; gap: 8px; margin-top: 15px; padding-left: 15px; border-left: 3px solid #ccc;">
              <label>Riscos verificados:</label>

              <div class="checkbox-group" id="group-riscos_${rip}" class="checkbox-group">'''

target_html2 = '''            <div id="bloco-obs-riscos_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="obs-riscos_${rip}">Observações sobre riscos:</label>
              <textarea
                id="obs-riscos_${rip}"
                name="imoveis[${index}][obs_riscos]"
                placeholder="Descreva informações complementares sobre os riscos verificados..."
              ></textarea>
            </div>
          </div>

          <!-- ==================== RESTRIÇÕES ==================== -->'''

replacement_html2 = '''            <div id="bloco-obs-riscos_${rip}" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="obs-riscos_${rip}">Observações sobre riscos:</label>
              <textarea
                id="obs-riscos_${rip}"
                name="imoveis[${index}][obs_riscos]"
                placeholder="Descreva informações complementares sobre os riscos verificados..."
              ></textarea>
            </div>
            </div> <!-- Fecha bloco-riscos-detalhes -->
          </div>

          <!-- ==================== RESTRIÇÕES ==================== -->'''

if target_html1 in content:
    content = content.replace(target_html1, replacement_html1)
    print("HTML1 applied.")
if target_html2 in content:
    content = content.replace(target_html2, replacement_html2)
    print("HTML2 applied.")

# 2. Add JavaScript logic
target_js = "populateChecks('riscos', dados.riscos);"

replacement_js = '''populateChecks('riscos', dados.riscos);

        // Lógica condicional para Riscos
        const riscoRadios = bloco.querySelectorAll(`input[name="imoveis[${index}][tem_riscos]"]`);
        const blocoRiscosDetalhes = document.getElementById(`bloco-riscos-detalhes_${rip}`);
        const blocoObsRiscos = document.getElementById(`bloco-obs-riscos_${rip}`);
        const riscosCheckboxes = bloco.querySelectorAll(`input[name="imoveis[${index}][riscos][]"]`);

        function updateTemRiscos() {
            let val = '';
            riscoRadios.forEach(r => { if (r.checked) val = r.value; });
            if (blocoRiscosDetalhes) {
                blocoRiscosDetalhes.style.display = (val === 'Sim') ? 'flex' : 'none';
            }
        }
        riscoRadios.forEach(r => r.addEventListener('change', updateTemRiscos));

        function updateObsRiscos() {
            let hasChecked = false;
            riscosCheckboxes.forEach(c => {
                if (c.checked && c.value !== 'Nenhum risco identificado') hasChecked = true;
            });
            if (blocoObsRiscos) {
                blocoObsRiscos.style.display = hasChecked ? 'flex' : 'none';
            }
        }
        riscosCheckboxes.forEach(c => c.addEventListener('change', updateObsRiscos));

        // Inicialização com dados do banco
        if (dados.tem_riscos) {
            riscoRadios.forEach(r => { if (r.value === dados.tem_riscos) r.checked = true; });
        } else if (dados.riscos && Array.isArray(dados.riscos) && dados.riscos.length > 0) {
            riscoRadios.forEach(r => { if (r.value === 'Sim') r.checked = true; });
        }
        updateTemRiscos();
        updateObsRiscos();'''

if target_js in content:
    content = content.replace(target_js, replacement_js)
    print("JS applied.")

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
