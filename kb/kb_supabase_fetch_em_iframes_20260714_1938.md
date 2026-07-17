# KB: Chamadas Supabase em Iframes Aninhados

## Problema
Em arquiteturas com iframes aninhados (`processo.html` → `foco-03.html`), é um erro comum delegar operações críticas de banco para funções do `window.parent`. Isso cria três pontos de falha invisíveis:

1. **SDK ausente no parent**: Se o `window.parent` não tiver o SDK do Supabase carregado, guards como `if (!window.supabaseClient) return;` abordam silenciosamente sem nenhum erro no console.
2. **Encadeamento de contexto**: `window.parent.updateStatusFluxo` pode não existir se o iframe foi carregado em contexto diferente do esperado.
3. **Race condition**: A função async pode ser chamada, mas o browser já navega para outra aba antes do Supabase confirmar o write.

## Solução Padrão (deste projeto)
Iframes que precisam escrever dados críticos de fluxo devem:

```javascript
// ✅ CORRETO: fetch direto dentro do iframe, sem depender do parent
const SUPA_URL = window.parent?.SUPABASE_URL || window.SUPABASE_URL;
const SUPA_KEY = window.parent?.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY;

// GET para verificar existência, depois PATCH ou POST
const resGet = await fetch(`${SUPA_URL}/rest/v1/tabela?campo=eq.${id}`, {...});
const existe = (await resGet.json()).length > 0;

if (existe) {
  await fetch(`${SUPA_URL}/rest/v1/tabela?campo=eq.${id}`, { method: 'PATCH', ... });
} else {
  await fetch(`${SUPA_URL}/rest/v1/tabela`, { method: 'POST', ... });
}

// ⚠️ APÓS escrever, aguardar antes de navegar
await new Promise(resolve => setTimeout(resolve, 600));
// ...então navegar
```

## Anti-padrão a evitar
```javascript
// ❌ ERRADO: depende de window.parent ter a função E o SDK carregado
if (typeof window.parent.updateStatusFluxo === "function") {
  await window.parent.updateStatusFluxo(processId, checkpoint, status);
}
```

## Sobre o trigger da aba receptora
Ao navegar para uma aba que lê dados do banco, enviar um `postMessage` após a navegação garante um segundo carregamento com os dados atualizados:

```javascript
btnTabNext.click(); // navega
setTimeout(() => {
  const iframe = rootWindow.document?.getElementById('frame');
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage({ type: 'RELOAD_DELIBERACOES' }, '*');
  }
}, 800); // aguarda o DOM da nova aba carregar
```

A aba receptora deve ter um listener para isso:
```javascript
window.addEventListener('message', function(event) {
  if (event.data?.type === 'RELOAD_DELIBERACOES') {
    carregarDeliberacoesETimeline();
  }
});
```
