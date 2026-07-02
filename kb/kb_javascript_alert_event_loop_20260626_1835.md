# Knowledge Base: O impacto do lert() no Event Loop do JavaScript

**Data:** 26/06/2026
**Contexto:** Ao debugar uma condição de corrida (race condition) de formulários em arquiteturas de iframes (onde a navegação destrói a view atual), foi levantada a hipótese de usar o lert() para gerar um "atraso seguro" e dar tempo para o motor de sincronização (sync.js) processar a página antes de avançar.

## O Mito do "Atraso Seguro" com Alert
É uma intuição lógica pensar que o lert() daria o tempo necessário para o sistema processar processos secundários, já que a tela fica travada esperando o usuário clicar em "OK". 

No entanto, o JavaScript possui um modelo de execução *Single-Threaded* (linha única de execução), guiado por um **Event Loop**.

### O que o lert() realmente faz?
O lert(), assim como confirm() e prompt(), são métodos **Síncronos Bloqueantes**. Quando invocados:
1. Eles não apenas pausam a interface.
2. Eles congelam completamente a **Thread Principal** do navegador.
3. Isso significa que o **Event Loop** é paralisado.
4. Processos pendentes, como Event Bubbling (propagação de cliques/submits) ou resolução de Promises, ficam travados na fila de tarefas (Task Queue ou Microtask Queue) e **não** são executados enquanto o alert estiver ativo.

## O Resultado na Prática
Se colocarmos um lert() antes do comando que muda a aba:
``javascript
form.addEventListener('submit', (e) => {
    alert('Salvo com sucesso!'); // (1) O tempo para aqui. O bubbling do submit congela.
    btnTabNext.click();          // (2) Ocorre no exato milissegundo após clicar em OK.
});
``
Ao clicar em "OK", o JavaScript retoma a execução exatamente na linha seguinte (tnTabNext.click()). 
A aba é destruída antes que a função atual termine e permita que o evento "borbulhe" até o document para ser capturado pelo sync.js. O tempo que a tela ficou aguardando o clique no "OK" não serviu para processar nenhum dado em segundo plano.

## A Solução Elegante: setTimeout
O setTimeout contorna esse comportamento bloqueante inserindo uma instrução na fila do Event Loop para o futuro (Macrotask).

``javascript
form.addEventListener('submit', (e) => {
    alert('Salvo com sucesso!'); // Congela e depois avança
    
    // Entrega o controle de volta ao navegador para que ele termine de propagar o evento
    setTimeout(() => {
        btnTabNext.click(); // Navega em segurança
    }, 100);
});
``
**Por que funciona?**
O setTimeout de 100ms não trava a thread. Ele delega a instrução ao navegador. Com isso, a função do listener termina sua execução atual, o Event Loop volta a girar livremente, o evento de *submit* borbulha para o sync.js (que coleta e faz o *fetch* de salvamento assíncrono), e só depois o gatilho de 100ms dispara para trocar a aba.

> [!TIP]
> **Lição de Arquitetura:** Nunca use métodos síncronos bloqueantes (lert, confirm) como artifício para garantir tempo para processamento de eventos ou operações assíncronas no JavaScript. Sempre devolva o fluxo ao Event Loop (usando *callbacks*, *Promises* ou *setTimeout*) para que as filas de micro/macrotasks possam ser esvaziadas.