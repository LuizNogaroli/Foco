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
