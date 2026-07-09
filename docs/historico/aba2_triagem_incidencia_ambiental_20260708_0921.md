# Triagem para Incidência Ambiental (Aba 2)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Estrutura de Pergunta com Triagem:**
   - No arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html), reestruturei o grupo de campos de Incidência Ambiental para alinhar com Riscos e Restrições.
   - Adicionei a pergunta principal: `"Há incidência ambiental identificada?"` com opções (`Sim`, `Não`, `Não há informação suficiente`) usando o padrão de checkboxes de triagem (`ha_incidencia[]`).
   - Encapsulei os itens e o campo de observações dentro de um container com display dinâmico (`#bloco-incidencia-itens`).
   - Removi a opção redundante "Nenhuma incidência identificada" da lista interna.

2. **Vinculação e Inicialização:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), configurei o inicializador global `window.initPerguntaComMulticheck` para gerenciar a visibilidade da nova seção `#group-pergunta-incidencia`.
   - Adaptei `preencherCamposGlobais` para restaurar e preencher a nova pergunta usando o campo `dados.ha_incidencia` recuperado do banco de dados.
