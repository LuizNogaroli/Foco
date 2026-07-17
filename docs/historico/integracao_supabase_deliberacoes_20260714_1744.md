# Histórico de Alterações - Integração de Deliberações ao Supabase e Fluxo de Status

## Resumo da Mudança
As funções de aprovação/devolução nos painéis da Chefia, Coordenação e Superintendência na Aba 7 (`aba7.html`) foram integradas ao Supabase. Agora, as deliberações gravam na tabela recém-criada (`tabela_deliberacoes`) e atualizam globalmente o status daquele processo no painel (por meio de `window.parent.updateStatusFluxo`), movendo o status geral para `"Devolvido para complementação"` em caso de retorno ou `"Aprovado"` para seguimento. Também foi criada a lógica de resgate (`verificarDevolucaoSupabase` no `db.js`) para exibir o banner vermelho nas Abas 1, 2 ou 3 se existirem pendências de correção.

## 1. Estado Anterior (Antes)
- Na `aba7.html`: O código JS dos botões "Confirmar Manifestação" era estático e não se comunicava com o banco, usando apenas `alert()` para simular as mensagens.
- No `db.js`: A inicialização via `DOMContentLoaded` apenas chamava a recuperação do *draft*. Não havia busca do histórico de deliberação para preencher o motivo do bloqueio da aba.
- No Supabase: A tabela `tabela_deliberacoes` não existia.

## 2. Estado Novo (Depois)
- Criada a instrução `create_tabela_deliberacoes.sql`.
- Na `aba7.html`: Criadas funções assíncronas `enviarDeliberacaoSupabase` e `notificarStatusFluxo` que fazem requisições REST usando `SUPABASE_ANON_KEY`. Todos os `salvarChefia`, `salvarCoord` e `salvarSuper` agora usam essa infraestrutura, empacotando os dados dinâmicos em um `JSON`.
- No `db.js`: Foi anexada ao final a função `window.verificarDevolucaoSupabase()`, que é chamada junto com o `loadDraftFromDB()` para verificar se o processo atual sofreu devolução. Caso positivo, ele localiza o componente de banner via DOM (ex: `bannerDevolucaoAba2`) e exibe o texto extraído da base de dados.

## 3. Plano de Rollback / Desfazer
Para reverter essa mudança:
1. **Desfazer no `db.js`**:
   - Abra `db.js` e remova a chamada `if (typeof window.verificarDevolucaoSupabase === 'function') { await window.verificarDevolucaoSupabase(); }` de dentro do listener `DOMContentLoaded`.
   - Delete a definição completa da função `window.verificarDevolucaoSupabase`.
2. **Desfazer no `aba7.html`**:
   - Volte ao arquivo `aba7.html` e remova todas as novas lógicas com os endpoints `SUPABASE_URL`.
   - Substitua o bloco de scripts final que define `enviarDeliberacaoSupabase`, `salvarChefia`, etc., pelo bloco estático original descrito no arquivo `docs/historico/reformulacao_deliberacoes_perfis_20260714_1733.md`.
3. **No Banco de Dados**:
   - Se desejar expurgar o registro local, simplesmente descarte a tabela recém-criada através de `DROP TABLE tabela_deliberacoes;`.
