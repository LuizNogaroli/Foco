# Manifesto Técnico: Sistema FOCO/SPU
## Protótipo Funcional e Guia de Implementação Dinâmica

Este documento descreve a arquitetura, as regras de negócio e o fluxo de trabalho do Sistema FOCO/SPU, servindo como base para a evolução da maquete estática atual para uma versão plenamente funcional com banco de dados.

---

## 1. Visão Geral
O FOCO (Ferramenta de Orientação e Consolidação de Objetos) é um sistema de workflow linear e hierárquico projetado para gerenciar o processo de destinação de imóveis da União. O sistema é dividido em duas fases principais:
1.  **Fase de Instrução (Etapas 1 a 6):** Coleta de dados técnicos, jurídicos e geográficos.
2.  **Fase de Deliberação (Etapa 7):** Fluxo de manifestações e aprovações sequenciais entre instâncias regionais e centrais.

---

## 2. Processo de Manifestação por Perfil
Na Etapa 7 (`manifestacao.html`), o sistema opera em um modelo de "Vistas" baseado em perfis. Cada perfil possui uma tela específica de decisão (`manifestacao-perfil.html`).

### 2.1. Perfis e Hierarquia
O fluxo segue a ordem obrigatória:
1.  **Equipe SPU/UF:** Analista responsável pela instrução inicial.
2.  **Chefia SPU/UF:** Chefe imediato que valida a instrução.
3.  **Coordenação SPU/UF:** Validação regional.
4.  **Superintendência:** Decisão final no âmbito da UF.
5.  **Equipe C.G.:** Análise técnica na Unidade Central (Brasília).
6.  **Coordenação-Geral:** Ratificação técnica central.
7.  **Diretoria:** Homologação para pauta.
8.  **CDE - Comissão de Destinações Especiais:** Órgão colegiado de deliberação.
9.  **Secretária / Ministra:** Autoridade superior para assinatura final.

### 2.2. Captura de Dados
Cada formulário de manifestação deve capturar:
*   **Decisão (Manifestação):** Seleção de opções via `radio buttons` (ex: Favorável, Necessita Complementação, Incompatível).
*   **Observações:** Campo de texto livre (`textarea`) para pareceres detalhados.
*   **Assinatura Digital:** Simulação de ato administrativo que gera um carimbo de tempo (timestamp) e um ID de autenticidade único.

---

## 3. Geração e Personalização de Resumos
O sistema utiliza um modelo de **Templates Estáticos Inteligentes**.

### 3.1. Arquivos de Resumo (`*-resumo.html`)
Cada perfil possui seu próprio arquivo físico de resumo. Isso permite:
*   **Customização Individual:** Cada instância pode ter um layout de relatório diferente (ex: a CDE precisa de um formato de Ata, enquanto a Equipe Técnica precisa de um Parecer).
*   **Injeção Dinâmica:** Embora o arquivo seja estático, ele contém um script que busca os dados preenchidos no formulário (armazenados em `localStorage` ou banco de dados) e os exibe nos boxes correspondentes.

### 3.2. Estrutura Padrão do Relatório
*   **Largura:** 75% da tela, centralizado.
*   **Cabeçalho:** Identificação "Relatório - [Nome do Perfil]".
*   **Box Manifestação:** Título da decisão e texto legal da declaração em largura total.
*   **Box Observações:** Conteúdo digitado pelo usuário, em largura total.
*   **Trilha de Auditoria:** Bloco no rodapé com Responsável, Cargo, Status, Data/Hora e ID de Autenticidade.

---

## 4. Esquema de Aprovação (Workflow)
O sistema implementa uma lógica de **Histórico Acumulado**:

1.  **Navegação Restrita:** Um perfil superior só pode se manifestar se os perfis subordinados já tiverem concluído suas etapas.
2.  **Histórico Visível:** Na tela de aprovação, a coluna da esquerda ("Histórico de Aprovações") constrói uma pilha de botões. Ao selecionar "Superintendência", o usuário vê os botões para abrir os relatórios da "Equipe SPU/UF", "Chefia" e "Coordenação".
3.  **Persistência:** Em uma versão com banco de dados, o `status` de cada manifestação deve ser bloqueado (`read-only`) após a assinatura, impedindo alterações retroativas sem um processo de "reabertura" formal.

---

## 5. Layout da Tela de Aprovações (`manifestacao.html`)
A interface é dividida em duas colunas principais para maximizar a produtividade:

*   **Lado Esquerdo (Sidebar - 380px):**
    *   **Topo:** Lista vertical de botões do histórico (acesso rápido aos PDFs/Resumos anteriores).
    *   **Base:** Box informativo animado ("sutil-bounce") e Seletor de Perfil.
*   **Lado Direito (Workspace - Flexível):**
    *   Exibição do formulário ativo ou do resumo selecionado via `iframe`.
*   **Navegação de Retorno:** Botão verde no menu superior global ("✏️ Visão da edição dos formulários") que permite resetar a visão para o modo de preenchimento das Etapas 1 a 6.

---

## 6. Recomendações para a Versão 2.0 (Database)
1.  **IDs Únicos:** Substituir os IDs de autenticidade randômicos por hashes SHA-256 baseados no conteúdo do documento.
2.  **JSON Storage:** Salvar as respostas das etapas 1-6 e as manifestações em um objeto JSON único por processo SEI.
3.  **Controle de Acesso:** Vincular o "Seletor de Perfil" ao login do sistema (SSO), para que o usuário veja apenas a tela correspondente ao seu cargo real.
4.  **Geração de PDF:** Utilizar bibliotecas como `Puppeteer` ou `jsPDF` para converter os arquivos de resumo estáticos em documentos PDF oficiais com papel timbrado.
