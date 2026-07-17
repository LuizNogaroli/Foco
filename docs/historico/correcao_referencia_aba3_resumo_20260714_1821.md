# Histórico de Alterações - Correção de Referência Indefinida no Modal da Aba 3

## Resumo da Mudança
Corrigimos um erro de JavaScript na Aba 3 (`foco-03.html`) em que o botão "Registrar manifestação" não abria o modal. O erro ocorria porque as variáveis `loadingRelatorio` e `conteudoRel` (DOM nodes do indicador de loading e do container de conteúdo) foram utilizadas sem serem declaradas previamente no escopo do listener de clique. Adicionamos a declaração de ambas buscando via `document.getElementById`.

## 1. Estado Anterior (Antes)
- No `foco-03.html` (linha 3082): O código disparava a mudança de display:
  ```javascript
  loadingRelatorio.style.display = "block";
  conteudoRel.style.display = "none";
  ```
  mas as variáveis `loadingRelatorio` e `conteudoRel` não haviam sido instanciadas com `const` ou `let`, resultando em um erro fatal de execução (`ReferenceError: loadingRelatorio is not defined`).

## 2. Estado Novo (Depois)
- Declaradas as variáveis `loadingRelatorio` e `conteudoRel` no topo do listener do botão de manifestação, apontando para `#loadingRelatorio` e `#conteudoRelatorioAprovacao` respectivamente. O fluxo agora inicializa e preenche o modal corretamente.

## 3. Plano de Rollback / Desfazer
Para reverter:
- Remova as duas linhas de declaração inseridas na linha 3078 do `foco-03.html`.
