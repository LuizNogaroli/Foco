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

---

## 3. Campos e Regras da Aba 3 — Análise e Proposta de Destinação (foco-03.html)

**Última Atualização:** 03/07/2026

### 3.1 Análise do Destinatário

| Campo | Tipo | Regra Condicional |
|-------|------|-------------------|
| CPF/CNPJ regular? | Radio (Sim / Não / Não se aplica) | — |
| Natureza Jurídica do Destinatário | Select | — |
| Requerente/interessado possui destinação ativa? | Radio (Sim / Não) | **Sim** → abre campo "Contratos relacionados à destinação ativa" (textarea) |
| Pendências contratuais | Multi-checkbox (6 opções) | Marcar "Nenhuma identificada" desmarca todas as outras; marcar qualquer outra desmarca "Nenhuma identificada" |
| Observações complementares (pendências) | Textarea | Sempre visível abaixo dos checkboxes |

**Opções de pendências contratuais:**
- Nenhuma identificada
- Inadimplência financeira
- Pendências contratuais
- Irregularidade cadastral
- Uso em desacordo com o autorizado
- Outras

### 3.2 Proposta de Destinação e Impactos

| Campo | Tipo | Regra Condicional |
|-------|------|-------------------|
| Tipo de procedimento pretendido | Select | Qualquer opção selecionada → abre campo "Informações complementares" (textarea) |
| Tipo de uso imobiliário pretendido | Select | Define dinamicamente as opções do campo "Tipo de uso específico pretendido" através do dicionário `usoEspecificoMap` no JS. |
| Tipo de uso específico pretendido | Select | Opções variam de acordo com o uso imobiliário selecionado. |
| Há previsão de modificação do terreno... | Radio (Sim / Não / Sem informação) | **Sim** → abre campo "Descrição da modificação prevista" (textarea) |
| Compatibilidade urbanística | Select | Opções variam do grau de compatibilidade (Compatível, Incompatível, etc). |
| Há vinculação com Programas/Estratégias de governo? | Radio (Sim / Não / Sem informação) | **Sim** → abre checkboxes de Programas (Minha Casa Minha Vida, REURB, etc.) e um campo de "Observações complementares". |
| Há vinculação com Políticas Públicas? | Radio (Sim / Não / Sem informação) | **Sim** → abre checkboxes de Políticas Nacionais e um campo de "Especificar". |
| Há expectativa de impacto social? | Radio (Sim / Não / Sem informação) | **Sim** → abre campo "Impacto" (textarea) e "Observações complementares". |
| Número estimado de beneficiários em potencial | Number | — |
| Há expectativa de impacto ambiental? | Radio (Sim / Não / Sem informação) | **Sim** → abre campo "Impacto" (textarea) e "Observações complementares". |
| Regime de destinação proposto | Select | Possui dezenas de opções (Afetação, Aforamento, Cessões, Doação, etc). Qualquer valor selecionado abre campo de "Observações complementares". |

### 3.3 Termo de Declaração do Técnico

Painel (acordeão) obrigatório no final da página onde o técnico deve assinar eletronicamente.
- **Regra**: O botão "Salvar e Avançar" é interceptado caso a `decl_assinado` não seja igual a "1".
- Se tentarem salvar sem assinar, o painel se expande automaticamente e o foco é redirecionado para o checkbox da declaração.