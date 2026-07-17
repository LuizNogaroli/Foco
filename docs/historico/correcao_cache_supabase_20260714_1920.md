# Histórico de Correção: Cache Buster e Supabase SDK no Processo.html

## Contexto
Mesmo após a reescrita pesada na função `updateStatusFluxo` para corrigir o bug de UPSERT silencioso na tabela de status, o usuário relatou que a transição da Aba 3 para a Aba 7 ainda falhava: a caixa de deliberação da Chefia não carregava.

Uma investigação minuciosa apontou que:
1. **Cache Forte de Navegador**: Os navegadores estavam com o `db.js` da versão anterior em cache devido à ausência de alteração no cache buster `v=` do `index.html` e `processo.html`. Isso fazia com que o usuário rodasse o script antigo, acionando novamente o bug do UPSERT (POST) defeituoso na API.
2. **O "Silent Killer" - Fallback de Execução**: `foco-03.html` disparava a função `window.parent.updateStatusFluxo`. Como o parent é `processo.html`, ele usa a instância do `db.js` carregada no processo principal. No entanto, o `processo.html` não possuía a tag `<script>` do Supabase SDK. Consequentemente, `window.supabaseClient` avaliava como nulo. O código original da função começava com `if (!processId || !window.supabaseClient) return;`, o que causava uma interrupção imediata (early return). O fluxo **nunca** chegou a ser atualizado a partir das Abas internas.

## 1. Estado Anterior (Antes)

### Em `processo.html` (Cabecalho)
```html
    <link rel="stylesheet" href="index.css?v=1782355313469">
    <script src="db.js?v=1782355313469"></script>
```

### Em `index.html` (Cabecalho)
```html
    <script src="db.js?v=1782355313469"></script>
```

### Em `db.js` (updateStatusFluxo)
```javascript
window.updateStatusFluxo = async function(processId, novoCheckpoint, novoStatus) {
    if (!processId || !window.supabaseClient) return;
```

## 2. Estado Novo (Depois)

### Em `processo.html` (Cabecalho)
Atualizamos o cache buster e inserimos o Supabase SDK para evitar falhas de contexto.
```html
    <link rel="stylesheet" href="index.css?v=202607142230">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="db.js?v=202607142230"></script>
```

### Em `index.html` (Cabecalho)
Atualizado o cache buster.
```html
    <script src="db.js?v=202607142230"></script>
```

### Em `db.js` (updateStatusFluxo)
A função foi blindada removendo o bloqueio, visto que sua arquitetura usa puramente chamadas `fetch` RESTful, não necessitando do SDK oficial no objeto window.
```javascript
window.updateStatusFluxo = async function(processId, novoCheckpoint, novoStatus) {
    if (!processId) return;
```

## 3. Plano de Rollback / Desfazer
Para reverter essas alterações:
1. Em `processo.html` e `index.html`, reverta as strings `v=202607142230` para a numeração anterior se desejar forçar cache.
2. Em `processo.html`, remova a linha `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`.
3. Em `db.js`, recoloque a condicional com o supabaseClient na primeira linha da função `updateStatusFluxo`: `if (!processId || !window.supabaseClient) return;`.
