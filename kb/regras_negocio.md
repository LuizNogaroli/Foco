# Regras de Negócio - Projeto Admissibilidade Foco-09

**Última Atualização:** 26/06/2026

Este documento centraliza as principais regras de negócio aplicadas ao ciclo de vida dos processos e fluxos do sistema.

---

## 1. Status do Processo (status_processo / status)
O campo status define a situação global (macro) do requerimento em termos de andamento de sua análise.

| Status | Gatilho / Momento de Mudança | Descrição |
|--------|------------------------------|-----------|
| **Aguardando análise** | Carregamento inicial via Portal de Serviços | O processo entrou na fila do painel principal, mas nenhum técnico abriu ainda. |
| **Em análise** | Clique na lupa (Abrir Processo) no painel principal | O usuário acessou o processo. Indica que a avaliação de admissibilidade iniciou. Permanece neste status durante as Abas 1, 2, 3 etc., enquanto a SPU/UF atuar. |
| **Em deliberação** | Conclusão das etapas da SPU/UF (ex: envio para CDE) | O processo terminou a fase de avaliação técnica e subiu para os diretores/comitê deliberarem. |
| **Viabilidade Aprovada** | Deliberação final favorável | A admissibilidade foi aprovada com sucesso. |
| **Devolvido para complementação** | Deliberação com ressalvas ou rejeição parcial | O processo retornou para etapas anteriores (ex: devolvido à SPU/UF) para correção ou adição de dados. |
| **Cancelado** | Acionado por usuário com privilégio de cancelamento | O processo foi abortado definitivamente em qualquer etapa do fluxo. |

---

## 2. Status do Fluxo (status_flow)
O campo status_flow indica a **posse física** do processo, ou seja, com quem está a responsabilidade no momento (Checkpoint).

| Status Flow | Gatilho / Momento de Mudança |
|-------------|------------------------------|
| **SPU/UF relacionada** (Ex: SPU/PR) | Carregamento inicial (origem Portal de Serviços). A posse inicial cai no painel da superintendência regional correspondente. |
| **SPU/UF relacionada - Caracterização** | Ocorre no evento **Salvar e Avançar** da **Aba 1**. Indica que o técnico concluiu a caracterização do imóvel. |
| **SPU/UF relacionada - Destinação** | Ocorre no evento **Salvar e Avançar** da **Aba 2**. Indica que o técnico concluiu as premissas de destinação. |
| **SPU/UF relacionada - Superintendência** | Ocorre no evento **Salvar e Avançar** da **Aba 3**. Indica que o processo seguiu para aprovação do superintendente. |

*(Outros status como CDE, Direção, etc., serão mapeados conforme a implementação avance).*

---
## Notas Arquiteturais
* Para facilitar a sustentação, a inteligência de sufixos ( - Caracterização,  - Destinação, etc.) fica centralizada no motor sync.js, que intercepta a URL da aba em que o usuário está, concatena ao prefixo SPU/{uf} e dispara a atualização automaticamente, preservando as abas de possuírem lógica pesada.
