# Histórico de Alterações - Ajuste na Consulta do Status do Fluxo no Supabase

## Resumo da Mudança
Corrigimos um erro de mapeamento de colunas na consulta da `tabela_status_fluxo` dentro da Aba 7. A tabela do Supabase armazena a chave identificadora na coluna `numero_requerimento` e os dados do fluxo (incluindo o checkpoint) na coluna JSONB `dados_json`. Nossa query estava buscando por uma coluna inexistente `process_id` e lendo a propriedade `checkpoint` diretamente na raiz do objeto de resposta. Corrigimos os parâmetros do fetch.

## 1. Estado Anterior (Antes)
- No `aba7.html` (linha 1087):
  ```javascript
  const statusUrl = `${supabaseUrl}/rest/v1/tabela_status_fluxo?process_id=eq.${encodeURIComponent(processId)}&limit=1`;
  ...
  currentCheckpoint = statusData[0].checkpoint;
  ```
  Isso resultava em um erro HTTP 400 do Supabase (Bad Request por coluna inválida `process_id`), zerando o checkpoint local.

## 2. Estado Novo (Depois)
- No `aba7.html`:
  ```javascript
  const statusUrl = `${supabaseUrl}/rest/v1/tabela_status_fluxo?select=dados_json&numero_requerimento=eq.${encodeURIComponent(processId)}&limit=1`;
  ...
  currentCheckpoint = statusData[0].dados_json.checkpoint || "";
  ```
  A consulta agora retorna com status HTTP 200 e o checkpoint é lido com precisão de dentro do objeto JSON.

## 3. Plano de Rollback / Desfazer
Para reverter:
- Restaure a string de URL e a extração do checkpoint na função `carregarDeliberacoesETimeline()` do `aba7.html` para os termos originais (devolver à linha 1087 do commit anterior).
