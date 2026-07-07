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
5. **Aguardando deliberação SPU/XX:** Quando a Aba 3 é concluída, o status é atualizado para "Aguardando deliberação" + a UF (ex: SPU/PR).

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

## 6. Tabelas Supabase

O sistema utiliza as seguintes tabelas no Supabase:

| Tabela | Uso no Sistema |
|--------|----------------|
| `tabela_foco` | Dados do formulário (rascunho) |
| `foco_final` | Dados definitivos (Aba 3 → saveToFinal) |
| `tabela_spu` | Dados do imóvel (RIPs, campos readonly) |
| `tabela_requerimentos` | Dados do requerimento (Aba 1) |
| `tabela_status_fluxo` | Checkpoint/instância e status geral |
| `tabela_indicacao` | RIPs e cadastros mínimos indicados |
| `tabela_acoes` | Ações judiciais/órgãos de controle |
| `portal_servicos` | Lista de processos do painel |
| `foco_drafts` | Rascunhos antigos |
| `foco_origem` | Dados de origem |
| `foco_reports` | Relatórios consolidados por perfil |
| `datalake_spunet` | Dados do SPUnet (imóvel) |

---

## 7. Campos por Aba

### Aba 1 - Indicação do Imóvel
- Conceituação do imóvel (checkboxes com regras de RIP)
- Cadastro do requerente/interessado
- Natureza jurídica do destinatário (select com optgroups)
- Endereço e localização
- Upload de certidão de matrícula

### Aba 2 - Caracterização
- Dados do imóvel (campos carregados da `tabela_spu`)
- Situação ocupacional
- Benfeitorias
- Avaliação do imóvel
- Geolocalização (Leaflet)
- Upload de certidão de matrícula
- Documentos e links anexados
- Observações da caracterização

### Aba 3 - Destinação
- Ações judiciais (carregadas da `tabela_acoes`)
- Dados de comparação de área e valor
- Custos de manutenção para a SPU
- Outros interessados
- Tipo de procedimento pretendido
- Tipo de uso imobiliário e específico pretendidos
- Modificação do terreno/edificação
- Compatibilidade urbanística
- Vinculação com programas estratégicos
- Vinculação com políticas públicas
- Impacto social esperado
- Número estimado de beneficiários
- Impacto ambiental esperado
- Regime de destinação proposto
- Observações da destinação

---

## 8. Atualizações Recentes

### Jul/2026
- **RIP Validation:** Inserção de RIPs agora valida contra a `tabela_spu`. RIPs não encontrados exibem erro "RIP não encontrado!".
- **Upload de Certidão:** Componente de upload de certidão de matrícula adicionado às Abas 2 e 3.
- **Ações Judiciais:** Campo carrega dados automaticamente da `tabela_acoes` via `fetch_acoes.js`.
- **Status Fluxo:** Ao concluir Aba 3, status é atualizado para "Aguardando deliberação SPU/XX" na `tabela_status_fluxo`.
- **Campos Condicionais:** Múltiplos campos com lógica de show/hide (radio → textarea, checkbox → textarea, select → textarea).
- **Labels Atualizados:** Labels corrigidos em português (acentuação, simplificação).
- **CSS Padronizado:** Seções de observações e documentos usam padrão `form-group editavel`.
- **Documentos por RIP:** Todos os 20 RIPs de teste têm pelo menos 1 documento anexado na `tabela_spu`.

---

## 9. Próximos Passos (Evolução para v2.0 com Database)
1. **Substituição de IDs temporários:** Trocar hashes randomizados por hashes SHA-256 baseados em conteúdo oficial.
2. **Persistência Completa JSON:** Agrupar respostas (Etapas 1-6) e as Manifestações (Etapa 7) em um único payload associado ao número do processo no SEI.
3. **Lock/Imutabilidade:** Ao concluir uma etapa, os dados e formulários devem entrar em modo `read-only`, bloqueando edições retroativas não autorizadas.
4. **Autenticação SSO:** Ligar a visualização das telas ao login real do usuário para que ele só acesse as abas e permissões de sua lotação ou cargo.
5. **Integração de Geração de PDFs:** Usar ferramentas como `jsPDF` ou `Puppeteer` para transformar os resumos em relatórios oficiais de sistema.
