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
- **`foco-01.html`, `foco-02.html`, etc.**: Arquivos isolados para cada aba/etapa do processo de Admissibilidade (Caracterização, Destinação, Deliberação, etc).

*Regra de Sustentação: Alterações de layout, criação de novos campos visuais ou botões que afetam apenas uma etapa devem ser feitos exclusivamente no HTML correspondente.*

### B. Lógicas Específicas de Tela (JavaScript)
- **`foco-01.js`, `foco-02.js`, etc.**: Cada tela possui um script espelho contendo a inteligência específica daquela etapa. Exemplo: regras de exibição condicional (esconder campo X se checkbox Y for marcado) ficam no arquivo JS da própria aba.

*Regra de Sustentação: O comportamento de um formulário ou campo de uma tela específica NUNCA deve ser inserido em outro arquivo.*

### C. Motores Centrais e Serviços (Core)
Estes arquivos são a espinha dorsal do sistema. Eles expõem funções genéricas consumidas por todas as telas. Alterações aqui impactam o projeto globalmente.

- **`db.js`**: O orquestrador de dados. Único arquivo responsável por ler, gravar e guardar as configurações do banco de dados (acesso via Supabase, leitura das tabelas `portal_servicos` e `foco_drafts`). É a única fonte da verdade dos dados em trânsito.
- **`sync.js`**: O motor de preenchimento (Hydration). Responsável por pegar os dados fornecidos pelo `db.js` e injetá-los nos campos do HTML (inputs, checkboxes, selects). Também monitora a digitação do usuário e "recolhe" os dados alterados da tela para devolver ao banco.
- **`unify-buttons.js`**: Centralizador das ações de avanço de fluxo. Controla o que acontece quando os botões genéricos de "Avançar", "Voltar" ou "Salvar" são clicados.

---

## 3. Guia Rápido de Sustentação e Manutenção

Para a equipe técnica que for assumir modificações futuras, guie-se por estas perguntas:

- **"Preciso mudar um texto ou campo no formulário X?"**
  → Altere apenas o arquivo `[tela].html`.
- **"Preciso mudar o comportamento ou a máscara de um campo na aba Y?"**
  → Altere apenas o arquivo `[tela].js`.
- **"O sistema precisa se conectar a uma tabela nova do Supabase ou mudar de banco."**
  → Altere apenas o `db.js`.
- **"O botão de Avançar precisa verificar uma nova condição antes de pular de aba."**
  → Altere o `unify-buttons.js` (se for global) ou interceptador na lógica da tela.
- **"Os dados vindos do banco não estão preenchendo um tipo novo de campo (ex: campo de arquivo longo)."**
  → Altere a mecânica principal no `sync.js`.
