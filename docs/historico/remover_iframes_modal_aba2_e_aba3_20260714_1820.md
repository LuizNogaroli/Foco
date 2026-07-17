# Histórico de Alterações - Remoção de Iframes nos Modais de Aprovação (Aba 2 e Aba 3)

## Resumo da Mudança
Replicamos a otimização de remoção de iframes aplicada na Aba 1 para os modais de "Conferência e Aprovação" da Aba 2 (`foco-02.html`) e Aba 3 (`foco-03.html`). O uso de `<iframe>` foi banido desses modais. A renderização agora é feita injetando de forma assíncrona o template HTML e os dados obtidos da tabela `tabela_relatorios` do Supabase. A folha de estilos `report.css` foi adicionada com resets específicos de body nas duas abas.

## 1. Estado Anterior (Antes)
- No `foco-02.html` e `foco-03.html`: Ambos continham uma tag `<iframe id="iframeAprovacao" src="" ...>` dentro de seus respectivos modais.
- No `foco-02-v2.js` e inline script do `foco-03.html`: O clique no botão de manifestação inicializava o modal apontando a URL do iframe correspondente para `foco-02-resumo.html` ou `foco-03-resumo.html`.

## 2. Estado Novo (Depois)
- No `foco-02.html` e `foco-03.html`:
  - O iframe foi deletado. Em seu lugar, foi inserida a div `#containerRelatorioAprovacao` contendo `#loadingRelatorio` e `#conteudoRelatorioAprovacao`.
  - No `head` de ambos os arquivos HTML, importamos o `report.css` e aplicamos um reset de estilo do `body` (`!important` nos parâmetros originais) para evitar que o CSS do relatório afetasse os formulários nativos.
- No `foco-02-v2.js`:
  - O listener do `btnManifestacao` foi refatorado para consultar a `tabela_relatorios` (aba=eq.aba2) e preencher os dados diretamente na div local.
- No inline script do `foco-03.html`:
  - O listener do `btnManifestacao3` foi refatorado para usar uma técnica ainda mais limpa: ele faz um `fetch` assíncrono do arquivo `foco-03-resumo.html` como texto, parseia a resposta como DOM via `DOMParser`, extrai o container do relatório (`#content`), injeta-o na div local e em seguida preenche todos os campos com os dados do Supabase.

## 3. Plano de Rollback / Desfazer
Para reverter essa alteração para o estado anterior:
1. **Desfazer no `foco-02.html`**:
   - Remova o import do `report.css` e a tag `<style>` de reset no `head`.
   - Substitua `#containerRelatorioAprovacao` por:
     ```html
     <div style="width: 100%; height: 50vh; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; margin-bottom: 20px;">
         <iframe id="iframeAprovacao" src="" style="width: 100%; height: 100%; border: none;"></iframe>
     </div>
     ```
2. **Desfazer no `foco-02-v2.js`**:
   - Reverter as alterações no listener de `btnManifestacao` para a lógica original com `iframeAprovacao.src = "foco-02-resumo.html?t=..."`.
3. **Desfazer no `foco-03.html`**:
   - Remova o import do `report.css` e reset de body no `head`.
   - Substitua `#containerRelatorioAprovacao` pelo iframe original:
     ```html
     <div style="width: 100%; height: 50vh; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; margin-bottom: 20px;">
       <iframe id="iframeAprovacao" src="" style="width: 100%; height: 100%; border: none"></iframe>
     </div>
     ```
   - Reverter as alterações no script inline de `btnManifestacao3` (por volta da linha 3080) para definir `iframeAprovacao.src = "foco-03-resumo.html?t=..."` e a confirmação com `fecharModal()`.
