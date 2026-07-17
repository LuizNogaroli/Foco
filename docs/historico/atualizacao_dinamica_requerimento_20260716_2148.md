# Atualização Dinâmica do Número de Requerimento ao Mudar o RIP

## Problema Relatado
O usuário simulou a devolução de um processo e removeu o RIP original `2026001` para adicionar o novo RIP `2026002` na Aba 1. Contudo, ao salvar e ver o resumo na Aba 3 (Conferência e Aprovação), o campo "Número do Requerimento" ainda constava como `PR2026001`, apesar de o campo "RIPs Associados" ter atualizado com sucesso para `2026002`.

## Análise da Causa Raiz (Root Cause)
O campo "Número do Requerimento" (elemento com `id="campo11"`) no formulário da Aba 1 (`foco-01.html`) é preenchido no carregamento inicial da página com o valor que está salvo no banco de dados (`PR2026001`). 
Ao alterar a lista de RIPs associados (removendo o RIP antigo e inserindo um novo), a lista `window.ripsPendentes` era atualizada no JS, porém o valor textual do input `campo11` permanecia inalterado, pois não havia nenhuma rotina para recalculá-lo dinamicamente a partir dos RIPs recém-selecionados e da UF do processo. 
Como o snapshot (Relatório/Resumo) da Aba 1 lê diretamente o valor do elemento DOM `campo11`, a gravação do snapshot preservava o número antigo.

## Solução Implementada
Criamos a função `atualizarNumeroRequerimento()` em `foco-01.js` que:
1. Obtém a UF ativa a partir de `formDataState.uf` ou, como fallback, extrai os dois primeiros caracteres do `processId` ativo (ex: "PR" de "PR2026001").
2. Se houver algum RIP inserido na lista (`window.ripsPendentes`), gera o novo número como `UF + Primeiro RIP` (ex: `PR2026002`).
3. Atualiza o valor do elemento DOM `campo11`.
4. Dispara o evento `'change'` no elemento para que o `sync.js` capte a mudança e propague para o estado global (`formDataState`) do formulário principal, garantindo que o novo número seja corretamente persistido no banco e gravado no snapshot de relatórios.

Essa função passa a ser chamada imediatamente nas operações de adição (`adicionarRipNaLista`) e remoção (`window.removerRipItem`).

## Estado Anterior (Antes)
Em `foco-01.js`:
```javascript
    window.removerRipItem = function(rip) {
        window.ripsPendentes = window.ripsPendentes.filter(r => r !== rip);
        // ...
        atualizarLayoutConceituacao();
        if (window.parent && typeof window.parent.updateField === 'function') {
            window.parent.updateField('rips', window.ripsPendentes);
        }
    };
    
    // ...
    
    function adicionarRipNaLista(rip) {
        // ...
        if (!window.ripsPendentes.includes(rip)) window.ripsPendentes.push(rip);
        atualizarLayoutConceituacao();
    }
```

## Estado Novo (Depois)
Em `foco-01.js`:
```javascript
    function atualizarNumeroRequerimento() {
        const campo11 = document.getElementById('campo11');
        if (!campo11) return;
        
        const processId = localStorage.getItem('CURRENT_PROCESS_ID') || '';
        let uf = '';
        if (window.parent && window.parent.formDataState && window.parent.formDataState.uf) {
            uf = window.parent.formDataState.uf;
        } else if (processId) {
            const match = processId.match(/^[A-Z]{2}/i);
            if (match) {
                uf = match[0].toUpperCase();
            }
        }
        
        if (!uf) uf = 'PR'; // fallback
        
        if (window.ripsPendentes && window.ripsPendentes.length > 0) {
            const novoNumero = uf + window.ripsPendentes[0];
            campo11.value = novoNumero;
            
            // Notifica o sync.js e o parent
            campo11.dispatchEvent(new Event('change', { bubbles: true }));
            if (window.parent && typeof window.parent.updateField === 'function') {
                window.parent.updateField('campo11', novoNumero);
            }
        }
    }

    window.removerRipItem = function(rip) {
        window.ripsPendentes = window.ripsPendentes.filter(r => r !== rip);
        // ...
        atualizarLayoutConceituacao();
        atualizarNumeroRequerimento();
        if (window.parent && typeof window.parent.updateField === 'function') {
            window.parent.updateField('rips', window.ripsPendentes);
        }
    };
    
    // ...
    
    function adicionarRipNaLista(rip) {
        // ...
        if (!window.ripsPendentes.includes(rip)) window.ripsPendentes.push(rip);
        atualizarLayoutConceituacao();
        atualizarNumeroRequerimento();
    }
```

## Plano de Rollback / Desfazer
Para reverter:
1. Abra `foco-01.js`.
2. Remova a função `atualizarNumeroRequerimento()`.
3. Retire as chamadas de `atualizarNumeroRequerimento()` dentro de `window.removerRipItem` e `adicionarRipNaLista`.
