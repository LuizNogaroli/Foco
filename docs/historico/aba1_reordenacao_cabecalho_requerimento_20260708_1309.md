# Inversão e Ajuste de Título/Subtítulo (Aba 1)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Reestruturação no HTML (foco-01.html):**
   - No arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html), configurei a primeira linha (rótulo) como uma `div` com texto menor em caixa alta (`Requerimento — [ID]`) utilizando `font-size: 0.85rem` e peso negrito.
   - Configurei a segunda linha como o título principal `<h2>` (`#titulo-pagina-requerimento`) para acomodar com destaque e tamanho original o Tipo de Requerimento dinâmico.

2. **Ajuste de População de Dados (foco-01.js):**
   - Atualizei o script [foco-01.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.js) para inverter a exibição:
     - O rótulo superior (#label-titulo-requerimento) agora exibe o texto *"Requerimento — PR2026001"* (com o número do processo).
     - O título principal (#titulo-pagina-requerimento) exibe o Tipo de Requerimento dinâmico (*"Regularizar Utilização de Imóvel da União"*, por exemplo).
