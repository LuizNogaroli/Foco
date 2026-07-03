# Arquitetura de Banco de Dados: Módulo de Admissibilidade (Foco-10)

Este documento registra o alinhamento da arquitetura de dados e do relacionamento entre as três principais camadas lógicas do sistema. Esta estrutura garante a preservação dos dados oficiais enquanto permite a flexibilidade necessária para auditoria e preenchimento de formulários de admissibilidade.

## 1. Tabela "Portal de Serviços" (A Origem da Demanda)
- **O que é:** Simula o sistema de origem (Portal gov.br / Requerimento do cidadão), de onde a demanda de atendimento nasce.
- **Chave Primária (PK):** `Número do Requerimento` (no código, tratado como `PROCESS_ID`).
- **Função e Ciclo de Vida:**
  - Registra a intenção do atendimento.
  - É a âncora de todo o fluxo. Sem um número de requerimento, não há processo.

## 2. Tabela "Requerimento" ou "Tabela JSON" (O Motor do Foco-10)
- **O que é:** Representa a tabela interna (conhecida como `foco_drafts` / `foco_reports` no banco Supabase) responsável por persistir o formulário inteligente em andamento.
- **Chave Primária / Chave Estrangeira:** `Número do Requerimento`. Existe uma relação direta (1-para-1 ou 1-para-N) com o Portal de Serviços.
- **Formato dos Dados:** Coluna do tipo `JSONB` (denominada `form_data`).
- **Função e Ciclo de Vida:**
  - É uma "cesta temporária e flexível".
  - Recebe todas as interações do analista: preenchimento do *Cadastro Mínimo*, flags marcadas nos modais, arquivos anexados (em Base64 ou URLs), e as solicitações de alteração/inclusão de dados ausentes no RIP.
  - **Relatório Final:** Ao concluir a análise, os dados consolidados neste JSONB são transformados em um Relatório Estruturado, que é então disparado/enviado para o **Setor de Cadastro** atuar.

## 3. Tabela "Cadastro" (O Datalake Oficial)
- **O que é:** Simula a base consolidada, imutável (sob a ótica do analista de ponta) e master de imóveis da União (`datalake_spunet`).
- **Chave Primária (PK):** `RIP do Imóvel`.
- **Função e Ciclo de Vida:**
  - Atua de forma estritamente **Somente Leitura (Read-Only)** para a aplicação do formulário.
  - É a "fotografia atual" do terreno. A aplicação pesquisa nela para realizar o autocompletar na tela (Ex: Município, Área da União, etc.).
  - Caso o analista perceba divergências nos dados puxados dessa tabela (ou a ausência deles), a correção **não é feita nela imediatamente**. A correção é anotada e salva na **Tabela Requerimento (JSON)**, compondo a ordem de serviço para a área de cadastro (que detém os privilégios de escrita para atualizar o Datalake).

---

> [!TIP]
> **Por que essa arquitetura é sólida?**
> A separação em três pilares impede a corrupção da base master de imóveis (`Cadastro`) por análises em andamento, mantendo o rastro de auditoria (`Portal`) estritamente ligado às anotações da SPU (`Requerimento/JSONB`), facilitando o roteamento das requisições entre diferentes setores internos.
