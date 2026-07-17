# Histórico de Correção - Correção de Redirecionamento da Aba 3 - 20260714_0955

## Descrição
Correção do link de redirecionamento no botão final da Aba 3 (`btnEnviarPainel`). O código buscava um elemento com o atributo `data-url="foco-07.html"`, que não existe no cabeçalho do fluxo do processo (`processo.html`). O botão correto da aba de visualização final possui o atributo `data-url="aba7.html"`.

## Estado Anterior (Antes)
O botão buscava a URL incorreta (`foco-07.html`), o que fazia com que o `querySelector` retornasse `null` e caísse no bloco de `else`, exibindo apenas um alerta.

```javascript
      if (btnEnviarPainel) {
        btnEnviarPainel.addEventListener("click", () => {
          const rootWindow = window.parent?.parent || window.parent || window;
          const btnTabNext = rootWindow.document?.querySelector(
            'button[data-url="foco-07.html"]',
          );
          if (btnTabNext) {
            btnTabNext.click();
          } else {
            alert("Manifestação concluída! Verifique o painel principal.");
          }
        });
      }
```

## Estado Novo (Depois)
O botão agora busca e simula o clique no botão correto da aba 7 (`aba7.html`).

```javascript
      if (btnEnviarPainel) {
        btnEnviarPainel.addEventListener("click", () => {
          const rootWindow = window.parent?.parent || window.parent || window;
          const btnTabNext = rootWindow.document?.querySelector(
            'button[data-url="aba7.html"]',
          );
          if (btnTabNext) {
            btnTabNext.click();
          } else {
            alert("Manifestação concluída! Verifique o painel principal.");
          }
        });
      }
```

## Plano de Rollback / Desfazer
1. Abra o arquivo `foco-03.html`.
2. Localize a escuta do evento de clique de `btnEnviarPainel` (por volta da linha 2990).
3. Substitua `aba7.html` por `foco-07.html`.
4. Salve o arquivo.
