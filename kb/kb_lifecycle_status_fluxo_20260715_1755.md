# Documentação Técnica: Gestão de Ciclo de Vida e Fluxo de Status (Workflow)
**Data:** 15/07/2026
**Assunto:** Problemas de Estado de Fluxo (Status do Painel), Caches em Iframes e Hardcoding de Workflow.

---

## 1. Divergência entre "Salvar Rascunho" vs. "Avanço de Workflow"

### 1.1 Contexto e Problema
A arquitetura do sistema divide cada etapa do processo em "Abas" independentes (ex: Aba 1 - Indicação, Aba 2 - Caracterização), embutidas como iframes. O Painel Gerencial acompanha o andamento lendo o último registro na `tabela_status_fluxo`.
Originalmente, a chamada da API que atualiza a `tabela_status_fluxo` (`window.parent.updateStatusFluxo`) ocorria assim que o usuário disparava o evento `Salvar Formulário` (ex: `submitAba1()`). 
Isso causava um **adiantamento incorreto do workflow**: se o técnico salvasse um rascunho de seu trabalho sem ter terminado, o sistema já reportava ao Painel que o processo estava na próxima fase ("Em Análise - Caracterização"), criando inconsistência.

### 1.2 Solução Arquitetural
Foi adotado o **desacoplamento** entre a persistência de dados (Draft/Snapshot) e a transição de máquina de estados (Workflow).
1. A função de *submit* (Salvar Formulário) agora apenas varre os inputs e salva o JSON em `tabela_foco` e cria versões em `tabela_versoes_formulario`, mas omite completamente a atualização da `tabela_status_fluxo`.
2. A atualização de status (Workflow) foi encapsulada nos *listeners* dos botões explícitos de submissão da fase (ex: `btnEnviarCaracterizacao`), sendo executada de forma atômica instantes antes de o iframe redirecionar o usuário para a aba subsequente via `btnTabNext.click()`.
**Lição aprendida:** Hooks de ciclo de vida (status_geral) devem sempre ser ancorados à intenção de avanço definitivo do usuário, e não às ações de auto-save ou persistência parcial.

---

## 2. Race Conditions Visuais por Cache de Navegador em Arquitetura Iframe

### 2.1 Contexto e Problema
O sistema injeta arquivos `.js` que rodam localmente dentro dos iframes (ex: `foco-01.html` carregando `foco-01.js`), mas que interagem ativamente com a API carregada no documento pai (`window.parent.supabaseClient`, `window.parent.updateStatusFluxo`).
Durante manutenções iterativas, após transferirmos lógicas críticas para novos listeners de botões (como a correção acima), verificou-se que a aplicação se mantinha agindo com a lógica defasada, falhando em atualizar o banco.
Isso ocorria pois o documento HTML principal injetava o script estático.

### 2.2 Solução Adotada
Implementou-se a disciplina estrita de **Cache Busting Paramétrico**. Todas as inclusões de script que interagem com fluxos transicionais devem possuir sufixos de versionamento manuais (`?v=XXXXX_YY`).
Qualquer refatoração em regras de negócio hospedadas nos arquivos de script de Iframe exige obrigatoriamente a atualização (`bump`) do versionador em seu respectivo `.html`. Sem isso, o evento não é refixado no DOM recarregado, pois o navegador prioriza o cache por se tratar de um arquivo acessado em série por múltiplas abas.

---

## 3. Sobrescrita de Status do Workflow por Hardcoding Global

### 3.1 Contexto e Problema
A Aba 3 (Destinação) possui uma mecânica condicional complexa (Aprovar, Devolver p/ Aba 2, Devolver p/ Aba 1).
Foi notado que ao submeter uma aprovação para a Chefia (Aba 3 -> Painel), o sistema rotulava erroneamente o processo com o status genérico `Em análise`, desrespeitando o fluxo esperado `Aguardando Aprovação (Chefia)`.
Na investigação, localizou-se um bloco hardcoded no manipulador de envio da Aba 3 (`foco-03.html`), que sobrescrevia a variável de transição de forma genérica para o fluxo positivo ("aprovar").

### 3.2 Solução Adotada
A lógica condicional de aprovação em `foco-03.html` foi refatorada. Em vez de uma atribuição hardcoded (que anulava eventuais retornos flexíveis ou dinâmicos do banco), a regra "Aprovar e Concluir Processo" recebeu a string de estado idêntica à esperada pelo dicionário do Painel Gerencial (SLA map em `painel-gerencial.js`).
**Lição aprendida:** Deve-se estabelecer um dicionário único de nomenclaturas de Workflow (enums/constants), para evitar divergência de nomenclaturas de status entre o arquivo inserindo o dado (frontend do iframe) e o arquivo que consome o dado (Painel Gerencial).
