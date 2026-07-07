# Regras de Preenchimento Condicional de Campos

**Última Atualização:** 06/07/2026

Este documento centraliza as regras de UI/UX referentes à exibição condicional de campos (mostrar/esconder) e opções dinâmicas dependentes dentro dos formulários do sistema Foco-11.

---

## 1. Aba 2 — Caracterização e Restrições (foco-02.html / foco-02.js)

### 1.1 Situação da Incorporação
| Campo | Tipo | Regra Condicional |
|-------|------|-------------------|
| Situação da Incorporação | Select | Controla a exibição do campo de observação. |

**Detalhes da regra de Situação da Incorporação:**
- Se **Outros**: Abre o campo de texto "Observação".
- Demais opções ("Em processo de incorporação" ou "Incorporado"): Mantém o campo oculto.
- Regra de origem de dados (`tabela_spu`):
  - Se `dados_json.situacao_incorporacao` vier **vazio** (null, undefined ou string vazia), o campo fica **editável** (fundo branco, sem cadeado).
  - Se `dados_json.situacao_incorporacao` vier **preenchido**, o campo fica **somente leitura** (fundo cinza, com cadeado).

### 1.2 Há Benfeitorias?
| Campo | Tipo | Regra Condicional |
|-------|------|-------------------|
| Há benfeitorias? | Select | Controla a exibição do campo de descrição. |

**Detalhes da regra de Benfeitorias:**
- Se **Sim**: Abre o campo de texto "Quais benfeitorias?".
- Se **Não**: Mantém o campo oculto.
- Regra de origem de dados (`tabela_spu`):
  - Se `dados_json.benfeitorias` vier **vazio** (null, undefined ou string vazia), o campo fica **editável** (fundo branco, sem cadeado).
  - Se `dados_json.benfeitorias` vier **preenchido**, o campo fica **somente leitura** (fundo cinza, com cadeado).

### 1.3 Situação Ocupacional
| Campo | Tipo | Regra Condicional |
|-------|------|-------------------|
| Situação Ocupacional | Radio (4 opções) | Controla a exibição de blocos complementares de ocupação e uso atual. |

**Detalhes da regra de Situação Ocupacional:**
- Se **Desocupado**: Abre os campos "Tempo de desocupação" e "Observações".
- Se **Ocupado regularmente** ou **Ocupado irregularmente**: Abre os campos "Data de conhecimento da ocupação", "Observações" e também revela o bloco completo de **Uso imobiliário atual** (com seus respectivos selects).
- Se **Não há informação**: Todos os blocos complementares permanecem ocultos.

### 1.2 Riscos
| Campo | Tipo | Regra Condicional |
|-------|------|-------------------|
| Há riscos identificados no imóvel? | Radio (3 opções) | Controla a exibição da listagem de riscos. |
| Riscos verificados | Multi-checkbox | Marcar um risco específico habilita o campo de "Observações sobre riscos". |

**Detalhes da regra de Riscos:**
- Se **Sim**: Revela o bloco de multi-seleção de "Riscos verificados".
- Se **Não** ou **Não há informação suficiente**: Mantém os detalhes de riscos ocultos.
- Dentro dos riscos verificados, se alguma opção de risco for marcada, o campo de observações ("Observações sobre riscos") é revelado.

### 1.3 Restrições
| Campo | Tipo | Regra Condicional |
|-------|------|-------------------|
| Há restrições e condições limitadoras? | Radio (3 opções) | Controla a exibição da listagem de restrições. |
| Restrições verificadas | Multi-checkbox | Marcar uma restrição específica habilita o campo de "Observações sobre as restrições". |

**Detalhes da regra de Restrições:**
- Se **Sim**: Revela o bloco de multi-seleção de "Restrições verificadas".
- Se **Não** ou **Não há informação suficiente**: Mantém os detalhes de restrições ocultos.
- Dentro das restrições verificadas, se alguma opção de restrição for marcada, o campo de observações ("Observações sobre as restrições") é revelado.

---

## 2. Aba 3 — Análise e Proposta de Destinação (foco-03.html)

### 2.1 Análise do Destinatário

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

### 2.2 Proposta de Destinação e Impactos

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

### 2.3 Termo de Declaração do Técnico

Painel (acordeão) obrigatório no final da página onde o técnico deve assinar eletronicamente.
- **Regra**: O botão "Salvar e Avançar" é interceptado caso a `decl_assinado` não seja igual a "1".
- Se tentarem salvar sem assinar, o painel se expande automaticamente e o foco é redirecionado para o checkbox da declaração.
