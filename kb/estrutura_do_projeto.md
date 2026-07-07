# Estrutura Modular do Projeto (Admissibilidade Foco-09)

Este documento descreve a arquitetura modular e o princípio de Separação de Responsabilidades (Separation of Concerns) adotados na construção do sistema. O objetivo dessa estrutura é garantir que o projeto seja de fácil manutenção, escalável e seguro para futuras alterações (sustentação).

---

## 1. Princípio Base

O sistema foi arquitetado de forma descentralizada para a interface (telas), mas centralizada para as regras de negócio de baixo nível (banco de dados, fluxos de dados). Isso significa que:
- **Telas e Lógicas Visuais** não se misturam. Cada etapa ou painel tem seu próprio ecossistema.
- **Mecanismos Universais** (Salvar, Carregar, Conectar ao Banco) são motores isolados. Nenhum arquivo de tela deve tentar conectar-se ao banco de dados diretamente; eles apenas invocam as funções do motor central.

Essa decisão impede que a alteração em uma etapa do fluxo quebre outra etapa acidentalmente, além de evitar o chamado "código espaguete".

---

## 2. Mapa da Estrutura

### A. Telas Independentes (HTML)
- **`index.html`**: Painel Gerencial de Requerimentos (tabela principal de processos).
- **`painel-estrategico.html`**: Painel Estratégico (indicadores e métricas globais de gestão).
- **`foco-01.html`**: Indicação do Imóvel (RIPs, requerente, conceituação).
- **`foco-02.html`**: Caracterização (dados do imóvel, ocupação, avaliação, geolocalização).
- **`foco-03.html`**: Destinação (ações judiciais, procedimento, uso, impactos, regime).
- **`foco-04.html` a `foco-10.html`**: Demais etapas do fluxo.
- **`processo.html`**: Container principal que carrega as abas via iframe.

*Regra de Sustentação: Alterações de layout, criação de novos campos visuais ou botões que afetam apenas uma etapa devem ser feitos exclusivamente no HTML correspondente.*

### B. Lógicas Específicas de Tela (JavaScript)
- **`foco-01.js`**: Lógica da Aba 1 (validação de RIP contra `tabela_spu`, inserção de RIPs).
- **`foco-02.js`**: Lógica da Aba 2 (carregamento de dados do imóvel, campos readonly/editáveis).
- **`foco-03.js`** (se existir): Lógica da Aba 3.
- **`foco-04.js` a `foco-10.js`**: Scripts correspondentes a cada aba.

*Regra de Sustentação: O comportamento de um formulário ou campo de uma tela específica NUNCA deve ser inserido em outro arquivo.*

### C. Motores Centrais e Serviços (Core)
Estes arquivos são a espinha dorsal do sistema. Eles expõem funções genéricas consumidas por todas as telas. Alterações aqui impactam o projeto globalmente.

- **`db.js`**: O orquestrador de dados. Único arquivo responsável por ler, gravar e guardar as configurações do banco de dados (acesso via Supabase). Funções principais:
  - `forceSaveDraft()`: Salva dados na `tabela_foco`.
  - `saveToFinal()`: Salva dados na `foco_final` (Aba 3).
  - `updateStatusFluxo(processId, checkpoint, status)`: Atualiza `tabela_status_fluxo`.
  - `updateField(name, value)`: Atualiza campo no estado central.
  - `supabaseClient`: Cliente Supabase inicializado.
- **`sync.js`**: O motor de sincronização entre iframe e parent. Responsável por:
  - Capturar `input`/`change` em todos os campos e salvar via `updateField()`.
  - No `submit`: varrer todos os campos, chamar `forceSaveDraft()`, `saveToFinal()` (Aba 3), `updateStatusFluxo()` (Aba 3), e navegar para próxima aba.
- **`formulario.js`**: Tratamento de upload de arquivos (`handleFileUpload`, `triggerUpload`, `visualizarDoc`, `removerDoc`, `updateDocUI`).
- **`scripts/fetch_spu.js`**: Busca dados da `tabela_spu` por RIP.
- **`scripts/fetch_acoes.js`**: Busca dados da `tabela_acoes` por RIP (via `tabela_indicacao`).
- **`hints.js`**: Sistema de dicas/hints nos campos.
- **`custom-select.js`**: Customização de selects.

### D. Scripts de Seed e Migração
- **`seed_tabela_spu.js`**: Popula `tabela_spu` com RIPs de teste.
- **`create_tabela_acoes.sql`**: Cria `tabela_acoes` com dados de teste.
- **`create_tabela_indicacao.sql`**: Cria `tabela_indicacao`.
- **`scripts/seed_indicacao.js`**: Popula `tabela_indicacao`.

---

## 3. Fluxo de Dados

### Inserção de RIP (Aba 1)
1. Usuário clica em "+ Inserir RIP"
2. Modal abre com campo de texto
3. Ao clicar "Inserir" ou "Mais", o RIP é validado contra `tabela_spu`
4. Se não encontrado: erro "RIP não encontrado na tabela_spu!"
5. Se encontrado: adicionado à lista `ripsPendentes`
6. Ao avançar: `ripsPendentes` salvo em `formDataState.rips`

### Carregamento de Dados (Aba 2)
1. Ao carregar a página, busca RIPs de `formDataState.rips`
2. Para cada RIP, chama `fetchSPU(rip)` → consulta `tabela_spu`
3. Campos com dados → readonly (fundo cinza, cadeado)
4. Campos vazios → editáveis (fundo branco)

### Ações Judiciais (Aba 3)
1. Ao carregar, lê `CURRENT_PROCESS_ID` do localStorage
2. Busca RIP via `tabela_indicacao` (se não encontrar, usa processId como RIP)
3. Consulta `tabela_acoes` pelo RIP
4. Preenche campos: NUP SEI, Tipo de Processo, Resumo, Descrição

### Salvamento (qualquer aba)
1. Cada campo com `name` é monitorado por `sync.js`
2. Ao digitar/selecionar: `saveField()` → `updateField()` → `formDataState`
3. Ao submeter: varredura completa + `forceSaveDraft()` → `tabela_foco`
4. Aba 3 adicionalmente: `saveToFinal()` → `foco_final` + `updateStatusFluxo()`

---

## 4. Guia Rápido de Sustentação

Para a equipe técnica que for assumir modificações futuras, guie-se por estas perguntas:

- **"Preciso mudar um texto ou campo no formulário X?"**
  → Altere apenas o arquivo `[tela].html`.
- **"Preciso mudar o comportamento ou a máscara de um campo na aba Y?"**
  → Altere apenas o arquivo `[tela].js`.
- **"O sistema precisa se conectar a uma tabela nova do Supabase ou mudar de banco."**
  → Altere apenas o `db.js`.
- **"O botão de Avançar precisa verificar uma nova condição antes de pular de aba."**
  → Altere o `sync.js` (função de submit).
- **"Preciso adicionar um campo de upload de arquivo."**
  → Siga o padrão de `formulario.js` (hidden input + file input + buttons).
- **"Preciso fazer um campo aparecer quando selecionar Sim."**
  → Adicione `onclick="document.getElementById('bloco').style.display='block'"` no radio Sim, e `display='none'` no Não.
