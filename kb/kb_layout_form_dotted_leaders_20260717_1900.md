# KB: Layout de Formulário com Dotted Leaders (Guias Pontilhadas)

**Data:** 17/07/2026
**Escopo:** Aba 3 (Análise de Viabilidade) — Accordion de RIP(s) e Cadastro(s) Mínimo(s)

---

## 1. Descrição do Padrão

Formulário estilo ficha técnica onde cada campo é exibido em uma linha contendo:

1. **Label** — nome do campo, alinhado à esquerda, em negrito
2. **Dotted Leaders** — sequência de pontinhos (`...`) que preenche o espaço entre o final do label e o delimitador
3. **Delimitador** — dois-pontos (`:`) posicionado após os pontinhos
4. **Valor** — dado do campo, exibido em box com fundo cinza claro e texto preto, alinhado à esquerda

O resultado visual é semelhante a índices de livros, contratos e laudos técnicos governamentais.

---

## 2. Estrutura HTML/CSS

```javascript
function buildFieldRO(label, value) {
    return `
        <div style="display: flex; align-items: baseline; margin-bottom: 6px; padding: 5px 0; font-size: 0.9rem;">
            <span style="display: flex; width: 240px;">
                <span style="font-weight: 600; color: #334155; white-space: nowrap;">${label}</span>
                <span style="flex: 1; border-bottom: 1px dotted #94a3b8; min-width: 10px;"></span>
                <span style="white-space: nowrap; color: #334155;">:</span>
            </span>
            <span style="flex: 1; margin-left: 6px; padding: 3px 10px; background: #f1f5f9; color: #0f172a; border-radius: 3px;">
                ${value || '-'}
            </span>
        </div>
    `;
}
```

---

## 3. Decisões de Design

| Decisão | Escolha | Motivo |
|---|---|---|
| Largura do container de label | 240px fixo | Baseado no label mais extenso ("LPM/1831 ou LMEO Homologadas?"), ajustado visualmente |
| Início dos pontinhos | Logo após o texto do label | Alinhamento visual consistente entre campos |
| Box cinza (2ª coluna) | `flex: 1` com fundo `#f1f5f9` | Ocupa toda a largura restante, separando visualmente label de valor |
| Alinhamento | `align-items: baseline` | Garante que label e valor fiquem na mesma linha de base |
| Texto do valor | `#0f172a` (preto) | Contraste claro sobre fundo cinza |

---

## 4. Nomenclatura

- **Inglês:** Form with Dotted Leaders / Key-Value Form with Dot Leaders
- **Português:** Formulário com Guias Pontilhadas / Layout Chave-Valor
- **Contextos de uso:** Fichas técnicas, laudos, contratos, documentos governamentais, índices

---

## 5. Onde Aplicar no Projeto

- Aba 3: Accordion de RIP(s) e Cadastro(s) Mínimo(s)
- Futuro: Qualquer exibição de dados read-only em formato de ficha (ex: resumos de processo, relatórios de auditoria)
