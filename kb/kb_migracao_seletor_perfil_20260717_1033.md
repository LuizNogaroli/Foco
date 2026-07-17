# KB — Migração do Seletor de Perfil: Dashboard (index.html) + Toggle `Meus Processos`
**Data:** 2026-07-17 10:33
**Sessão:** Foco-14 — Alteração Estrutural #1

---

## 1. Problema / Motivação

O `index.html` tinha um seletor de visualização simplificado com apenas 2 opções:
- `Chefia (Distribuidor)` → habilitava coluna de atribuição de servidores
- `Técnico (Somente Leitura)` → desabilitava a coluna

Isso era insuficiente para simular os múltiplos perfis do sistema.

---

## 2. Solução Implementada

### A) Seletor de Perfil Completo
Substituído o `<select id="userSimulator">` pelo `<select id="profileSelector">` com 10 perfis (ALL, DESTINACAO, CARACTERIZACAO, CHEFIA, COORDENACAO, SUPERINTENDENCIA, EQUIPE_CG, COORDENACAO_GERAL, DIRETORIA, CDE). Valores sem prefixo/sufixo SPU_ por decisão do usuário.

### B) Toggle `Meus Processos`
Toggle pill (estilo iOS). Quando ativo, filtra a tabela mostrando apenas processos cuja `instância/checkpoint` corresponde à fila do perfil ativo. Comportamento padrão: desligado.

### C) PROFILE_QUEUE_MAP
Mapa perfil → checkpoints brutos do banco. Integrado dentro de `applyFilters()` como mais um filtro (compatível com todos os outros filtros existentes).

### D) Persistência
`changeProfile()` → `localStorage.setItem('CURRENT_USER_PROFILE', profile)` → lido pelo `aba7.html` automaticamente.

### E) Aliases em aba7.html
Adicionados: CHEFIA, COORDENACAO, DESTINACAO, CARACTERIZACAO como aliases limpos no `profilePermissions`. Chaves antigas (CHEFIA_SPU, COORDENACAO_SPU etc.) mantidas para compatibilidade retroativa.

---

## 3. Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| index.html | HTML navbar + JS (PROFILE_QUEUE_MAP, changeProfile, applyFilters, DOMContentLoaded) |
| dashboard.css | .profile-switcher-wrapper, .toggle-switch, .toggle-slider |
| aba7.html | profilePermissions: aliases limpos adicionados |

---

## 4. Regras de Negócio

- Somente perfil CHEFIA pode atribuir processos (`currentUserCanDistribute = true`)
- Toggle + ALL = sem efeito (PROFILE_QUEUE_MAP['ALL'] = null → mostra tudo)
- CHEFIA_SPU e COORDENACAO_SPU continuam sendo usados para gravar deliberações no banco — NÃO renomear.
