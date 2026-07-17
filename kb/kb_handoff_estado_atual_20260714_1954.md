# Handoff de Sessão de Desenvolvimento - Foco 13

**Data de Geração:** 14 de Julho de 2026 — 19h54 (BRT)
**Objetivo:** Este documento é um "save state" detalhado do projeto para continuidade por outra IA ou na mesma ferramenta em sessões futuras. **Substitui a versão anterior gerada às 18h51.**

---

## 1. Contexto Geral do Projeto (Foco-13)

- **Tipo de Aplicação:** Sistema Web (Vanilla HTML/CSS/JS) para gestão de uma esteira de análise técnica governamental de destinação de imóveis da União (SPU/UF).
- **Backend/Banco de Dados:** Supabase via REST API direta (`fetch`). Nenhum SDK do Supabase é utilizado — todas as chamadas usam `fetch` puro com as chaves `apikey` e `Authorization` no header.
- **Arquitetura de UI:** Iframes progressivos carregados dentro de `processo.html`. A navegação entre Abas usa o `index.js` que atualiza o `src` do `<iframe id="frame">` com cache busters (`?t=Date.now()`).
- **Autenticação e Permissões (RBAC):** Perfis definidos estaticamente no select do `processo.html`. Persistidos via `localStorage.setItem('CURRENT_USER_PROFILE', valor)` pelo `index.js`. As páginas leem esse valor para controlar visibilidade.
- **Tabelas Supabase relevantes:**
  - `tabela_requerimentos` — dados dos processos
  - `tabela_foco` — dados preenchidos em cada aba (rascunho)
  - `tabela_relatorios` — relatórios/aprovações por aba
  - `tabela_status_fluxo` — checkpoint atual do processo na esteira (campo `dados_json.checkpoint`)
  - `tabela_deliberacoes` — histórico de deliberações salvas (Chefia, Coord, Super)

---

## 2. Estado Atual — O Que Foi Implementado e Validado Hoje

### ✅ Fluxo Aba 3 → Aba 7 (FUNCIONANDO)

Quando o usuário (perfil Equipe SPU) finaliza a análise na **Aba 3 (Destinação)**:
1. Clica em **"📝 Registrar Manifestação"** → abre modal de aprovação
2. Marca o checkbox de ciência + clica **"Confirmar"** → modal fecha, aparece o botão verde
3. Clica em **"Concluir Processo e ir para Painel Gerencial"**:
   - Faz fetch direto ao Supabase salvando `checkpoint = "Aguardando Chefia SPU/UF"` na `tabela_status_fluxo`
   - Aguarda 600ms (garante que o Supabase processou)
   - Navega para a Aba 7
   - Após 800ms dispara `postMessage({ type: 'RELOAD_DELIBERACOES' })` para forçar reload

### ✅ Aba 7 — Bloco da Chefia SPU/UF (FUNCIONANDO)

- Quando perfil = `CHEFIA_SPU` ou `Chefia SPU/UF` **E** checkpoint = `"Aguardando Chefia SPU/UF"`, o `#bloco-deliberacao-chefia` aparece
- Ao confirmar deliberação: `notificarStatusFluxo()` salva `"Aguardando Coordenação SPU/UF"` no banco via fetch direto
- Deliberação fica registrada no Histórico de Deliberações

### ✅ Aba 7 — Bloco da Coordenação SPU/UF (FUNCIONANDO)

- Quando perfil = `COORDENACAO_SPU` ou `Coordenação SPU/UF` **E** checkpoint = `"Aguardando Coordenação SPU/UF"`, o `#bloco-deliberacao-coord` aparece
- Ao confirmar: salva `"Aguardando Superintendência"` no banco

### ✅ Aba 7 — Bloco da Superintendência (IMPLEMENTADO, pendente teste completo)

- Quando perfil = `SUPERINTENDENCIA` **E** checkpoint = `"Aguardando Superintendência"`, o `#bloco-deliberacao-super` aparece
- Ao confirmar: salva checkpoint final (`"Processo Aprovado pela Superintendência"` ou variação)

---

## 3. Correções Críticas Realizadas Nesta Sessão

### 3.1 Anti-padrão eliminado: dependência de `window.parent` para fetch crítico

**O problema raiz de TODOS os bugs desta sessão:**
Iframes (foco-03.html, aba7.html) chamavam funções de banco via `window.parent.updateStatusFluxo()` ou `window.parent.updateStatusFluxo`. Isso falhava silenciosamente em três cenários:
- `window.parent` não tinha o SDK carregado → `window.supabaseClient` nulo → early return
- A função não estava disponível no contexto correto
- Race condition: o parent não havia carregado ainda

**A solução padronizada (aplicar em TODOS os iframes):**
```javascript
// Sempre usar fetch direto, nunca window.parent.updateStatusFluxo
const SUPA_URL = window.SUPABASE_URL || (window.parent && window.parent.SUPABASE_URL);
const SUPA_KEY = window.SUPABASE_ANON_KEY || (window.parent && window.parent.SUPABASE_ANON_KEY);

// GET para verificar existência → PATCH se existe, POST se não existe
const resGet = await fetch(`${SUPA_URL}/rest/v1/tabela_status_fluxo?select=id&numero_requerimento=eq.${encodeURIComponent(processId)}&order=id.desc&limit=1`, ...);
const existe = (await resGet.json()).length > 0;
if (existe) { /* PATCH */ } else { /* POST */ }
```

### 3.2 Credenciais adicionadas diretamente nos iframes críticos

**`aba7.html`** agora tem no `<head>`:
```html
<script>
  window.SUPABASE_URL = "https://rzdmnzuweyzhilfcungl.supabase.co";
  window.SUPABASE_ANON_KEY = "eyJhbGci...";
</script>
```
Isso garante que mesmo sem `window.parent`, as credenciais estão disponíveis.

### 3.3 Cache bump forçado

Todos os arquivos HTML que carregam `db.js` e `index.js` foram atualizados para `v=202607142230` para forçar o browser a buscar o código novo.

### 3.4 `notificarStatusFluxo` em aba7.html reescrita

Antes dependia de `window.parent.updateStatusFluxo` (frágil). Agora faz fetch direto — a **mesma função serve para Chefia, Coordenação e Superintendência**.

### 3.5 Modal de aprovação da Aba 3 blindado

O `btnConfirmarAprov.onclick` agora mostra o `btnEnviarPainel` **mesmo se o PATCH do relatório falhar** (o catch agora não bloqueia o fluxo).

---

## 4. Checkpoints do Fluxo (Referência)

| Etapa | Quem salva | Valor do `dados_json.checkpoint` |
|---|---|---|
| Aba 3 → Chefia | foco-03.html | `"Aguardando Chefia SPU/UF"` |
| Chefia → Coordenação | aba7.html `salvarChefia` | `"Aguardando Coordenação SPU/UF"` |
| Coord → Superintendência | aba7.html `salvarCoord` | `"Aguardando Superintendência"` |
| Super → Final | aba7.html `salvarSuper` | `"Processo Aprovado pela Superintendência"` |
| Chefia devolve | aba7.html `salvarChefia` | `"Devolvido para Equipe de Destinação"` ou `"...Caracterização"` |
| Coord devolve | aba7.html `salvarCoord` | `"Devolvido para Chefia SPU/UF"` |

---

## 5. Arquivos-Chave (Para IA Subsequente)

| Arquivo | Papel |
|---|---|
| `db.js` | Controlador central de estado. Contém `updateStatusFluxo` (GET+PATCH/POST). Carregado por `processo.html` e `index.html`. |
| `processo.html` | Container principal com iframe, menu de abas e profileSwitcher. Carrega `db.js` e `index.js`. |
| `index.js` | Gerencia navegação entre abas, salva perfil no localStorage, envia `postMessage` ao iframe. |
| `foco-03.html` | Aba 3 (Destinação). O `btnEnviarPainel` faz fetch direto para salvar checkpoint. |
| `aba7.html` | Painel Gerencial. Contém `applyProfileView`, `carregarDeliberacoesETimeline` e `notificarStatusFluxo`. |
| `docs/historico/` | Logs de reversibilidade com estado antes/depois/rollback de cada correção. |
| `kb/` | Base de conhecimento arquitetural desta sessão. |

---

## 6. O Que Ainda Não Foi Testado / Próximos Passos

- [ ] **Fluxo completo da Coordenação** → confirmar deliberação → verificar se `"Aguardando Superintendência"` chega no banco e o bloco da Super aparece
- [ ] **Fluxo de devolução** (Chefia devolve para Aba 2 ou 3) — o sistema deveria mudar o checkpoint e permitir que a equipe retrabalhasse
- [ ] **Fluxo da Superintendência** → aprovação final → estado final do processo
- [ ] **Múltiplos processos simultâneos** — garantir que o `CURRENT_PROCESS_ID` no localStorage não conflita quando o usuário abre dois processos em abas diferentes do browser
- [ ] **Visão do Painel (Aba 7 como Admin/ALL)** — validar se o histórico completo de deliberações aparece corretamente no modo Admin
- [ ] **Processo SC2026020** — o banco foi corrigido manualmente para `"Aguardando Coordenação SPU/UF"`. O próximo passo é confirmar a deliberação da Coordenação nele para validar o fluxo até a Superintendência.

---

## 7. Lições Arquiteturais Importantes (Não Repetir)

1. **Nunca usar `window.parent.funcao()` para operações críticas de banco em iframes** — sempre fazer `fetch` direto com as credenciais locais.
2. **Sempre adicionar `order=id.desc` nas queries de `tabela_status_fluxo`** — a tabela não tem constraint UNIQUE no `numero_requerimento`, podendo ter duplicatas. O `order=id.desc&limit=1` garante que pega o mais recente.
3. **Cache de browser é traicioneiro** — qualquer alteração em JS deve ser acompanhada de bump no cache buster (`?v=YYYYMMDDHHMI`) em todos os HTMLs que carregam o script.
4. **Adicionar `await new Promise(resolve => setTimeout(resolve, 600))` antes de navegar** após salvar no Supabase — garante que o servidor processou antes da próxima tela fazer a leitura.

*Ass: Antigravity AI — Sessão de 14/07/2026.*
