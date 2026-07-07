# Estado Atual do Sistema – FOCO-11
*Data: 06 de Julho de 2026 | Horário: 20:28 (local)*
*Gerado para: Continuidade do desenvolvimento por outra IA ou desenvolvedor*

---

## 1. Visão Geral do Projeto

Sistema web de **Admissibilidade de Processos de Destinação de Imóveis da SPU** (Secretaria de Patrimônio da União). É um formulário multi-etapas dividido em abas (Foco-01 a Foco-10), onde analistas cadastram dados de imóveis para destinação, dentro de um fluxo de aprovação multiusuário.

- **Tecnologias**: HTML puro + CSS + JavaScript vanilla (sem frameworks)
- **Banco de Dados**: Supabase (PostgreSQL via REST API)
- **Ponto de entrada**: `processo.html` → carrega abas via `<iframe id="frame">`
- **Arquivo de dados**: `db.js` (gerencia estado global e comunicação com Supabase)
- **Sincronizador**: `sync.js` (presente em cada aba, faz bridge entre iframe e janela pai)

---

## 2. Arquitetura de Comunicação (CRÍTICA)

O sistema usa uma arquitetura de **iframes aninhados**:

```
processo.html (janela pai)
  ├── db.js        ← gerencia window.formDataState, window.updateField(), etc.
  ├── index.js     ← gerencia navegação entre abas (clique nos botões 1-10)
  └── <iframe id="frame">
        ├── foco-01.html + foco-01.js + sync.js
        ├── foco-02.html + foco-02.js + sync.js
        └── ... (cada aba é um HTML isolado com seus scripts)
```

**Como um iframe salva dados:**
```javascript
// Dentro de qualquer foco-XX.js ou sync.js (no iframe):
window.parent.updateField('nome_do_campo', valor);
// Isso grava em window.parent.formDataState['nome_do_campo']
// e dispara triggerSaveDraft() para salvar no Supabase
```

**Como o estado central chega ao iframe (ao carregar uma aba):**
1. `db.js` carrega o processo do Supabase e popula `window.formDataState`
2. `db.js` dispara o evento `DATABASE_LOADED` via `postMessage` para todos os iframes filhos
3. `sync.js` (dentro do iframe) ouve `DATABASE_LOADED` e chama `populateForm(state)`
4. `populateForm()` preenche os campos do formulário com os dados do estado

---

## 3. Tabelas do Supabase

| Tabela | Finalidade |
|---|---|
| `foco_drafts` | Rascunhos dos formulários. Cada processo tem um registro com `form_data` (JSON). Coluna chave: `process_id` |
| `tabela_requerimentos` | Dados do requerimento original (Portal SPU) — somente leitura |
| `tabela_spu` | Dados do imóvel (Datalake SPUnet) — somente leitura. Buscado pelo RIP |
| `tabela_indicacao` | Salva os RIPs e cadastros mínimos indicados na Aba 1 |
| `tabela_status_fluxo` | Rastreia em qual etapa do fluxo o processo está |
| `foco_reports` | Relatórios HTML gerados por perfil de usuário |

**Campos-chave do `form_data` (JSON em `foco_drafts`):**

| Campo | Tipo | Preenchido por | Usado em |
|---|---|---|---|
| `_ripsPesquisados` | Objeto `{ rip: {...dadosDoRIP} }` | Aba 1 (via `foco-01.js`) | Aba 2 (blocos de imóvel) |
| `rips` | Array `["RIP1", "RIP2"]` | Aba 1 (fallback) | Aba 2 (fallback) |
| `municipio`, `uf`, `cep` | String | sync.js sweep do form | Várias abas |
| `status_flow` | String | sync.js | Dashboard / fluxo |

---

## 4. Aba 1 — `foco-01.html` + `foco-01.js`

**Finalidade**: Identificação do Requerimento. O analista informa o número do processo, pesquisa o imóvel pelo RIP e adiciona RIPs ao processo.

**Fluxo de RIPs (lógica complexa):**

1. O usuário clica em "Inserir RIP" → abre `modalInserirRip`
2. Digita o número e clica "Salvar RIP" ou "Mais RIPs"
3. `adicionarRipNaLista(rip)` adiciona ao `window.ripsPendentes[]`
4. **[CORRIGIDO em 06/07/2026]** Ao adicionar, chama imediatamente:
   ```javascript
   window.parent.updateField('rips', window.ripsPendentes);
   ```
   Isso persiste a lista no `formDataState` para que a Aba 2 possa lê-la.

> **Bug histórico resolvido**: Anteriormente, `ripsPendentes` era local e nunca enviado ao estado central, causando a Aba 2 não carregar os blocos de RIP.

---

## 5. Aba 2 — `foco-02.html` + `foco-02.js`

**Finalidade**: Caracterização do Imóvel. Para cada RIP adicionado na Aba 1, monta dinamicamente um bloco accordion com campos de dados do imóvel.

### 5.1 — Funções Globais Exportadas (usadas pelo `sync.js`)

```javascript
window.criarBlocoImovel(rip, dados)  // Cria o accordion HTML para um RIP
window.adicionarTagRIP(rip, dados)   // Adiciona a tag visual no topo da aba
window.atualizarRipsOcultos()        // Atualiza o input hidden com a lista de RIPs
window.ripsPesquisados               // Objeto global com todos os RIPs ativos
```

### 5.2 — Como os RIPs são restaurados ao carregar a Aba 2

`sync.js` → função `restoreFoco02DynamicBlocks(state)`:

1. Tenta ler `state['_ripsPesquisados']` (objeto completo com dados do RIP)
2. **Fallback [implementado em 06/07/2026]**: Se vazio, tenta ler `state['rips']` (array de strings) e constrói um objeto mínimo para cada RIP (suficiente para criar o bloco)
3. Chama `window.adicionarTagRIP()` e `window.criarBlocoImovel()` para cada RIP encontrado

### 5.3 — Campo `buildField()` (função interna de `foco-02.js`)

Cria os inputs/selects de cada campo do imóvel com lógica de:
- **Campo preenchido**: `readonly`, fundo cinza `#f8f9fa`, borda cinza
- **Campo vazio**: editável, fundo branco `#ffffff`, borda azul `#0056b3` (classe `custom-empty-select`)

**Motor de Dropdowns** (`CAMPOS_CONFIG`): objeto global que mapeia `nome_do_campo → [opções]`. Se um campo vazio tiver opções configuradas, `buildField()` renderiza um `<select>` ao invés de um `<input>`.

### 5.4 — Campos com Dropdown (configurados em `CAMPOS_CONFIG`)

- `conceituacao` / `descricao`
- `condicao_urbanizacao`
- `natureza` / `natureza_terreno`
- `tipo_imovel`
- `benfeitorias`
- `situacao_incorporacao`
- `lpm_1831` / `lmeo`
- `processo_incorporacao`
- `custos_manutencao`

### 5.5 — CSS dos campos

Arquivo principal: `styles-forms.css`

Classes relevantes:
- `.auto-loaded-field` — campo carregado do banco (readonly)
- `.custom-empty-select` — campo vazio que pode ser preenchido (branco + borda azul)
- `.empty-unlocked` — **REMOVIDA** em 06/07/2026 (causava fundo amarelo indesejado)

> **Atenção**: Não existem mais regras `.empty-unlocked` no sistema. Se aparecer um fundo colorido inesperado, verificar se esse seletor foi reintroduzido em algum script de patch.

### 5.6 — Checkboxes (Há Benfeitorias? / Situação da Incorporação)

- Esses campos são renderizados como grupos de radio/checkbox
- Quando vêm preenchidos do banco → ficam marcados e `disabled`
- Quando vazios → ficam editáveis (sem `disabled`)
- O fundo branco dos **checkboxes** é aplicado via CSS em `.form-group` (não no label)

---

## 6. `sync.js` — O Sincronizador Universal

Presente em **todas as abas**. Responsável por:

1. **Carregar overlay de espera** ("Carregando dados...") ao abrir qualquer aba
2. **Receber `DATABASE_LOADED`** da janela pai e chamar `populateForm(state)`
3. **`populateForm(state)`**: preenche todos os `<input>`, `<select>`, `<textarea>` com os valores do estado
4. **Sweep de mudanças**: ouve `change` em todos os campos e chama `window.parent.updateField()` a cada alteração
5. **Caso especial foco-02.html**: chama `restoreFoco02DynamicBlocks(state)` ao invés do preenchimento normal
6. **Modo somente leitura**: se URL tiver `?readonly=true`, desabilita todos os campos

**Lógica de timing:**
- Inicia um timer de 1.2 segundos ao carregar
- Se `DATABASE_LOADED` chegar antes: cancela o timer e usa dados reais
- Se o timer expirar primeiro: popula com o estado atual (que pode ser vazio se o banco ainda não respondeu)

---

## 7. `db.js` — O Gerenciador de Estado

**Funções globais críticas:**

```javascript
window.updateField(name, value)        // Atualiza um campo no formDataState e agenda salvar
window.updateMultipleFields(fieldsObj) // Atualiza vários campos de uma vez
window.forceSaveDraft()                // Força salvamento imediato no Supabase
window.formDataState                   // O objeto de estado central (todo o formulário)
window.PROCESS_ID                      // ID do processo atual
window.supabaseClient                  // Cliente Supabase configurado
```

**Dados mock (fallback sem Supabase):** `db.js` contém `window.mockProcesses` com ~20 processos de demonstração. Cada processo tem `form_data._ripsPesquisados` completo para que a Aba 2 funcione em modo offline/demo.

---

## 8. Bugs Resolvidos nesta Sessão (06/07/2026)

### Bug 1: Fundo Amarelo nos Campos Vazios da Aba 2
- **Causa**: Regra CSS `.empty-unlocked { background-color: #fffacd !important; }` existia dentro do `<style>` do `foco-02.html` com `!important`, sobrescrevendo qualquer CSS via JavaScript
- **Solução**: Removida a regra do HTML. O sistema agora usa apenas `.custom-empty-select` com `background: white; border: 2px solid #0056b3`

### Bug 2: Aba 2 não carregava os RIPs gravados na Aba 1
- **Causa raiz**: `foco-01.js` salvava RIPs em `window.ripsPendentes[]` (variável local no iframe), mas **nunca chamava `window.parent.updateField('rips', ...)`**. Ao navegar para Aba 2 (novo iframe), a memória local da Aba 1 era destruída.
- **Solução 1** (`foco-01.js`): Ao adicionar um RIP, agora chama imediatamente `window.parent.updateField('rips', window.ripsPendentes)`
- **Solução 2** (`sync.js`): Adicionado fallback em `restoreFoco02DynamicBlocks()`: se `_ripsPesquisados` estiver vazio, tenta reconstruir a partir do campo `rips` (array de strings)

### Bug 3: Erros de sintaxe em `foco-02.js`
- **Causa**: Múltiplas sessões de patch acumularam blocos de código duplicados (dois `return` e dois `}` extras dentro de `buildField()`)
- **Solução**: Removidos os blocos duplicados. Arquivo validado com `node -c foco-02.js` (OK)

### Bug 4: Campos preenchidos do banco aparecendo como editáveis
- **Causa**: `readonlyAttr` não estava sendo aplicada corretamente nos `<select>` (`readonly` não funciona em select — é necessário usar `disabled`)
- **Solução**: `<select>` usa `disabled` quando preenchido do banco. CSS garante aparência de somente-leitura.

---

## 9. Arquivos Principais e suas Responsabilidades

| Arquivo | Tamanho | Papel |
|---|---|---|
| `processo.html` | 2 KB | Ponto de entrada. Contém apenas o iframe e os botões de navegação |
| `index.js` | 3.7 KB | Gerencia clique nos botões de aba e carrega o HTML correto no iframe |
| `db.js` | 60 KB | Estado global, Supabase, mock data (~20 processos), `updateField()` |
| `sync.js` | 26 KB | Sincronizador universal: overlay, populate, sweep, restore |
| `foco-01.html` | 26 KB | Aba 1: Identificação do Requerimento |
| `foco-01.js` | 22 KB | Lógica da Aba 1: modal de RIP, cadastro mínimo, submit |
| `foco-02.html` | 21 KB | Aba 2: Caracterização do Imóvel (estrutura estática) |
| `foco-02.js` | 67 KB | Lógica da Aba 2: `criarBlocoImovel`, `buildField`, `adicionarTagRIP` |
| `styles-forms.css` | 30 KB | CSS global de todos os formulários |
| `formulario.js` | 34 KB | Máscaras de input, validações genéricas, utilitários |
| `hints.js` / `hints.css` | ~8 KB | Sistema de dicas contextuais nos campos |

---

## 10. Pendências e Próximos Passos

1. **Confirmar o fluxo corrigido**: Aba 1 → adicionar RIP → navegar para Aba 2 → confirmar que o bloco carrega
2. **Remover alertas de diagnóstico temporários** de `sync.js` e `foco-02.js` (adicionados para debug, ainda ativos)
3. **Processos antigos** (salvos antes do fix de 06/07/2026): O campo `rips` pode estar vazio. Pode ser necessário re-adicionar o RIP na Aba 1 para persistir no banco
4. **Validar `buildField` com dados reais do Supabase**: Confirmar que campos com dados do Datalake aparecem como `readonly` (cinza) e campos sem dados aparecem como editáveis (branco + borda azul)
5. **Limpeza da raiz do projeto**: Dezenas de arquivos `fix*.js`, `fix*.py`, `patch*.js` na raiz são scripts temporários — mover para `/scripts/` ou deletar após validação

---

## 11. Como Reproduzir / Testar Localmente

1. Abrir `processo.html` no navegador (ou via Live Server no VS Code)
2. O sistema tentará conectar ao Supabase. Se não houver chave configurada, usará os **dados mock** de `db.js` automaticamente
3. Para testar com dados reais: configurar `SUPABASE_URL` e `SUPABASE_ANON_KEY` em `db.js` (linhas ~1-20)
4. Selecionar um processo na tela inicial (`index.html`) e clicar em "Abrir Processo"
5. Navegar pelas abas usando os botões circulares no topo

> **Dica**: Usar **janela anônima** do navegador para evitar problemas de cache JavaScript entre sessões de desenvolvimento.

---

## 12. Convenções do Projeto

- **Cache busting**: Scripts são carregados com `?v=TIMESTAMP`. Incrementar o número ao fazer alterações. Ex: `<script src="foco-02.js?v=9999992">`
- **Scripts de patch**: A convenção do projeto usa scripts Python/JS temporários em `/scripts/` para patches automatizados. Não são parte do sistema, são ferramentas de desenvolvimento
- **Documentação**: Todo registro importante vai em `/docs/historico/` com o padrão `<nome>_<YYYYMMDD_HHmm>.md`
- **Encoding**: Todos os arquivos são UTF-8. Cuidado ao usar PowerShell para ler/gravar (prefira Python com `encoding='utf-8'`)
- **Validação de sintaxe JS**: Usar `node -c <arquivo>.js` antes de testar no browser
