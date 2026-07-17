# Histórico de Alteração: Contratos Anteriores Dinâmicos na Aba 3 (Destinação) - 20260710_1002

## 1. Estado Anterior (Antes)
### HTML (`foco-03.html`):
```html
      <div class="form-group editavel">
    <label for="campo51">Tipo de procedimento pretendido:
      <span class="hint-semaforo"><span class="hint-icon" data-hint-tipo="verde" data-hint="Selecione o tipo de procedimento administrativo que origina esta anlise de destinação." role="tooltip" tabindex="0" aria-label="Ajuda: Tipo de procedimento">?</span></span>
    </label>
    <select id="campo51" name="tipo_procedimento" required>
      <option value="">Selecione...</option>
      <option value="Nova destinação">Nova destinação: primeiro instrumento formal de destinação para o imóvel</option>
      <option value="Renovação">Renovação: continuidade de instrumento vigente com as mesmas condições</option>
      <option value="Alteração">Alteração: modificação de condições, finalidade ou área em instrumento vigente</option>
      <option value="Regularização">Regularização: formalização de uso preexistente sem instrumento vigente</option>
    </select>
    <span class="error-msg" id="err51" style="display:none;">Selecione o tipo de procedimento.</span>
    <div id="bloco51_obs" style="display:none;margin-top:8px;">
      <label for="campo51_obs">Informações complementares:</label>
      <textarea id="campo51_obs" name="campo51_obs" placeholder="Informações complementares ao tipo de procedimento..."></textarea>
    </div>
  </div>
```

### Script Loader (`foco-03.html`):
```html
  <script src="scripts/fetch_acoes.js?v=99999_1"></script>
  <script src="formulario.js?v=1782355313469"></script>
```

### Event Listener (`foco-03.html`):
```javascript
  document.getElementById('campo51').addEventListener('change',function(){
    toggleBloco('bloco51_obs',!!this.value);
    limparErro(this,'err51');
  });
```

---

## 2. Estado Novo (Depois)
### HTML (`foco-03.html`):
```html
      <div class="form-group editavel">
        <label for="campo51">Tipo de procedimento pretendido:
          <span class="hint-semaforo"><span class="hint-icon" data-hint-tipo="verde" data-hint="Selecione o tipo de procedimento administrativo que origina esta análise de destinação." role="tooltip" tabindex="0" aria-label="Ajuda: Tipo de procedimento">?</span></span>
        </label>
        <select id="campo51" name="tipo_procedimento" required>
          <option value="">Selecione...</option>
          <option value="Nova destinação">Nova destinação</option>
          <option value="Renovação/alteração contratual">Renovação/alteração contratual</option>
          <option value="Regularização de uso">Regularização de uso</option>
        </select>
        <span class="error-msg" id="err51" style="display:none;">Selecione o tipo de procedimento.</span>

        <!-- SEÇÃO CONDICIONAL: Contratos Anteriores (Dinamico) -->
        <div id="bloco_contratos_anteriores" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
          <h3 style="text-align: left; margin-bottom: 12px; color: #1e3a5f; font-size: 0.95rem; font-weight: bold;">Contratos anteriores</h3>
          <div id="contratos_anteriores_container" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <!-- Carregado dinamicamente -->
          </div>
        </div>

        <div id="bloco51_obs" style="display:none;margin-top:8px;">
          <label for="campo51_obs">Informações complementares:</label>
          <textarea id="campo51_obs" name="campo51_obs" placeholder="Informações complementares ao tipo de procedimento..."></textarea>
        </div>
      </div>
```

### Script Loader (`foco-03.html`):
```html
  <script src="scripts/fetch_acoes.js?v=99999_1"></script>
  <script src="scripts/fetch_spu.js?v=1782355313469"></script>
  <script src="formulario.js?v=1782355313469"></script>
```

### Event Listener & Logic (`foco-03.html`):
```javascript
  // Carregar dados de contratos anteriores da tabela_spu
  let contratosAnterioresData = [];
  (async function() {
    const rip = localStorage.getItem('CURRENT_PROCESS_ID') || window.processId;
    console.log(`[foco-03] RIP para contratos: "${rip}", fetchSPU existe: ${typeof window.fetchSPU}`);
    if (!rip || typeof window.fetchSPU !== 'function') {
      console.warn('[foco-03] RIP ou fetchSPU não disponível');
      return;
    }
    try {
      const dadosSPU = await window.fetchSPU(rip);
      console.log('[foco-03] Resultado fetchSPU:', dadosSPU);
      if (dadosSPU && dadosSPU.contratos_anteriores) {
        contratosAnterioresData = dadosSPU.contratos_anteriores;
        renderContratosAnteriores();
      }
    } catch(e) { console.error('[foco-03] Erro ao carregar dados SPU:', e); }
  })();

  function renderContratosAnteriores() {
    const container = document.getElementById('contratos_anteriores_container');
    if (!container) return;
    container.innerHTML = '';
    if (!contratosAnterioresData || contratosAnterioresData.length === 0) {
      container.innerHTML = '<span style="font-size: 0.85rem; color: #64748b;">Nenhum contrato anterior registrado para este imóvel.</span>';
      return;
    }
    contratosAnterioresData.forEach(c => {
      const card = document.createElement('div');
      card.style.cssText = "background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; color: #334155; box-shadow: 0 1px 2px rgba(0,0,0,0.05); flex: 1; min-width: 200px;";
      card.innerHTML = `
        <strong style="display: block; color: #1e293b; margin-bottom: 2px;">${c.numero}</strong>
        <span style="font-size: 0.8em; color: #64748b;">Vigência: ${c.data_inicio} a ${c.data_fim}</span>
      `;
      container.appendChild(card);
    });
  }
  
  ...
  
  document.getElementById('campo51').addEventListener('change',function(){
    toggleBloco('bloco51_obs',!!this.value);
    toggleBloco('bloco_contratos_anteriores', this.value === 'Renovação/alteração contratual');
    limparErro(this,'err51');
  });
```

---

## 3. Plano de Rollback / Desfazer
Para reverter as alterações feitas e retornar ao estado anterior:
1. Reverter o arquivo `foco-03.html` para o estado anterior, removendo o script `<script src="scripts/fetch_spu.js?v=1782355313469"></script>`, o bloco `#bloco_contratos_anteriores`, as funções `renderContratosAnteriores`, o carregamento assíncrono de contratos e retornando as opções originais no `<select id="campo51">`.
2. Reverter o arquivo `seed_tabela_spu.js` removendo a propriedade `contratos_anteriores` do payload de inserção e executando `node seed_tabela_spu.js` para atualizar novamente a base no Supabase.
