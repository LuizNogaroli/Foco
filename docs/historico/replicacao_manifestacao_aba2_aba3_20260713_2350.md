# Replicação da Funcionalidade de Manifestação (Abas 2 e 3)

**Data:** 13 de Julho de 2026
**Responsável:** Antigravity (AI)
**Arquivos Afetados:**
- `foco-02.html` / `foco-02.js` / `foco-02-resumo.html`
- `foco-03.html` / `foco-03-resumo.html`

## 1. Descrição do Problema
O usuário solicitou que o mesmo fluxo implementado na Aba 1 (Botões "Salvar" e "Manifestação" separados, exibição de um Modal de Aprovação com o Relatório da aba, e gravação na `tabela_relatorios` via Snapshot) fosse replicado perfeitamente para a **Aba 2 (Caracterização)** e **Aba 3 (Destinação)**.

---

## 2. Estado Anterior (Antes)

### 2.1 Botões (Aba 2 e Aba 3)
```html
<!-- Antes: Apenas um botão de submit acoplado ao sync.js -->
<button type="submit" id="btnEnviar" class="btn-action">💾 Salvar e Avançar ➡</button>
```

### 2.2 Salvamento em JS (Aba 2 e Aba 3)
Antes, a Aba 2 e Aba 3 dependiam 100% do comportamento do `sync.js` (`document.addEventListener('submit', ...)` no form global). Elas não geravam o próprio snapshot.

### 2.3 Relatórios (foco-XX-resumo)
- `foco-02-resumo.html` possuía dados fixados ("hardcoded" em HTML).
- `foco-03-resumo.html` não existia.

---

## 3. Estado Novo (Depois)

### 3.1 Botões e Modais
```html
<!-- Depois: Botões independentes e estrutura do modal injetada no final do container principal -->
<button type="button" id="btnSalvarRelatorio" class="btn-action">💾 Salvar</button>
<button type="button" id="btnManifestacao" class="btn-action">Manifestação ➡</button>
```
Adicionado `div#modalAprovacaoAbaX` para exibir o iframe e o checkbox de confirmação.

### 3.2 Salvamento em JS (exemplo genérico inserido)
```javascript
// O submit padrão é prevenido
formReq.addEventListener('submit', (e) => e.preventDefault());

async function executarSalvamento() {
    // 1. Força sync.js a salvar draft
    await window.parent.forceSaveDraft();
    
    // 2. Extrai formDataState para montar snapshot da aba
    const snapshot = { campoX: formDataState['campoX'] };
    
    // 3. Salva em tabela_relatorios
    await fetch(urlRel, { method: 'POST', body: JSON.stringify(payload) });
}
```

### 3.3 Relatórios Dinâmicos
Criados arquivos `foco-02-resumo.html` e `foco-03-resumo.html` com script AJAX que carrega `tabela_relatorios?aba=eq.abaX` e injeta os valores dinamicamente no DOM, exibindo também o selo de assinatura (se `aprovacao.status` for `true`).

---

## 4. Plano de Rollback / Desfazer

Caso essa replicação cause problemas no carregamento do mapa (Aba 2) ou dependências visuais, ou se a lógica do `sync.js` começar a falhar:

**Passo 1: Reverter Botões e Modais**
- Abra `foco-02.html` e `foco-03.html`.
- Remova as tags de botão `<button id="btnSalvarRelatorio">` e `<button id="btnManifestacao">`.
- Restaure o antigo `<button type="submit" id="btnEnviar" class="btn-action">💾 Salvar e Avançar ➡</button>`.
- Apague completamente o bloco HTML `<div id="modalAprovacaoAba2">` (ou Aba3).

**Passo 2: Reverter o JS**
- Abra `foco-02.js` e vá até as últimas linhas (após o final da lógica principal).
- Apague todo o bloco demarcado por `// ========================================================================= // LÓGICA DE SALVAMENTO E MANIFESTAÇÃO`.
- Faça o mesmo processo em `foco-03.html` (nas últimas linhas do `<script>` interno).

**Passo 3: (Opcional) Restaurar Relatórios**
- Caso desejado, restaurar o arquivo original do `foco-02-resumo.html` via `git restore foco-02-resumo.html` (ou voltar ao design "hardcoded").
- Deletar `foco-03-resumo.html`.
