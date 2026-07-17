# Histórico de Alterações - Remoção de Iframe no Modal de Aprovação (Aba 1)

## Resumo da Mudança
O modal "Conferência e Aprovação - Aba 1" (`modalAprovacaoAba1`) utilizava um `<iframe>` para carregar a página `foco-01-resumo.html`. Seguindo a premissa de simplificação "menos é mais", removemos o iframe e o substituímos por uma renderização Javascript assíncrona que consome diretamente o JSON do Supabase e monta a estrutura no próprio DOM do modal. A folha de estilos `report.css` foi importada na Aba 1 de forma segura (com resets do seletor `body`).

## 1. Estado Anterior (Antes)
- No `foco-01.html`: Havia uma tag `<iframe id="iframeAprovacao" src="" ...>` configurada para carregar dinamicamente `foco-01-resumo.html` ao abrir o modal.
- No `foco-01.js`: A função ao clicar no botão de manifestação definia o `.src` do iframe com um cache buster e abria o modal. A renderização ficava encapsulada no ciclo de vida de outro documento HTML.

## 2. Estado Novo (Depois)
- No `foco-01.html`: O iframe foi deletado. Em seu lugar, foi inserida uma estrutura de loading (`#loadingRelatorio`) e uma div de conteúdo (`#conteudoRelatorioAprovacao`) com a classe `.report-container`. No `head`, importamos a folha de estilos `report.css` e aplicamos um bloco de reset imediato para o seletor `body` para evitar conflito com a estrutura principal do formulário da Aba 1.
- No `foco-01.js`: O clique no botão `btnRegistrarManifestacao` agora faz um `fetch` assíncrono para o endpoint da `tabela_relatorios` no Supabase filtrando por `aba1` e `process_id`. Ele mesmo processa os dados, gera a marcação HTML dinâmica e a injeta no `#conteudoRelatorioAprovacao` ocultando o elemento de carregamento.

## 3. Plano de Rollback / Desfazer
Para reverter essa alteração para o estado anterior:
1. **Desfazer no `foco-01.html`**:
   - Remova o bloco `<link rel="stylesheet" href="report.css?v=1782355313469">` e a tag `<style>` de reset de body do `head`.
   - Remova a `div` com id `containerRelatorioAprovacao` e reintroduza a tag original:
     ```html
     <div style="width: 100%; height: 400px; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; margin-bottom: 20px;">
         <iframe id="iframeAprovacao" src="" style="width: 100%; height: 100%; border: none;"></iframe>
     </div>
     ```
2. **Desfazer no `foco-01.js`**:
   - Restaure a lógica de clique original de `btnRegistrarManifestacao`:
     ```javascript
     if (btnRegistrarManifestacao) {
         btnRegistrarManifestacao.addEventListener('click', () => {
             const modalAprovacao = document.getElementById('modalAprovacaoAba1');
             const iframeAprovacao = document.getElementById('iframeAprovacao');
             const chkAprovar = document.getElementById('chkAprovarAba1');
             const btnConfirmarAprov = document.getElementById('btnConfirmarAprovacao');
             const btnCancelarAprov = document.getElementById('btnCancelarAprovacao');
             const btnFecharAprov = document.getElementById('btnFecharModalAprovacao');

             if (modalAprovacao && iframeAprovacao) {
                 iframeAprovacao.src = 'foco-01-resumo.html?t=' + new Date().getTime();
                 chkAprovar.checked = false;
                 btnConfirmarAprov.disabled = true;
                 
                 modalAprovacao.style.display = 'flex';
                 // ... Restante da lógica de clique
             }
         });
     }
     ```
