const fs = require('fs');

let html = fs.readFileSync('foco-02.html', 'utf8');

const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

const formSections = `
      <!-- Avaliação -->
      <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Avaliação do Imóvel</h4>
      <div class="form-group editavel">
          <label>Valor da Avaliação (R$): <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('valor_avaliacao', 'Valor da Avaliação', document.getElementById('valor_avaliacao').value, 'text')">${editIconSVG}</span></label>
          <input type="text" id="valor_avaliacao" name="valor_avaliacao" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
      </div>
      <div class="form-group editavel">
          <label>Data da Avaliação: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('data_avaliacao', 'Data da Avaliação', document.getElementById('data_avaliacao').value, 'text')">${editIconSVG}</span></label>
          <input type="text" id="data_avaliacao" name="data_avaliacao" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
      </div>
      <div class="form-group editavel">
          <label>Instrumento de Avaliação: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('instrumento_avaliacao', 'Instrumento de Avaliação', document.getElementById('instrumento_avaliacao').value, 'text')">${editIconSVG}</span></label>
          <input type="text" id="instrumento_avaliacao" name="instrumento_avaliacao" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
          <div class="dynamic-list-wrapper" style="margin-top: 10px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
              <button type="button" class="btn-add" id="btnAdicionarDocumentoAvaliacao" style="align-self: flex-start;">＋ Anexar Instrumento de Avaliação (Digitalizado)</button>
              <div id="documentos-list-avaliacao"></div>
          </div>
      </div>

      <!-- Ocupação -->
      <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Ocupação</h4>
      <div class="form-group editavel">
          <label>Situação ocupacional: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('situacao_ocupacional', 'Situação ocupacional', document.getElementById('situacao_ocupacional').value, 'options', 'Desocupado|Ocupado regularmente|Ocupado irregularmente|Não há informação')">${editIconSVG}</span></label>
          <input type="text" id="situacao_ocupacional" name="situacao_ocupacional" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
          
          <div id="bloco-desocupado" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label>Tempo de desocupação: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('tempo_desocupacao', 'Tempo de desocupação', document.getElementById('tempo_desocupacao').value, 'text')">${editIconSVG}</span></label>
              <input type="text" id="tempo_desocupacao" name="tempo_desocupacao" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
          </div>
          
          <div id="bloco-ocupado" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label>Data de conhecimento da ocupação: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('data_ocupacao', 'Data de conhecimento', document.getElementById('data_ocupacao').value, 'text')">${editIconSVG}</span></label>
              <input type="text" id="data_ocupacao" name="data_ocupacao" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
              
              <label>Observações: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('obs_ocupado', 'Observações', document.getElementById('obs_ocupado').value, 'textarea')">${editIconSVG}</span></label>
              <textarea id="obs_ocupado" name="obs_ocupado" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;" rows="2"></textarea>
          </div>
      </div>

      <div class="form-group editavel">
          <label>Condição da urbanização: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('condicao_urbanizacao', 'Condição da urbanização', document.getElementById('condicao_urbanizacao').value, 'options', 'urbanizado|urbanização parcial/precária|não urbanizado|sem informação')">${editIconSVG}</span></label>
          <input type="text" id="condicao_urbanizacao" name="condicao_urbanizacao" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
      </div>

      <div class="form-group editavel">
          <label>Tipo de imóvel: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('tipo_imovel_global', 'Tipo de imóvel', document.getElementById('tipo_imovel_global').value, 'options', 'casa|galpão|prédio|terreno')">${editIconSVG}</span></label>
          <input type="text" id="tipo_imovel_global" name="tipo_imovel_global" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;">
      </div>

      <!-- Riscos e Restrições -->
      <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">Riscos e Restrições</h4>
      <div class="form-group editavel">
          <label>Riscos verificados: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('riscos_verificados', 'Riscos verificados', document.getElementById('riscos_verificados').value, 'options', 'Nenhum risco identificado|Risco de invasão/esbulho|Risco à segurança/saúde pública|Risco estrutural ou de desabamento|Risco de depredação, vandalismo ou deterioração|Outro risco identificado')">${editIconSVG}</span></label>
          <textarea id="riscos_verificados" name="riscos_verificados" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;" rows="3"></textarea>
          
          <div id="bloco-obs-riscos" style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label>Observações sobre riscos: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('obs_riscos', 'Observações sobre riscos', document.getElementById('obs_riscos').value, 'textarea')">${editIconSVG}</span></label>
              <textarea id="obs_riscos" name="obs_riscos" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;"></textarea>
          </div>
      </div>
      <div class="form-group editavel">
          <label>Restrições verificadas: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('restricoes_verificadas', 'Restrições verificadas', document.getElementById('restricoes_verificadas').value, 'options', 'Nenhuma restrição identificada|Faixa de fronteira|Faixa de segurança|Faixa de domínio Ferrovia/Rodovia|Faixa de 100 metros ao longo da costa marítima|Circunferência de 1.320 metros em torno de instalações militares|Terra indígena|Território quilombola ou área de comunidade tradicional|Zona/Área de Interesse Social — ZEIS|Área de segurança|Área Non Aedificandi|Restrição de uso/ocupação incidente sobre o imóvel|Tombado como patrimônio histórico, artístico e/ou cultural|Poligonal de Porto Organizado|Área operacional da RFFSA|Ilha oceânica ou costeira sem sede de município|Ilha fluvial ou lacustre|Localizada em loteamento|Outra restrição identificada')">${editIconSVG}</span></label>
          <textarea id="restricoes_verificadas" name="restricoes_verificadas" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;" rows="3"></textarea>
          
          <div id="bloco-obs-restricoes" style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label>Observações sobre as restrições: <span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração" onclick="openGlobalModal('obs_restricoes', 'Observações sobre as restrições', document.getElementById('obs_restricoes').value, 'textarea')">${editIconSVG}</span></label>
              <textarea id="obs_restricoes" name="obs_restricoes" readonly class="auto-loaded-field" style="width: 100%; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background-color: #f8f9fa; color: #495057;"></textarea>
          </div>
      </div>
`;

// In foco-02.html, replace everything from `<!-- Avaliação -->` down to just before `<!-- Botões -->` or `<!-- Geolocalização -->` (since I just moved Geolocalização to the end).
// Wait, Geolocalizacao is now at the very end. So the end of this block is `<!-- Geolocalização -->`.
const blockRegex = /<!-- Avaliação -->[\s\S]*?<!-- Geolocalização -->/;

if (html.match(blockRegex)) {
    html = html.replace(blockRegex, formSections + "\n      <!-- Geolocalização -->");
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Successfully replaced global sections with read-only Datalake versions.');
} else {
    console.log('Regex did not match HTML blocks.');
}

// Now add the JS logic to populate these fields globally when rip is found
let js = fs.readFileSync('foco-02.js', 'utf8');

const jsAppend = `
// ==================== Lógica Datalake para Campos Globais ====================
window.preencherCamposGlobais = function(dados) {
    if (!dados) return;
    
    // Helper para preencher e acionar visibilidade
    function fill(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    }

    fill('valor_avaliacao', dados.valor_avaliado || dados.valor_avaliacao);
    fill('data_avaliacao', dados.data_avaliacao);
    fill('instrumento_avaliacao', dados.instrumento_avaliacao);
    
    const ocup = dados.situacao_ocupacional || dados.ocupacao || '';
    fill('situacao_ocupacional', ocup);
    document.getElementById('bloco-desocupado').style.display = (ocup === 'Desocupado') ? 'flex' : 'none';
    document.getElementById('bloco-ocupado').style.display = (ocup === 'Ocupado regularmente' || ocup === 'Ocupado irregularmente') ? 'flex' : 'none';
    
    fill('tempo_desocupacao', dados.tempo_desocupacao);
    fill('data_ocupacao', dados.data_ocupacao);
    fill('obs_ocupado', dados.obs_ocupado);
    
    fill('condicao_urbanizacao', dados.condicao_urbanizacao);
    fill('tipo_imovel_global', dados.tipo_imovel);
    
    // Riscos e restricoes (array or string)
    let riscos = dados.riscos_verificados || dados.riscos;
    if (Array.isArray(riscos)) riscos = riscos.join(', ');
    fill('riscos_verificados', riscos);
    fill('obs_riscos', dados.obs_riscos);
    
    let restricoes = dados.restricoes_verificadas || dados.restricoes;
    if (Array.isArray(restricoes)) restricoes = restricoes.join(', ');
    fill('restricoes_verificadas', restricoes);
    fill('obs_restricoes', dados.obs_restricoes);
};

window.openGlobalModal = function(key, label, value, type, opts) {
    // Pegar o rip inserido ou vazio
    const ripInput = document.getElementById('hidden_lista_rips');
    let rip = '';
    if (ripInput && ripInput.value) {
        rip = ripInput.value.split(',')[0];
    }
    
    // Reutilizar o modal principal
    window.openSolicitacaoModal(rip, key, encodeURIComponent(label), encodeURIComponent(value || ''), type, encodeURIComponent(opts || ''));
};
`;

if (!js.includes('window.preencherCamposGlobais')) {
    js += '\n' + jsAppend;
    // Inject preencherCamposGlobais into pesquisarRip
    js = js.replace(/window\.criarBlocoImovel\(rip, dados\);/g, 'window.criarBlocoImovel(rip, dados);\n            window.preencherCamposGlobais(dados);');
    fs.writeFileSync('foco-02.js', js, 'utf8');
    console.log('Successfully injected global mapping into JS.');
}

