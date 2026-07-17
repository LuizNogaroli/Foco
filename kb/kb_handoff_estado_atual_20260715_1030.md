# Handoff de Sessão de Desenvolvimento - Foco 13

**Data de Geração:** 15 de Julho de 2026 — 10h30 (BRT)
**Objetivo:** Este documento é um "save state" detalhado do projeto para continuidade por outra IA ou na mesma ferramenta em sessões futuras. **Substitui a versão anterior gerada às 19h54 do dia 14/07.**

---

## 1. Contexto Geral do Projeto (Foco-13)

- **Tipo de Aplicação:** Sistema Web (Vanilla HTML/CSS/JS) para gestão de uma esteira de análise técnica governamental de destinação de imóveis da União (SPU/UF).
- **Backend/Banco de Dados:** Supabase via REST API direta (`fetch`). Nenhum SDK do Supabase é utilizado — todas as chamadas usam `fetch` puro com as chaves `apikey` e `Authorization` no header.
- **Arquitetura de UI:** Iframes progressivos carregados dentro de `processo.html`. A navegação entre Abas usa o `index.js` que atualiza o `src` do `<iframe id="frame">` com cache busters (`?t=Date.now()`).
- **Autenticação e Permissões (RBAC):** Perfis definidos estaticamente no select do `processo.html`. Persistidos via `localStorage.setItem('CURRENT_USER_PROFILE', valor)` pelo `index.js`. As páginas leem esse valor para controlar visibilidade.
- **Tabelas Supabase relevantes:**
  - `tabela_requerimentos` — dados dos processos
  - `tabela_foco` — dados preenchidos em cada aba (rascunho)
  - `tabela_relatorios` — relatórios/aprovações por aba (snapshot ativo)
  - `tabela_status_fluxo` — checkpoint atual do processo na esteira (campo `dados_json.checkpoint`)
  - `tabela_deliberacoes` — histórico de deliberações salvas
  - `tabela_versoes_formulario` — **NOVA** — versionamento de dados por aba (snapshots)

---

## 2. Estado Atual — O Que Foi Implementado e Validado

### ✅ Fluxo de Aprovação (Caminho Feliz) — COMPLETO

```
Aba 3 (Destinação)
  → "Aguardando Chefia SPU/UF"
    → Chefia aprova → "Aguardando Coordenação SPU/UF"
      → Coordenação aprova → "Aguardando Superintendência"
        → Superintendência aprova → "Aguardando Equipe C.G."
          → Equipe C.G. aprova → "Aguardando Coordenação-Geral"
            → Coordenação-Geral aprova → "Aguardando Direção"
              → Direção aprova → "Processo Aprovado pela Direção"
```

### ✅ Fluxo de Devolução — IMPLEMENTADO

Cada nível devolve para o anterior na cadeia:
- Chefia SPU/UF → devolve para Aba 3
- Coordenação SPU/UF → devolve para Chefia SPU/UF
- Superintendência → devolve para Coordenação SPU/UF
- Equipe C.G. → devolve para Superintendência
- Coordenação-Geral → devolve para Equipe C.G.
- Direção → devolve para Coordenação-Geral
- Aba 3 → devolve para Aba 1 ou Aba 2

### ✅ Aba 7 — Painel Gerencial com 6 Blocos de Deliberação

| # | Bloco | Perfil | Checkpoint ao aprovar | Devolução para |
|---|---|---|---|---|
| 1 | `bloco-deliberacao-chefia` | `CHEFIA_SPU` | `Aguardando Coordenação SPU/UF` | Aba 3 |
| 2 | `bloco-deliberacao-coord` | `COORDENACAO_SPU` | `Aguardando Superintendência` | Chefia SPU/UF |
| 3 | `bloco-deliberacao-super` | `SUPERINTENDENCIA` | `Aguardando Equipe C.G.` | Coordenação SPU/UF |
| 4 | `bloco-deliberacao-equipe-cg` | `EQUIPE_CG` | `Aguardando Coordenação-Geral` | Superintendência |
| 5 | `bloco-deliberacao-coord-geral` | `COORDENACAO_GERAL` | `Aguardando Direção` | Equipe C.G. |
| 6 | `bloco-deliberacao-diretoria` | `DIRETORIA` | `Processo Aprovado pela Direção` | Coordenação-Geral |

### ✅ Geração de PDF — IMPLEMENTADO

- Botão "📄 Gerar PDF do Processo" no final do histórico de deliberações (Aba 7)
- Abre `processo-print.html` com dados consolidados das 3 abas + deliberações
- Usa `html2pdf.js` para gerar PDF no browser
- Busca dados da `tabela_versoes_formulario` (versão mais recente de cada aba)
- Fallback para `tabela_relatorios` se não houver versão (compatibilidade)

### ✅ Versionamento de Dados — IMPLEMENTADO

- Nova tabela `tabela_versoes_formulario` criada no Supabase
- Cada aba (01, 02, 03) grava uma nova versão ao salvar
- `tabela_foco` e `tabela_relatorios` continuam como "snapshot ativo"
- Histórico completo preservado para auditoria

---

## 3. Padrões Arquiteturais Estabelecidos

### 3.1 Fetch Direto em Iframes (NUNCA window.parent)
```javascript
const SUPA_URL = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
const SUPA_KEY = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);
```

### 3.2 Padrão GET → PATCH/POST para Status de Fluxo
```javascript
// 1. GET para verificar existência
const resGet = await fetch(`${SUPA_URL}/rest/v1/tabela_status_fluxo?select=id&numero_requerimento=eq.${processId}&order=id.desc&limit=1`);
const existe = (await resGet.json()).length > 0;

// 2. PATCH se existe, POST se não existe
if (existe) { /* PATCH */ } else { /* POST */ }
```

### 3.3 Cache Busting Obrigatório
- Toda alteração em JS deve ser acompanhada de bump: `?v=YYYYMMDDHHMI`
- Aplicar em todos os HTMLs que carregam o script alterado

### 3.4 Delay Após Supabase
```javascript
await new Promise(resolve => setTimeout(resolve, 600)); // antes de navegar
```

### 3.5 Versionamento de Dados
- Ao salvar: gravar versão em `tabela_versoes_formulario` com `versao = ultima + 1`
- `tabela_relatorios` mantém snapshot ativo (UPSERT)
- PDF busca da tabela de versões

---

## 4. Arquivos-Chave (Para IA Subsequente)

| Arquivo | Papel |
|---|---|
| `db.js` | Controlador central de estado. Contém `updateStatusFluxo` (GET+PATCH/POST). |
| `processo.html` | Container principal com iframe, menu de abas e profileSwitcher. |
| `index.js` | Gerencia navegação entre abas, salva perfil no localStorage. |
| `foco-01.js` | Aba 1 (Indicação). Salva relatório + versão. |
| `foco-02-v2.js` | Aba 2 (Caracterização). Salva relatório + versão. |
| `foco-03.html` | Aba 3 (Destinação). Salva relatório + versão. Faz fetch direto para checkpoint. |
| `aba7.html` | Painel Gerencial. 6 blocos de deliberação, timeline, botão PDF. |
| `processo-print.html` | Geração de PDF. Busca versões + deliberações. |
| `tabela_versoes_formulario` | Versionamento de dados por aba. |
| `kb/` | Base de conhecimento arquitetural. |
| `DOC_HISTORICO_BUGS.md` | Histórico de problemas e soluções. |

---

## 5. Checkpoints do Fluxo (Referência Completa)

| Etapa | Quem salva | Valor do `dados_json.checkpoint` |
|---|---|---|
| Aba 3 → Chefia | foco-03.html | `"Aguardando Chefia SPU/UF"` |
| Chefia → Coordenação | aba7.html `salvarChefia` | `"Aguardando Coordenação SPU/UF"` |
| Coord → Superintendência | aba7.html `salvarCoord` | `"Aguardando Superintendência"` |
| Super → Equipe C.G. | aba7.html `salvarSuper` | `"Aguardando Equipe C.G."` |
| Equipe C.G. → Coord-Geral | aba7.html `salvarEquipeCG` | `"Aguardando Coordenação-Geral"` |
| Coord-Geral → Direção | aba7.html `salvarCoordGeral` | `"Aguardando Direção"` |
| Direção → Final | aba7.html `salvarDiretoria` | `"Processo Aprovado pela Direção"` |
| Chefia devolve | aba7.html `salvarChefia` | `"Devolvido para Equipe de Destinação"` |
| Coord devolve | aba7.html `salvarCoord` | `"Devolvido para Chefia SPU/UF"` |
| Super devolve | aba7.html `salvarSuper` | `"Devolvido para Coordenação SPU/UF"` |
| Equipe C.G. devolve | aba7.html `salvarEquipeCG` | `"Devolvido para Superintendência"` |
| Coord-Geral devolve | aba7.html `salvarCoordGeral` | `"Devolvido para Equipe C.G."` |
| Direção devolve | aba7.html `salvarDiretoria` | `"Devolvido para Coordenação-Geral"` |

---

## 6. O Que Ainda Não Foi Testado / Próximos Passos

- [ ] **Testar fluxo completo de devolução** — devolver em cada nível e confirmar que o processo volta ao ponto correto
- [ ] **Testar versionamento** — salvar, devolver, salvar novamente, verificar que a versão 2 é criada e o PDF mostra a versão mais recente
- [ ] **Validar PDF com dados de processos reais** — confirmar que todos os campos aparecem corretamente
- [ ] **Fluxo da CDE** — último nível da cadeia (após Direção)
- [ ] **Múltiplos processos simultâneos** — garantir que `CURRENT_PROCESS_ID` não conflita
- [ ] **Visão Admin na Aba 7** — validar se o histórico completo aparece no modo Admin

---

## 7. Lições Arquiteturais Importantes (Não Repetir)

1. **Nunca usar `window.parent.funcao()` para operações críticas de banco em iframes** — sempre fazer `fetch` direto com as credenciais locais.
2. **Sempre adicionar `order=id.desc` nas queries de `tabela_status_fluxo`** — a tabela não tem constraint UNIQUE.
3. **Cache de browser é traicioneiro** — qualquer alteração em JS deve ser acompanhada de bump no cache buster.
4. **Adicionar `await new Promise(resolve => setTimeout(resolve, 600))` antes de navegar** após salvar no Supabase.
5. **Em processos administrativos, nunca sobrescrever dados** — sempre criar nova versão (versionamento por snapshots).
6. **Manter "snapshot ativo" para performance** — `tabela_relatorios` continua sendo a fonte para telas existentes.

---

*Ass: Antigravity AI — Sessão de 15/07/2026.*
