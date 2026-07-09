# Padronização Visual dos Filtros

Este documento registra os ajustes realizados para unificar e padronizar o corpo (tamanho e peso) e a fonte das letras nos filtros de pesquisa da página principal (`index.html`).

## Detalhes da Modificação

Anteriormente, os filtros possuíam disparidades visuais entre a primeira linha (UF, Município, Status) e a segunda linha (Interessado, Processo SEI, RIP, Uso Imobiliário), devido a estilos inline que sobrescreviam as diretrizes do CSS global (`dashboard.css`).

### Alterações Realizadas

1. **Herdabilidade de Fontes (`dashboard.css`):**
   - Adicionada a propriedade `font-family: inherit;` à regra `.filter-group select, .filter-group input` e `.search-box input` para garantir que os campos de formulário herdem a fonte definida no corpo da página (`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`) em todos os navegadores, sem depender do padrão nativo do browser.

2. **Unificação da Segunda Linha (`index.html`):**
   - Removidos todos os estilos inline (`style="..."`) que sobrescreviam propriedades de margem, espaçamento (`padding`), bordas, cor e tamanho de fonte dos campos (Interessado, Processo SEI, RIP e Uso Imobiliário).
   - Alterados os wrappers de container flexível secundários para utilizarem a classe padrão `.filter-group`.
   - Removido o estilo inline dos rótulos (`<label>`), permitindo que a regra CSS global se aplique homogeneamente (font-size de `11px`, peso em negrito `700`, cor acinzentada e texto em caixa-alta `uppercase`).

## Comparativo de Estilos

| Elemento | Estilo Antigo (Linha 2) | Estilo Novo Padronizado (Ambas Linhas) |
| :--- | :--- | :--- |
| **Rótulos (`label`)** | Fonte default, size 13px, weight 600, cor `#475569`, minúsculo | 'Segoe UI', size 11px, weight 700, cor `#64748b` (var), uppercase |
| **Inputs e Selects** | Padding 8px 12px, border 1px solid, font-size 14px | Padding 10px, border 1.5px solid, font-size 13.5px |

---

*Log gerado automaticamente para preservação do histórico de desenvolvimento do projeto.*
