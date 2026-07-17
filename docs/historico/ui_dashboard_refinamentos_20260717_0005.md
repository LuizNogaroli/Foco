# Histórico — Sessão 16-17/07/2026 (23h00 → 00h05)
**Tema:** Refinamentos de UI — Painel de Requerimentos (`index.html` + `dashboard.css`)

---

## Resumo das Alterações

Esta sessão foi dedicada exclusivamente a melhorias visuais e de usabilidade no dashboard principal (`index.html`). Nenhuma lógica de negócio ou funcionalidade foi alterada.

---

## Alteração 1 — Padronização do tamanho dos Badges (Tag e Status)

**Arquivo:** `dashboard.css`

### Antes
```css
/* .badge (coluna Tag) */
.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    /* sem width nem height fixos */
}

/* .badge-status-foco (coluna Status) */
.badge-status-foco {
    font-size: 11px;
    width: 170px;
    /* sem height fixo */
    white-space: nowrap; /* não quebrava linha */
}
```

### Depois
```css
/* .badge (coluna Tag) */
.badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    width: 130px;
    height: 52px;
    white-space: normal;
    line-height: 1.2;
}

/* .badge-status-foco (coluna Status) */
.badge-status-foco {
    font-size: 13px;
    width: 130px;
    height: 52px;
    white-space: normal;
    line-height: 1.2;
}
```

**Rollback:** Reverter os valores acima para os valores "Antes".

---

## Alteração 2 — Padronização de Fontes no Dashboard

**Arquivo:** `dashboard.css` e `index.html`

### Antes
- Badges: `font-size: 11px`
- Indicador de origem: `font-size: 11px`
- Sub-label de perfil (Instância): `font-size: 10px`
- Textos N/A, "Sem equipe na UF", dropdowns de atribuição: `font-size: 11px`

### Depois
- Badges: `font-size: 13px`
- Indicador de origem: `font-size: 12.5px`
- Sub-label de perfil (Instância): `font-size: 11.5px`
- Textos N/A, "Sem equipe na UF", dropdowns de atribuição: `font-size: 13px`

**Rollback:** Reverter `13px → 11px` e `11.5px → 10px` nos locais citados.

---

## Alteração 3 — Redução do Padding das Células da Tabela

**Arquivo:** `dashboard.css`

### Antes
```css
.data-table th { padding: 14px 18px; }
.data-table td { padding: 15px 18px; }
```

### Depois
```css
.data-table th { padding: 14px 10px; }
.data-table td { padding: 15px 10px; }
```

**Rollback:** Reverter `10px → 18px` no padding lateral.

---

## Alteração 4 — Redistribuição de Larguras das Colunas

**Arquivo:** `index.html` (cabeçalhos `<th>` na tabela principal)

### Antes (larguras originais)
| Coluna | Valor |
|---|---|
| Nº Requerimento | `min-width: 140px` |
| Data Req. | `min-width: 100px` |
| Município | `min-width: 150px` |
| Interessado | `min-width: 200px` |
| Processo SEI | `min-width: 160px` |
| Regime de Destinação | `min-width: 220px` |
| Atribuído para | `min-width: 150px` |
| Tag | `min-width: 140px` |
| Status | `min-width: 220px` |
| Instância | `min-width: 200px` |
| Ação | `min-width: 70px` |

### Depois (larguras ajustadas)
| Coluna | Valor |
|---|---|
| Nº Requerimento | `min-width: 110px` |
| Data Req. | `min-width: 90px` |
| Município | `min-width: 120px` |
| Interessado | `max-width: 160px; width: 140px` |
| Processo SEI | `min-width: 140px; width: auto` (amortecedor) |
| Regime de Destinação | `max-width: 150px; width: 150px` |
| Atribuído para | `130px fixo` |
| Tag | `140px fixo` |
| Status | `150px fixo` |
| Instância | `130px fixo` |
| Ação | `70px fixo` |

### Alteração nas células `<td>` (coluna Interessado e Regime de Destinação)
Ambas passaram a ter `white-space: normal` com `max-width` correspondente para permitir quebra de linha.

**Rollback:** Substituir os valores `th` acima pelos valores "Antes". Remover `style` das `<td>` de Interessado e Regime de Destinação.

---

*Fim do histórico da sessão.*
