# Histórico de Alterações - Devolução Rápida e Solução de Cache no Motor de Fluxo

Este documento detalha a implementação do componente de Devolução Rápida na Aba 3 (`foco-03.html`), a correção da dessincronização de colunas no Supabase e a resolução definitiva de problemas de cache do navegador.

---

## 1. Estado Anterior (Antes)

### HTML premature closing tag (`foco-03.html`)
O container principal da página fechava-se incorretamente antes do término real do form devido a uma tag `</div>` perdida na linha 298.
```html
            </div>
          </div>
        </div>
        </div>
        <!-- ========================================================= -->
```

### Componente de Devolução Rápida antigo (`foco-03.html`)
Usava botões de rádio que dependiam de clique interno para seleção do destino de devolução, o que causava travamento na experiência do usuário e demandava mais cliques.
```html
          <div id="bloco_devolucao_rapida" style="display: none; margin-top: 15px; border-top: 1px dashed #fda4af; padding-top: 15px;">
            <p style="margin-top: 0; margin-bottom: 10px; color: #9f1239; font-weight: bold;">Selecione para qual fase o processo deve retornar:</p>
            <div class="radio-group" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
              <label class="radio-option" style="background: #ffffff; padding: 10px; border: 1px solid #fecdd3; border-radius: 6px; cursor: pointer;">
                <input type="radio" name="opcao_devolucao_rapida" value="12" />
                Opção 1) Devolver para Indicação de Imóvel
              </label>
              <label class="radio-option" style="background: #ffffff; padding: 10px; border: 1px solid #fecdd3; border-radius: 6px; cursor: pointer;">
                <input type="radio" name="opcao_devolucao_rapida" value="13" />
                Opção 2) Devolver para Diagnóstico de Imóvel
              </label>
            </div>
            
            <label for="motivo_devolucao_rapida" style="color: #9f1239; font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;">Motivo (Obrigatório):</label>
            <textarea id="motivo_devolucao_rapida" placeholder="Justifique a devolução..." style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid #fecdd3; border-radius: 4px; margin-bottom: 15px; font-family: inherit; box-sizing: border-box;"></textarea>
            
            <button type="button" id="btnEnviarDevolucaoRapida" style="background-color: #be123c; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">🚀 Enviar Processo</button>
          </div>
```

### Lógica de Conclusão Final (`foco-03.html`)
Ao devolver o processo pelo box de conclusão final da manifestação da Aba 3, os dados inseridos na tabela do Supabase utilizavam o status legada `"Devolvido"` e checkpoints sem o prefixo `"Aguardando"`.
```javascript
              if (despacho === 'devolver_aba1') {
                novoCheckpoint = 'Indicação de Imóvel'; novoStatus = 'Devolvido'; novaInstancia = 'Equipe-Caracterização'; novoPerfil = 'Equipe-Caracterização';
              } else if (despacho === 'devolver_aba2') {
                novoCheckpoint = 'Análise Viabilidade'; novoStatus = 'Devolvido'; novaInstancia = 'Equipe-Destinação'; novoPerfil = 'Equipe-Destinação';
```

### Motor de Atualização de Status (`db.js`)
O JSON de envio em `updateStatusFluxo()` tentou atualizar colunas de nível raiz que não existem no schema cache da tabela `tabela_status_fluxo` do Supabase, o que gerou erro HTTP 400 Bad Request nas requisições.
```javascript
            // Atualiza
            const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/tabela_status_fluxo?numero_requerimento=eq.${encodeURIComponent(processId)}`, {
                method: 'PATCH',
                body: JSON.stringify({ 
                    dados_json: json,
                    tag_fluxo: json.tag_fluxo,
                    status: json.status,
                    ...
                })
            });
```

### Mapeamento do Workflow (`workflow.js`)
Os estados de devolução (IDs 12 e 13) continham o status genérico `"Devolução"` e não tinham campo de `tag_fluxo` preenchido.
```javascript
  12: { id_workflow: 12, status: "Devolução",                    instancia: "Destinação",              perfil: "Equipe (Destinação)",     descricao: "Devolução para indicação de outro imóvel/área, acrescentar ou excluir imóvel/área" },
  13: { id_workflow: 13, status: "Devolução",                    instancia: "Caracterização",          perfil: "Equipe (Caracterização)", descricao: "Devolução para ajuste na análise preliminar do imóvel/área" }
```

---

## 2. Estado Novo (Depois)

### HTML Corrigido (`foco-03.html`)
Fechamento de container realocado após a renderização dos formulários e blocos de devolução.
```html
            </div>
          </div>
        </div>
        <!-- ========================================================= -->
```

### Componente de Devolução Direto por Botões (`foco-03.html`)
Substituiu a área de seleção com botões diretos de gatilho, permitindo a devolução com 1 clique (motivo + ação direta).
```html
          <div id="bloco_devolucao_rapida" style="display: none; margin-top: 15px; border-top: 1px dashed #fda4af; padding-top: 15px;">
            <label for="motivo_devolucao_rapida" style="color: #9f1239; font-weight: bold; font-size: 0.9em; display: block; margin-bottom: 5px;">Motivo (Obrigatório):</label>
            <textarea id="motivo_devolucao_rapida" placeholder="Justifique a devolução..." style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid #fecdd3; border-radius: 4px; margin-bottom: 15px; font-family: inherit; box-sizing: border-box;"></textarea>
            
            <p style="margin-top: 0; margin-bottom: 10px; color: #9f1239; font-weight: bold;">Para qual fase o processo deve retornar?</p>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              <button type="button" class="btnEnviarDevolucaoRapida" data-workflow="12" style="...">🔙 Devolver para Indicação (Aba 1)</button>
              <button type="button" class="btnEnviarDevolucaoRapida" data-workflow="13" style="...">🔙 Devolver para Diagnóstico (Aba 2)</button>
            </div>
          </div>
```

### Alinhamento do Box de Conclusão Final (`foco-03.html`)
O bloco de conclusão final agora grava os mesmos estados padronizados do workflow principal.
```javascript
              if (despacho === 'devolver_aba1') {
                novoCheckpoint = 'Aguardando Indicação de Imóvel'; novoStatus = 'Aguardando Indicação de Imóvel'; novaInstancia = 'Destinação'; novoPerfil = 'Equipe (Destinação)';
              } else if (despacho === 'devolver_aba2') {
                novoCheckpoint = 'Aguardando Diagnóstico de Imóvel'; novoStatus = 'Aguardando Diagnóstico de Imóvel'; novaInstancia = 'Caracterização'; novoPerfil = 'Equipe (Caracterização)';
```

### Motor de Atualização Seguro (`db.js`)
O JSON de envio do fetch foi revertido para apenas atualizar o campo `dados_json` (onde os dados reais do fluxo estão mapeados) para respeitar o schema do Supabase e evitar erros de HTTP 400.
```javascript
            // Atualiza
            const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/tabela_status_fluxo?numero_requerimento=eq.${encodeURIComponent(processId)}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dados_json: json })
            });
```

### Mapeamento do Workflow Mestre (`workflow.js`)
IDs 12 e 13 agora refletem a tag "Devolvido" e a nomenclatura correta para a exibição de KPIs.
```javascript
  12: { id_workflow: 12, tag_fluxo: "Devolvido", status: "Aguardando Indicação de Imóvel",                    instancia: "Destinação",              perfil: "Equipe (Destinação)",     descricao: "Devolução para indicação de outro imóvel/área, acrescentar ou excluir imóvel/área" },
  13: { id_workflow: 13, tag_fluxo: "Devolvido", status: "Aguardando Diagnóstico de Imóvel",                    instancia: "Caracterização",          perfil: "Equipe (Caracterização)", descricao: "Devolução para ajuste na análise preliminar do imóvel/área" }
```

### Cache-Busting (`index.html` e `processo.html`)
Adicionadas tags dinâmicas baseadas na data de publicação atual.
```html
    <script src="workflow.js?v=202607170020"></script>
    <script src="db.js?v=202607170020"></script>
```

---

## 3. Plano de Rollback (Como Desfazer)

Para desfazer a totalidade das alterações realizadas nesse commit, siga os passos abaixo:

1. **Reverter `foco-03.html`**:
   - Abra o arquivo `foco-03.html`.
   - Adicione a tag `</div>` redundante na linha 298.
   - Substitua o bloco HTML `id="bloco_devolucao_rapida"` e seu script associado pela versão com radio buttons detalhada na seção "Estado Anterior".
   - Restaure as variáveis de `novoCheckpoint` e `novoStatus` do box de conclusão final da manifestação.

2. **Reverter `db.js`**:
   - Abra o arquivo `db.js`.
   - Retorne as strings de status para os IDs 12 e 13 para `"Indicação de Imóvel"` e `"Diagnóstico de Imóvel"`.

3. **Reverter `workflow.js`**:
   - Abra o arquivo `workflow.js`.
   - Remova a propriedade `tag_fluxo` dos registros e retorne a string `status` para `"Devolução"` nos IDs 12 e 13.

4. **Reverter Importações**:
   - Em `index.html` e `processo.html`, altere as query strings de `v=202607170020` de volta para `v=1` e `v=202607161510`.
