# Fix: Checkboxes do Modal Cadastro Mínimo não funcionavam

**Data:** 2026-07-03  
**Problema:** Na aba 2 (foco-02), ao clicar em "Preencher Cadastro Mínimo", o modal abria corretamente, mas os checkboxes de tipo de terreno dispensado não respondiam a cliques.

## Causa Raiz

O `sync.js` possui uma função `isAutoLoadedInput()` (linha 117) que determina se um campo do formulário deve ser tratado como "auto-carregado" (preenchido pelo datalake). A lógica era:

```javascript
function isAutoLoadedInput(input) {
    // ...
    return input.closest('.editavel') === null;
}
```

Ou seja, **todo input que NÃO está dentro de um `.editavel`** era considerado auto-carregado e, portanto, **desabilitado** (`input.disabled = true`) na linha 149.

Os checkboxes do modal de Cadastro Mínimo (`input[name="modal_conceituacao[]"]`) estão dentro do `<form id="form02">` mas fora de qualquer container `.editavel`, então o `sync.js` os marcava como `disabled = true` na inicialização da página.

## Correção

### 1. `sync.js` — Exclusão do modal na função `isAutoLoadedInput`

Adicionada verificação para excluir inputs dentro do `#modalCadastroMinimo`:

```javascript
if (input.closest('#modalCadastroMinimo')) {
    return false;
}
```

### 2. `foco-02.html` — Limpeza de estilos inline excessivos

Removidos os estilos `!important` que haviam sido adicionados como tentativa anterior de fix (sem sucesso, pois o problema era `disabled` no DOM, não CSS).

## Arquivos Alterados
- `sync.js` (função `isAutoLoadedInput`, ~linha 117)
- `foco-02.html` (checkboxes do modal, linhas 163-178)
