# Ajuste de Colunas no Grid de Requerimentos (Painel Principal)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Alteração de Colunas no Cabeçalho (index.html):**
   - Removi as colunas `"RIP(s)"` (com largura 120px) e `"Regime de Destinação"` (com largura 170px) do cabeçalho da tabela principal de processos.
   - Incluí a nova coluna `"Tipo de Requerimento"` (com largura de 250px) ocupando o lugar das colunas retiradas.
   - Ajustei o `colspan` das linhas de estado vazio e carregamento de `12` para `11` para manter a conformidade da grid.

2. **Ajuste na Renderização de Linhas:**
   - Adaptei a função `renderTable()` para omitir a geração das células com os badges de RIPs e preencher a célula da nova coluna com o valor correspondente ao Tipo de Requerimento/Regime solicitado (`proc.procedimento`).
