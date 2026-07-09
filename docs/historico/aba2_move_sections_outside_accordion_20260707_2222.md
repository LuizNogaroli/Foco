# Relocação de Ocupação, Riscos, Restrições e Geolocalização (Aba 2)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Remoção do Accordion do RIP:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), removi a marcação HTML e os listeners internos das seções de `Ocupação`, `Riscos`, `Restrições` e `Geolocalização` de dentro do template de cada RIP (`window.criarBlocoImovel`).
   - Com isso, o acordeão de cada RIP passa a conter exclusivamente dados específicos do imóvel: `Identificação`, `Avaliação` e a `Certidão atualizada da matrícula`.

2. **Criação das Seções Globais:**
   - No arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html), reinseri as seções de `Ocupação` (com Incidência Ambiental), `Riscos`, `Restrições` e `Geolocalização` de forma estática dentro da div `#global-sections-container`.
   - Essas seções agora aparecem uma única vez no formulário (no nível da área/terreno consolidado da Aba 2).
   - Ajustei os nomes e IDs dos inputs para formatos globais (removendo os sufixos de RIP e índices de array).

3. **Vinculação de Listeners Globais:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), criei listeners globais que atuam sobre os novos campos estáticos:
     - Alternância de visibilidade da Situação Ocupacional (`Desocupado`, `Ocupado`).
     - Lógica inteligente de incidência ambiental (desmarcar outras se marcar "Nenhuma...").
     - Triagem de Riscos e Restrições através de multicheckboxes.
     - Abertura e preenchimento do mapa interativo por CEP e coordenadas lat/lon.

4. **Sincronização de Dados:**
   - Atualizei `window.preencherCamposGlobais` no JavaScript para popular esses campos a partir das propriedades retornadas do Supabase no carregamento da página.
