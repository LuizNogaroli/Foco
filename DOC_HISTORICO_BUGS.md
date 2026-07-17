# Histórico de Resolução de Problemas e Arquitetura (Knowledge Base)
**Projeto:** Admissibilidade - Foco 09 (Integração Supabase e Formulários Dinâmicos)
**Data:** Junho de 2026

Este documento foi elaborado para servir como um acervo técnico (Knowledge Base) para projetos futuros. Ele detalha os principais desafios de engenharia de software e arquitetura de front-end enfrentados durante a integração de banco de dados, iframes e gerenciamento de estados.

---

## 1. O Desafio do Cache Agressivo em Iframes

**Sintoma:** Alterações em arquivos JavaScript (`foco-01.js`, `sync.js`, etc.) e CSS não refletiam na interface do usuário. Atualizações simples via teclado (F5 ou Ctrl+F5) não resolviam o problema.

**Causa:** A arquitetura do sistema utiliza uma página principal (`processo.html`) que embute as subpáginas em um `iframe`. Os navegadores modernos tratam o cache de conteúdos dentro de iframes de forma extremamente agressiva. Ao recarregar a página "mãe", o navegador não propagava a ordem de recarregamento forçado para os arquivos anexados dentro do iframe.

**Solução Desenvolvida ("Cache Busting" Automatizado):**
- Foi criado um script em Node.js (`disable-cache.js`) para atuar como ferramenta de build.
- O script varre automaticamente todos os mais de 40 arquivos `.html` do projeto.
- Ele injeta `Meta Tags` de controle de cache (`no-cache`, `no-store`, `must-revalidate`) no cabeçalho.
- Ele utiliza Expressões Regulares (Regex) para localizar todas as importações locais de `<script src="...">` e `<link href="...">` e adiciona dinamicamente um *timestamp* de versão (ex: `script.js?v=1719273645000`). Como a URL muda a cada execução, o navegador é obrigado a baixar a versão mais recente dos arquivos sempre que o script é rodado.

---

## 2. Efeitos Colaterais de Regex: Corrupção de CDNs Externos

**Sintoma:** A integração com o banco de dados Supabase parou de funcionar de forma repentina. O console acusava erro fatal: `supabase is not defined`.

**Causa:** A expressão regular implementada no `disable-cache.js` para aplicar o *timestamp* foi desenhada de forma excessivamente abrangente. Ao processar o `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">`, ela injetou o `?v=` no meio da URL do domínio (transformando em `cdn.js...delivr`), quebrando o endereço da biblioteca na internet.

**Solução Desenvolvida:**
- **Recuperação imediata:** Criação de um script corretivo temporário (`fix-cdn.js`) para localizar a URL quebrada e restaurá-la para o caminho original.
- **Prevenção futura:** Refinamento lógico na expressão regular do *cache buster* para atuar exclusivamente sobre arquivos com extensões diretas (`.js`, `.css`) e ignorar sumariamente URLs absolutas (iniciadas com `http://` ou `https://`).

---

## 3. Concorrência Assíncrona e "Race Conditions" na Passagem de Dados (Window.Parent)

**Sintoma:** Os dados "mockados" do banco (ex: Dados de RIPs associados) carregavam corretamente no objeto central do sistema, mas os campos visíveis nos formulários (iframes) continuavam vazios ou com valores padrão de HTML.

**Causa:** "Race Condition" (Condição de Corrida). O iframe (`foco-01.html`) é carregado em paralelo à inicialização da conexão de banco de dados na página principal (`processo.html`). A execução do módulo de preenchimento (`sync.js`) acontecia milissegundos *antes* do módulo do Supabase (`db.js`) retornar os dados do banco na rede. Quando o formulário tentava se preencher lendo o objeto `window.parent.formDataState`, este objeto ainda estava vazio.

**Solução Desenvolvida (Arquitetura Reativa):**
- Transição de um modelo de "leitura direta" (Pull) para um modelo baseado em eventos (Push).
- O arquivo principal (`db.js`) foi modificado para, logo após obter sucesso na leitura do Supabase, emitir um `postMessage` (sinal) avisando que o banco estava pronto (evento `DATABASE_LOADED`).
- O `sync.js` (dentro do iframe) foi ensinado a ficar "escutando" esse sinal. Assim que o evento é interceptado, ele aciona a função `populateForm()`, garantindo que o formulário só seja preenchido no instante em que os dados estão 100% disponíveis na memória, eliminando a dependência do tempo de resposta da rede.

---

## 4. O Sequestro de URLs em Ambientes de Roteamento e Perda de Contexto

**Sintoma:** Independentemente do processo clicado no Painel Gerencial (ex: `DF04401/2026`), o formulário jamais populava os dados. Testes diretos mostraram que o ID estava sendo ignorado e o sistema operava em um "processo fantasma".

**Causa:** Arquiteturas modernas de "Live Servers" ou rotas de SPA (Single Page Applications, como no React/Next.js) muitas vezes formatam as URLs por motivos de estética e roteamento interno (hash routing). Quando a função original ordenava a transição para `processo.html?process_id=2401`, o servidor local interceptava a requisição, limpava a URL e substituía por algo estrutural como `localhost:3000/processo#foco-01`. Sem os *query parameters* (`?process_id=...`), a leitura da URL falhava silenciosamente e o script definia o ID para um valor padrão *fallback* (`processo-admissibilidade-foco`).

**Solução Desenvolvida (Persistência Dupla com LocalStorage):**
- A função de navegação no painel (`openProcess` no `index.html`) foi modificada para, antes de alterar a URL, salvar o ID real no "cofre" do navegador: `localStorage.setItem('CURRENT_PROCESS_ID', id)`.
- No momento da leitura (`db.js`), estabelecemos uma estratégia de contingência dupla: primeiro tenta-se ler da URL; se a URL tiver sido adulterada/limpa pelo servidor, o script aciona a contingência e resgata o ID do `localStorage`. Isso "blindou" o trânsito do parâmetro contra qualquer tipo de roteamento invisível.

---

## 5. A Armadilha Letal do "Auto-Save" e a Corrupção Mutável

**Sintoma:** Os dados do processo inteiro foram magicamente deletados no banco de dados do Supabase, restando apenas uma chave de "checkbox" recém-marcada.

**Causa:** Uma intersecção fatal de eventos.
1. O processo perdeu o ID original na URL (conforme Problema #4).
2. O formulário abriu vazio em seu estado "fantasma".
3. O usuário interagiu com um campo do formulário (clicou na caixa de "Terreno/acrescido de marinha").
4. A ação ativou o sistema reativo de *Auto-Save* do `sync.js`.
5. O *Auto-Save* varreu o estado em memória (que estava vazio) mais o campo que foi alterado e realizou um comando de Upsert/Update massivo contra o banco de dados. O Supabase obedeceu à requisição e apagou todo o histórico do processo, gravando *apenas* a chave do checkbox no registro inteiro.

**Solução Desenvolvida:**
- A resolução imediata foi o conserto estrutural apontado na solução do Problema #4 (`LocalStorage`), garantindo que o formulário seja *sempre* carregado com a carga massiva de dados original ANTES do usuário interagir e forçar um *Auto-Save*.
- Adicionalmente, implementou-se o conceito de uso de **Debuggers Visuais (Overlays em Tempo Real)**: Painéis CSS vermelhos injetados diretamente na tela (DOM) durante o desenvolvimento para imprimir, em texto cru (`JSON.stringify`), as requisições em trânsito. Isso permitiu "enxergar" o estado assíncrono interno e desmascarar a falha em poucos segundos.

---

### Lições Aprendidas

1. **Iframes e Cache:** Jamais dependa de atualizações forçadas (F5) em arquiteturas que embutem frames. Uma estratégia automatizada de *Cache Busting* por hashes/timestamps em rotinas de CI/CD ou scripts locais é obrigatória.
2. **Manipulação de DOM vs Regex:** Usar Regex para alterar códigos `.html` é perigoso. Exige validações estritas (como evitar modificar URLs externas de CDNs) para não quebrar dependências de terceiros vitais para a estrutura.
3. **Persistência Blindada:** Não confie inteiramente na barra de endereços (URL) para trânsito de chaves primárias ou estados entre páginas caso o ecossistema backend e roteamento não for 100% conhecido. O `SessionStorage` e `LocalStorage` são grandes aliados arquiteturais.
4. **Perigo do Auto-Save:** Rotinas de salvamento instantâneo devem ter condicionais que as impeçam de operar ("lockdown") caso o estado central não tenha sido positivamente hidratado/recebido pela base de dados inicial, evitando sobregravação acidental (corrupção por formulário limpo).

---

## 6. Dependência de window.parent para Fetch Crítico em Iframes (Devolução)

**Sintoma:** Ao tentar salvar checkpoint de fluxo (ex: "Aguardando Coordenação SPU/UF") a partir de iframes como `foco-03.html` ou `aba7.html`, a operação falhava silenciosamente. O console não mostrava erro, mas o checkpoint não era salvo no Supabase.

**Causa:** Os iframes chamavam funções de banco via `window.parent.updateStatusFluxo()` ou `window.parent.updateStatusFluxo`. Isso falhava em três cenários:
1. `window.parent` não tinha o SDK carregado → `window.supabaseClient` nulo → early return
2. A função não estava disponível no contexto correto do iframe
3. Race condition: o parent não havia carregado ainda

**Solução Desenvolvida (Fetch Direto Padrão):**
- Padrão arquitetural: **nunca** usar `window.parent.funcao()` para operações críticas de banco em iframes.
- Implementar `fetch` direto ao Supabase usando credenciais locais:
```javascript
const SUPA_URL = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
const SUPA_KEY = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);
```
- Credenciais Supabase embutidas diretamente no `<head>` dos iframes críticos (`aba7.html`, `foco-03.html`).
- Padrão GET → PATCH/POST: primeiro verificar se existe registro em `tabela_status_fluxo`, depois PATCH se existe ou POST se não existe.

---

## 7. Ordem de Consulta em tabela_status_fluxo (Duplicatas)

**Sintoma:** Ao consultar o checkpoint atual do processo, o sistema às vezes retornava um checkpoint antigo em vez do mais recente.

**Causa:** A tabela `tabela_status_fluxo` não tem constraint UNIQUE no campo `numero_requerimento`. Pode haver múltiplas linhas para o mesmo processo (duplicatas de operações anteriores).

**Solução Desenvolvida:**
- Sempre usar `order=id.desc&limit=1` nas queries de `tabela_status_fluxo`.
- Isso garante que se pega o registro mais recente, mesmo que existam duplicatas.

---

## 8. Cache de Browser em Alterações de JS (Cache Busting Obrigatório)

**Sintoma:** Alterações em arquivos JavaScript não refletiam na interface, mesmo após upload para o servidor.

**Causa:** O browser mantém cache agressivo de arquivos estáticos. Qualquer alteração em JS precisa de um bump no cache buster para forçar o download da nova versão.

**Solução Desenvolvida:**
- Tornar obrigatório o uso de cache buster (`?v=YYYYMMDDHHMI`) em todos os HTMLs que carregam scripts alterados.
- Exemplo: `foco-03.html?v=202607142230`

---

## 9. Race Condition Após Salvar no Supabase (Navegação Prematura)

**Sintoma:** Ao salvar checkpoint e navegar para outra aba imediatamente, a nova aba não via o checkpoint atualizado.

**Causa:** O Supabase processa a escrita de forma assíncrona. Se a navegação acontece antes do banco processar, a leitura na nova aba retorna o estado antigo.

**Solução Desenvolvida:**
- Adicionar `await new Promise(resolve => setTimeout(resolve, 600))` antes de navegar após salvar no Supabase.
- Isso garante que o servidor processou antes da próxima tela fazer a leitura.

---

## 10. Versionamento de Dados em Processos com Devolução

**Sintoma:** Quando um processo é devolvido (ex: Coordenação devolve para Chefia), os dados da aba eram sobrescritos, perdendo o histórico de preenchimentos anteriores.

**Causa:** O sistema original salvava dados em `tabela_foco` e `tabela_relatorios` usando UPSERT (sobrescrevia o registro existente). Não havia preservação de versões anteriores.

**Solução Desenvolvida (Versionamento por Snapshots):**
- Criada nova tabela `tabela_versoes_formulario` no Supabase:
  - `id`, `processo_id`, `aba` (aba1/aba2/aba3), `versao` (integer), `dados_json` (jsonb), `criado_por`, `criado_em`
- Ao salvar qualquer aba, além do UPSERT em `tabela_relatorios`, grava-se uma nova versão em `tabela_versoes_formulario` com `versao = ultima_versao + 1`.
- `tabela_foco` e `tabela_relatorios` continuam como "snapshot ativo" para não quebrar telas existentes.
- PDF (`processo-print.html`) busca a versão mais recente de cada aba na tabela de versões, com fallback para `tabela_relatorios` se não houver versão (compatibilidade com processos antigos).

**Lições Arquiteturais:**
1. Em processos administrativos, **nunca sobrescrever** dados — sempre append (criar nova versão).
2. Manter "snapshot ativo" para performance, mas preservar todas as versões para auditoria.
3. O versionamento deve ser transparente para o usuário — ele continua salvando normalmente.

---

### Lições Gerais Atualizadas

1. **Iframes e Cache:** Jamais dependa de atualizações forçadas (F5) em arquiteturas que embutem frames. Uma estratégia automatizada de *Cache Busting* por hashes/timestamps é obrigatória.
2. **Manipulação de DOM vs Regex:** Usar Regex para alterar códigos `.html` é perigoso. Exige validações estritas.
3. **Persistência Blindada:** Não confie na barra de endereços (URL) para trânsito de chaves primárias. Use `localStorage` como backup.
4. **Perigo do Auto-Save:** Rotinas de salvamento devem ter "lockdown" se o estado central não foi hidratado.
5. **Fetch Direto em Iframes:** Nunca usar `window.parent.funcao()` para operações críticas de banco. Sempre fazer `fetch` direto com credenciais locais.
6. **Ordenação em Queries:** Sempre usar `order=id.desc&limit=1` em tabelas sem constraint UNIQUE.
7. **Cache Busting Obrigatório:** Toda alteração em JS deve ser acompanhada de bump no cache buster em todos os HTMLs.
8. **Delay Após Supabase:** Aguardar 600ms após salvar antes de navegar para outra aba.
9. **Versionamento de Dados:** Em processos administrativos, nunca sobrescrever — sempre criar nova versão.
