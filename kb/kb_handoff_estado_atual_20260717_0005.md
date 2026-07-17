# KB — Handoff: Estado Atual do Sistema
**Data:** 2026-07-17 00:05  
**Sessão:** Checkpoint 18 — Refinamentos de UI do Painel de Requerimentos

---

## 1. Contexto Geral do Projeto

O sistema **FOCO-13** é um protótipo de plataforma administrativa (HTML/JS/Supabase) para tramitação de processos de destinação de imóveis da SPU. Ele **não é uma aplicação PHP/Laravel ainda** — o objetivo desta fase é validar o fluxo de negócio antes da migração.

---

## 2. Arquitetura de Arquivos Principais

| Arquivo | Papel |
|---|---|
| `index.html` | Dashboard principal — tabela de requerimentos com filtros e ações |
| `dashboard.css` | Estilos exclusivos do painel (`index.html`) |
| `db.js` | Motor central: toda lógica de Supabase, estados de fluxo, versionamento |
| `aba7.html` | Tela de tramitação/deliberação (Chefia, Coordenação, Superintendência, CG, etc.) |
| `processo-print.html` | Histórico cronológico em formato imprimível |
| `formulario.js` | Lógica das abas de preenchimento (Aba 1, 2, 3) |

---

## 3. Banco de Dados (Supabase)

### Tabelas Principais

| Tabela | Função |
|---|---|
| `tabela_foco` | Requerimentos — dados do processo, `dados_json` com histórico de versões |
| `tabela_status_fluxo` | Estados de workflow por processo (`workflowId`, `checkpoint`, `perfil`, `tag_fluxo`) |
| `tabela_deliberacoes` | Manifestações de cada instância (Chefia, Coord, Super, CG, Diretoria, CDE) |
| `tabela_spu` | Cadastro de servidores por UF/perfil (para atribuição) |
| `tabela_atribuicao` | Atribuições de processos a servidores |

### Campo crítico: `dados_json` em `tabela_foco`
O campo `dados_json` armazena **todas as versões do processo** no formato:
```json
{
  "versoes": [
    { "numero": 1, "dados": {...}, "status": "ATIVO", "timestamp": "..." },
    { "numero": 2, "dados": {...}, "status": "CONSOLIDADO E CORRIGIDO", ... }
  ],
  "deliberacoes": [...]
}
```
Isso implementa a **Abordagem A do versionamento imutável** — cada salvamento cria uma nova versão, nunca sobrescreve a anterior.

---

## 4. Fluxo de Workflow

O status de tramitação é gerenciado pela função `updateStatusFluxo()` em `db.js`. Os checkpoints reconhecidos (na coluna **Instância** do dashboard) são:

1. Análise Viabilidade (Equipe Destinação)
2. Indicação de Imóvel (Equipe Caracterização)
3. Aguardando Chefia SPU/UF
4. Aguardando Coordenação SPU/UF
5. Aguardando Superintendência
6. Aguardando Equipe C.G.
7. Aguardando Coordenação-Geral
8. Aguardando Direção
9. Aguardando CDE

### Lógica de Devolutiva (`retorno_devolucao_id`)
Quando um processo é devolvido e depois corrigido, o campo `retorno_devolucao_id` em `tabela_status_fluxo` aponta para o ID do workflow original, fazendo com que o sistema **retorne automaticamente à instância que devolveu**, pulando etapas intermediárias. Isso foi implementado na sessão anterior em `db.js`.

### Mapeamento visual de checkpoints (em `index.html`)
Strings antigas (legado no banco) são convertidas visualmente:
- `"Devolvido para Equipe de Destinação"` → exibe como `"Análise Viabilidade"`
- `"Devolvido para Chefia SPU/UF"` → exibe como `"Aguardando Chefia SPU/UF"`
- etc.

---

## 5. Sistema de Perfis/RBAC

Em `aba7.html`, a função `applyProfileView()` controla quais painéis de deliberação aparecem baseando-se no `checkpoint` do `dados_json`. A normalização (feita nesta sessão) garante que strings com pequenas variações de nomenclatura ainda ativem o painel correto.

**Perfis disponíveis no simulador (`index.html`):**
- Administrador
- Equipe (Destinação) / Equipe (Caracterização)
- Chefia
- Coordenação
- Superintendência
- Equipe C.G. / Coordenação-Geral
- Direção

---

## 6. Dashboard UI — Estado Atual (após sessão 17/07/2026)

### Colunas da Tabela (em ordem)
| Coluna | Width | Obs |
|---|---|---|
| Nº Requerimento | min 110px | — |
| Data Req. | min 90px | — |
| UF | min 50px | — |
| Município | min 120px | — |
| Interessado | max 140px | quebra em até 3 linhas |
| Processo SEI | min 140px, auto | coluna "amortecedor" para espaço restante |
| Regime de Destinação | max 150px | quebra em até 3 linhas |
| Atribuído para | 130px fixo | — |
| Tag | 140px fixo | badge `.badge` 130×52px |
| Status | 150px fixo | badge `.badge-status-foco` 130×52px |
| Instância | 130px fixo | texto + sub-label do perfil |
| Ação | 70px fixo | botão 🔎 |

### Badge System (`dashboard.css`)
Dois conjuntos de badges foram padronizados em **tamanho idêntico (130px × 52px)**:

**`.badge` (coluna Tag) — classes de cor:**
- `.badge-aguardando` — azul claro (status inicial)
- `.badge-analise` — verde claro
- `.badge-devolvido` — vermelho
- `.badge-confirmada` — verde escuro
- `.badge-em-andamento` — verde menta (texto preto)
- `.badge-deliberado` — verde escuro (texto branco)

**`.badge-status-foco` (coluna Status):**  
Azul claro (`#f0f9ff`), texto azul escuro (`#0369a1`), borda `#bae6fd`.

### Tamanhos de Fonte Padronizados
- Células da tabela: **14.5px** (definido em `.data-table`)
- Badges (Tag e Status): **13px**
- Sub-label de perfil (Instância): **11.5px**
- Indicadores de origem: **12.5px**

### Padding da Tabela
- `th` e `td`: **padding: 14-15px 10px** (reduzido de 18px para compactar)

---

## 7. Histórico de Bugs Resolvidos Nesta Sessão (17/07/2026)

1. **Badge inconsistência de tamanho:** A coluna Tag (`.badge`) tinha `width: 170px` e `height: auto`. Padronizado para 130×52px com quebra de linha automática.
2. **Fonte pequena nos badges:** Estava em 11px. Corrigido para 13px em toda a tabela.
3. **Coluna "Regime de Destinação" muito larga:** Antes `min-width: 220px`. Reduzida para `max-width: 150px` com `white-space: normal`.
4. **Colunas Tag/Status/Instância/Ação esticadas em telas largas:** Colunas não tinham `max-width`, fazendo a tabela distribuir o espaço em excesso entre elas. Resolvido com larguras fixas (`min`, `max` e `width` idênticos) para travar o tamanho.

---

## 8. Pendências / Próximos Passos

### Interface (UI)
- [ ] **Cores dos badges por status:** O usuário deseja definir cores distintas para cada status. Atualmente usa um padrão azul único para todos os status na coluna "Status".
- [ ] **Revisão final do layout em diferentes resoluções:** Testar em tela menor (notebook) para garantir que o `overflow-x: auto` entra em ação corretamente.

### Funcionalidade / Negócio
- [ ] **Nenhum fluxo funcional pendente** identificado nesta sessão — o fluxo de devolutiva com retorno automático foi implementado e validado.
- [ ] **Migração para PHP/Laravel + PostgreSQL:** Decisão já tomada, mas fora do escopo atual. O protótipo deve continuar sendo refinado antes disso.

---

## 9. Como Retomar

1. Abrir `c:\Users\luizn\Documents\1-PROGRAMAS\Foco-13\` no VS Code ou similar.
2. Abrir o `index.html` no navegador (LiveServer ou equivalente).
3. Os arquivos centrais desta sessão foram: `dashboard.css` e `index.html`.
4. Para verificar o estado do banco, acessar o projeto Supabase e conferir `tabela_foco` e `tabela_status_fluxo`.

---

*Gerado automaticamente ao final da sessão de 16-17/07/2026.*
