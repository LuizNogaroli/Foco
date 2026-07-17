# Histórico de Alterações - Correção de Detecção de Processo e Checkpoint de Fila

## Resumo da Mudança
Corrigimos dois bugs que impediam o funcionamento correto da fila de deliberação na Aba 7:
1. **Fallback de ID do Processo na Aba 7:** O `processId` em `carregarDeliberacoesETimeline` estava retornando `null` porque dependia exclusivamente da URL. Adicionamos a busca no `localStorage.getItem('CURRENT_PROCESS_ID')`. Isso fazia com que a função de inicialização retornasse imediatamente sem ler o status e sem desenhar a timeline de deliberações.
2. **Checkpoint Incorreto na Conclusão da Aba 3:** Ao concluir a Aba 3 (`foco-03.html`), o status do fluxo era alterado para `'Painel Final'`, fazendo com que o checkpoint do processo não coincidisse com `"Aguardando Chefia SPU/UF"`. Corrigimos para atualizar o checkpoint para `'Aguardando Chefia SPU/UF'`.

## 1. Estado Anterior (Antes)
- No `aba7.html` (linha 951): `processId` era buscado apenas na URL. Sem encontrar parâmetros na query string do iframe, retornava `null`.
- No `foco-03.html` (linha 3351): O submit da equipe técnica enviava `Painel Final` e status `Aprovado`.

## 2. Estado Novo (Depois)
- No `aba7.html`: O ID é detectado primeiro na URL, depois em `localStorage` e finalmente na URL do pai.
- No `foco-03.html`: O submit da equipe técnica encaminha o processo corretamente alterando o checkpoint para `'Aguardando Chefia SPU/UF'` com status geral `'Em análise'`, o que habilita as ações da Chefia de forma reativa.

## 3. Plano de Rollback / Desfazer
Para reverter:
1. **No `aba7.html`**:
   - Reverter a atribuição do `processId` em `carregarDeliberacoesETimeline()` para ler apenas `URLSearchParams` do iframe e da URL do pai.
2. **No `foco-03.html`**:
   - Mudar de volta a chamada `window.parent.updateStatusFluxo(processId, 'Aguardando Chefia SPU/UF', 'Em análise')` para `window.parent.updateStatusFluxo(processId, 'Painel Final', 'Aprovado')` na linha 3351.
