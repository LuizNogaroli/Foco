# Knowledge Base: Resolução do Escopo de Banners de Devolução (Iframe vs. Parent)

## Contexto e Desafio
No fluxo de aprovações/deliberações da Aba 7, quando um processo sofre uma devolução, o sistema precisa sinalizar o erro na respectiva aba de origem (Aba 1, 2 ou 3) exibindo um banner vermelho com a justificativa preenchida pelo revisor.

Durante os testes iniciais, o banner não foi renderizado na Aba 2 (Caracterização). Investigando a arquitetura, identificamos dois problemas fundamentais de escopo decorrentes do uso de iframes:
1. **Origem do ID do Processo:** A função que consultava o banco no arquivo `db.js` tentava ler o ID do processo por meio de `URLSearchParams(window.location.search).get('processo')`. Porém, nos iframes das abas, a URL não contém essa query string; o ID do processo é armazenado localmente em `localStorage.getItem('CURRENT_PROCESS_ID')`.
2. **Contexto de DOM Incorreto:** Como a função `verificarDevolucaoSupabase` era disparada pelo arquivo pai (`db.js`), a busca via `document.getElementById('bannerDevolucaoAbaX')` ocorria na página principal (`index.html`), onde o banner não existe. O banner na verdade estava instanciado dentro do documento do iframe (`contentWindow.document`).

## Solução Técnica
Para solucionar esse conflito de escopo, adotamos uma estratégia de passagem dinâmica de contexto e fallback de identificação:

1. **Assinatura Parametrizada no Pai (`db.js`):**
   Alteramos a função para aceitar opcionalmente o documento alvo como parâmetro:
   ```javascript
   window.verificarDevolucaoSupabase = async function(doc = document) { ... }
   ```
   Caso nenhum documento seja passado, ela assume o `document` padrão do pai. O DOM lookup foi atualizado de `document.getElementById` para `doc.getElementById`.

2. **Detecção Resiliente do ID do Processo:**
   A leitura do ID do processo foi estendida para verificar múltiplos fallbacks:
   ```javascript
   let processId = new URLSearchParams(window.location.search).get('processo')
       || localStorage.getItem('CURRENT_PROCESS_ID')
       || (window.parent && new URLSearchParams(window.parent.location.search).get('processo'));
   ```

3. **Invocação no Ciclo de Vida do Iframe (`sync.js`):**
   Inserimos o gatilho no final do carregamento dos iframes, enviando o contexto local (`document`) para a função do pai:
   ```javascript
   if (window.parent && typeof window.parent.verificarDevolucaoSupabase === 'function') {
       window.parent.verificarDevolucaoSupabase(document);
   }
   ```

## Lições Aprendidas
- Em arquiteturas baseadas em iframes de mesma origem (*same-origin*), a melhor forma de interagir com o DOM interno sem acoplamento rígido é delegar funções ao contexto pai passando referências locais de escopo (`document` ou elementos de DOM específicos).
- A verificação de variáveis de ambiente do Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) dentro de iframes deve sempre prever fallbacks no objeto `window.parent` caso os scripts locais não as instanciem diretamente.
