# Documentação do Projeto FOCO/SPU

## 1. Visão Geral
O **FOCO (Ferramenta de Orientação e Consolidação de Objetos)** é um sistema de workflow linear e hierárquico projetado para gerenciar o processo de destinação de imóveis da União (SPU). O sistema opera hoje como um protótipo funcional/maquete focado na coleta e validação sequencial de dados. 

Ele é dividido em duas fases principais:
1. **Fase de Instrução (Etapas 1 a 6):** Coleta de dados técnicos, jurídicos e geográficos. Essa fase envolve o preenchimento de formulários e painéis iterativos.
2. **Fase de Deliberação (Etapa 7):** Fluxo de manifestações e aprovações sequenciais entre instâncias regionais e centrais.

---

## 2. Estrutura do Fluxo de Trabalho e Aprovações

O sistema utiliza um modelo de "Vistas" baseado em perfis, que segue uma hierarquia obrigatória. Um perfil superior só pode se manifestar após a conclusão das etapas pelos perfis subordinados (Navegação Restrita / Histórico Acumulado).

### Ordem Hierárquica:
1. **Equipe SPU/UF:** Analista responsável pela instrução inicial.
2. **Chefia SPU/UF:** Chefe imediato que valida a instrução.
3. **Coordenação SPU/UF:** Validação regional.
4. **Superintendência:** Decisão final no âmbito da UF.
5. **Equipe C.G.:** Análise técnica na Unidade Central (Brasília).
6. **Coordenação-Geral:** Ratificação técnica central.
7. **Diretoria:** Homologação para pauta.
8. **CDE (Comissão de Destinações Especiais):** Órgão colegiado de deliberação.
9. **Secretária / Ministra:** Autoridade superior para assinatura final.

### Captura de Dados na Manifestação:
- **Decisão:** Opções via `radio buttons` (ex: Favorável, Necessita Complementação, Incompatível).
- **Observações:** Campo de texto livre para pareceres detalhados.
- **Assinatura Digital:** Ato administrativo com carimbo de tempo e ID de autenticidade único.

---

## 3. Regras de Negócios e Status do Processo

A máquina de estados do processo no FOCO reflete a situação do requerimento, com os seguintes status:

1. **Aguardando análise de admissibilidade:** O processo ainda não foi manipulado pelo técnico na SPU/UF. *(Cor no layout: azul claro)*.
2. **Em análise de admissibilidade:** O perfil "Equipe Técnica SPU/UF" salvou a primeira etapa (Aba 1). *(Cor no layout: verde claro)*.
3. **Devolvido para complementação:** Quando qualquer perfil devolve o processo para uma instância inferior. *(Cor no layout: vermelho vivo)*.
4. **Admissibilidade confirmada:** O perfil "CDE" aprovou o requerimento com ou sem ressalvas. *(Cor no layout: verde vivo)*.

### Ordenação no Painel:
- **Prioridade 1:** Processos "Devolvido para complementação" aparecem no topo.
- **Prioridade 2:** Ordenação cronológica pela data do requerimento (mais antigos antes dos mais recentes).

---

## 4. Arquitetura da Interface (Maquete Estática Inteligente)

A arquitetura do frontend é construída com arquivos estáticos inteligentes (HTML, CSS e JS puros), utilizando estratégias locais como o `localStorage` para persistir dados na sessão antes da integração com o backend.

### Templates de Resumo (`*-resumo.html`)
Cada perfil tem seu arquivo físico de resumo, o que permite:
- **Customização Individual:** Relatórios formatados adequadamente para o cargo (ex: Formato de Ata para CDE, e Parecer Técnico para a Equipe Técnica).
- **Injeção Dinâmica:** O arquivo é estático, mas contém JavaScript que resgata os dados preenchidos no formulário principal e popula as exibições.

### Estrutura Visual do Relatório
- Largura ocupando 75% da tela.
- **Box Manifestação:** O texto legal da declaração e a decisão.
- **Trilha de Auditoria:** Bloco de rodapé informando Responsável, Cargo, Status, Data/Hora e ID de Autenticidade (Hash simulado ou SHA-256 no futuro).

### Tela de Aprovação (`manifestacao.html`)
A interface divide-se em:
- **Sidebar Esquerda:** Contém o histórico empilhado (para acesso rápido a PDFs e resumos de instâncias anteriores) e o seletor de perfil.
- **Workspace (Centro-Direita):** Carrega os formulários ativos ou resumos via `iframe`.

---

## 5. Estrutura de Arquivos do Projeto

A estrutura reflete a segmentação de responsabilidades (focos) e as páginas de resumo:

- **Etapas (Foco 1 ao 10):** Arquivos como `foco-01.html` a `foco-10.html` com seus respectivos `.js`.
- **Manifestações de Perfis:** 
  - `manifestacao-uf-tecnica.html`
  - `manifestacao-uf-chefia.html`
  - `manifestacao-uf-coord.html`
  - `manifestacao-uf-super.html`
  - `manifestacao-uc-tecnica.html`, etc.
- **Resumos:** `*-resumo.html` correspondente a cada um dos perfis, para a injeção do relatório.
- **Estilização e Core UI:**
  - `index.css`, `dashboard.css`, `styles-forms.css`, `manifestacao-styles.css`
  - `hints.css` / `custom-select.css`
- **Lógica Centralizada:**
  - `db.js` (Simulação de banco de dados e métodos de Storage)
  - `formulario.js` (Tratamento dos campos e preenchimento)
  - `sync.js` (Controle de sincronização de estado entre abas e dados locais)

---

## 6. Arquitetura Cloud & Sincronização (Supabase, GitHub & Vercel)

O protótipo evoluiu de uma solução puramente local baseada em `localStorage` para uma arquitetura cloud totalmente funcional e integrada:

### Banco de Dados (Supabase)
* **SDK:** Consumido diretamente via CDN nas interfaces principais (`index.html`, `processo.html`).
* **Conexão Centralizada (`db.js`):** Inicializa o cliente do Supabase (`window.supabaseClient`) de forma transparente se as credenciais estiverem disponíveis.
* **Persistência de Estados:**
  * **Rascunhos (`foco_drafts`):** Armazena o estado completo de cada formulário das Etapas 1 a 6 (`saveDraftStateToSupabase`, `loadDraftStateFromSupabase`).
  * **Relatórios (`foco_reports`):** Salva e recupera as manifestações e assinaturas digitais por perfil (`savePerfilRelatorioToSupabase`, `loadPerfilRelatorioFromSupabase`).
* **Seeding (`scripts/seed.js`):** Script utilitário que popula o banco com 20 processos simulados diretamente via REST API do Supabase.

### Sincronização e Deploy Contínuo (Vercel + GitHub)
* **Hospedagem:** O frontend estático inteligente está hospedado na Vercel (URL de produção: `https://vercel.com/luiz-nogaroli/sistema`).
* **Sincronização Contínua:** Integrado diretamente com o repositório do GitHub. Qualquer alteração ou atualização nos arquivos enviados para o GitHub dispara um build automático e atualização (deploy) imediata na Vercel.
* **Comunicação Segura:** As requisições são efetuadas pelo navegador do usuário direto para a API REST do Supabase, aproveitando a arquitetura serverless.

---

## 7. Próximos Passos e Evolução

Com a persistência em nuvem (Supabase) concluída, os próximos passos focam na segurança e consolidação das regras de negócio:

1. **Substituição de IDs temporários:** Trocar hashes randomizados por hashes SHA-256 baseados em conteúdo oficial assinado.
2. **Lock / Imutabilidade:** Ao concluir uma etapa ou manifestação, travar os dados correspondentes em modo `read-only`, impedindo alterações retroativas.
3. **Autenticação SSO / Controle de Acesso:** Vincular a visualização de abas e permissões de manifestação à autenticação real do usuário (por exemplo, via Governo Federal / Gov.br ou login do órgão).
4. **Integração de Geração de PDFs:** Implementar ferramentas como `jsPDF` ou `Puppeteer` para renderizar as páginas de resumo (`*-resumo.html`) em relatórios oficiais assinados para download ou envio ao SEI.
