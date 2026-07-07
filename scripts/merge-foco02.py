import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Load campos de caracterizacao
with open('campos de caracterização.txt', 'r', encoding='utf-8') as f:
    campos_html = f.read()

start_idx = campos_html.find('<!-- ==================== OCUPAÇÃO ==================== -->')
end_idx = campos_html.find('<!-- Lista de anexos / documentos (Aba 4) -->')

new_sections = '''
            <!-- ========== AVALIAÇÃO DO IMÓVEL ========== -->
            <div id="secao-avaliacao-${rip}">
                <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
                  Avaliação do Imóvel
                </h4>
                ${buildField('Valor da Avaliação (R$)', 'valor_avaliacao', dados.valor_avaliacao)}
                ${buildField('Data da Avaliação', 'data_avaliacao', dados.data_avaliacao)}
                ${buildField('Instrumento de Avaliação', 'instrumento_avaliacao', dados.instrumento_avaliacao)}
                
                <div class="form-group editavel">
                    <div class="dynamic-list-wrapper" style="margin-top: 10px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <button type="button" class="btn-add" id="btnAdicionarDocumentoAvaliacao_${rip}" style="align-self: flex-start;" onclick="if(typeof window.adicionarDocumentoDinamico === 'function') window.adicionarDocumentoDinamico('documentos-list-avaliacao_${rip}')">＋ Anexar Instrumento de Avaliação (Digitalizado)</button>
                        <div id="documentos-list-avaliacao_${rip}"></div>
                    </div>
                </div>
            </div>
'''

extracted_campos = campos_html[start_idx:end_idx]

# Basic replacements for dynamics
extracted_campos = extracted_campos.replace('imoveis[0]', 'imoveis[${index}]')
extracted_campos = extracted_campos.replace('_0', '_${rip}')
extracted_campos = extracted_campos.replace('id="group-incidencia_${rip}"', 'id="group-incidencia_${rip}" class="checkbox-group"')
extracted_campos = extracted_campos.replace('id="group-riscos_${rip}"', 'id="group-riscos_${rip}" class="checkbox-group"')
extracted_campos = extracted_campos.replace('id="group-restricoes_${rip}"', 'id="group-restricoes_${rip}" class="checkbox-group"')

new_sections += extracted_campos

new_sections += '''
            <!-- ========== GEOLOCALIZAÇÃO ========== -->
            <div id="secao-geolocalizacao-${rip}">
                <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
                  Geolocalização
                </h4>
                <div class="form-group editavel">
                    <label for="cep_${rip}">Localizar por CEP:</label>
                    <div class="cep-row">
                        <input type="text" id="cep_${rip}" name="imoveis[${index}][geo_cep]" class="mask-cep" placeholder="00000-000" maxlength="9" value="${dados.geo_cep || ''}">
                        <button type="button" class="btn-search">🔍 Buscar</button>
                    </div>
                </div>
                <div class="form-group editavel">
                    <div class="cep-row">
                        <div style="flex: 1;">
                            <label for="latitude_${rip}" style="font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;">Latitude:</label>
                            <input type="text" id="latitude_${rip}" name="imoveis[${index}][latitude]" placeholder="-15.793889" style="width: 100%;" value="${dados.latitude || ''}">
                        </div>
                        <div style="flex: 1;">
                            <label for="longitude_${rip}" style="font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;">Longitude:</label>
                            <input type="text" id="longitude_${rip}" name="imoveis[${index}][longitude]" placeholder="-47.882778" style="width: 100%;" value="${dados.longitude || ''}">
                        </div>
                    </div>
                </div>
                <div class="form-group" style="background: transparent; border: none; padding: 0; display: flex; justify-content: center; margin-top: 10px;">
                    <button type="button" class="btn-primary" style="padding: 12px 24px; font-size: 1em; width: auto;" onclick="document.getElementById('geoModal').style.display='flex'">
                        🗺️ Abrir Mapa Interativo e Demarcar
                    </button>
                </div>
            </div>
'''

import re
match = re.search(r'<!-- /secao-identificacao -->\s*</div>', content)
if not match:
    print('Error: Could not find insert position')
    exit(1)

insert_pos = match.end()

new_content = content[:insert_pos] + '\n' + new_sections + content[insert_pos:]

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('foco-02.js updated successfully!')
